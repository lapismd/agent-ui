import { expect, test } from "vitest";
import {
  workspaceListingFiles,
  workspaceRevisionRows,
} from "../packages/repository-ui/src/jj/workspace/stack-lane/presentation.js";
import { parsePatchToRows } from "@lapismd/design-core/diff";
import { workspaceHunkContext } from "../packages/repository-ui/src/stacks/hunk-context.js";
import {
  stackReviewSnapshot,
  fileSet,
} from "../catalog/jj/support/stack-workspace-data.js";
import { createStackReview } from "../catalog/jj/support/stack-workspace-fixture.js";

test("workspace graph rows preserve recorded parent, author, conflict and alias facts", () => {
  const stack = stackReviewSnapshot("Conflicts").stacks[0]!;
  const rows = workspaceRevisionRows(stack, [...stack.commits].reverse());
  const tip = stack.commits.at(-1)!;
  expect(rows[0]).toMatchObject({
    eventId: tip.id,
    changeId: tip.changeId,
    parents: tip.graph!.parents,
    authorEmail: tip.email,
    millis: tip.createdAt * 1000,
    conflicted: true,
    tags: ["feature/stack-1", "release/ui@origin", "Working copy · daily"],
  });
  expect(
    rows.find((row) => row.eventId === stack.commits[5]!.id)?.parents,
  ).toEqual(stack.commits[5]!.graph!.parents);
  expect(rows.at(-1)?.tags).toContain("Immutable");
});

test("file listings preserve unknown counts, explicit zeroes and conflict signals", () => {
  const files = workspaceListingFiles(
    [
      { path: "unknown", hunks: [{ id: "native", label: "one", patch: "" }] },
      { path: "zero", hunks: [], additions: 0, deletions: 0 },
      {
        path: "counts",
        hunks: [],
        additions: 14,
        deletions: 3,
        conflicted: true,
      },
      {
        path: "content",
        hunks: [],
        content: { status: "unavailable", reason: "conflict" },
      },
      { path: "snapshot", hunks: [] },
    ],
    ["snapshot"],
  );
  expect(files[0]).not.toHaveProperty("additions");
  expect(files[0]).not.toHaveProperty("deletions");
  expect(files[1]).toMatchObject({ additions: 0, deletions: 0 });
  expect(files[2]).toMatchObject({
    additions: 14,
    deletions: 3,
    conflicted: true,
  });
  expect(files.slice(2).every((file) => file.conflicted)).toBe(true);
});

test("paged scoped reads and independent origin diffs remain presentation-only", async () => {
  const demo = createStackReview("Paged");
  try {
    await demo.start();
    const { controller } = demo;
    await controller.details.loadFiles("unassigned");
    expect(controller.filesFor("unassigned")).toHaveLength(2);
    await controller.details.loadFiles("unassigned", true);
    expect(controller.filesFor("unassigned")).toHaveLength(4);
    controller.selectFile(
      "unassigned",
      controller.filesFor("unassigned")[0]!.path,
    );
    const stack = controller.snapshot!.stacks[0]!;
    await controller.histories.load(stack.id);
    const commit = controller.snapshot!.stacks[0]!.commits.at(-1)!;
    controller.selectCommit(commit.id, stack.id);
    await controller.details.loadFiles(commit.id);
    controller.selectFile(
      commit.id,
      controller.filesFor(commit.id)[0]!.path,
      undefined,
      stack.id,
    );
    expect(controller.diffs.map((diff) => diff.origin).sort()).toEqual([
      "stack-lane-1",
      "working",
    ]);
    const diffs = JSON.parse(JSON.stringify(controller.diffs));
    await controller.refresh();
    expect(controller.diffs).toEqual(diffs);
    expect(demo.commands).toEqual([]);
    const reads = demo.requests.filter((item) => item.kind === "files");
    expect(
      reads.every(
        (item) =>
          (item.request as { readKey: string }).readKey ===
          "operation:recorded-7",
      ),
    ).toBe(true);
  } finally {
    demo.close();
  }
});

test("target history stays immutable and workspace changes replace the read scope", async () => {
  const demo = createStackReview("TargetHistory", "branches");
  try {
    await demo.start();
    const history = demo.controller.targetHistory;
    expect(history.active).toBe(true);
    expect(history.commits.every((commit) => commit.immutable)).toBe(true);
    const firstCount = history.commits.length;
    await history.loadMore();
    expect(history.commits.length).toBeGreaterThan(firstCount);
    await demo.selectWorkspace("review");
    expect(demo.controller.snapshot?.active).toBe("review");
    expect(demo.controller.snapshot?.readKey).toBe(
      "operation:recorded-7:workspace:review",
    );
    expect(demo.commands).toEqual([]);
  } finally {
    demo.close();
  }
});

test("native hunk contexts retain three independent tokens and complete file statistics", () => {
  const file = fileSet(80)[0]!;
  const context = workspaceHunkContext(file);
  expect(file.hunks).toHaveLength(3);
  expect(context.size).toBe(3);
  expect(new Set(file.hunks.map((h) => h.id)).size).toBe(3);
  expect(file.hunks.every((h) => /^native:[0-9a-f]{64}$/.test(h.id))).toBe(
    true,
  );
  const changes = [...context.values()]
    .flatMap((patch) => parsePatchToRows(patch))
    .filter((row) => row.variant !== "context");
  expect(changes.filter((row) => row.variant === "added")).toHaveLength(
    file.additions!,
  );
  expect(changes.filter((row) => row.variant === "removed")).toHaveLength(
    file.deletions!,
  );
  expect(changes.map((row) => row.text)).toEqual([
    "old 80",
    "new 80",
    "retain exact operation",
  ]);
});

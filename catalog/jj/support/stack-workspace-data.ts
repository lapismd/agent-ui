import type {
  WorkspaceFile,
  WorkspaceSnapshot,
  StackCommit,
} from "../../../packages/repository-ui/src/stacks/index.js";
export const stackNow = 1792666800;
export const hex = (id: number, length = 40) =>
  id.toString(16).padStart(length, "0");
function textFile(path: string, seed: number): WorkspaceFile {
  const middle = Array.from(
    { length: 72 },
    (_, i) => ` unchanged context line ${i + 1}`,
  );
  const patch = `diff --git a/${path} b/${path}\n--- a/${path}\n+++ b/${path}\n@@ -1,74 +1,75 @@\n-old ${seed}\n+new ${seed}\n+retain exact operation\n${middle.join("\n")}\n final context\n`;
  return {
    path,
    patch,
    additions: 2,
    deletions: 1,
    hunks: [{ id: `native:${hex(seed, 64)}`, label: `Update ${path}`, patch }],
    content: { status: "ready" },
  };
}
export function fileSet(seed: number): WorkspaceFile[] {
  return [
    textFile(`src/stack-${seed}/controller.ts`, seed),
    textFile(`src/stack-${seed}/view.svelte`, seed + 1),
    textFile(`tests/stack-${seed}.test.ts`, seed + 2),
    {
      path: `assets/stack-${seed}.png`,
      hunks: [],
      content: { status: "unavailable", reason: "binary" },
    },
    {
      path: `docs/stack-${seed}.md`,
      hunks: [],
      additions: 0,
      deletions: 0,
      content: { status: "ready" },
    },
  ];
}
const summary = (file: WorkspaceFile): WorkspaceFile => ({
  ...file,
  patch: undefined,
  hunks: [],
  content:
    file.content?.status === "unavailable"
      ? file.content
      : { status: "unloaded" },
});
export function stackReviewSnapshot(variant = "Basic"): WorkspaceSnapshot {
  const dense = variant === "Dense" || variant === "Paged";
  const stacks = Array.from({ length: dense ? 6 : 3 }, (_, lane) => {
    const commits: StackCommit[] = Array.from(
      { length: dense ? 54 : 8 },
      (_, index) => {
        const id = hex(1000 + lane * 100 + index),
          previous = index ? hex(1000 + lane * 100 + index - 1) : hex(1);
        return {
          id,
          changeId: hex(1000 + lane * 100 + index, 32),
          message:
            `${["Extract portable workspace controllers", "Keep stack selection through refresh", "Render independent file columns", "Preserve recorded graph parents"][index % 4]} ${lane + 1}.${index + 1}` +
            (index % 3 === 0
              ? "\n\nKeep the recorded workspace and operation together.\n\n### Review notes\n\n" +
                "The host retains execution, persistence and routing.\n\n".repeat(
                  8,
                )
              : ""),
          author: ["Alex Morgan", "Mira Patel", "Jo Chen"][lane % 3]!,
          email:
            lane === 0
              ? "dev@lapis.md"
              : ["mira@example.test", "jo@example.test"][lane % 2]!,
          createdAt: stackNow - 120 * (index + lane),
          immutable: index === 0,
          files: fileSet(lane * 100 + index + 1),
          graph: {
            parents:
              index > 2 && index % 5 === 0
                ? [previous, hex(1000 + lane * 100 + index - 3)]
                : [previous],
            edges: [{ target: previous, kind: "direct" }],
            bookmarks:
              index === 7
                ? [
                    { name: `feature/stack-${lane + 1}` },
                    { name: "release/ui", remote: "origin" },
                  ]
                : [],
            workspaces: index === 7 ? ["daily"] : [],
            conflicted: variant === "Conflicts" && lane === 0 && index === 7,
            divergent: lane === 1 && index === 6,
          },
        };
      },
    );
    const name = `feature/${["portable-api", "workspace-ui", "search-index", "agent-reviews", "long-stack-name-with-multiple-bookmark-aliases", "native-history"][lane]}`;
    return {
      id: `lane-${lane + 1}`,
      name,
      base: hex(1),
      heads: [
        {
          name,
          commit: commits.at(-1)!.id,
          aliases:
            lane === 0
              ? [
                  "feature/controller-api",
                  "review/portable",
                  "release/ui",
                  "desktop",
                  "web",
                ]
              : [],
          shared: lane === 0,
        },
        {
          name: `base/${lane + 1}`,
          commit: commits[2]!.id,
          shared: lane === 0,
        },
      ],
      commits,
      conflicts: variant === "Conflicts" && lane === 0,
    };
  });
  const unassigned = fileSet(80);
  if (variant === "Conflicts") {
    unassigned[1] = {
      path: "src/shared/conflict.ts",
      hunks: [],
      conflicted: true,
      content: { status: "unavailable", reason: "conflict" },
    };
  }
  const empty = variant === "Empty";
  return {
    repository: "recorded-stack-review",
    operation: hex(900, 128),
    revision: 7,
    readKey: "operation:recorded-7",
    folder: "/workspace/portable-repository",
    profile: "native",
    availability: variant === "Unlinked" ? "unlinked" : "ready",
    base: hex(1),
    active: "daily",
    target: {
      name: "main",
      commit: hex(500),
      message: "Recorded immutable target",
      author: "Sam Rivera",
      email: "sam@example.test",
      createdAt: stackNow - 86400,
    },
    workspaces: [
      {
        id: "daily",
        name: "Daily work",
        applied: empty ? [] : stacks.map((s) => s.id),
        unassigned: empty ? [] : unassigned,
      },
      {
        id: "review",
        name: "Review workspace",
        applied: empty ? [] : [stacks[1]!.id],
        unassigned: empty ? [] : fileSet(90),
      },
    ],
    stacks: empty ? [] : stacks,
    conflicts:
      variant === "Conflicts"
        ? [
            {
              path: "src/shared/conflict.ts",
              left: "left",
              right: "right",
              base: "base",
            },
          ]
        : [],
    capabilities: [
      "create_commit",
      "create_stack",
      "apply_stack",
      "unapply_stack",
      "delete_stack",
    ],
    canUndo: false,
    topology:
      variant === "IncompleteTopology"
        ? { complete: false, lanes: [] }
        : undefined,
  };
}

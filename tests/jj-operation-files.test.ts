import { expect, test } from "vitest";
import { OperationController } from "../packages/repository-ui/src/jj/index.js";
import { operationFixture } from "../catalog/jj/support/reference/operations.js";
import {
  operation,
  parent,
  revision,
} from "../catalog/jj/support/reference/fixture.js";

function setup(scenario?: string) {
  const fixture = operationFixture(scenario),
    errors: unknown[] = [];
  const controller = new OperationController(fixture.reader, {
    report: (error) => errors.push(error),
    recovered() {},
  });
  return { ...fixture, controller, errors };
}
async function expand(f: ReturnType<typeof setup>) {
  await f.controller.refresh();
  await f.controller.select(f.controller.state.nodes[0]);
}
test("expanding one changed revision loads paths from its native pair on the pinned handle", async () => {
  const f = setup();
  try {
    await expand(f);
    expect(f.controller.state.files.group?.change).toBe("aa".repeat(16));
    expect(f.controller.state.files.paths.map((p) => p.path)).toEqual([
      "Welcome.md",
    ]);
    await f.controller.files.selectPath("Welcome.md");
    expect(f.controller.state.files.diff?.path).toBe("Welcome.md");
    const [handle, query] = f.calls.find(([, q]) => q?.kind === "diff")!;
    expect(handle).toBe("handle-1");
    expect(query).toMatchObject({
      kind: "diff",
      query: { from: parent, to: revision },
    });
    f.advance();
    await f.controller.refresh();
    expect(f.controller.state.operation).toBe(operation);
    expect(f.controller.state.files.diff?.path).toBe("Welcome.md");
    expect(f.errors).toEqual([]);
  } finally {
    await f.controller.close();
  }
});

test.each(["operation-ambiguous", "operation-unavailable"])(
  "one %s group never invents revision endpoints",
  async (scenario) => {
    const f = setup(scenario);
    try {
      await expand(f);
      expect(f.controller.state.files.group).toBeDefined();
      expect(f.controller.state.files.from).toBeUndefined();
      expect(f.calls.some(([, q]) => q?.kind === "diff_paths")).toBe(false);
      if (scenario === "operation-ambiguous") {
        await f.controller.files.compare(parent, revision);
        expect(f.controller.state.files.pathsReady).toBe(true);
      }
    } finally {
      await f.controller.close();
    }
  },
);
test.each([false, true])(
  "multiple or continued groups retain explicit selection (continued %s)",
  async (continued) => {
    const f = setup(),
      read = f.reader.read;
    f.reader.read = async (h, q) => {
      const r = await read(h, q);
      if (r.kind === "operation_changes") {
        if (continued) r.data.next = "next-group";
        else
          r.data.groups.push({ ...r.data.groups[0], change: "bb".repeat(16) });
      }
      return r;
    };
    try {
      await expand(f);
      expect(f.controller.state.files.group).toBeUndefined();
      expect(f.calls.some(([, q]) => q?.kind === "diff_paths")).toBe(false);
      await f.controller.files.selectGroup("aa".repeat(16));
      expect(f.controller.state.files.pathsReady).toBe(true);
    } finally {
      await f.controller.close();
    }
  },
);
test("late paths cannot repopulate a collapsed operation", async () => {
  const f = setup(),
    read = f.reader.read;
  let release!: () => void;
  f.reader.read = (h, q) =>
    q.kind === "diff_paths"
      ? new Promise((resolve) => {
          release = () => {
            void read(h, q).then(resolve);
          };
        })
      : read(h, q);
  await f.controller.refresh();
  const selected = f.controller.select(f.controller.state.nodes[0]);
  await new Promise((resolve) => setTimeout(resolve, 0));
  await f.controller.clearSelection();
  release();
  await selected;
  expect(f.controller.state.selected).toBeUndefined();
  expect(f.controller.state.files.paths).toEqual([]);
  expect(f.controller.state.files.group).toBeUndefined();
  await f.controller.close();
});
test("failed group read recovers on explicit retry and then shows files", async () => {
  const f = setup("operation-files-failure");
  try {
    await expand(f);
    expect(f.errors).toHaveLength(1);
    expect(f.controller.state.files.ready).toBe(false);
    f.recover();
    await f.controller.files.retry();
    expect(f.controller.state.files.pathsReady).toBe(true);
  } finally {
    await f.controller.close();
  }
});

test("changed revision paging reports its retained 500-group bound", async () => {
  const f = setup(),
    read = f.reader.read;
  f.reader.read = async (handle, query) => {
    const response = await read(handle, query);
    if (
      query.kind !== "operation_changes" ||
      response.kind !== "operation_changes"
    )
      return response;
    const offset = Number(query.query.anchor ?? 0);
    return {
      ...response,
      data: {
        ...response.data,
        groups: Array.from({ length: 100 }, (_, i) => ({
          ...response.data.groups[0],
          change: (offset + i + 1).toString(16).padStart(32, "0"),
        })),
        next: String(offset + 100),
      },
    };
  };
  try {
    await expand(f);
    for (let page = 0; page < 4; page++) await f.controller.files.more();
    expect(f.controller.state.files.groups).toHaveLength(500);
    expect(f.controller.state.files.groupsLimitReached).toBe(true);
    expect(f.controller.state.files.next).toBeNull();
    expect(f.errors).toEqual([]);
  } finally {
    await f.controller.close();
  }
});

test("duplicate changed paths fail without inventing a completed comparison", async () => {
  const f = setup(),
    read = f.reader.read;
  f.reader.read = async (handle, query) => {
    const response = await read(handle, query);
    if (response.kind === "diff_paths")
      response.data.changes.push(response.data.changes[0]);
    return response;
  };
  try {
    await expand(f);
    expect(f.errors).toHaveLength(1);
    expect(f.controller.state.files.pathsReady).toBe(false);
    expect(f.controller.state.files.paths).toEqual([]);
  } finally {
    await f.controller.close();
  }
});

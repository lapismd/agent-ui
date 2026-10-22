import { expect, test } from "vitest";
import { OperationController } from "../packages/repository-ui/src/jj/index.js";
import { operationFixture } from "../catalog/jj/support/reference/operations.js";

function setup(maxOperations = 200) {
  const fixture = operationFixture(),
    errors: unknown[] = [];
  const controller = new OperationController(
    fixture.reader,
    {
      report: (error) => errors.push(error),
      recovered() {},
    },
    undefined,
    { pageSize: 2, maxOperations },
  );
  return { ...fixture, controller, errors };
}

test("operation query preserves its pin and clears dependent selection", async () => {
  const f = setup(),
    read = f.reader.read;
  f.reader.read = (h, q) =>
    q.kind === "graph" && q.query[0].graph === "operations_filtered"
      ? read(h, { ...q, query: [{ graph: "operations" }, q.query[1]] })
      : read(h, q);
  try {
    await f.controller.refresh();
    await f.controller.select(f.controller.state.nodes[0]);
    const pin = f.controller.state.operation;
    await f.controller.search(' description:"describe" ');
    expect(f.controller.state.query).toBe('description:"describe"');
    expect(f.controller.state.operation).toBe(pin);
    expect(f.controller.state.selected).toBeUndefined();
    expect(f.controller.state.files.paths).toEqual([]);
    await f.controller.search("");
    expect(f.controller.state.query).toBe("");
    expect(f.errors).toEqual([]);
  } finally {
    await f.controller.close();
  }
});

test("operation display bounds are explicit", async () => {
  const f = setup(2),
    read = f.reader.read;
  f.reader.read = async (h, q) => {
    const r = await read(h, q);
    if (r.kind === "graph" && r.data.data.graph === "operations")
      return {
        ...r,
        data: { ...r.data, next: { kind: "operation", id: "next" } },
      };
    return r;
  };
  try {
    await f.controller.refresh();
    expect(f.controller.state.limitReached).toBe(true);
    expect(f.controller.state.displayLimit).toBe(2);
    expect(f.controller.state.next).toBeNull();
  } finally {
    await f.controller.close();
  }
});

test("an advancing operation page cannot repeat its cursor", async () => {
  const f = setup(),
    read = f.reader.read;
  f.reader.read = async (h, q) => {
    const response = await read(h, q);
    if (response.kind !== "graph" || response.data.data.graph !== "operations")
      return response;
    const append = q.kind === "graph" && !!q.query[1].after;
    return {
      ...response,
      data: {
        ...response.data,
        data: {
          graph: "operations",
          nodes: append
            ? [{ ...response.data.data.nodes[0], id: "new-operation" }]
            : response.data.data.nodes,
        },
        next: { kind: "operation", id: "cursor" },
      },
    };
  };
  try {
    await f.controller.refresh();
    await f.controller.more();
    expect(f.errors).toHaveLength(1);
    expect(f.controller.state.nodes).toHaveLength(2);
  } finally {
    await f.controller.close();
  }
});

test("late conflict reads cannot repopulate a cleared operation", async () => {
  const f = setup(),
    read = f.reader.read;
  let release!: () => void;
  f.reader.read = async (h, q) => {
    if (q.kind === "conflicts")
      await new Promise<void>((resolve) => (release = resolve));
    return read(h, q);
  };
  try {
    await f.controller.refresh();
    await f.controller.select(f.controller.state.nodes[0]);
    const pending = f.controller.loadConflicts();
    await f.controller.clearSelection();
    release();
    await pending;
    expect(f.controller.state.conflicts).toEqual([]);
    expect(f.controller.state.conflictsReady).toBe(false);
    expect(f.errors).toEqual([]);
  } finally {
    await f.controller.close();
  }
});

test("late filtered operation responses cannot replace a newer query", async () => {
  const f = setup(),
    read = f.reader.read;
  let release!: () => void;
  f.reader.read = async (h, q) => {
    if (q.kind !== "graph" || q.query[0].graph !== "operations_filtered")
      return read(h, q);
    const query = q.query[0].query;
    if (query === "slow")
      await new Promise<void>((resolve) => (release = resolve));
    const r = await read(h, {
      ...q,
      query: [{ graph: "operations" }, q.query[1]],
    });
    if (r.kind !== "graph" || r.data.data.graph !== "operations")
      throw Error("Expected operations");
    return {
      ...r,
      data: {
        ...r.data,
        data: {
          graph: "operations",
          nodes: query === "none" ? [] : r.data.data.nodes,
        },
      },
    };
  };
  try {
    await f.controller.refresh();
    const pending = f.controller.search("slow");
    await f.controller.search("none");
    release();
    await pending;
    expect(f.controller.state.query).toBe("none");
    expect(f.controller.state.nodes).toEqual([]);
    expect(f.errors).toEqual([]);
  } finally {
    await f.controller.close();
  }
});

test("closing an operation controller drains an outstanding filter without a late update", async () => {
  const f = setup(),
    read = f.reader.read;
  let release!: () => void;
  await f.controller.refresh();
  f.reader.read = async (handle, query) => {
    if (
      query.kind !== "graph" ||
      query.query[0].graph !== "operations_filtered"
    )
      return read(handle, query);
    await new Promise<void>((resolve) => (release = resolve));
    return read(handle, {
      ...query,
      query: [{ graph: "operations" }, query.query[1]],
    });
  };
  let updates = 0;
  f.controller.subscribe(() => updates++);
  const pending = f.controller.search("hold"),
    closing = f.controller.close();
  const before = updates;
  release();
  await Promise.all([pending, closing]);
  expect(updates).toBe(before);
  expect(f.controller.state.nodes).toEqual([]);
  expect(f.errors).toEqual([]);
});

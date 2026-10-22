import { expect, test } from "vitest";
import { HistoryController } from "../packages/repository-ui/src/jj/logic/history-controller.js";
import {
  historyFixture,
  operation,
  otherOperation,
} from "../catalog/jj/support/reference/fixture.js";
const feedback = () => ({
  errors: [] as unknown[],
  report(error: unknown) {
    this.errors.push(error);
  },
  recovered() {},
});

test("revset search keeps its operation and host context while clearing dependent selection", async () => {
  const f = historyFixture(),
    c = new HistoryController(f.reader, feedback(), undefined, {
      userEmail: "dev@lapis.md",
      now: () => 1234,
    });
  await c.refresh();
  await c.selectWorkspace("review");
  await c.selectRevision(c.state.commits[0]);
  await c.selectPath("Welcome.md");
  await c.search("author(mine())");
  expect(c.state.operation).toBe(operation);
  expect(c.state.revset).toBe("author(mine())");
  expect(c.state.revision).toBeUndefined();
  expect(c.state.diff).toBeUndefined();
  f.advance();
  await c.checkpointChanged(otherOperation);
  expect(c.state.operation).toBe(operation);
  const request = f.calls
    .map(([, request]) => request)
    .filter((q: any) => q?.kind === "graph")
    .at(-1) as any;
  expect(request.query[0]).toMatchObject({
    revset: "author(mine())",
    user_email: "dev@lapis.md",
    at_time_millis: 1234,
    workspace: "review",
  });
  await c.selectOperation(otherOperation);
  expect(c.state.revset).toBe("author(mine())");
  await c.close();
});

test("repeated graph cursors are rejected before appending another page", async () => {
  const f = historyFixture(),
    read = f.reader.read,
    errors = feedback();
  f.reader.read = async (handle, query) => {
    const response = await read(handle, query);
    if (response.kind === "graph") {
      response.data.next = { kind: "commit", id: "33".repeat(20) };
      if (query.kind === "graph" && query.query[1].after)
        response.data.data.nodes = response.data.data.nodes.map(
          (node, index) => ({
            ...node,
            commit: { ...node.commit, id: String(index + 7).padStart(40, "0") },
          }),
        );
    }
    return response;
  };
  const c = new HistoryController(f.reader, errors);
  await c.refresh();
  await c.moreCommits();
  expect(errors.errors).toHaveLength(1);
  expect(c.state.commits).toHaveLength(2);
  await c.close();
});

test("late search replies cannot replace a newer revset or selection", async () => {
  const f = historyFixture(),
    read = f.reader.read;
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  f.reader.read = async (handle, query) => {
    if (query.kind === "graph" && query.query[0].revset === "slow()")
      await gate;
    return read(handle, query);
  };
  const c = new HistoryController(f.reader, feedback());
  await c.refresh();
  const pending = c.search("slow()");
  await c.search("fast()");
  await c.selectRevision(c.state.commits[0]);
  release();
  await pending;
  expect(c.state.revset).toBe("fast()");
  expect(c.state.revision).toBeDefined();
  await c.close();
});

test("paging retains its query clock and reports a configured display bound", async () => {
  const f = historyFixture(),
    read = f.reader.read;
  let now = 1;
  f.reader.read = async (handle, query) => {
    const result = await read(handle, query);
    if (result.kind === "graph") {
      const page = query.kind === "graph" && query.query[1].after;
      const first = result.data.data.nodes[0];
      result.data.data.nodes = [0, 1].map((i) => ({
        ...first,
        commit: {
          ...first.commit,
          id: String((page ? 3 : 1) + i).padStart(40, "0"),
        },
      }));
      result.data.next = {
        kind: "commit",
        id: page ? "44".repeat(20) : "33".repeat(20),
      };
    }
    return result;
  };
  const c = new HistoryController(f.reader, feedback(), undefined, {
    pageSize: 2,
    maxCommits: 3,
    now: () => now++,
  });
  await c.refresh();
  await c.moreCommits();
  expect(c.state.commits).toHaveLength(3);
  expect(c.state.next).toBeNull();
  expect(c.state.limitReached).toBe(true);
  const requests = f.calls
    .map(([, q]) => q)
    .filter((q: any) => q?.kind === "graph") as any[];
  expect(requests.map((q) => q.query[0].at_time_millis)).toEqual([1, 1]);
  await c.close();
});

test("a failed query can be retried without opening another operation", async () => {
  const f = historyFixture(),
    read = f.reader.read,
    errors = feedback();
  let fail = true;
  f.reader.read = async (handle, query) => {
    if (query.kind === "graph" && query.query[0].revset === "retry()" && fail) {
      fail = false;
      throw new Error("Query unavailable");
    }
    return read(handle, query);
  };
  const c = new HistoryController(f.reader, errors);
  await c.refresh();
  await c.search("retry()");
  expect(errors.errors).toHaveLength(1);
  expect(c.state.operation).toBe(operation);
  await c.search("retry()");
  expect(c.state.commitsReady).toBe(true);
  expect(f.calls.filter(([kind]) => kind === "open")).toHaveLength(1);
  await c.close();
});

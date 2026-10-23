import { expect, test } from "vitest";
import {
  HistoryController,
  OperationController,
  FileHistoryController,
  BlameController,
  RestoreController,
} from "../packages/repository-ui/src/history/index.js";
import {
  historyFixture,
  operation,
  revision,
} from "../catalog/jj/support/reference/fixture.js";
import { operationFixture } from "../catalog/jj/support/reference/operations.js";
import { holdPreparation } from "../catalog/jj/support/hold-preparation.js";
const feedback = () => ({
  errors: [] as unknown[],
  report(error: unknown) {
    this.errors.push(error);
  },
  recovered() {
    this.errors = [];
  },
});
test("copied controllers perform no read on construction and retain explicit pins across head refresh", async () => {
  const f = historyFixture(),
    c = new HistoryController(f.reader, feedback());
  expect(f.calls).toHaveLength(0);
  await c.refresh();
  await c.selectOperation(operation);
  f.advance();
  await c.refresh();
  expect(c.state.operation).toBe(operation);
  expect(c.state.heads).not.toContain(operation);
  await c.close();
  expect(f.closed.length).toBeGreaterThan(0);
});
test("merge changes require an explicit exact parent comparison", async () => {
  const f = historyFixture("merge"),
    c = new HistoryController(f.reader, feedback());
  await c.refresh();
  await c.selectRevision(c.state.commits[0]);
  expect(c.state.base).toBeUndefined();
  expect(c.state.paths).toEqual([]);
  await c.selectBase(c.state.revision!.parents[1]);
  await c.selectPath("Welcome.md");
  expect(c.state.base).toBe("33".repeat(20));
  expect(c.state.revision?.id).toBe(revision);
  expect(c.state.diff?.path).toBe("Welcome.md");
  await c.close();
});
test("operation detail selection keeps its original pin and comparison identities", async () => {
  const f = operationFixture(),
    c = new OperationController(f.reader, feedback());
  await c.refresh();
  await c.select(c.state.nodes[0]);
  expect(c.state.selected?.id).toBe(operation);
  expect(c.state.operation).toBe(operation);
  expect(c.state.detail?.operation).toBe(operation);
  await c.close();
});
test("file history delegates the literal path and recorded workspace predicate to its read port", async () => {
  const f = historyFixture(),
    c = new FileHistoryController(f.reader, feedback());
  const file = 'Notes/a"b.md';
  await c.follow(file);
  const query = f.calls
    .map(([, query]) => query)
    .find(
      (query: any) =>
        query?.kind === "graph" && query.query[0].revset.includes("files("),
    ) as any;
  expect(query.query[0].revset).toBe(
    `all() & files(root-file:${JSON.stringify(file)})`,
  );
  expect(query.query[0].workspace).toBe("default");
  await c.follow();
  expect(c.state.workspaceCommit).toBeUndefined();
  expect(c.state.path).toBeUndefined();
  await c.close();
});
test("closing a loading controller releases and drains its in-memory read without a stale update", async () => {
  const f = historyFixture(),
    errors = feedback();
  holdPreparation(f.reader);
  const c = new HistoryController(f.reader, errors);
  const loading = c.refresh();
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(c.state.busy).toBe(true);
  await c.close();
  await loading;
  expect(errors.errors).toEqual([]);
  expect(f.closed).toHaveLength(1);
});
test("file history starts at the supplied operation even after native heads advance", async () => {
  const f = historyFixture(),
    errors = feedback();
  f.advance();
  const c = new FileHistoryController(f.reader, errors);
  await c.follow("Welcome.md", operation);
  expect(c.state.operation).toBe(operation);
  expect(c.state.heads).not.toContain(operation);
  expect(errors.errors).toEqual([]);
  await c.close();
});
test("blame refuses mismatched operation proofs instead of rendering empty content", async () => {
  const f = historyFixture(),
    errors = feedback();
  const read = f.reader.blame!;
  f.reader.blame = async (...args) => ({
    ...(await read(...args)),
    operation: "different-operation",
  });
  const c = new BlameController(f.reader, errors);
  await c.open({ operation, commit: revision, path: "Welcome.md" });
  expect(c.state.status).toBe("failed");
  expect(c.state.contents).toBeUndefined();
  expect(errors.errors).toHaveLength(1);
  await c.close();
});
test("restore failures retain the exact original request for host receipt recovery and never retry implicitly", async () => {
  const calls: string[] = [],
    persisted: unknown[] = [];
  const c = new RestoreController(
    {
      async preview(checkpoint, path) {
        return {
          checkpoint,
          path,
          expected: "proof",
          bytes: 12,
          deleted: false,
        };
      },
      async apply(request) {
        calls.push(request.request_id);
        throw new Error("Outcome unknown");
      },
    },
    async (_path, action) => action(),
    feedback(),
    async (pending) => {
      persisted.push(pending);
    },
  );
  let state: any;
  c.subscribe((value) => (state = value));
  await c.prepare(revision, "Welcome.md");
  const id = state.request.request_id;
  await c.apply();
  expect(calls).toEqual([id]);
  expect(state.request.request_id).toBe(id);
  expect(state.open).toBe(true);
  expect(persisted).toHaveLength(1);
  c.close();
});

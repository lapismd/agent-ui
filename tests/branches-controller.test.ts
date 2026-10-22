import { expect, test } from "vitest";
import { createBranchesDemo } from "../catalog/jj/support/branches-fixture.js";
import {
  RepositoryBranchesController,
  branchRevset,
  bookmarkKey,
  type RepositoryBranchesPage,
  type RepositoryBranchesPort,
} from "../packages/repository-ui/src/jj/index.js";
import {
  historyFixture,
  operation,
  otherOperation,
  repository,
  revision,
} from "../catalog/jj/support/reference/fixture.js";
const pin = { repository, operation };
function fixture(port: RepositoryBranchesPort, options = {}) {
  const source = historyFixture(),
    errors: unknown[] = [];
  const controller = new RepositoryBranchesController(
    port,
    source.reader,
    { report: (error) => errors.push(error), recovered() {} },
    options,
  );
  return { source, controller, errors };
}
const page = (
  extras: Partial<RepositoryBranchesPage> = {},
): RepositoryBranchesPage => ({
  ...pin,
  bookmarks: [{ name: "main", targets: [revision] }],
  workingCopies: [],
  next: null,
  ...extras,
});

test("constructs without reads, resolves recorded targets before opening history and distinguishes remotes", async () => {
  const demo = createBranchesDemo("Remote");
  expect(demo.fixture.calls).toEqual([]);
  expect(demo.requests).toEqual([]);
  await demo.start();
  expect(demo.controller.state.selected).toEqual({
    kind: "bookmark",
    name: "main",
    remote: "origin",
  });
  expect(demo.controller.history.state.revset).toBe(
    branchRevset(demo.bookmarks[4].targets),
  );
  expect(
    demo.controller.history.state.commits.map((row) => row.id),
  ).not.toContain(demo.dense.commits[0].id);
  expect(bookmarkKey(demo.bookmarks[0])).not.toBe(
    bookmarkKey(demo.bookmarks[4]),
  );
  const reads = demo.fixture.calls.filter(
    ([, query]) => (query as { kind?: string })?.kind === "graph",
  );
  expect(reads.length).toBeGreaterThan(0);
  for (const [, query] of reads)
    expect((query as any).query[0].revset).not.toBe("all()");
  await demo.close();
});
test("conflicted references query every captured target, deleted references remain empty", async () => {
  const demo = createBranchesDemo("Conflicted");
  await demo.start();
  expect(demo.controller.history.state.revset).toBe(
    branchRevset(demo.bookmarks[2].targets),
  );
  expect(demo.controller.state.targets).toHaveLength(2);
  await demo.controller.select({
    kind: "bookmark",
    name: "retired/old-preview",
  });
  expect(demo.controller.history.state.revset).toBe("none()");
  expect(demo.controller.history.state.commits).toEqual([]);
  expect(demo.controller.history.state.revision).toBeUndefined();
  expect(demo.controller.history.state.path).toBeUndefined();
  await demo.close();
});
test("working-copy selection opens the exact recorded commit and a new reference clears its file", async () => {
  const demo = createBranchesDemo("WorkingCopy");
  await demo.start();
  expect(demo.controller.history.state.revision?.id).toBe(
    demo.workingCopies[1].commitId,
  );
  if (!demo.controller.history.state.paths.length)
    await demo.controller.history.selectBase(
      demo.controller.history.state.revision!.parents[0],
    );
  const path = demo.controller.history.state.paths[0].path;
  await demo.controller.history.selectPath(path);
  await demo.controller.select({ kind: "bookmark", name: "main" });
  expect(demo.controller.history.state.revision).toBeUndefined();
  expect(demo.controller.history.state.path).toBeUndefined();
  await demo.close();
});
test("history paging retains exact target query and evaluation clock", async () => {
  const demo = createBranchesDemo();
  await demo.start();
  await demo.controller.history.moreCommits();
  const queries = demo.fixture.calls
    .map(([, query]) => query as any)
    .filter((q) => q?.kind === "graph");
  expect(queries).toHaveLength(2);
  expect(queries[1].query[0]).toEqual(queries[0].query[0]);
  expect(queries[1].query[1].after).not.toBeNull();
  await demo.close();
});
test.each(["operation", "repository", "duplicate", "cursor", "invalid-target"])(
  "rejects %s reference pages without opening graph",
  async (fault) => {
    const invalid = page();
    if (fault === "operation") invalid.operation = otherOperation;
    if (fault === "repository") invalid.repository = "different";
    if (fault === "duplicate")
      invalid.bookmarks = [...invalid.bookmarks, ...invalid.bookmarks];
    if (fault === "cursor") {
      invalid.bookmarks = [];
      invalid.next = "next";
    }
    if (fault === "invalid-target")
      invalid.bookmarks = [{ name: "unsafe", targets: ["main) | all()"] }];
    const test = fixture({
      async read() {
        return invalid;
      },
    });
    await test.controller.open(pin);
    expect(test.controller.state.phase).toBe("unavailable");
    expect(test.errors).toHaveLength(1);
    expect(test.source.calls).toEqual([]);
    await test.controller.close();
  },
);
test("reference paging rejects repeats, supports retry and stops at a hard bound", async () => {
  let count = 0;
  const test = fixture({
    async read() {
      return count++ === 0
        ? page({ next: "cursor" })
        : page({
            bookmarks: [{ name: "topic", targets: [revision] }],
            next: "cursor",
          });
    },
  });
  await test.controller.open(pin);
  await test.controller.more();
  expect(test.errors).toHaveLength(1);
  expect(test.controller.state.bookmarks).toHaveLength(1);
  await test.controller.close();
  const bounded = fixture(
    {
      async read() {
        return page({
          bookmarks: [
            { name: "main", targets: [revision] },
            { name: "topic", targets: [revision] },
          ],
          next: "cursor",
        });
      },
    },
    { maxReferences: 1 },
  );
  await bounded.controller.open(pin);
  expect(bounded.controller.state.bookmarks).toHaveLength(1);
  expect(bounded.controller.state.limitReached).toBe(true);
  expect(bounded.controller.state.next).toBeNull();
  await bounded.controller.close();
});
test("late reference responses cannot replace a newer pin", async () => {
  let resolve!: (value: RepositoryBranchesPage) => void, started!: () => void;
  const reading = new Promise<void>((done) => (started = done));
  const test = fixture({
    async read(request) {
      return request.operation === operation
        ? new Promise((done) => {
            resolve = done;
            started();
          })
        : page({ operation: otherOperation });
    },
  });
  const old = test.controller.open(pin);
  await reading;
  await test.controller.open({ ...pin, operation: otherOperation });
  resolve(page());
  await old;
  expect(test.controller.state.pin?.operation).toBe(otherOperation);
  expect(test.controller.history.state.operation).toBe(otherOperation);
  await test.controller.close();
});
test("late graph responses cannot replace a newer reference", async () => {
  const demo = createBranchesDemo();
  await demo.start();
  const read = demo.fixture.reader.read;
  let resolve!: () => void;
  demo.fixture.reader.read = async (handle, query) => {
    if (
      query.kind === "graph" &&
      query.query[0].graph === "log" &&
      query.query[0].revset === branchRevset(demo.bookmarks[1].targets)
    )
      await new Promise<void>((done) => (resolve = done));
    return read(handle, query);
  };
  const old = demo.controller.select({
    kind: "bookmark",
    name: demo.bookmarks[1].name,
  });
  await demo.controller.select({
    kind: "bookmark",
    name: "retired/old-preview",
  });
  resolve();
  await old;
  expect(demo.controller.history.state.commits).toEqual([]);
  expect(demo.controller.state.selected).toEqual({
    kind: "bookmark",
    name: "retired/old-preview",
  });
  await demo.close();
});
test("close aborts and drains owned reads and closes history handles", async () => {
  let aborted = false,
    started!: () => void;
  const reading = new Promise<void>((done) => (started = done));
  const test = fixture({
    read: (_request, signal) =>
      new Promise((resolve) => {
        started();
        signal.addEventListener(
          "abort",
          () => {
            aborted = true;
            resolve(page());
          },
          { once: true },
        );
      }),
  });
  const read = test.controller.open(pin);
  await reading;
  await test.controller.close();
  await read;
  expect(aborted).toBe(true);
  expect(test.source.calls).toEqual([]);
  const demo = createBranchesDemo();
  await demo.start();
  await demo.close();
  expect(demo.fixture.closed.length).toBeGreaterThan(0);
});
test("retry restores a failed captured-reference read", async () => {
  const demo = createBranchesDemo("Retry");
  await demo.start();
  expect(demo.controller.state.phase).toBe("unavailable");
  await demo.controller.refresh();
  expect(demo.controller.state.phase).toBe("ready");
  expect(demo.errors).toEqual([]);
  await demo.close();
});

test("refresh resolves an explicitly retained reference across bounded pages", async () => {
  const demo = createBranchesDemo("Dense");
  await demo.start();
  await demo.controller.more();
  const selected = demo.controller.state.bookmarks[15];
  await demo.controller.select({ kind: "bookmark", name: selected.name });
  await demo.controller.refresh();
  expect(demo.controller.state.selected).toEqual({
    kind: "bookmark",
    name: selected.name,
  });
  expect(demo.controller.history.state.revset).toBe(
    branchRevset(selected.targets),
  );
  await demo.close();
});
test("an absent requested reference stays unavailable rather than silently selecting another", async () => {
  const test = fixture({
    async read() {
      return page();
    },
  });
  await test.controller.open(pin, { kind: "bookmark", name: "absent" });
  expect(test.controller.state.phase).toBe("unavailable");
  expect(test.source.calls).toEqual([]);
  await test.controller.close();
});

test("close before a queued read begins issues no port request", async () => {
  let requests = 0;
  const test = fixture({
    async read() {
      requests++;
      return page();
    },
  });
  const pending = test.controller.open(pin);
  await test.controller.close();
  await pending;
  expect(requests).toBe(0);
  expect(test.source.calls).toEqual([]);
});

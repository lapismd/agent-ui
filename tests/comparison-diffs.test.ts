import { expect, test } from "vitest";
import {
  ComparisonDiffs,
  type RepositoryDiffEntries,
} from "../packages/repository-ui/src/jj/logic/comparison-diffs.js";
import { denseChanges } from "../catalog/jj/support/dense-diffs.js";
const first = denseChanges[0],
  second = denseChanges[1];
test("deduplicates a pending file and retains independent completed reads", async () => {
  let state: RepositoryDiffEntries = {},
    calls = 0,
    release!: () => void;
  const files = new ComparisonDiffs((entries) => (state = entries));
  const read = async () => {
    calls++;
    await new Promise<void>((resolve) => (release = resolve));
    return first;
  };
  const a = files.load(first.path, read),
    b = files.load(first.path, read);
  await Promise.resolve();
  expect(a).toBe(b);
  expect(calls).toBe(1);
  await files.load(second.path, async () => second);
  expect(state[second.path]).toEqual({ phase: "ready", change: second });
  release();
  await a;
  expect(state[first.path]).toEqual({ phase: "ready", change: first });
  expect(await files.load(first.path, read)).toBe(first);
  expect(calls).toBe(1);
});
test("reset discards delayed successes and failures without damaging a new comparison", async () => {
  let state: RepositoryDiffEntries = {},
    release!: () => void,
    reject!: (error: Error) => void;
  const files = new ComparisonDiffs((entries) => (state = entries));
  const a = files.load(
    first.path,
    () => new Promise((resolve) => (release = () => resolve(first))),
  );
  const b = files.load(
    second.path,
    () => new Promise((_, fail) => (reject = fail)),
  );
  await Promise.resolve();
  files.reset();
  await files.load(first.path, async () => ({ ...first, path: "replacement" }));
  release();
  reject(Error("late failure"));
  await Promise.all([a, b]);
  expect(state[first.path]).toMatchObject({
    phase: "ready",
    change: { path: "replacement" },
  });
  expect(state[second.path]).toBeUndefined();
});
test("a failed file can retry without clearing other results", async () => {
  let state: RepositoryDiffEntries = {};
  const files = new ComparisonDiffs((entries) => (state = entries));
  await files.load(first.path, async () => first);
  await expect(
    files.load(second.path, async () => {
      throw Error("Read refused");
    }),
  ).rejects.toThrow("Read refused");
  expect(state[second.path]).toEqual({
    phase: "failed",
    message: "Read refused",
  });
  await files.load(second.path, async () => second);
  expect(Object.values(state).every((entry) => entry.phase === "ready")).toBe(
    true,
  );
});

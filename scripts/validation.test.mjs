import assert from "node:assert/strict";
import { test } from "node:test";
import {
  auditRouting,
  dispatch,
  imageKey,
  nativeInvocation,
  sourcePathViolation,
  validationConfig,
  validationKeys,
} from "./validation/model.mjs";
import { readFileSync } from "node:fs";
test("portable validation defaults to bounded Docker and explicit native execution", () => {
  assert.deepEqual(validationConfig({}, {}), {
    runtime: "docker",
    cpus: 4,
    memoryGiB: 12,
    shmGiB: 2,
  });
  assert.equal(
    validationConfig({}, { AGENT_UI_VALIDATION_RUNTIME: "native" }).runtime,
    "native",
  );
  assert.throws(() =>
    validationConfig({}, { AGENT_UI_VALIDATION_RUNTIME: "auto" }),
  );
});
test("invalid limits and transports fail closed", () => {
  for (const value of [0, -1, NaN, Infinity, "4"])
    assert.throws(() => validationConfig({ cpus: value }, {}));
  assert.throws(() => validationConfig({ context: "" }, {}));
  assert.throws(() => validationConfig({ transport: "auto" }, {}));
});
test("focused names remain literal arguments", () => {
  const call = nativeInvocation(
    { test: "node --test" },
    "test",
    ["file with spaces.test.mjs", "$(touch unsafe)"],
    "/repo",
    {},
  );
  assert.deepEqual(call.args, [
    "-c",
    'node --test "$@"',
    "validation",
    "file with spaces.test.mjs",
    "$(touch unsafe)",
  ]);
  assert.equal(call.env.AGENT_UI_VALIDATION_RUNTIME, "native");
  assert.throws(() => nativeInvocation({}, "missing", [], "/repo", {}));
});
test("all root scripts are Docker lanes or exact reviewed native exceptions", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const lanes = JSON.parse(
    readFileSync("scripts/validation/lanes.json", "utf8"),
  );
  assert.deepEqual(auditRouting(pkg.scripts, lanes), []);
  assert.notDeepEqual(auditRouting({ "test:new": "node new.mjs" }, {}), []);
  assert.notDeepEqual(auditRouting({ storybook: "unreviewed" }, {}), []);
});
test("Docker failure cannot call a native fallback", async () => {
  let called = false;
  await assert.rejects(
    dispatch(
      { runtime: "docker" },
      () => {
        called = true;
      },
      () => {
        throw Error("offline");
      },
    ),
    /offline/,
  );
  assert.equal(called, false);
});
test("private paths and model bytes reject recursively while source and reviewed port example remain valid", () => {
  for (const path of [
    ".env",
    "nested/.env.local",
    "nested/.local/secrets.json",
    "nested/target/bin",
    ".ssh/id",
    "nested/token.pem",
    "model.gguf",
    "../outside.ts",
  ])
    assert.equal(sourcePathViolation(path), true, path);
  for (const path of [
    "package.json",
    "packages/agent-ui/src/core/index.ts",
    ".env.storybook.local.example",
  ])
    assert.equal(sourcePathViolation(path), false, path);
});
test("tool image and JavaScript dependency cache identities are independent", () => {
  const inputs = {
    "scripts/validation/Dockerfile": "recipe",
    "scripts/validation/install-tools.mjs": "tools",
    packageManager: "pnpm@10.34.5",
    architecture: "x86_64",
    "package.json": "scripts",
    "pnpm-lock.yaml": "lock",
    archives: "one",
  };
  const first = validationKeys(inputs);
  assert.equal(
    first.image,
    validationKeys({ ...inputs, archives: "two", "package.json": "changed" })
      .image,
  );
  assert.notEqual(
    first.cache,
    validationKeys({ ...inputs, archives: "two" }).cache,
  );
  assert.equal(
    first.cache,
    validationKeys({ ...inputs, "package.json": "changed" }).cache,
  );
  assert.notEqual(
    first.image,
    validationKeys({ ...inputs, architecture: "arm64" }).image,
  );
  assert.equal(imageKey({ a: 1, b: 2 }), imageKey({ b: 2, a: 1 }));
});
test("cleanup keeps prepared, paused and uncertain work leased", async () => {
  const { leaseReleaseAllowed, stoppedRunState } =
    await import("./validation/model.mjs");
  assert.equal(leaseReleaseAllowed([]), true);
  for (const value of [undefined, null, ["active"]])
    assert.equal(leaseReleaseAllowed(value), false);
  for (const state of [
    "running",
    "created",
    "paused",
    "restarting",
    "removing",
    undefined,
  ])
    assert.equal(stoppedRunState(state), false);
  for (const state of ["exited", "dead"])
    assert.equal(stoppedRunState(state), true);
});

test("zero selected stories cannot qualify focused acceptance", async () => {
  const { assertSelectedStories } = await import("./storybook-report.mjs");
  assert.throws(
    () =>
      assertSelectedStories({
        numPassedTests: 0,
        numFailedTests: 0,
        numPendingTests: 2,
      }),
    /no executable/,
  );
  assert.throws(() => assertSelectedStories({}), /no executable/);
  assert.equal(
    assertSelectedStories({ numPassedTests: 2, numFailedTests: 0 }),
    2,
  );
});

test("complete catalogs use fresh native shards without changing focused arguments", async () => {
  const { storybookMatrix } = await import("./storybook-report.mjs");
  const all = storybookMatrix([]);
  assert.equal(all.length, 16);
  for (const mode of ["light", "dark"])
    for (const viewport of ["desktop", "narrow"])
      assert.deepEqual(
        all
          .filter((run) => run.mode === mode && run.viewport === viewport)
          .map((run) => run.args),
        [["--shard=1/4"], ["--shard=2/4"], ["--shard=3/4"], ["--shard=4/4"]],
      );
  assert.equal(new Set(all.map((run) => run.report)).size, 16);
  const args = ["family.stories.ts", "-t", "a name", "--shard=2/3"];
  const focused = storybookMatrix(args);
  assert.equal(focused.length, 4);
  for (const run of focused) assert.deepEqual(run.args, args);
});

test("matrix coverage rejects duplicated, missing and inconsistent selected cases", async () => {
  const { assertMatrixCoverage, storybookMatrix } =
    await import("./storybook-report.mjs");
  const report = (name) => ({
    numPassedTests: 1,
    numFailedTests: 0,
    testResults: [
      {
        name: "family.stories.ts",
        assertionResults: [{ fullName: name, status: "passed" }],
      },
    ],
  });
  const matrix = storybookMatrix([]).map((run) => ({
    ...run,
    report: report(run.args[0]),
  }));
  assert.deepEqual(assertMatrixCoverage(matrix), {
    casesPerMode: 4,
    total: 16,
  });
  assert.throws(
    () => assertMatrixCoverage([...matrix, matrix[0]]),
    /Duplicate/,
  );
  assert.throws(() => assertMatrixCoverage(matrix.slice(0, 12)), /Incomplete/);
  assert.throws(() => assertMatrixCoverage(matrix.slice(1)), /different cases/);
  assert.throws(
    () =>
      assertMatrixCoverage([
        { ...matrix[0], report: { ...matrix[0].report, numPassedTests: 2 } },
      ]),
    /count does not match/,
  );
});

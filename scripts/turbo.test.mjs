import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { resolveTurboConcurrency } from "./lib/concurrency.mjs";
import { summarizeTurboCache } from "./report-turbo-cache.mjs";

test("Turbo defaults to half the processors capped at four", () => {
  assert.equal(resolveTurboConcurrency({}, 1), "1");
  assert.equal(resolveTurboConcurrency({}, 6), "3");
  assert.equal(resolveTurboConcurrency({}, 32), "4");
});

test("Turbo accepts numeric and percentage overrides", () => {
  assert.equal(resolveTurboConcurrency({ TURBO_CONCURRENCY: "2" }, 32), "2");
  assert.equal(
    resolveTurboConcurrency({ TURBO_CONCURRENCY: "50%" }, 32),
    "50%",
  );
  assert.throws(
    () => resolveTurboConcurrency({ TURBO_CONCURRENCY: "0" }, 4),
    /positive integer/,
  );
});

test("summarizes local and remote cache outcomes", () => {
  assert.deepEqual(
    summarizeTurboCache({
      tasks: [
        { cache: { status: "HIT", source: "REMOTE" } },
        { cache: { status: "HIT", source: "LOCAL" } },
        { cache: { status: "MISS" } },
      ],
    }),
    { attempted: 3, executed: 1, localHits: 1, remoteHits: 1 },
  );
});

test("turbo.json matches the signed Design Core task-graph shape", () => {
  const config = JSON.parse(readFileSync("turbo.json", "utf8"));
  assert.equal(config.remoteCache.signature, true);
  assert.equal(config.remoteCache.timeout, 10);
  assert.equal(config.remoteCache.uploadTimeout, 30);
  assert.equal(config.futureFlags.longerSignatureKey, true);
  assert.deepEqual(config.globalEnv, ["CI"]);
  assert.equal(config.envMode, "loose");
  assert.equal(config.tasks["//#ci:governance"].cache, false);
  assert.equal(config.tasks["//#ci:storybook-interaction"].dependsOn, undefined);
  assert.equal(config.tasks["//#ci:browser"].dependsOn, undefined);
  for (const name of [
    "packages/**",
    "catalog/**",
    ".storybook/**",
    "tests/**",
    "scripts/**",
    "spec/**",
  ])
    assert.ok(config.globalDependencies.includes(name), name);
});

test("hosted verify runs storybook and browser as independent jobs", () => {
  const workflow = readFileSync(".github/workflows/check.yml", "utf8");
  const story = workflow.slice(
    workflow.indexOf("\n  storybook-interaction:"),
    workflow.indexOf("\n  browser:"),
  );
  const browser = workflow.slice(
    workflow.indexOf("\n  browser:"),
    workflow.indexOf("\n  verify:"),
  );
  assert.match(story, /ci:storybook-interaction/);
  assert.match(browser, /ci:browser/);
  assert.doesNotMatch(story, /\n    needs:/);
  assert.doesNotMatch(browser, /\n    needs:/);
  assert.match(workflow, /ci:governance/);
  const lanes = JSON.parse(
    readFileSync("scripts/validation/lanes.json", "utf8"),
  );
  assert.equal(
    lanes["storybook:check"],
    "pnpm test:storybook && pnpm test:browser && pnpm build-storybook",
  );
});

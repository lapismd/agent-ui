import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, mkdtempSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { gunzipSync } from "node:zlib";
import { sourceIntakeReader } from "./source-intake-reader.mjs";
import { sourceBaseline } from "./initial-intake.mjs";
import { verifyIntake } from "./workspace-intake.mjs";

// Unmodified output from real bot42, not a source-generated mock Changeset.
const actual = JSON.parse(
  gunzipSync(
    readFileSync(
      new URL("../fixtures/generated-core0135-intake.json.gz", import.meta.url),
    ),
  ),
);
const policyPath = ".github/dependency-automation/canonical-intake.json";
const policyBytes = actual.after[policyPath];
const policy = JSON.parse(policyBytes);
const notePath = ".changeset/lapis-dependencies-6882649476db.md";
function fixture(hasJj = false) {
  const commands = [];
  const execute = (binary, args) => {
    commands.push([binary, ...args]);
    if (binary === "git" && args.join(" ") === "rev-parse HEAD^1")
      return actual.baselineSource;
    if (binary === "jj" && args.includes("log")) return actual.baselineSource;
    if (binary === "git" && args[0] === "show") {
      assert(args[1].startsWith(actual.baselineSource + ":"));
      return actual.before[args[1].slice(41)];
    }
    if (binary === "jj" && args.includes("show"))
      return actual.before[args.at(-1)];
    assert(
      args.includes(actual.baselineSource),
      "changed paths must use the source fact baseline",
    );
    assert(
      args.includes(hasJj ? "@" : "HEAD"),
      "changed paths must include the candidate head",
    );
    assert(args.includes("diff"));
    assert.equal(binary, hasJj ? "jj" : "git");
    return actual.gitDiff;
  };
  // A marker-only transport fixture is not a source checkout or a VCS repo.
  const jjMarker = hasJj ? mkdtempSync(join(tmpdir(), "aui-jj-range-")) : null;
  if (jjMarker) mkdirSync(join(jjMarker, ".jj"));
  const reader = sourceIntakeReader(
    jjMarker ?? "/immutable-public-git-fixture",
    execute,
    hasJj,
  );
  const files = Object.fromEntries(
    ["pnpm-workspace.yaml", "pnpm-lock.yaml", ...policy.manifests].map(
      (path) => [path, actual.after[path]],
    ),
  );
  const context = sourceBaseline({
    readPrevious: reader,
    sourceSha: reader.sourceSha,
    policyBytes,
    files,
    metadataBytes: actual.after[".github/dependency-automation/bootstrap.json"],
  });
  let changedFiles;
  try {
    changedFiles = reader.changedFiles();
  } finally {
    if (jjMarker) rmSync(jjMarker, { recursive: true, force: true });
  }
  for (const path of changedFiles)
    if (path.startsWith(".changeset/")) files[path] = actual.after[path];
  return {
    commands,
    data: {
      policyBytes,
      files,
      ...context,
      changedFiles,
      documents: Object.fromEntries(
        policy.chapters.map((path) => [path, actual.after[path]]),
      ),
    },
  };
}
for (const hasJj of [false, true])
  test(`actual clean ${hasJj ? "Jujutsu" : "Git"} runtime candidate retains its generated release map`, () => {
    const { data, commands } = fixture(hasJj);
    assert.deepEqual(data.changedFiles, actual.changedFiles);
    assert(data.changedFiles.includes(notePath));
    const unchanged = structuredClone(data);
    const facts = verifyIntake(data);
    assert.equal(
      facts.manifests["packages/agent-ui/package.json"].dependencies[
        "@lapismd/design-core"
      ].version,
      "0.13.5",
    );
    assert.equal(
      facts.manifests["packages/repository-ui/package.json"].dependencies[
        "@lapismd/design-core"
      ].version,
      "0.13.5",
    );
    assert(data.files[notePath].includes('"@lapismd/agent-ui": patch'));
    assert(data.files[notePath].includes('"@lapismd/repository-ui": patch'));
    assert.deepEqual(data, unchanged);
    assert(commands.at(-1).includes(actual.baselineSource));
  });
test("actual runtime patch still rejects its omitted changed-file note", () => {
  const { data } = fixture();
  data.changedFiles = data.changedFiles.filter((path) => path !== notePath);
  assert.throws(
    () => verifyIntake(data),
    /Runtime dependency patch requires its Changeset/,
  );
});
test("actual runtime patch still rejects a weakened owner release map", () => {
  const { data } = fixture();
  data.files[notePath] = data.files[notePath].replace(
    '"@lapismd/repository-ui": patch\n',
    "",
  );
  assert.throws(
    () => verifyIntake(data),
    /Unexpected managed dependency release intent/,
  );
});
test("actual candidate still rejects unrelated tracked implementation changes", () => {
  const { data } = fixture();
  data.changedFiles.push("packages/agent-ui/src/index.ts");
  assert.throws(() => verifyIntake(data), /unexpected intake source scope/);
});
test("actual candidate still rejects changed managed-note bytes", () => {
  const { data } = fixture();
  data.files[notePath] = "---\nnull\n---\nInvalid release intent.\n";
  assert.throws(
    () => verifyIntake(data),
    /Invalid managed dependency note release map/,
  );
});
test("missing immutable Git ancestry fails before any source selection", () => {
  assert.throws(
    () => sourceIntakeReader("/immutable-public-git-fixture", () => "", false),
    /Source intake ancestry unavailable/,
  );
});

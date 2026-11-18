import test from "node:test";
import assert from "node:assert/strict";
import {
  readFileSync,
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  rmSync,
  symlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { gunzipSync } from "node:zlib";
import { checkWorkspaceIntake } from "./check-workspace-intake.mjs";
import { sourceIntakeReader } from "./source-intake-reader.mjs";
const fixture = (name) =>
  JSON.parse(
    gunzipSync(readFileSync(new URL("../fixtures/" + name, import.meta.url))),
  );
const version = fixture("consumed-version-intake.json.gz");
const runtime = fixture("generated-core0135-intake.json.gz");
const note = ".changeset/lapis-dependencies-6882649476db.md";
function check(actual, hasJj = false, mutate = () => {}) {
  const root = mkdtempSync(join(tmpdir(), "aui-consumed-note-"));
  try {
    for (const [path, bytes] of Object.entries(actual.after)) {
      mkdirSync(dirname(join(root, path)), { recursive: true });
      writeFileSync(join(root, path), bytes);
    }
    mutate(root);
    const factory = () =>
      sourceIntakeReader(
        root,
        (binary, args) => {
          if (
            (binary === "git" && args[0] === "rev-parse") ||
            (binary === "jj" && args.includes("log"))
          )
            return actual.baselineSource;
          if (args.includes("show"))
            return actual.before[
              binary === "git" ? args[1].slice(41) : args.at(-1)
            ];
          assert(args.includes("diff"));
          assert(args.includes(actual.baselineSource));
          assert(args.includes(hasJj ? "@" : "HEAD"));
          return actual.gitDiff;
        },
        hasJj,
      );
    return checkWorkspaceIntake(root, factory);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
for (const hasJj of [false, true])
  test(`real version44 consumes managed note in ${hasJj ? "JJ" : "Git"} without weakening intake`, () => {
    const facts = check(version, hasJj);
    assert.equal(
      facts.manifests["packages/agent-ui/package.json"].dependencies[
        "@lapismd/design-core"
      ].version,
      "0.13.5",
    );
    assert.equal(
      JSON.parse(version.after["packages/agent-ui/package.json"]).version,
      "0.2.9",
    );
    assert.equal(
      JSON.parse(version.after["packages/repository-ui/package.json"]).version,
      "0.2.7",
    );
    assert(version.changedFiles.includes(note));
    assert(!Object.hasOwn(version.after, note));
  });
test("real runtime candidate still requires actual managed release map", () =>
  assert.doesNotThrow(() => check(runtime)));
test("deleted runtime note remains rejected", () => {
  const data = structuredClone(runtime);
  delete data.after[note];
  assert.throws(() => check(data), /note bytes|Changeset/);
});
for (const [type, make] of [
  ["directory", (p) => mkdirSync(p)],
  ["live symlink", (p) => symlinkSync("../package.json", p)],
  ["dangling symlink", (p) => symlinkSync("./missing", p)],
  ["external symlink", (p) => symlinkSync("/etc/passwd", p)],
])
  test(`consumed-note handling rejects ${type}`, () =>
    assert.throws(() =>
      check(version, false, (root) => {
        mkdirSync(dirname(join(root, note)), { recursive: true });
        make(join(root, note));
      }),
    ));

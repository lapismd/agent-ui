import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import YAML from "yaml";
import { intakeFacts, intakeSlot, verifyIntake } from "./workspace-intake.mjs";
import ranges from "./ranges.mjs";

const read = (path) =>
  readFileSync(new URL("../../" + path, import.meta.url), "utf8");
const policyBytes = read(".github/dependency-automation/canonical-intake.json");
const policy = JSON.parse(policyBytes);
const fixture = (name) =>
  JSON.parse(
    gunzipSync(
      readFileSync(
        new URL("../fixtures/" + name + "-intake.json.gz", import.meta.url),
      ),
    ),
  );
const actual = fixture("workspace");
const documents = (files) =>
  Object.fromEntries(
    policy.chapters.map((path) => [
      path,
      "# Contract\n\n" + intakeSlot(policy, intakeFacts(policy, files)) + "\n",
    ]),
  );
function data() {
  const before = structuredClone(actual.before),
    files = structuredClone(actual.after);
  return {
    policyBytes,
    basePolicyBytes: policyBytes,
    before,
    files,
    documents: documents(files),
    baseDocuments: documents(before),
    changedFiles: ["package.json", "pnpm-lock.yaml", ...policy.chapters],
  };
}
const sdk = "@lapismd/spec-validator";
const changeLock = (d, mutate) => {
  const lock = YAML.parse(d.files["pnpm-lock.yaml"]);
  mutate(lock);
  d.files["pnpm-lock.yaml"] = YAML.stringify(lock);
};

test("actual SDK registry patch independently qualifies all three owners", () => {
  const d = data(),
    saved = structuredClone(d);
  const facts = verifyIntake(d);
  assert.equal(
    facts.manifests["package.json"].devDependencies[sdk].version,
    "0.2.1",
  );
  assert.deepEqual(
    Object.keys(facts.manifests).sort(),
    [...policy.manifests].sort(),
  );
  assert.deepEqual(d, saved);
});
for (const [name, mutate] of [
  ["missing immutable policy", (d) => delete d.basePolicyBytes],
  ["changed immutable policy", (d) => (d.basePolicyBytes += " ")],
  [
    "unrelated source",
    (d) => d.changedFiles.push("packages/agent-ui/src/index.ts"),
  ],
  [
    "manual canonical prose",
    (d) => (d.documents[policy.chapters[0]] += "Manual rewrite"),
  ],
  ["missing mapped owner slot", (d) => delete d.documents[policy.chapters[1]]],
  [
    "duplicate slot",
    (d) => (d.documents[policy.chapters[2]] += d.documents[policy.chapters[2]]),
  ],
  [
    "runtime public exports",
    (d) => {
      const p = JSON.parse(d.files[policy.manifests[1]]);
      p.exports["."] = "./other.js";
      d.files[policy.manifests[1]] = JSON.stringify(p);
    },
  ],
  [
    "runtime owner version",
    (d) => {
      const p = JSON.parse(d.files[policy.manifests[2]]);
      p.version = "99.0.0";
      d.files[policy.manifests[2]] = JSON.stringify(p);
    },
  ],
  [
    "workspace settings",
    (d) =>
      (d.files["pnpm-workspace.yaml"] += "\npreferWorkspacePackages: true\n"),
  ],
  [
    "undeclared active importer",
    (d) =>
      changeLock(
        d,
        (l) => (l.importers.hidden = structuredClone(l.importers["."])),
      ),
  ],
  [
    "unrelated importer edge",
    (d) =>
      changeLock(
        d,
        (l) =>
          (l.importers["."].devDependencies.unreviewed = {
            specifier: "1.0.0",
            version: "1.0.0",
          }),
      ),
  ],
  [
    "same-version Core metadata",
    (d) =>
      changeLock(
        d,
        (l) =>
          (l.packages["@lapismd/design-core@0.13.4"].engines = {
            node: ">=99",
          }),
      ),
  ],
  [
    "unsupported SDK minor",
    (d) => {
      const p = JSON.parse(d.files["package.json"]);
      p.devDependencies[sdk] = "^0.3.0";
      d.files["package.json"] = JSON.stringify(p);
    },
  ],
  [
    "source policy owner removal",
    (d) => {
      const p = JSON.parse(d.policyBytes);
      p.manifests.pop();
      d.policyBytes = JSON.stringify(p);
    },
  ],
])
  test("rejects " + name + " without mutation", () => {
    const d = data();
    mutate(d);
    const saved = structuredClone(d);
    assert.throws(() => verifyIntake(d));
    assert.deepEqual(d, saved);
  });
test("same-version SDK integrity drift fails even without an update", () => {
  const d = data();
  d.files = structuredClone(d.before);
  changeLock(
    d,
    (l) =>
      (l.packages[sdk + "@0.2.0"].resolution.integrity =
        "sha512-" + "A".repeat(86) + "=="),
  );
  d.documents = documents(d.files);
  assert.throws(() => verifyIntake(d), /integrity/u);
});
test("same-version first-party metadata fails even without an update", () => {
  const d = data();
  d.files = structuredClone(d.before);
  d.documents = d.baseDocuments;
  changeLock(
    d,
    (l) =>
      (l.packages["@lapismd/design-core@0.13.4"].engines = { node: ">=99" }),
  );
  assert.throws(() => verifyIntake(d), /metadata/u);
});
const note = ".changeset/lapis-dependencies-123456abcdef.md";
for (const header of ["", "{}"])
  test("actual empty managed note retains no release intent: " + header, () => {
    const d = data();
    d.changedFiles.push(note);
    d.files[note] =
      "---\n" +
      (header ? header + "\n" : "") +
      "---\n\nUpdate development tooling.\n";
    assert.doesNotThrow(() => verifyIntake(d));
  });
for (const [name, text, paths] of [
  ["null", "---\nnull\n---\nBody", [note]],
  ["array", "---\n[]\n---\nBody", [note]],
  [
    "public bump on development intake",
    '---\n"@lapismd/agent-ui": patch\n---\nBody',
    [note],
  ],
  ["missing body", "---\n---\n\n", [note]],
  ["oversized UTF8", "---\n---\n\n" + "é".repeat(4096), [note]],
  [
    "multiple notes",
    "---\n---\n\nBody",
    [note, ".changeset/lapis-dependencies-abcdef123456.md"],
  ],
  ["arbitrary Changeset", "---\n---\n\nBody", [".changeset/arbitrary.md"]],
])
  test("rejects managed note " + name, () => {
    const d = data();
    for (const path of paths) {
      d.changedFiles.push(path);
      d.files[path] = text;
    }
    assert.throws(() => verifyIntake(d));
  });
test("source-supported ranges reject migrations and non-registry syntax", () => {
  for (const range of ["^0.13.4", "~0.2.0", "0.2.1"])
    assert.ok(ranges.validRange(range));
  for (const range of [
    "file:../core",
    "workspace:*",
    "catalog:unsupported",
    "https://registry.test/core",
    ">=0.2.0",
    "^1.0.0",
    "^0.2.1-beta.1",
    "^0.2.999999999999999999999999",
  ])
    assert.equal(ranges.validRange(range), false);
  assert.ok(ranges.satisfies("0.2.1", "^0.2.0"));
  assert.equal(ranges.satisfies("0.3.0", "^0.2.0"), false);
  assert.equal(ranges.satisfies("0.0.5", "^0.0.4"), false);
  assert.equal(ranges.diff("0.2.0", "0.2.1"), "patch");
  assert.equal(ranges.subset("^0.3.0", "^0.2.0"), false);
});

// Synthetic owner-selection control; actual-registry qualification uses the gzip fixture.
function runtimeData() {
  const files = structuredClone(actual.after),
    before = structuredClone(actual.after);
  const build = (source, coreVersion) => {
    const lock = {
      lockfileVersion: "9.0",
      importers: {},
      packages: {},
      snapshots: {},
    };
    for (const path of policy.manifests) {
      const manifest = JSON.parse(source[path]),
        importer = path === "package.json" ? "." : path.slice(0, -13);
      const selected = {};
      for (const type of [
        "dependencies",
        "devDependencies",
        "optionalDependencies",
      ])
        for (const name of policy.dependencies) {
          if (!manifest[type]?.[name]) continue;
          if (name === "@lapismd/design-core")
            manifest[type][name] = "^" + coreVersion;
          const value =
            name === "@lapismd/design-core"
              ? coreVersion
              : intakeFacts(policy, actual.after).manifests[path][type][name]
                  .version;
          (selected[type] ??= {})[name] = {
            specifier: manifest[type][name],
            version: value,
          };
          lock.packages[name + "@" + value] = {
            resolution: { integrity: "sha512-" + "A".repeat(86) + "==" },
          };
          lock.snapshots[name + "@" + value] = {};
        }
      lock.importers[importer] = selected;
      source[path] = JSON.stringify(manifest);
    }
    source["pnpm-lock.yaml"] = YAML.stringify(lock);
  };
  build(before, "0.13.4");
  build(files, "0.13.5");
  return {
    policyBytes,
    basePolicyBytes: policyBytes,
    files,
    before,
    documents: documents(files),
    baseDocuments: documents(before),
    changedFiles: [...policy.manifests, "pnpm-lock.yaml", ...policy.chapters],
  };
}
test("runtime floor control requires both affected public owners and excludes the private root", () => {
  const d = runtimeData();
  d.changedFiles.push(note);
  d.files[note] =
    '---\n"@lapismd/agent-ui": patch\n"@lapismd/repository-ui": patch\n---\n\nUpdate the shared runtime floor.\n';
  assert.doesNotThrow(() => verifyIntake(d));
  d.files[note] =
    '---\n"@lapismd/agent-ui": patch\n---\n\nMissing the second public owner.\n';
  assert.throws(() => verifyIntake(d), /release intent/u);
});
test("a runtime floor change without its note is rejected", () =>
  assert.throws(() => verifyIntake(runtimeData()), /Changeset/u));

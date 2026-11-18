import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { initialIntake, sourceBaseline } from "./initial-intake.mjs";
import { intakeFacts, intakeSlot } from "./workspace-intake.mjs";
const read = (path) =>
  readFileSync(new URL("../../" + path, import.meta.url), "utf8");
const policyBytes = read(".github/dependency-automation/canonical-intake.json");
const policy = JSON.parse(policyBytes);
const metadataBytes = read(".github/dependency-automation/bootstrap.json");
const metadata = JSON.parse(metadataBytes);
const fixture = (name) =>
  JSON.parse(
    gunzipSync(
      readFileSync(
        new URL("../fixtures/" + name + "-intake.json.gz", import.meta.url),
      ),
    ),
  );
const bootstrap = fixture("bootstrap");
const documents = (files) =>
  Object.fromEntries(
    policy.chapters.map((path) => [
      path,
      "# Contract\n\n" + intakeSlot(policy, intakeFacts(policy, files)) + "\n",
    ]),
  );
const data = () => {
  const actual = fixture("workspace");
  return {
    ...actual,
    files: actual.after,
    baseDocuments: documents(actual.before),
  };
};
function initial() {
  return {
    sourceSha: metadata.baselineSource,
    policyBytes,
    metadataBytes,
    before: structuredClone(bootstrap.before),
    files: structuredClone(bootstrap.after),
  };
}
test("only the exact reviewed initial baseline and five input hashes bootstrap", () =>
  assert.equal(initialIntake(initial()), true));
for (const [name, mutate] of [
  ["missing history", (d) => delete d.sourceSha],
  ["changed metadata", (d) => (d.metadataBytes += " ")],
  ["changed opt-in", (d) => (d.policyBytes += " ")],
  ["changed baseline bytes", (d) => (d.before["package.json"] += " ")],
  ["changed candidate bytes", (d) => (d.files["pnpm-lock.yaml"] += " ")],
  ["missing owner", (d) => delete d.files[policy.manifests[1]]],
])
  test("initial bootstrap rejects " + name, () => {
    const d = initial();
    mutate(d);
    assert.throws(() => initialIntake(d));
  });
test("another real source cannot use bootstrap as a missing-policy fallback", () => {
  const sourceSha = "b".repeat(40),
    d = initial();
  assert.equal(initialIntake({ ...d, sourceSha }), false);
  assert.throws(
    () =>
      sourceBaseline({
        ...d,
        sourceSha,
        readPrevious: (path) => {
          if (path === ".github/dependency-automation/canonical-intake.json")
            throw Error("missing source opt-in");
          return d.before[path];
        },
      }),
    /missing source opt-in/u,
  );
});
test("ordinary source requires unchanged policy and every base owner chapter", () => {
  const d = data(),
    readPrevious = (path) =>
      path === ".github/dependency-automation/canonical-intake.json"
        ? policyBytes
        : (d.before[path] ?? d.baseDocuments[path]);
  const result = sourceBaseline({
    ...initial(),
    sourceSha: "b".repeat(40),
    readPrevious,
  });
  assert.equal(result.bootstrap, false);
  assert.deepEqual(result.baseDocuments, d.baseDocuments);
});

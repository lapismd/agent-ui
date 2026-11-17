import { createHash } from "node:crypto";
const reviewedMetadataSha256 =
  "4edd83a5a72f83478a83c3293d8ffd714d78bdbcdc78c568b382ae648eb0b780";
const policyPath = ".github/dependency-automation/canonical-intake.json";
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const fail = (reason) => {
  throw Error("Initial Agent UI intake: " + reason);
};
export function initialIntake({
  sourceSha,
  policyBytes,
  files,
  before,
  metadataBytes,
}) {
  if (!/^[a-f0-9]{40}$/.test(sourceSha ?? ""))
    fail("source ancestry unavailable");
  if (
    typeof metadataBytes !== "string" ||
    hash(metadataBytes) !== reviewedMetadataSha256
  )
    fail("reviewed bootstrap metadata changed");
  const metadata = JSON.parse(metadataBytes);
  if (sourceSha !== metadata.baselineSource) return false;
  if (hash(policyBytes) !== metadata.policySha256)
    fail("initial source policy changed");
  if (
    JSON.stringify(Object.keys(files).sort()) !==
    JSON.stringify(Object.keys(metadata.inputs).sort())
  )
    fail("initial input set changed");
  for (const [path, binding] of Object.entries(metadata.inputs)) {
    if (
      typeof before[path] !== "string" ||
      typeof files[path] !== "string" ||
      hash(before[path]) !== binding.before ||
      hash(files[path]) !== binding.after
    )
      fail("initial source bytes changed: " + path);
  }
  return true;
}
export function sourceBaseline({
  readPrevious,
  sourceSha,
  policyBytes,
  files,
  metadataBytes,
}) {
  const before = Object.fromEntries(
    Object.keys(files).map((path) => [path, readPrevious(path)]),
  );
  if (initialIntake({ sourceSha, policyBytes, files, before, metadataBytes }))
    return { before: undefined, bootstrap: true };
  const basePolicyBytes = readPrevious(policyPath);
  if (basePolicyBytes !== policyBytes)
    fail("ordinary source opt-in changed or missing");
  const policy = JSON.parse(policyBytes);
  const baseDocuments = Object.fromEntries(
    policy.chapters.map((path) => [path, readPrevious(path)]),
  );
  return { before, basePolicyBytes, baseDocuments, bootstrap: false };
}

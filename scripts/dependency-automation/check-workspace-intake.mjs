import { readFileSync, realpathSync, lstatSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { sourceIntakeReader } from "./source-intake-reader.mjs";
import { sourceBaseline } from "./initial-intake.mjs";
import { verifyIntake } from "./workspace-intake.mjs";
export function checkWorkspaceIntake(
  root = process.cwd(),
  sourceReader = sourceIntakeReader,
) {
  const read = (path) => {
    const target = resolve(root, path);
    if (realpathSync(target) !== target || !lstatSync(target).isFile())
      throw Error("Non-regular Agent UI intake source");
    return readFileSync(target, "utf8");
  };
  const policyBytes = read(
    ".github/dependency-automation/canonical-intake.json",
  );
  const policy = JSON.parse(policyBytes);
  const inputs = [
    ...new Set(["pnpm-workspace.yaml", "pnpm-lock.yaml", ...policy.manifests]),
  ];
  const files = Object.fromEntries(inputs.map((path) => [path, read(path)]));
  const documents = Object.fromEntries(
    policy.chapters.map((path) => [path, read(path)]),
  );
  const base = sourceReader(root);
  const context = sourceBaseline({
    readPrevious: base,
    sourceSha: base.sourceSha,
    policyBytes,
    files,
    metadataBytes: read(".github/dependency-automation/bootstrap.json"),
  });
  const changedFiles = base.changedFiles();
  for (const path of changedFiles)
    if (
      /^\.changeset\/lapis-dependencies-[a-f0-9]{12}\.md$/u.test(path) &&
      lstatSync(resolve(root, path), { throwIfNoEntry: false }) !== undefined
    )
      files[path] = read(path);
  return verifyIntake({
    policyBytes,
    files,
    documents,
    ...context,
    changedFiles,
  });
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  checkWorkspaceIntake();
  console.log(
    "Agent UI workspace intake matches all three owners and registry facts.",
  );
}

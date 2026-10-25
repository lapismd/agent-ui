import { readFile, writeFile, mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { hash, sourcePathViolation } from "./model.mjs";
export function validateArchives(entries) {
  if (!Array.isArray(entries))
    throw Error("Archive inventory must be an array");
  const names = new Set();
  for (const entry of entries) {
    if (
      !/^(@[a-z0-9-]+\/)?[a-z0-9][a-z0-9._-]*$/.test(entry.name ?? "") ||
      !/^\d+\.\d+\.\d+[-+\w.]*$/.test(entry.version ?? "") ||
      typeof entry.path !== "string" ||
      !entry.path.endsWith(".tgz") ||
      !/^[a-f0-9]{64}$/.test(entry.sha256 ?? "") ||
      names.has(entry.name)
    )
      throw Error("Invalid or duplicate archive identity");
    names.add(entry.name);
  }
  return entries;
}
export async function projection(entries, input, root) {
  const overrides = {};
  for (const entry of validateArchives(entries)) {
    const path = join(input, entry.path);
    if (hash(await readFile(path)) !== entry.sha256)
      throw Error(`Archive checksum mismatch: ${entry.name}`);
    const listing = execFileSync("tar", ["-tzf", path], { encoding: "utf8" })
      .trim()
      .split("\n");
    if (
      listing.some(
        (member) =>
          !member.startsWith("package/") ||
          sourcePathViolation(member.slice(8)),
      )
    )
      throw Error(`Private or unsafe package archive: ${entry.name}`);
    if (
      execFileSync("tar", ["-tvzf", path], { encoding: "utf8" })
        .split("\n")
        .some((line) => line && !/^[d-]/.test(line))
    )
      throw Error(`Package archive links are forbidden: ${entry.name}`);
    const identity = JSON.parse(
      execFileSync("tar", ["-xOf", path, "package/package.json"], {
        encoding: "utf8",
      }),
    );
    if (identity.name !== entry.name || identity.version !== entry.version)
      throw Error(`Archive package identity mismatch: ${entry.name}`);
    overrides[entry.name] = `file:${path}`;
  }
  if (entries.length) {
    const directory = join(root, ".local/validation");
    await mkdir(directory, { recursive: true });
    const hook = join(directory, "review-pnpmfile.cjs");
    await writeFile(
      hook,
      `const archives=${JSON.stringify(overrides)};module.exports={hooks:{readPackage(pkg){for(const field of ['dependencies','optionalDependencies','peerDependencies'])for(const name of Object.keys(pkg[field]||{})){if(!archives[name])continue;if(field==='peerDependencies'){pkg.dependencies??={};pkg.dependencies[name]=archives[name];}else pkg[field][name]=archives[name];}return pkg;}}};\n`,
    );
    process.env.AGENT_UI_REVIEW_PNPMFILE = hook;
  }
  return overrides;
}

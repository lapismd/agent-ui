import { cp, mkdir, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
const root = path.resolve(import.meta.dirname, "..");
const name = process.argv[2] ?? "agent-ui";
if (!["agent-ui", "repository-ui"].includes(name))
  throw new Error("Unknown package");
const owner = path.join(root, "packages", name);
const stage = path.join(owner, ".cache/package");
const input = path.join(stage, "src");
const catalogFile =
  /(?:\.stories\.|\.example-sources\.|\.tokens\.json$|\.mdx$)/;
await rm(stage, { recursive: true, force: true });
await mkdir(stage, { recursive: true });
try {
  await cp(path.join(owner, "src"), input, {
    recursive: true,
    filter: (file) => !catalogFile.test(file),
  });
  for (const args of [
    [
      "exec",
      "svelte-package",
      "-i",
      input,
      "-o",
      "dist",
      "--tsconfig",
      path.join(owner, "tsconfig.json"),
    ],
    ["exec", "publint"],
  ]) {
    const result = spawnSync("pnpm", args, { cwd: owner, stdio: "inherit" });
    if (result.status !== 0)
      throw new Error(`${args.join(" ")} failed (${result.status})`);
  }
} finally {
  await rm(stage, { recursive: true, force: true });
}

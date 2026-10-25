import { execFileSync } from "node:child_process";
import { readFile, writeFile, copyFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { exportPack } from "./docker.mjs";
import { validateArchives } from "./archives.mjs";
import { hash, sourcePathViolation } from "./model.mjs";

const jj = (root, args) =>
  execFileSync("jj", ["--no-pager", "--color=never", ...args], {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  }).trim();
export async function snapshot(root, directory, archiveManifest) {
  const revision = jj(root, [
    "log",
    "-r",
    "@",
    "--no-graph",
    "-T",
    "commit_id",
  ]);
  const parents = jj(root, [
    "log",
    "-r",
    `${revision}-`,
    "--no-graph",
    "-T",
    'commit_id ++ "\\n"',
  ])
    .split("\n")
    .filter(Boolean);
  const files = jj(root, ["file", "list", "-r", revision]).split("\n");
  const gitDirectory = jj(root, ["git", "root"]);
  const historical = execFileSync(
    "git",
    ["--git-dir", gitDirectory, "rev-list", "--objects", revision],
    {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    },
  )
    .split("\n")
    .filter((line) => line.includes(" "))
    .map((line) => line.slice(line.indexOf(" ") + 1));
  // This tracked example contains a port only. Verify every historical blob.
  for (const line of execFileSync(
    "git",
    ["--git-dir", gitDirectory, "rev-list", "--objects", revision],
    { encoding: "utf8" },
  ).split("\n"))
    if (line.endsWith(" .env.storybook.local.example")) {
      const content = execFileSync(
        "git",
        ["--git-dir", gitDirectory, "cat-file", "blob", line.split(" ")[0]],
        { encoding: "utf8" },
      );
      if (!/^STORYBOOK_PORT=\d{4,5}\n?$/.test(content))
        throw Error("Port example contains unexpected private configuration");
    }
  const rejected = [...files, ...historical].find(sourcePathViolation);
  if (rejected)
    throw Error(
      `Private/local/model state must not enter source snapshot: ${rejected}`,
    );
  await exportPack(
    root,
    gitDirectory,
    revision,
    join(directory, "source.pack"),
  );
  const archives = [];
  if (archiveManifest) {
    const manifest = resolve(root, archiveManifest);
    for (const [index, entry] of validateArchives(
      JSON.parse(await readFile(manifest, "utf8")),
    ).entries()) {
      const original = resolve(dirname(manifest), entry.path),
        bytes = await readFile(original);
      if (hash(bytes) !== entry.sha256)
        throw Error(`Archive checksum mismatch: ${entry.name}`);
      const path = `package-${index}.tgz`;
      await copyFile(original, join(directory, path));
      archives.push({ ...entry, path });
    }
  }
  const source = {
    schema: 1,
    revision,
    parents,
    fileCount: files.length,
    archives,
    packSha256: hash(await readFile(join(directory, "source.pack"))),
  };
  await writeFile(
    join(directory, "source.json"),
    JSON.stringify(source, null, 2),
  );
  return source;
}

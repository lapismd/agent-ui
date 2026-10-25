import { execFileSync } from "node:child_process";
import { writeFile, mkdir, mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import {
  hash,
  validationKeys,
  label,
  workspace,
  stoppedRunState,
} from "./model.mjs";
import { collect } from "./reports.mjs";
import { output, docker, sendDirectory } from "./docker.mjs";
import { snapshot } from "./source.mjs";

export const revision = (root) =>
  execFileSync("jj", ["log", "-r", "@", "--no-graph", "-T", "commit_id"], {
    cwd: root,
    encoding: "utf8",
  }).trim();
const snapshotFile = (root, commit, path) =>
  execFileSync("jj", ["file", "show", "-r", commit, "--", path], {
    cwd: root,
    maxBuffer: 64 * 1024 * 1024,
  });
export async function image(
  config,
  root,
  commit = revision(root),
  rebuild = false,
) {
  const inputs = {},
    files = new Map();
  for (const path of [
    "scripts/validation/Dockerfile",
    "scripts/validation/install-tools.mjs",
    "package.json",
    "pnpm-lock.yaml",
  ]) {
    const bytes = snapshotFile(root, commit, path);
    files.set(path, bytes);
    inputs[path] = hash(bytes);
  }
  const packageManager = JSON.parse(files.get("package.json")).packageManager;
  const recipe = files.get("scripts/validation/Dockerfile").toString();
  const versions = [
    ...new Set(
      [
        ...files
          .get("pnpm-lock.yaml")
          .toString()
          .matchAll(/^  playwright@([0-9][^:]*):$/gm),
      ].map((m) => m[1]),
    ),
  ];
  if (
    !/^pnpm@\d+\.\d+\.\d+$/.test(packageManager ?? "") ||
    versions.length !== 1 ||
    !recipe.includes(`corepack prepare ${packageManager} --activate`) ||
    !recipe.includes(`Version ${versions[0]}`)
  )
    throw Error(
      "Pinned validation recipe must match pnpm and locked Playwright",
    );
  Object.assign(inputs, {
    packageManager,
    playwright: versions[0],
    architecture: output(config, ["info", "--format", "{{.Architecture}} "]),
  });
  const {
    image: key,
    cache: cacheKey,
    imageInputs,
    cacheInputs,
  } = validationKeys(inputs);
  const tag = `agent-ui-validation:${key}`;
  try {
    if (!rebuild)
      return {
        tag,
        key,
        cacheKey,
        id: output(config, ["image", "inspect", tag, "--format", "{{.Id}}"]),
        inputs: imageInputs,
        cacheInputs,
      };
  } catch {
    /* Build the missing fingerprint; no host fallback. */
  }
  const directory = await mkdtemp(join(tmpdir(), "agent-ui-image-"));
  try {
    for (const file of ["Dockerfile", "install-tools.mjs"])
      await writeFile(
        join(directory, file),
        files.get(`scripts/validation/${file}`),
      );
    await sendDirectory(
      config,
      [
        "build",
        "--label",
        `${label}=image`,
        "-t",
        tag,
        ...(rebuild ? ["--no-cache"] : []),
        "-",
      ],
      directory,
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
  return {
    tag,
    key,
    cacheKey,
    id: output(config, ["image", "inspect", tag, "--format", "{{.Id}}"]),
    inputs: imageInputs,
    cacheInputs,
  };
}
export async function remoteRun(config, root, lane, args) {
  const directory = await mkdtemp(join(tmpdir(), "agent-ui-source-"));
  const run = `agent-ui-run-${randomUUID()}`,
    owner = workspace(root),
    lease = `agent-ui-lease-${owner}`;
  let leaseId,
    runRequested = false,
    collected = false,
    removed = false;
  try {
    const source = await snapshot(root, directory, config.archives);
    const selected = await image(config, root, source.revision);
    const keys = validationKeys({
      ...selected.cacheInputs,
      ...selected.inputs,
      archives: JSON.stringify(
        source.archives
          .map(({ name, version, sha256 }) => ({ name, version, sha256 }))
          .sort((a, b) => a.name.localeCompare(b.name)),
      ),
    });
    selected.cacheKey = keys.cache;
    selected.cacheInputs = keys.cacheInputs;
    const request = {
      run,
      lane,
      args,
      image: selected,
      resources: {
        cpus: config.cpus,
        memoryGiB: config.memoryGiB,
        shmGiB: config.shmGiB,
        init: true,
        capabilities: "none",
      },
    };
    await writeFile(
      join(directory, "request.json"),
      JSON.stringify(request, null, 2),
    );
    for (const file of [
      "worker.mjs",
      "model.mjs",
      "docker.mjs",
      "archives.mjs",
    ])
      await writeFile(
        join(directory, file),
        snapshotFile(root, source.revision, `scripts/validation/${file}`),
      );
    const report = join(root, ".local/validation/runs", run);
    await mkdir(report, { recursive: true });
    await writeFile(
      join(report, "request.json"),
      JSON.stringify({ ...request, source }, null, 2),
    );
    leaseId = output(config, [
      "create",
      "--name",
      lease,
      "--label",
      `${label}=lease`,
      "--label",
      `${label}.workspace=${owner}`,
      "--label",
      `${label}.run=${run}`,
      "--entrypoint",
      "true",
      selected.tag,
    ]);
    const cache = `agent-ui-cache-${selected.cacheKey}`;
    await docker(config, [
      "volume",
      "create",
      "--label",
      `${label}=cache`,
      cache,
    ]);
    runRequested = true;
    await docker(config, [
      "create",
      "--name",
      run,
      "--init",
      "--cap-drop=ALL",
      "--label",
      `${label}=run`,
      "--label",
      `${label}.workspace=${owner}`,
      "--cpus",
      String(config.cpus),
      "--memory",
      `${config.memoryGiB}g`,
      "--shm-size",
      `${config.shmGiB}g`,
      "--mount",
      `type=volume,src=${cache},dst=/cache`,
      "--env",
      "NODE_OPTIONS=--max-old-space-size=6144",
      "--entrypoint",
      "node",
      selected.tag,
      "/input/worker.mjs",
    ]);
    await sendDirectory(config, ["cp", "-", `${run}:/input`], directory);
    let failure;
    try {
      await docker(config, ["start", "--attach", run]);
    } catch (error) {
      failure = error;
    }
    const result = await collect(config, root, run);
    collected = true;
    console.log(`Validation ${result.status}: ${report}`);
    if (failure || result.status !== "passed")
      throw failure ?? Error(`Validation failed: ${result.error ?? run}`);
    await docker(config, ["rm", run]);
    removed = true;
    return result;
  } finally {
    try {
      // Remove this exact lease only after a known terminal state; lost SSH stays leased.
      if (leaseId) {
        const safe =
          removed ||
          !runRequested ||
          (collected &&
            stoppedRunState(
              output(config, [
                "inspect",
                run,
                "--format",
                "{{.State.Status}} ",
              ]),
            ));
        if (safe) await docker(config, ["rm", leaseId]);
        else
          console.error(
            `Retaining validation lease ${leaseId}: run state or collection is incomplete`,
          );
      }
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  }
}

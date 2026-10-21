#!/usr/bin/env node
import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  realpathSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { processCwd, processCommand } from "./storybook-process-inspect.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const DEFAULT_STORYBOOK_PORT = "7490";

function normalizedRoot(root) {
  const resolved = path.resolve(root);
  return existsSync(resolved) ? realpathSync(resolved) : resolved;
}

export function resolveStorybookLane({ root, env = process.env } = {}) {
  const checkoutRoot = normalizedRoot(
    root ?? path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."),
  );
  const port = String(env.STORYBOOK_PORT ?? DEFAULT_STORYBOOK_PORT);
  const portNumber = Number(port);
  if (!Number.isInteger(portNumber) || portNumber < 1 || portNumber > 65_535) {
    throw new Error(`Invalid STORYBOOK_PORT: ${port}`);
  }
  const visualPort = String(
    env.VISUAL_SERVER_PORT ?? env.VISUAL_DELTA_SERVER_PORT ?? portNumber + 1,
  );
  const debugPort = String(portNumber + 90);
  const extraPorts = (env.STORYBOOK_EXTRA_PORTS ?? `${visualPort} ${debugPort}`)
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const stopPorts = [
    port,
    ...extraPorts,
    String(env.VISUAL_DELTA_PANEL_STATIC_PORT ?? portNumber + 3),
    String(env.VISUAL_DELTA_PANEL_STORYBOOK_PORT ?? portNumber + 4),
    String(env.VISUAL_DELTA_PANEL_VISUAL_PORT ?? portNumber + 5),
    String(
      Number(env.VISUAL_DELTA_PANEL_STORYBOOK_PORT ?? portNumber + 4) + 90,
    ),
    String(env.WORKSPACE_STORYBOOK_PORT ?? portNumber + 200),
    String(env.WORKSPACE_VISUAL_SERVER_PORT ?? portNumber + 201),
    String(Number(env.WORKSPACE_STORYBOOK_PORT ?? portNumber + 200) + 90),
  ];
  return {
    root: checkoutRoot,
    port,
    visualPort,
    debugPort,
    extraPorts,
    serverPorts: [...new Set([port, ...extraPorts])],
    stopPorts: [...new Set(stopPorts)],
    ownerPath: path.join(
      checkoutRoot,
      ".cache",
      "storybook",
      "supervisors",
      `${port}.json`,
    ),
  };
}

export function storybookStartupMode(env = process.env) {
  return env.STORYBOOK_REPLACE === "1" ? "replace" : "reuse";
}

export function processIsAlive(pid) {
  if (!Number.isInteger(pid) || pid < 1) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function readJson(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

export function readSupervisorOwnership(lane) {
  const owner = readJson(lane.ownerPath);
  if (
    !owner ||
    owner.version !== 1 ||
    owner.root !== lane.root ||
    owner.port !== lane.port ||
    !Number.isInteger(owner.supervisorPid)
  ) {
    return null;
  }
  return owner;
}

function runtimeOwnerIsAlive(owner) {
  if (!processIsAlive(owner.supervisorPid)) return false;
  const cwd = processCwd(owner.supervisorPid);
  const command = processCommand(owner.supervisorPid);
  return cwd === owner.root && command.includes("scripts/storybook-run.mjs");
}

export function acquireSupervisorOwnership(
  lane,
  {
    supervisorPid = process.pid,
    ownerIsAlive = runtimeOwnerIsAlive,
    now = () => Date.now(),
  } = {},
) {
  mkdirSync(path.dirname(lane.ownerPath), { recursive: true });
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const existing = readSupervisorOwnership(lane);
    if (existing && ownerIsAlive(existing)) {
      return { acquired: false, owner: existing };
    }
    if (existsSync(lane.ownerPath)) {
      try {
        unlinkSync(lane.ownerPath);
      } catch {
        continue;
      }
    }
    const owner = {
      version: 1,
      root: lane.root,
      port: lane.port,
      supervisorPid,
      childPid: null,
      startedAt: now(),
    };
    try {
      const fd = openSync(lane.ownerPath, "wx");
      try {
        writeFileSync(fd, `${JSON.stringify(owner, null, 2)}\n`);
      } finally {
        closeSync(fd);
      }
      return { acquired: true, owner };
    } catch (error) {
      if (error?.code !== "EEXIST") throw error;
    }
  }
  throw new Error(`Could not acquire Storybook ownership at ${lane.ownerPath}`);
}

export function updateSupervisorOwnership(
  lane,
  patch,
  supervisorPid = process.pid,
) {
  const owner = readSupervisorOwnership(lane);
  if (!owner || owner.supervisorPid !== supervisorPid) return false;
  const temporary = `${lane.ownerPath}.${supervisorPid}.tmp`;
  writeFileSync(
    temporary,
    `${JSON.stringify({ ...owner, ...patch }, null, 2)}\n`,
  );
  renameSync(temporary, lane.ownerPath);
  return true;
}

export function releaseSupervisorOwnership(lane, supervisorPid = process.pid) {
  const owner = readSupervisorOwnership(lane);
  if (!owner || owner.supervisorPid !== supervisorPid) return false;
  try {
    unlinkSync(lane.ownerPath);
    return true;
  } catch {
    return false;
  }
}

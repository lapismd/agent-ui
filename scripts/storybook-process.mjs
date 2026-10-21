import { unlinkSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  resolveStorybookLane,
  readSupervisorOwnership,
  processIsAlive,
} from "./storybook-process-state.mjs";
import {
  findMatchingSupervisors,
  listProcesses,
  descendantPids,
  processCwd,
  processCommand,
} from "./storybook-process-inspect.mjs";
export * from "./storybook-process-state.mjs";
export * from "./storybook-process-inspect.mjs";
export function planStorybookStop({
  processes,
  root,
  port,
  owner,
  cwdForPid = processCwd,
  environmentForPid = (pid) => processCommand(pid, { environment: true }),
}) {
  const supervisors = findMatchingSupervisors({
    processes,
    root,
    port,
    cwdForPid,
    environmentForPid,
  });
  const roots = new Set(supervisors.map((entry) => entry.pid));
  if (owner?.supervisorPid) roots.add(owner.supervisorPid);
  return {
    supervisors: [...roots],
    processes: descendantPids(processes, [...roots]),
  };
}

export function listenerPids(port) {
  try {
    return execFileSync("lsof", ["-tiTCP:" + port, "-sTCP:LISTEN"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    })
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map(Number);
  } catch {
    return [];
  }
}

export function partitionForeignListeners(lane, listeners) {
  return {
    storybookPort: listeners.filter((listener) => listener.port === lane.port),
    auxiliaryPorts: listeners.filter((listener) => listener.port !== lane.port),
  };
}

export async function terminateProcessTrees(
  roots,
  {
    processes = listProcesses(),
    graceMs = 700,
    sendSignal = (pid, signal) => process.kill(pid, signal),
    isAlive = processIsAlive,
  } = {},
) {
  const targets = descendantPids(processes, roots)
    .filter((pid) => pid !== process.pid)
    .reverse();
  for (const pid of targets) {
    try {
      sendSignal(pid, "SIGTERM");
    } catch {
      /* already exited */
    }
  }
  if (targets.some(isAlive)) {
    await new Promise((resolve) => setTimeout(resolve, graceMs));
  }
  for (const pid of targets) {
    if (!isAlive(pid)) continue;
    try {
      sendSignal(pid, "SIGKILL");
    } catch {
      /* already exited */
    }
  }
  return targets;
}

export async function cleanupCheckoutListeners(lane, ports = lane.serverPorts) {
  const retained = [];
  const local = [];
  for (const port of ports) {
    for (const pid of listenerPids(port)) {
      if (processCwd(pid) === lane.root) local.push(pid);
      else retained.push({ port, pid, cwd: processCwd(pid) });
    }
  }
  if (local.length > 0) {
    await terminateProcessTrees([...new Set(local)]);
  }
  return retained;
}

export async function stopStorybookLane(
  lane,
  { includePorts = lane.stopPorts, processes = listProcesses() } = {},
) {
  const plan = planStorybookStop({
    processes,
    root: lane.root,
    port: lane.port,
    owner: readSupervisorOwnership(lane),
  });
  const terminated =
    plan.supervisors.length > 0
      ? await terminateProcessTrees(plan.supervisors, { processes })
      : [];

  const latestOwner = readSupervisorOwnership(lane);
  if (
    latestOwner &&
    (plan.supervisors.includes(latestOwner.supervisorPid) ||
      !processIsAlive(latestOwner.supervisorPid))
  ) {
    try {
      unlinkSync(lane.ownerPath);
    } catch {
      /* already released */
    }
  }
  const retained = await cleanupCheckoutListeners(lane, includePorts);
  return {
    supervisors: plan.supervisors,
    terminated,
    retained,
  };
}

async function cli() {
  if (process.argv[1] !== fileURLToPath(import.meta.url)) return;
  const command = process.argv[2];
  if (command !== "stop") {
    console.error("Usage: node scripts/storybook-process.mjs stop");
    process.exitCode = 2;
    return;
  }
  const lane = resolveStorybookLane();
  const result = await stopStorybookLane(lane);
  if (result.supervisors.length > 0) {
    console.log(
      `[storybook-process] stopped supervisors ${result.supervisors.join(", ")} for ${lane.root} :${lane.port}`,
    );
  } else {
    console.log(
      `[storybook-process] no supervisor for ${lane.root} :${lane.port}`,
    );
  }
  for (const listener of result.retained) {
    console.warn(
      `[storybook-process] retained foreign listener ${listener.pid} on :${listener.port}${listener.cwd ? ` (${listener.cwd})` : ""}`,
    );
  }
}

await cli();

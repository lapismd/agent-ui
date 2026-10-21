import { execFileSync } from "node:child_process";
import { existsSync, realpathSync } from "node:fs";
import path from "node:path";
const DEFAULT_STORYBOOK_PORT = "7490";
function normalizedRoot(root) {
  const p = path.resolve(root);
  return existsSync(p) ? realpathSync(p) : p;
}
export function parseProcessTable(output) {
  return output
    .split("\n")
    .map((line) => line.match(/^\s*(\d+)\s+(\d+)\s+(.*)$/))
    .filter(Boolean)
    .map((match) => ({
      pid: Number(match[1]),
      ppid: Number(match[2]),
      command: match[3],
    }));
}

export function listProcesses() {
  try {
    return parseProcessTable(
      execFileSync("ps", ["-axo", "pid=,ppid=,command="], {
        encoding: "utf8",
      }),
    );
  } catch {
    return [];
  }
}

export function processCommand(pid, { environment = false } = {}) {
  try {
    return execFileSync(
      "ps",
      environment
        ? ["eww", "-p", String(pid), "-o", "command="]
        : ["-p", String(pid), "-o", "command="],
      { encoding: "utf8" },
    ).trim();
  } catch {
    return "";
  }
}

export function processCwd(pid) {
  try {
    const output = execFileSync(
      "lsof",
      ["-a", "-p", String(pid), "-d", "cwd", "-Fn"],
      {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      },
    );
    const cwd = output
      .split("\n")
      .find((line) => line.startsWith("n"))
      ?.slice(1);
    return cwd ? normalizedRoot(cwd) : null;
  } catch {
    return null;
  }
}

export function descendantPids(processes, parentPids) {
  const found = new Set(parentPids);
  let changed = true;
  while (changed) {
    changed = false;
    for (const entry of processes) {
      if (found.has(entry.ppid) && !found.has(entry.pid)) {
        found.add(entry.pid);
        changed = true;
      }
    }
  }
  return [...found];
}

function explicitPort(environment) {
  return environment.match(/(?:^|\s)STORYBOOK_PORT=(\d+)(?:\s|$)/)?.[1];
}

function dispatcherPort(command) {
  if (!command.includes("storybook/dist/bin/dispatcher.js")) return undefined;
  return command.match(/(?:^|\s)-p\s+(\d+)(?:\s|$)/)?.[1];
}

export function isStorybookSupervisorCommand(command) {
  return /^\s*\S*node\s+(?:\S*\/)?scripts\/storybook-run\.mjs(?:\s|$)/.test(
    command,
  );
}

export function findMatchingSupervisors({
  processes,
  root,
  port,
  cwdForPid = processCwd,
  environmentForPid = (pid) => processCommand(pid, { environment: true }),
}) {
  const checkoutRoot = normalizedRoot(root);
  return processes
    .filter((entry) => isStorybookSupervisorCommand(entry.command))
    .filter((entry) => cwdForPid(entry.pid) === checkoutRoot)
    .filter((entry) => {
      const descendants = descendantPids(processes, [entry.pid])
        .map((pid) => processes.find((candidate) => candidate.pid === pid))
        .filter(Boolean);
      const childPort = descendants
        .map((candidate) => dispatcherPort(candidate.command))
        .find(Boolean);
      const configuredPort = explicitPort(environmentForPid(entry.pid));
      // Legacy default-lane supervisors did not export STORYBOOK_PORT.
      return (configuredPort ?? childPort ?? DEFAULT_STORYBOOK_PORT) === port;
    });
}

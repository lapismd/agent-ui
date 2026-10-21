import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  acquireSupervisorOwnership,
  isStorybookSupervisorCommand,
  planStorybookStop,
  partitionForeignListeners,
  readSupervisorOwnership,
  releaseSupervisorOwnership,
  resolveStorybookLane,
  storybookStartupMode,
  terminateProcessTrees,
  updateSupervisorOwnership,
} from "../scripts/storybook-process.mjs";

const temporaryRoots: string[] = [];

function temporaryLane(port = "9400") {
  const root = mkdtempSync(path.join(tmpdir(), "storybook-process-"));
  temporaryRoots.push(root);
  return resolveStorybookLane({ root, env: { STORYBOOK_PORT: port } });
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("Storybook supervisor ownership", () => {
  it("does not mistake the environment wrapper for the supervisor", () => {
    expect(
      isStorybookSupervisorCommand(
        "node scripts/with-storybook-env.mjs node scripts/storybook-run.mjs",
      ),
    ).toBe(false);
    expect(
      isStorybookSupervisorCommand("node scripts/storybook-run.mjs --ci"),
    ).toBe(true);
    expect(
      isStorybookSupervisorCommand(
        "node /repo/scripts/storybook-run.mjs --no-open",
      ),
    ).toBe(true);
  });

  it("rejects a duplicate start while the checkout-and-port owner is alive", () => {
    const lane = temporaryLane();
    const first = acquireSupervisorOwnership(lane, {
      supervisorPid: 101,
      ownerIsAlive: () => false,
      now: () => 1,
    });
    const duplicate = acquireSupervisorOwnership(lane, {
      supervisorPid: 202,
      ownerIsAlive: (owner) => owner.supervisorPid === 101,
      now: () => 2,
    });

    expect(first.acquired).toBe(true);
    expect(duplicate).toMatchObject({
      acquired: false,
      owner: { supervisorPid: 101, port: "9400" },
    });
  });

  it("recovers a malformed or stale owner and releases on child exit", () => {
    const lane = temporaryLane();
    mkdirSync(path.dirname(lane.ownerPath), { recursive: true });
    writeFileSync(lane.ownerPath, "stale");

    expect(
      acquireSupervisorOwnership(lane, {
        supervisorPid: 303,
        ownerIsAlive: () => false,
      }),
    ).toMatchObject({ acquired: true });
    expect(updateSupervisorOwnership(lane, { childPid: 404 }, 303)).toBe(true);
    expect(readSupervisorOwnership(lane)).toMatchObject({
      supervisorPid: 303,
      childPid: 404,
    });
    expect(releaseSupervisorOwnership(lane, 303)).toBe(true);
    expect(readSupervisorOwnership(lane)).toBeNull();
  });

  it("makes restart replace ownership while an ordinary start reuses it", () => {
    expect(storybookStartupMode({})).toBe("reuse");
    expect(storybookStartupMode({ STORYBOOK_REPLACE: "1" })).toBe("replace");
  });
});

describe("Storybook lane cleanup", () => {
  const processes = [
    { pid: 10, ppid: 1, command: "node scripts/storybook-run.mjs" },
    {
      pid: 11,
      ppid: 10,
      command: "node storybook/dist/bin/dispatcher.js dev -p 7490",
    },
    { pid: 12, ppid: 11, command: "node vite-child.js" },
    { pid: 20, ppid: 1, command: "node scripts/storybook-run.mjs" },
    {
      pid: 21,
      ppid: 20,
      command: "node storybook/dist/bin/dispatcher.js dev -p 9200",
    },
    { pid: 30, ppid: 1, command: "node scripts/storybook-run.mjs" },
    {
      pid: 31,
      ppid: 30,
      command: "node storybook/dist/bin/dispatcher.js dev -p 7490",
    },
  ];
  const cwd = new Map([
    [10, "/repo"],
    [20, "/repo"],
    [30, "/other"],
  ]);

  it("stops the supervisor and every child only for the requested checkout and port", () => {
    const planned = planStorybookStop({
      processes,
      root: "/repo",
      port: "7490",
      owner: null,
      cwdForPid: (pid) => cwd.get(pid) ?? null,
      environmentForPid: () => "",
    });

    expect(planned.supervisors).toEqual([10]);
    expect(planned.processes).toEqual([10, 11, 12]);
  });

  it("keeps an alternate checkout port independent", () => {
    const planned = planStorybookStop({
      processes,
      root: "/repo",
      port: "9200",
      owner: null,
      cwdForPid: (pid) => cwd.get(pid) ?? null,
      environmentForPid: (pid) => (pid === 20 ? "STORYBOOK_PORT=9200" : ""),
    });

    expect(planned.supervisors).toEqual([20]);
    expect(planned.processes).toEqual([20, 21]);
  });

  it("blocks a foreign Storybook listener but only warns for auxiliary ports", () => {
    const lane = temporaryLane();
    expect(
      partitionForeignListeners(lane, [
        { port: "9400", pid: 1, cwd: "/other" },
        { port: "9401", pid: 2, cwd: "/" },
      ]),
    ).toEqual({
      storybookPort: [{ port: "9400", pid: 1, cwd: "/other" }],
      auxiliaryPorts: [{ port: "9401", pid: 2, cwd: "/" }],
    });
  });

  it("terminates descendants before the supervisor", async () => {
    const signals: Array<[number, string]> = [];
    const alive = new Set([10, 11, 12]);
    const terminated = await terminateProcessTrees([10], {
      processes,
      graceMs: 0,
      isAlive: (pid) => alive.has(pid),
      sendSignal: (pid, signal) => {
        signals.push([pid, signal]);
        alive.delete(pid);
      },
    });

    expect(terminated).toEqual([12, 11, 10]);
    expect(signals).toEqual([
      [12, "SIGTERM"],
      [11, "SIGTERM"],
      [10, "SIGTERM"],
    ]);
  });
});

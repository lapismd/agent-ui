import { describe, expect, it, vi } from "vitest";
import { AgentDirectoryController } from "../packages/agent-ui/src/directory/logic/controller.js";
import type {
  AgentDirectoryPort,
  AgentDirectoryPage,
} from "../packages/agent-ui/src/directory/logic/types.js";

function page(): AgentDirectoryPage {
  return {
    snapshot: "v1",
    agents: [],
    sessions: [],
    captures: [],
    clients: [],
    capabilities: ["save-agent", "stop-session"],
  };
}
function fixture() {
  const value = page();
  const port: AgentDirectoryPort = {
    read: vi.fn(async () => value),
    execute: vi.fn(async () => ({ state: "committed" as const })),
    resolve: vi.fn(async () => ({ state: "committed" as const })),
    draft: vi.fn(async () => null),
  };
  const report = vi.fn();
  return {
    port,
    value,
    report,
    controller: new AgentDirectoryController(port, report),
  };
}

describe("Agent directory host boundary", () => {
  it("refreshes a known rejection while retaining the exact unsaved draft", async () => {
    const { port, controller } = fixture();
    await controller.open();
    const agent = {
      id: "agent",
      version: "old",
      name: "Builder",
      client: "codex",
      model: "",
      description: "",
      instructions: "Keep this",
    };
    await controller.draft("agent", agent);
    port.execute = vi.fn(async () => ({
      state: "rejected" as const,
      message: "Configuration changed",
    }));
    port.read = vi.fn(async () => ({
      ...page(),
      agents: [{ ...agent, version: "latest" }],
    }));
    expect(await controller.submit({ kind: "save-agent", agent })).toBe(false);
    expect(controller.state.page?.agents[0].version).toBe("latest");
    expect(await controller.draft("agent")).toEqual(agent);
    expect(controller.state.pending).toHaveLength(0);
    expect(port.execute).toHaveBeenCalledOnce();
    await controller.close();
  });
  it("drains serialized draft writes in order before controller teardown", async () => {
    const { port, controller } = fixture();
    let finish!: () => void;
    const writes: string[] = [];
    port.draft = vi.fn(async (_key, value) => {
      writes.push(value?.name ?? "clear");
      if (writes.length === 1)
        await new Promise<void>((resolve) => {
          finish = resolve;
        });
      return value ?? null;
    });
    const draft = {
      id: "agent",
      version: "",
      name: "First",
      client: "codex",
      model: "",
      description: "",
      instructions: "",
    };
    const first = controller.draft("new", draft);
    const second = controller.draft("new", { ...draft, name: "Second" });
    await Promise.resolve();
    let closed = false;
    const close = controller.close().then(() => {
      closed = true;
    });
    expect(writes).toEqual(["First"]);
    expect(closed).toBe(false);
    finish();
    await Promise.all([first, second, close]);
    expect(writes).toEqual(["First", "Second"]);
  });
  it("keeps an edited draft through a failed host write and editor remount", async () => {
    const { port, controller } = fixture();
    const draft = {
      id: "agent",
      version: "",
      name: "Builder",
      client: "codex",
      model: "",
      description: "",
      instructions: "Keep this draft",
    };
    port.draft = vi.fn(async () => {
      throw Error("Disk unavailable");
    });
    await expect(controller.draft("new", draft)).rejects.toThrow(
      "Disk unavailable",
    );
    expect(await controller.draft("new")).toEqual(draft);
    port.draft = vi.fn(async () => null);
    await controller.draft("new", null);
    expect(await controller.draft("new")).toBeNull();
    await controller.close();
  });

  it("rejects a scoped page from another metadata home", async () => {
    const { value, controller, report } = fixture();
    value.sessions = [
      {
        id: "s",
        home: "b",
        title: "Wrong home",
        agentName: "Builder",
        state: "running",
        updatedAt: 1,
      },
    ];
    await controller.open({ home: "a" });
    expect(controller.state.page).toBeUndefined();
    expect(report).toHaveBeenCalledOnce();
    await controller.close();
  });
  it("does not execute on open, hides unsupported writes and releases subscriptions", async () => {
    const { port, value, controller } = fixture();
    const release = vi.fn();
    port.subscribe = vi.fn(() => release);
    value.capabilities = [];
    await controller.open();
    expect(port.execute).not.toHaveBeenCalled();
    expect(
      await controller.submit({
        kind: "stop-session",
        home: "a",
        session: "s",
      }),
    ).toBe(false);
    await controller.close();
    expect(release).toHaveBeenCalledOnce();
  });

  it("recovers a persisted exact request without redispatch after remount", async () => {
    const { port, controller } = fixture();
    const request = {
      id: "saved-intent",
      command: { kind: "stop-session" as const, home: "a", session: "s" },
    };
    port.pending = vi.fn(async () => [request]);
    await controller.open({ home: "b" });
    expect(controller.state.pending).toEqual([request]);
    await controller.resolve(request.id);
    expect(port.resolve).toHaveBeenCalledWith(request);
    expect(port.execute).not.toHaveBeenCalled();
    expect(controller.state.pending).toHaveLength(0);
    await controller.close();
  });

  it("preserves existing rows when a continuation belongs to another snapshot", async () => {
    const { port, value, controller } = fixture();
    value.next = "page-2";
    await controller.open();
    port.read = vi.fn(async () => ({ ...page(), snapshot: "changed" }));
    await controller.more();
    expect(controller.state.page?.snapshot).toBe("v1");
    expect(controller.state.page?.next).toBe("page-2");
    expect(controller.state.error).toContain("snapshot changed");
    await controller.close();
  });

  it("discards stale scope reads and drains outstanding reads on close", async () => {
    const { port, controller } = fixture();
    let finish!: (value: AgentDirectoryPage) => void;
    port.read = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            finish = resolve;
          }),
      )
      .mockResolvedValue({ ...page(), snapshot: "new" });
    const old = controller.open({ home: "a" });
    await controller.open({ home: "b" });
    let closed = false;
    const close = controller.close().then(() => {
      closed = true;
    });
    await Promise.resolve();
    expect(closed).toBe(false);
    finish(page());
    await Promise.all([old, close]);
    expect(controller.state.page?.snapshot).toBe("new");
    expect(controller.state.scope.home).toBe("b");
  });

  it("keeps live sessions and captures distinct across duplicate home IDs", async () => {
    const { value, controller } = fixture();
    value.sessions = ["a", "b"].map((home) => ({
      id: "same",
      home,
      title: "Review",
      agentName: "Builder",
      state: "running",
      updatedAt: 1,
    }));
    value.captures = [
      {
        id: "same",
        home: "a",
        title: "Review",
        agentName: "Builder",
        snapshot: "capture-1",
        transcripts: 2,
        tools: 1,
        updatedAt: 1,
      },
    ];
    await controller.open();
    expect(controller.state.page?.sessions).toHaveLength(2);
    expect(controller.state.page?.captures).toHaveLength(1);
    await controller.close();
  });

  it("rejects repeated cursors and duplicate identities without losing loaded rows", async () => {
    const { port, value, controller, report } = fixture();
    value.next = "next";
    await controller.open();
    port.read = vi.fn(async () => ({ ...page(), next: "next" }));
    await controller.more();
    expect(report).toHaveBeenCalledTimes(1);
    expect(controller.state.page?.next).toBe("next");
    port.read = vi.fn(async () => ({
      ...page(),
      agents: [
        {
          id: "same",
          name: "One",
          version: "1",
          client: "acp",
          model: "",
          description: "",
          instructions: "",
        },
        {
          id: "same",
          name: "Two",
          version: "1",
          client: "acp",
          model: "",
          description: "",
          instructions: "",
        },
      ],
    }));
    await controller.open();
    expect(report).toHaveBeenCalledTimes(2);
    await controller.close();
  });

  it("retains exact unknown actions and resolves without replay after navigation", async () => {
    const { port, controller } = fixture();
    port.execute = vi.fn(async () => ({ state: "unknown" }));
    await controller.open({ home: "a" });
    await controller.submit({
      kind: "stop-session",
      home: "a",
      session: "session",
    });
    const request = structuredClone(controller.state.pending[0]);
    await controller.open({ home: "b" });
    expect(
      await controller.submit({
        kind: "stop-session",
        home: "b",
        session: "session",
      }),
    ).toBe(false);
    await controller.resolve(request.id);
    expect(port.execute).toHaveBeenCalledTimes(1);
    expect(port.resolve).toHaveBeenCalledWith(request);
    expect(controller.state.pending).toHaveLength(0);
    await controller.close();
  });

  it("does not convert an acknowledged action into an unknown outcome on refresh failure", async () => {
    const { port, controller } = fixture();
    await controller.open();
    port.read = vi.fn(async () => {
      throw Error("Offline");
    });
    expect(
      await controller.submit({
        kind: "stop-session",
        home: "a",
        session: "session",
      }),
    ).toBe(true);
    expect(controller.state.pending).toHaveLength(0);
    expect(controller.state.error).toBeTruthy();
    await controller.close();
  });
});

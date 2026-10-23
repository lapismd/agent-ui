import { describe, it, expect, vi } from "vitest";
import { ProjectsController } from "../packages/repository-ui/src/jj/projects/logic/controller.js";
import type {
  WorkPage,
  WorkPort,
  WorkRequest,
} from "../packages/repository-ui/src/jj/projects/logic/types.js";
const page = (home = "a"): WorkPage => ({
  home,
  snapshot: "v1",
  projects: [],
  tasks: [],
  comments: [],
  reviews: [],
  activity: [],
});
const fixture = () => {
  const port: WorkPort = {
    homes: vi.fn(async () =>
      ["a", "b"].map((id) => ({
        id,
        name: "Same name",
        available: true,
        writable: true,
      })),
    ),
    read: vi.fn(async (q) => page(q.home)),
    execute: vi.fn(async () => ({ state: "committed" })),
    resolve: vi.fn(async () => ({ state: "unknown" })),
    draft: vi.fn(async () => null),
  };
  const report = vi.fn();
  return { port, report, controller: new ProjectsController(port, { report }) };
};
describe("Projects scoped controller", () => {
  it("constructs without reads or mutations and separates duplicate names", async () => {
    const f = fixture();
    expect(f.port.read).not.toHaveBeenCalled();
    await f.controller.open();
    expect(f.controller.state.homes.map((h) => h.home.id)).toEqual(["a", "b"]);
    expect(f.port.execute).not.toHaveBeenCalled();
    expect(f.port.read).toHaveBeenCalledWith(
      expect.objectContaining({ home: "a", limit: 25 }),
      expect.any(AbortSignal),
    );
    await f.controller.close();
  });
  it("retains successful homes when another fails and retries independently", async () => {
    const f = fixture();
    f.port.read = vi.fn(async (q) => {
      if (q.home === "b") throw Error("Offline");
      return page(q.home);
    });
    await f.controller.open();
    expect(f.controller.state.homes[0].page?.home).toBe("a");
    expect(f.controller.state.homes[1].error).toContain("Offline");
    f.port.read = vi.fn(async (q) => page(q.home));
    await f.controller.read("b");
    expect(f.controller.state.homes[1].error).toBeUndefined();
  });
  it("fences stale reads and invalid continuation snapshots", async () => {
    const f = fixture();
    let resolve!: (value: WorkPage) => void;
    f.port.read = vi.fn(
      async () =>
        new Promise((done) => {
          resolve = done;
        }),
    );
    const first = f.controller.open({ tab: "projects", home: "a" });
    await vi.waitFor(() => expect(resolve).toBeTypeOf("function"));
    f.port.read = vi.fn(async (q) => ({ ...page(q.home), next: "page2" }));
    await f.controller.open({ tab: "tasks", home: "b" });
    resolve(page("a"));
    await first;
    expect(f.controller.state.homes[0].page?.home).toBe("b");
    f.port.read = vi.fn(async () => ({ ...page("b"), snapshot: "changed" }));
    await f.controller.read("b", true);
    expect(f.controller.state.homes[0].page?.snapshot).toBe("v1");
    expect(f.controller.state.homes[0].error).toContain("snapshot changed");
  });
  it("unknown commands remain exact and are inspected without replay", async () => {
    const f = fixture();
    await f.controller.open();
    f.port.execute = vi.fn(async () => ({ state: "unknown" }));
    const command = {
      kind: "create-project",
      id: "p",
      title: "Original",
      body: "",
    } as const;
    expect(await f.controller.submit("a", command)).toBe(false);
    const retained = f.controller.state.pending[0];
    await f.controller.submit("a", { ...command, title: "Changed" });
    expect(f.port.execute).toHaveBeenCalledTimes(1);
    await f.controller.resolve(retained);
    expect(f.port.resolve).toHaveBeenCalledWith(retained);
    expect(f.port.execute).toHaveBeenCalledTimes(1);
  });
  it("navigation cannot redirect an in-flight mutation or lose its request", async () => {
    const f = fixture();
    await f.controller.open();
    let finish!: (value: { state: "unknown" }) => void;
    f.port.execute = vi.fn(
      async () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    const write = f.controller.submit("a", {
      kind: "create-project",
      id: "p",
      title: "Original",
      body: "",
    });
    const retained = f.controller.state.pending[0];
    await f.controller.open({ tab: "tasks", home: "b" });
    expect(f.controller.state.pending).toContainEqual(retained);
    finish({ state: "unknown" });
    await write;
    expect(f.controller.state.pending[0].home).toBe("a");
  });
  it("restores pending requests without dispatching and rejects writes to unavailable homes", async () => {
    const f = fixture();
    const pending: WorkRequest = {
      id: "saved",
      home: "a",
      command: { kind: "create-review", body: "Saved" },
    };
    f.port.pending = async () => [pending];
    await f.controller.open();
    expect(f.controller.state.pending).toEqual([pending]);
    expect(f.port.execute).not.toHaveBeenCalled();
    expect(
      await f.controller.submit("unknown", {
        kind: "create-review",
        body: "No",
      }),
    ).toBe(false);
    expect(f.port.execute).not.toHaveBeenCalled();
  });
});

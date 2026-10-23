import { describe, it, expect, vi } from "vitest";
import { ThreadsController } from "../packages/agent-ui/src/threads/logic/controller.js";
import type {
  ThreadsPort,
  ThreadPage,
} from "../packages/agent-ui/src/threads/logic/types.js";

const row = (home: string, id = "same") => ({
  home,
  id,
  title: "Review",
  status: "active",
  author: { id: "alex", name: "Alex" },
});
const page = (home: string): ThreadPage => ({
  home,
  snapshot: "v1",
  rows: [row(home)],
});
function fixture() {
  const report = vi.fn();
  const port: ThreadsPort = {
    homes: vi.fn(async () => [
      { id: "a", name: "App" },
      { id: "b", name: "App" },
    ]),
    read: vi.fn(async ({ home }) => page(home)),
  };
  const controller = new ThreadsController(port, report);
  return { controller, port, report };
}
describe("Registered Threads inbox", () => {
  it("keeps duplicate thread and repository names scoped without activating code", async () => {
    const { controller, port } = fixture();
    await controller.open();
    expect(controller.state.homes.map((h) => h.page?.rows[0])).toEqual([
      row("a"),
      row("b"),
    ]);
    expect(Object.keys(port).sort()).toEqual(["homes", "read"]);
    await controller.close();
  });
  it("keeps a partial outage independent and retries only that home", async () => {
    const { controller, port } = fixture();
    port.read = vi.fn(async ({ home }) => {
      if (home === "b") throw Error("Offline");
      return page(home);
    });
    await controller.open();
    expect(controller.state.homes[0].page?.rows).toHaveLength(1);
    expect(controller.state.homes[1].error).toContain("Offline");
    port.read = vi.fn(async ({ home }) => page(home));
    await controller.read("b");
    expect(port.read).toHaveBeenCalledTimes(1);
    expect(controller.state.homes[1].error).toBeUndefined();
    await controller.close();
  });
  it("preserves loaded rows when continuation changes snapshot or repeats identities", async () => {
    const { controller, port, report } = fixture();
    port.read = vi.fn(async ({ home }) => ({ ...page(home), next: "next" }));
    await controller.open();
    port.read = vi.fn(async ({ home }) => ({ ...page(home), snapshot: "v2" }));
    await controller.read("a", true);
    expect(controller.state.homes[0].page?.snapshot).toBe("v1");
    port.read = vi.fn(async ({ home }) => page(home));
    await controller.read("a", true);
    expect(controller.state.homes[0].page?.rows).toHaveLength(1);
    expect(report).toHaveBeenCalledTimes(2);
    await controller.close();
  });
  it("rejects a foreign home and repeated cursor without discarding other homes", async () => {
    const { controller, port } = fixture();
    port.read = vi.fn(async ({ home }) => ({ ...page(home), next: "next" }));
    await controller.open();
    await controller.read("a", true);
    expect(controller.state.homes[0].error).toContain("continuation");
    port.read = vi.fn(async () => page("wrong"));
    await controller.read("a");
    expect(controller.state.homes[0].error).toContain("home");
    expect(controller.state.homes[1].page?.rows).toHaveLength(1);
    await controller.close();
  });
  it("discards a late response after scope change and drains reads on close", async () => {
    const { controller, port } = fixture();
    let finish!: (value: ThreadPage) => void;
    port.read = vi.fn(({ home }) =>
      home === "a"
        ? new Promise<ThreadPage>((resolve) => {
            finish = resolve;
          })
        : Promise.resolve(page(home)),
    );
    const old = controller.open({ home: "a" });
    await vi.waitFor(() => expect(finish).toBeTypeOf("function"));
    await controller.open({ home: "b" });
    let closed = false;
    const closing = controller.close().then(() => {
      closed = true;
    });
    await Promise.resolve();
    expect(closed).toBe(false);
    finish(page("a"));
    await Promise.all([old, closing]);
    expect(controller.state.homes.map((h) => h.id)).toEqual(["b"]);
  });
  it("bounds repository fanout and exposes further registered homes explicitly", async () => {
    const { controller, port } = fixture();
    port.homes = vi.fn(async () =>
      Array.from({ length: 21 }, (_, i) => ({ id: String(i), name: "App" })),
    );
    await controller.open();
    expect(controller.state.homes).toHaveLength(20);
    expect(controller.state.remaining).toBe(1);
    await controller.moreHomes();
    expect(controller.state.homes).toHaveLength(21);
    await controller.close();
  });
});

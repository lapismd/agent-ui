import { describe, expect, it } from "vitest";
import { RepositoryBrowserController } from "../packages/repository-ui/src/jj/browse/logic/controller.js";
import type {
  RepositoryBrowserPort,
  RepositoryPathRequest,
  RepositoryPathPage,
} from "../packages/repository-ui/src/jj/browse/logic/types.js";

const pin = {
  repository: "notes",
  operation: "operation-a",
  revision: "commit-a",
};
const entry = (path: string) => ({
  type: "blob" as const,
  name: path.split("/").at(-1)!,
  path,
});
function fixture() {
  const reads: RepositoryPathRequest[] = [];
  const port: RepositoryBrowserPort = {
    async paths(request) {
      reads.push(request);
      return {
        pin: request.pin,
        path: request.path,
        recursive: request.recursive,
        entries: [
          entry(request.path ? `${request.path}/index.ts` : "README.md"),
        ],
      };
    },
    async file(request) {
      return {
        pin: request.pin,
        file: { path: request.path, contents: "# Notes", kind: "text" },
      };
    },
  };
  const controller = new RepositoryBrowserController(port, pin, {
    pageSize: 2,
    maxEntries: 4,
  });
  return { controller, port, reads };
}

describe("pinned repository browser", () => {
  it("does not read on construction and retains the exact pin through navigation", async () => {
    const { controller, reads } = fixture();
    expect(reads).toHaveLength(0);
    await controller.openDirectory("src");
    expect(reads[0]).toMatchObject({
      pin,
      path: "src",
      recursive: false,
      limit: 2,
    });
    await controller.openFile("src/index.ts");
    expect(controller.state.file).toMatchObject({
      path: "src/index.ts",
      contents: "# Notes",
    });
    expect(controller.state.pin).toEqual(pin);
    await controller.close();
  });
  it("rejects noncanonical paths and mismatched response pins without publishing content", async () => {
    const { controller, port, reads } = fixture();
    for (const path of [
      "../secret",
      "/absolute",
      "src//index.ts",
      "src/./index.ts",
      "src\\index.ts",
    ])
      await expect(controller.openFile(path)).rejects.toThrow(/canonical/i);
    expect(reads).toHaveLength(0);
    port.paths = async (request) => ({
      pin: { ...pin, operation: "wrong" },
      path: request.path,
      recursive: false,
      entries: [entry("secret")],
    });
    await controller.openDirectory("");
    expect(controller.state.directoryPhase).toBe("unavailable");
    expect(controller.entries).toEqual([]);
    await controller.close();
  });
  it("caches expanded directories and deduplicates concurrent identical reads", async () => {
    const { controller, reads } = fixture();
    await Promise.all([
      controller.openDirectory("src"),
      controller.openDirectory("src"),
    ]);
    expect(reads).toHaveLength(1);
    await controller.openDirectory("");
    await controller.openDirectory("src");
    expect(reads).toHaveLength(2);
    expect(controller.entries[0].path).toBe("src/index.ts");
    await controller.close();
  });
  it("fences delayed directory/file replies after pin changes and drains on close", async () => {
    const { controller, port } = fixture();
    let release!: (page: RepositoryPathPage) => void;
    port.paths = (request) =>
      request.pin.operation === pin.operation
        ? new Promise((resolve) => (release = resolve))
        : Promise.resolve({ ...request, entries: [entry("current.md")] });
    const old = controller.openDirectory("");
    await controller.setPin({
      ...pin,
      operation: "operation-b",
      revision: "commit-b",
    });
    let closed = false;
    const closing = controller.close().then(() => (closed = true));
    await Promise.resolve();
    expect(closed).toBe(false);
    release({ pin, path: "", recursive: false, entries: [entry("stale.md")] });
    await Promise.all([old, closing]);
    expect(controller.state.pin.operation).toBe("operation-b");
    expect(controller.entries.map((row) => row.path)).toEqual(["current.md"]);
  });
  it("keeps a newer file selected when an older read finishes last", async () => {
    const { controller, port } = fixture();
    let release!: () => void;
    port.file = (request) =>
      request.path === "old.md"
        ? new Promise(
            (resolve) =>
              (release = () =>
                resolve({
                  pin,
                  file: { path: "old.md", contents: "old", kind: "text" },
                })),
          )
        : Promise.resolve({
            pin,
            file: { path: request.path, contents: "new", kind: "text" },
          });
    const old = controller.openFile("old.md");
    await controller.openFile("new.md");
    release();
    await old;
    expect(controller.state.file?.path).toBe("new.md");
    await controller.close();
  });
  it("rejects duplicate rows, retains a usable page and retries", async () => {
    const { controller, port } = fixture();
    let broken = true;
    port.paths = async (request) => ({
      ...request,
      entries: [entry(request.cursor ? (broken ? "a.ts" : "b.ts") : "a.ts")],
      nextCursor: request.cursor ? undefined : "page-2",
    });
    await controller.openDirectory("");
    await controller.more();
    expect(controller.state.directoryPhase).toBe("unavailable");
    expect(controller.entries.map((row) => row.path)).toEqual(["a.ts"]);
    broken = false;
    await controller.more();
    expect(controller.entries.map((row) => row.path)).toEqual(["a.ts", "b.ts"]);
    await controller.close();
  });
  it("caps pages, preserves empty text and treats missing/binary content distinctly", async () => {
    const { controller, port } = fixture();
    port.paths = async (request) => ({
      ...request,
      entries: [
        entry(`${request.cursor ?? "first"}-a`),
        entry(`${request.cursor ?? "first"}-b`),
      ],
      nextCursor: request.cursor ? "page-3" : "page-2",
    });
    await controller.openDirectory("");
    await controller.more();
    await controller.more();
    expect(controller.entries).toHaveLength(4);
    expect(controller.limitReached).toBe(true);
    port.file = async (request) => ({
      pin,
      file: { path: request.path, kind: "text", contents: "" },
    });
    await controller.openFile("empty.txt");
    expect(controller.state.file).toMatchObject({ kind: "text", contents: "" });
    await controller.close();
  });
  it("rejects repeated continuation cursors without extending the loaded window", async () => {
    const { controller, port } = fixture();
    port.paths = async (request) => ({
      ...request,
      entries: [entry(request.cursor ? "b.ts" : "a.ts")],
      nextCursor: "page-2",
    });
    await controller.openDirectory("");
    await controller.more();
    expect(controller.state.directoryPhase).toBe("unavailable");
    expect(controller.entries.map((row) => row.path)).toEqual(["a.ts"]);
    await controller.close();
  });
  it.each(["pin", "path"])(
    "rejects a file reply with a different %s",
    async (mismatch) => {
      const { controller, port } = fixture();
      port.file = async (request) => ({
        pin: mismatch === "pin" ? { ...pin, revision: "wrong" } : pin,
        file: {
          path: mismatch === "path" ? "other.md" : request.path,
          kind: "text",
          contents: "not requested",
        },
      });
      await controller.openFile("README.md");
      expect(controller.state.filePhase).toBe("unavailable");
      expect(controller.state.file).toBeUndefined();
      await controller.close();
    },
  );
});

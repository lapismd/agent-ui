import { expect, test, vi } from "vitest";
import { ImportController } from "../packages/agent-ui/src/imports/controller.svelte.js";
import type {
  AiImportSources,
  PreviewPage,
} from "../packages/agent-ui/src/imports/source-port.js";
function deferred<T>() {
  let resolve!: (value: T) => void;
  return { promise: new Promise<T>((done) => (resolve = done)), resolve };
}
const page = (reader: string, progress = 100): PreviewPage => ({
  reader,
  progress,
  entries: [],
  order: [],
});
async function fixture() {
  const releasePreview = vi.fn(async (_reader: string) => {});
  const sources: AiImportSources = {
    folders: async () => ({
      folders: [
        { selector: "folder", label: "Project", location: "Local", count: 2 },
      ],
      indexed: 1,
      complete: true,
      limited: false,
    }),
    sessions: async () => ({
      rows: ["first", "second"].map((selector) => ({
        selector,
        title: selector,
        profile: "Codex",
        updatedAt: "2026-10-21T12:00:00Z",
        kind: "codex",
        folder: "folder",
        bytes: 100,
      })),
      next: null,
      total: 2,
    }),
    startPreview: async (selector) => page(selector),
    nextPreview: async (reader) => page(reader),
    releasePreview,
  };
  const report = vi.fn();
  const controller = new ImportController({
    sources,
    save: async () => ({ id: "saved", duplicate: false }),
    report,
  });
  await controller.load();
  await controller.browser.openFolder("folder", "codex");
  return { controller, sources, releasePreview, report };
}
test("replacing a preview releases every reader exactly once", async () => {
  const { controller, releasePreview } = await fixture();
  await controller.select("first");
  await controller.select("second");
  await controller.close();
  expect(releasePreview.mock.calls.map(([reader]) => reader).sort()).toEqual([
    "first",
    "second",
  ]);
});
test("pause and resume cannot overlap next reads, and close drains a resumed read", async () => {
  const { controller, sources, releasePreview } = await fixture();
  sources.startPreview = async () => page("reader", 0);
  const next = deferred<PreviewPage>();
  sources.nextPreview = vi.fn(() => next.promise);
  const selecting = controller.select("first");
  await vi.waitFor(() => expect(sources.nextPreview).toHaveBeenCalledTimes(1));
  controller.togglePause();
  controller.togglePause();
  expect(sources.nextPreview).toHaveBeenCalledTimes(1);
  let closed = false;
  const closing = controller.close().then(() => {
    closed = true;
  });
  await Promise.resolve();
  expect(closed).toBe(false);
  next.resolve(page("reader"));
  await Promise.all([selecting, closing]);
  expect(controller.entries).toEqual([]);
  expect(releasePreview).toHaveBeenCalledTimes(1);
});
test("late start responses cannot replace a newer preview and are released on close", async () => {
  const { controller, sources, releasePreview } = await fixture();
  const old = deferred<PreviewPage>();
  sources.startPreview = (selector) =>
    selector === "first" ? old.promise : Promise.resolve(page("new"));
  const first = controller.select("first");
  await controller.select("second");
  let closed = false;
  const closing = controller.close().then(() => {
    closed = true;
  });
  await Promise.resolve();
  expect(closed).toBe(false);
  old.resolve(page("old"));
  await Promise.all([first, closing]);
  expect(controller.selectedRow?.selector).toBe("second");
  expect(releasePreview.mock.calls.map(([reader]) => reader).sort()).toEqual([
    "new",
    "old",
  ]);
});

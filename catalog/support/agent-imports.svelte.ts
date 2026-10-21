import { ImportController } from "../../packages/agent-ui/src/imports/controller.svelte.js";
import type { AgentUiController } from "../../packages/agent-ui/src/core/controller.svelte.js";
import type { ImportHarness } from "../../packages/agent-ui/src/imports/source-port.js";
export function memoryAgentImports(owner: AgentUiController) {
  const kind = (id: string): ImportHarness =>
    id === "import-other" ? "opencode" : "codex";
  const rows = () => owner.snapshot?.imports ?? [];
  const sources = {
    async folders(
      harness: ImportHarness,
      _refresh: boolean,
      signal: AbortSignal,
    ) {
      signal.throwIfAborted();
      const count = rows().filter((row) => kind(row.id) === harness).length;
      return {
        folders: count
          ? [
              {
                selector: `${harness}-project`,
                label: "agent-ui",
                location: "Projects/agent-ui",
                count,
              },
            ]
          : [],
        indexed: count,
        complete: true,
        limited: false,
      };
    },
    async sessions(
      folder: string,
      _after: string | undefined,
      signal: AbortSignal,
    ) {
      signal.throwIfAborted();
      const result = rows()
        .filter((row) => folder === `${kind(row.id)}-project`)
        .map((row) => ({
          selector: row.id,
          title: row.title,
          profile:
            kind(row.id) === "opencode" ? "opencode-sqlite-v1" : "codex-cli-v1",
          updatedAt: "2026-10-21T12:00:00Z",
          kind: kind(row.id),
          folder,
          bytes: 4096,
        }));
      return { rows: result, total: result.length, next: null };
    },
    async startPreview(selector: string, signal: AbortSignal) {
      signal.throwIfAborted();
      const entries = [
        ...(rows().find((row) => row.id === selector)?.items ?? []),
      ];
      return {
        reader: `reader-${selector}`,
        entries,
        progress: 100,
        capture: { entries },
      };
    },
    async nextPreview(_reader: string, signal: AbortSignal) {
      signal.throwIfAborted();
      return {
        reader: _reader,
        entries: [],
        progress: 100,
        capture: { entries: [] },
      };
    },
    async releasePreview(_reader: string, _signal: AbortSignal) {},
  };
  return new ImportController({
    sources,
    async save(selector) {
      const result = await owner.action("import", selector);
      if (result?.status !== "acknowledged")
        throw new Error("Import was not acknowledged");
      return { id: selector, duplicate: false };
    },
    async open(id) {
      owner.selectSession(id);
    },
    report(error) {
      owner.error = error instanceof Error ? error.message : String(error);
    },
  });
}

import type {
  AiImportSources,
  BrowserSession,
  FolderPage,
  ImportFolder,
  ImportHarness,
  SessionPage,
} from "./source-port.js";
import { validateFolders, validateSessions } from "./source-validation.js";
import { ImportTasks, importYield } from "./tasks.js";
export const importHarnesses = [
  { id: "codex", name: "Codex" },
  { id: "cursor", name: "Cursor" },
  { id: "opencode", name: "OpenCode" },
] as const;
type IndexState = FolderPage & {
  loading: boolean;
  loaded: boolean;
  unavailable: boolean;
};
const empty = (): IndexState => ({
  folders: [],
  indexed: 0,
  complete: false,
  limited: false,
  loading: false,
  loaded: false,
  unavailable: false,
});
export function createImportBrowser(
  sources: AiImportSources | undefined,
  tasks: ImportTasks,
) {
  let indexes = $state.raw<Record<ImportHarness, IndexState>>({
    codex: empty(),
    cursor: empty(),
    opencode: empty(),
  });
  let expanded = $state.raw(new Set<ImportHarness>(["codex"]));
  let collapsed = $state.raw(new Set<string>()),
    folder = $state<ImportFolder>(),
    kind = $state<ImportHarness>("codex");
  let cache = $state.raw<Record<string, SessionPage>>({}),
    loadingFolder = $state(false),
    folderUnavailable = $state(false),
    active = true;
  const scans = new Map<ImportHarness, AbortController>();
  let folderAbort: AbortController | undefined;
  const rows = () => Object.values(cache).flatMap((page) => page.rows);
  async function loadHarness(harness: ImportHarness, refresh = false) {
    if (!active || !sources) return;
    if (scans.has(harness)) {
      if (!refresh) return;
      scans.get(harness)!.abort();
    }
    const abort = new AbortController();
    scans.set(harness, abort);
    indexes = {
      ...indexes,
      [harness]: { ...indexes[harness], loading: true, unavailable: false },
    };
    const result = await tasks.run(
      `Indexing ${importHarnesses.find((h) => h.id === harness)!.name} sessions`,
      `ai-import-index-${harness}`,
      abort.signal,
      async () => {
        let first = true;
        do {
          const page = validateFolders(
            await sources.folders(harness, refresh && first, abort.signal),
          );
          if (!active || abort.signal.aborted) return;
          const known = new Set(
            indexes[harness].folders.map((f) => f.selector),
          );
          const next = new Set(collapsed);
          for (const row of page.folders)
            if (!known.has(row.selector)) next.add(row.selector);
          collapsed = next;
          indexes = {
            ...indexes,
            [harness]: {
              ...page,
              loading: !page.complete,
              loaded: true,
              unavailable: false,
            },
          };
          first = false;
          if (page.complete) break;
          await importYield(abort.signal);
        } while (!abort.signal.aborted);
        if (
          active &&
          !abort.signal.aborted &&
          folder &&
          indexes[harness].folders.some((f) => f.selector === folder!.selector)
        )
          await openFolder(folder.selector, harness, true);
        return true;
      },
    );
    if (scans.get(harness) === abort) {
      scans.delete(harness);
      if (active)
        indexes = {
          ...indexes,
          [harness]: {
            ...indexes[harness],
            loading: false,
            unavailable: !abort.signal.aborted && result !== true,
          },
        };
    }
  }
  async function openFolder(
    id: string,
    harness: ImportHarness,
    refresh = false,
    more = false,
  ) {
    const next = indexes[harness].folders.find((f) => f.selector === id);
    if (!next || !sources || !active) return;
    folderAbort?.abort();
    const abort = new AbortController();
    folderAbort = abort;
    folder = next;
    kind = harness;
    folderUnavailable = false;
    if (cache[id] && !refresh && !more) {
      loadingFolder = false;
      return;
    }
    loadingFolder = true;
    const result = await tasks.run(
      "Loading folder sessions",
      "ai-import-folder-failure",
      abort.signal,
      async () => {
        const page = validateSessions(
          await sources.sessions(
            id,
            more ? (cache[id]?.next ?? undefined) : undefined,
            abort.signal,
          ),
          id,
        );
        if (!active || abort.signal.aborted) return;
        const previous = more ? (cache[id]?.rows ?? []) : [];
        const combined = new Map(
          [...previous, ...page.rows].map((row) => [row.selector, row]),
        );
        cache = { ...cache, [id]: { ...page, rows: [...combined.values()] } };
        return true;
      },
    );
    if (active && folderAbort === abort) {
      loadingFolder = false;
      folderUnavailable = !abort.signal.aborted && result !== true;
    }
  }
  return {
    get indexes() {
      return indexes;
    },
    get expanded() {
      return expanded;
    },
    get collapsed() {
      return collapsed;
    },
    get cache() {
      return cache;
    },
    get folder() {
      return folder;
    },
    get kind() {
      return kind;
    },
    get loadingFolder() {
      return loadingFolder;
    },
    get folderUnavailable() {
      return folderUnavailable;
    },
    get rows() {
      return rows();
    },
    loadHarness,
    openFolder,
    toggleHarness(harness: ImportHarness) {
      const next = new Set(expanded);
      if (next.has(harness)) next.delete(harness);
      else {
        next.add(harness);
        if (!indexes[harness].loaded) void loadHarness(harness, true);
      }
      expanded = next;
    },
    toggleFolder(id: string, harness: ImportHarness) {
      const next = new Set(collapsed);
      if (next.has(id)) {
        next.delete(id);
        void openFolder(id, harness);
      } else next.add(id);
      collapsed = next;
    },
    more() {
      if (folder && cache[folder.selector]?.next && !loadingFolder)
        void openFolder(folder.selector, kind, false, true);
    },
    async refresh() {
      await loadHarness(kind, true);
      if (folder) await openFolder(folder.selector, kind, true);
    },
    close() {
      active = false;
      folderAbort?.abort();
      for (const abort of scans.values()) abort.abort();
    },
  };
}
export type ImportBrowser = ReturnType<typeof createImportBrowser>;

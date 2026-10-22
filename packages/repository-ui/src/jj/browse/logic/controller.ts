import type {
  RepositoryBrowserPin,
  RepositoryBrowserPort,
  RepositoryBrowserState,
  RepositoryBrowserOptions,
} from "./types.js";
import {
  acceptPage,
  canonicalPath,
  pathPageKey,
  samePin,
  browserBounds,
  acceptFile,
} from "./requests.js";
import { isMarkdownRepositoryPath } from "./paths.js";

import { initialBrowserState as initial, browserTreeEntries } from "./state.js";
/** Host-retained, read-only adaptation of JJ Store's scoped file-reader flow. */
export class RepositoryBrowserController {
  #state: RepositoryBrowserState;
  #listeners = new Set<(state: RepositoryBrowserState) => void>();
  #scope = 0;
  #fileVersion = 0;
  #fileAbort?: AbortController;
  #pageAborts = new Set<AbortController>();
  #pending = new Map<string, Promise<void>>();
  #tasks = new Set<Promise<void>>();
  #knownDirectories = new Set<string>();
  #closed = false;
  #closing?: Promise<void>;
  readonly pageSize: number;
  readonly maxEntries: number;
  constructor(
    readonly port: RepositoryBrowserPort,
    pin: RepositoryBrowserPin,
    readonly options: RepositoryBrowserOptions = {},
  ) {
    samePin(pin, pin);
    this.#state = initial(pin);
    const bounds = browserBounds(options);
    this.pageSize = bounds.pageSize;
    this.maxEntries = bounds.maxEntries;
  }
  get state() {
    return this.#state;
  }
  get window() {
    return this.#state.pages[pathPageKey(this.#state.directory)];
  }
  get entries() {
    return this.window?.entries ?? [];
  }
  get hasMore() {
    return !!this.window?.nextCursor && !this.limitReached;
  }
  get limitReached() {
    return this.window?.limitReached ?? false;
  }
  get treeEntries() {
    return browserTreeEntries(this.#state);
  }
  get treeHasMore() {
    const page =
      this.#state.pages[pathPageKey("", this.#state.mode !== "tree")];
    return !!page?.nextCursor && !page.limitReached;
  }
  subscribe(listener: (state: RepositoryBrowserState) => void) {
    if (!this.#closed) {
      this.#listeners.add(listener);
      listener(this.#state);
    }
    return () => {
      this.#listeners.delete(listener);
    };
  }
  #set(patch: Partial<RepositoryBrowserState>) {
    if (this.#closed) return;
    this.#state = { ...this.#state, ...patch };
    for (const listener of this.#listeners) listener(this.#state);
  }
  #track(task: Promise<void>) {
    this.#tasks.add(task);
    void task.then(
      () => this.#tasks.delete(task),
      () => this.#tasks.delete(task),
    );
    return task;
  }
  async setPin(pin: RepositoryBrowserPin) {
    if (this.#closed) return;
    samePin(pin, pin);
    this.#scope++;
    this.#fileVersion++;
    this.#fileAbort?.abort();
    for (const abort of this.#pageAborts) abort.abort();
    this.#knownDirectories.clear();
    const mode = this.#state.mode;
    this.#set({ ...initial(pin), mode });
    await this.refresh();
  }
  async openDirectory(path: string) {
    canonicalPath(path, true);
    if (this.#closed) return;
    this.#fileVersion++;
    this.#fileAbort?.abort();
    const collapsed = new Set(this.#state.collapsedDirectoryPaths);
    const segments = path.split("/");
    for (let index = 1; index <= segments.length; index++)
      collapsed.delete(segments.slice(0, index).join("/"));
    this.#set({
      directory: path,
      path: undefined,
      file: undefined,
      filePhase: "idle",
      collapsedDirectoryPaths: collapsed,
    });
    await this.loadPaths(path);
  }
  setDisplay(display: "preview" | "source" | "blame") {
    this.#set({ display });
  }
  async setMode(mode: RepositoryBrowserState["mode"]) {
    if (this.#closed) return;
    this.#set({ mode });
    if (mode !== "tree") await this.loadPaths("", true);
  }
  async toggleDirectory(path: string, collapsed: boolean) {
    canonicalPath(path);
    const paths = new Set(this.#state.collapsedDirectoryPaths);
    if (collapsed) paths.add(path);
    else paths.delete(path);
    this.#set({ collapsedDirectoryPaths: paths });
    if (!collapsed) await this.loadPaths(path);
  }
  async refresh() {
    await this.loadPaths(this.#state.directory, false, false, true);
    if (this.#state.mode !== "tree")
      await this.loadPaths("", true, false, true);
    if (this.#state.path) await this.openFile(this.#state.path, true);
  }
  more(path = this.#state.directory, recursive = false) {
    return this.loadPaths(path, recursive, true);
  }
  loadPaths(
    path: string,
    recursive = false,
    more = false,
    force = false,
  ): Promise<void> {
    canonicalPath(path, true);
    if (this.#closed) return Promise.resolve();
    const pageKey = pathPageKey(path, recursive),
      previous = this.#state.pages[pageKey];
    const visible = () => this.#state.directory === path && !recursive;
    if (more && (!previous?.nextCursor || previous.limitReached))
      return Promise.resolve();
    if (previous && !more && !force) {
      if (visible()) this.#set({ directoryPhase: "ready" });
      return Promise.resolve();
    }
    const key = `${this.#scope}:${pageKey}:${more ? previous?.nextCursor : ""}`;
    const pending = this.#pending.get(key);
    if (pending) return pending;
    const scope = this.#scope,
      abort = new AbortController();
    this.#pageAborts.add(abort);
    this.#set({
      loadingPages: new Set([...this.#state.loadingPages, pageKey]),
      ...(visible() ? { directoryPhase: "loading" } : {}),
    });
    const request = {
      pin: this.#state.pin,
      path,
      recursive,
      cursor: more ? previous?.nextCursor : undefined,
      limit: Math.min(
        this.pageSize,
        this.maxEntries - (more ? previous!.entries.length : 0),
      ),
      signal: abort.signal,
    };
    const task = Promise.resolve().then(async () => {
      try {
        const page = await this.port.paths(request);
        if (this.#closed || scope !== this.#scope || abort.signal.aborted)
          return;
        const accepted = acceptPage(request, page, previous, this.maxEntries);
        const collapsed = new Set(this.#state.collapsedDirectoryPaths);
        for (const entry of page.entries)
          if (
            entry.type === "tree" &&
            !this.#knownDirectories.has(entry.path)
          ) {
            this.#knownDirectories.add(entry.path);
            collapsed.add(entry.path);
          }
        const pages = { ...this.#state.pages, [pageKey]: accepted };
        // Retain a bounded navigation cache; hosts can reload evicted windows.
        if (Object.keys(pages).length > 32)
          delete pages[
            Object.keys(pages).find(
              (value) =>
                value !== pageKey &&
                value !== pathPageKey(this.#state.directory),
            )!
          ];
        this.#set({
          pages,
          collapsedDirectoryPaths: collapsed,
          ...(visible() ? { directoryPhase: "ready" } : {}),
        });
      } catch (cause) {
        if (!this.#closed && scope === this.#scope && !abort.signal.aborted) {
          if (visible()) this.#set({ directoryPhase: "unavailable" });
          this.options.report?.(cause);
        }
      } finally {
        this.#pageAborts.delete(abort);
        this.#pending.delete(key);
        if (scope === this.#scope) {
          const loadingPages = new Set(this.#state.loadingPages);
          loadingPages.delete(pageKey);
          this.#set({ loadingPages });
        }
      }
    });
    this.#pending.set(key, task);
    return this.#track(task);
  }
  async openFile(path: string, force = false): Promise<void> {
    canonicalPath(path);
    if (this.#closed) return;
    const key = `file:${this.#scope}:${path}`;
    if (!force && this.#state.path === path) {
      const pending = this.#pending.get(key);
      if (pending) return pending;
      if (this.#state.filePhase === "ready") return;
    }
    const scope = this.#scope,
      version = ++this.#fileVersion,
      abort = new AbortController();
    this.#fileAbort?.abort();
    this.#fileAbort = abort;
    const pin = this.#state.pin;
    this.#set({
      path,
      file: undefined,
      filePhase: "loading",
      display: isMarkdownRepositoryPath(path) ? "preview" : "source",
    });
    const task = Promise.resolve().then(async () => {
      try {
        const result = await this.port.file({
          pin,
          path,
          signal: abort.signal,
        });
        if (
          this.#closed ||
          scope !== this.#scope ||
          version !== this.#fileVersion ||
          abort.signal.aborted
        )
          return;
        this.#set({
          file: acceptFile({ pin, path }, result),
          filePhase: "ready",
        });
      } catch (cause) {
        if (
          !this.#closed &&
          scope === this.#scope &&
          version === this.#fileVersion &&
          !abort.signal.aborted
        ) {
          this.#set({ filePhase: "unavailable" });
          this.options.report?.(cause);
        }
      } finally {
        if (this.#pending.get(key) === task) this.#pending.delete(key);
      }
    });
    this.#pending.set(key, task);
    return this.#track(task);
  }
  close(): Promise<void> {
    if (this.#closing) return this.#closing;
    this.#closed = true;
    this.#scope++;
    this.#fileVersion++;
    this.#fileAbort?.abort();
    for (const abort of this.#pageAborts) abort.abort();
    this.#listeners.clear();
    return (this.#closing = Promise.allSettled([...this.#tasks]).then(
      () => undefined,
    ));
  }
}

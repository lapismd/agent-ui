import type {
  LocalCodeQuery,
  LocalCodeResponse,
  LocalFileDiffChange,
  LocalOperationChangesGroup,
} from "@lapismd/jj-history";
import {
  ComparisonDiffs,
  type RepositoryDiffEntries,
} from "./comparison-diffs.js";
import { check } from "./history-selection.js";
export interface OperationFilesState {
  diffs: RepositoryDiffEntries;
  pathRequest: number;
  ready: boolean;
  groupsLimitReached: boolean;
  pathsLimitReached: boolean;
  groups: LocalOperationChangesGroup[];
  next?: string | null;
  group?: LocalOperationChangesGroup;
  from?: string;
  to?: string;
  paths: LocalFileDiffChange[];
  pathsReady: boolean;
  nextPath?: string | null;
  path?: string;
  diff?: LocalFileDiffChange;
}
export const initialOperationFiles = (): OperationFilesState => ({
  diffs: {},
  pathRequest: 0,
  ready: false,
  groupsLimitReached: false,
  pathsLimitReached: false,
  groups: [],
  paths: [],
  pathsReady: false,
});
/** Shares the operation reader's lifetime; every reset fences delayed replies. */
export class OperationFiles {
  state = initialOperationFiles();
  readonly diffs: ComparisonDiffs;
  #epoch = 0;
  #file = 0;
  #operation?: string;
  #parent?: string;
  readonly read: (q: LocalCodeQuery) => Promise<LocalCodeResponse>;
  readonly run: (f: () => Promise<void>) => Promise<void>;
  readonly changed: (s: OperationFilesState) => void;
  constructor(
    read: OperationFiles["read"],
    run: OperationFiles["run"],
    changed: OperationFiles["changed"],
  ) {
    this.diffs = new ComparisonDiffs((diffs) => this.#set({ diffs }));
    this.read = read;
    this.run = run;
    this.changed = changed;
  }
  #set(patch: Partial<OperationFilesState>) {
    this.state = { ...this.state, ...patch };
    this.changed(this.state);
  }
  reset() {
    this.diffs.reset();
    this.#epoch++;
    this.#file++;
    this.#operation = undefined;
    this.#parent = undefined;
    this.state = initialOperationFiles();
    this.changed(this.state);
  }
  async load(operation: string, parent: string) {
    this.reset();
    this.#operation = operation;
    this.#parent = parent;
    await this.#groups(false);
  }
  more() {
    return this.run(() => this.#groups(true));
  }
  retry() {
    return this.run(() => this.#groups(false));
  }
  async #groups(append: boolean) {
    const operation = this.#operation,
      parent = this.#parent,
      epoch = this.#epoch;
    if (!operation || !parent || (append && !this.state.next)) return;
    const response = await this.read({
      kind: "operation_changes",
      query: {
        operation,
        parent,
        limit: 100,
        anchor: append ? this.state.next : null,
        direction: "forward",
      },
    });
    if (epoch !== this.#epoch) return;
    check(
      response.kind === "operation_changes" &&
        response.data.operation === operation &&
        response.data.parent === parent,
    );
    const retained = append ? this.state.groups : [];
    const ids = new Set(retained.map((g) => g.change));
    for (const group of response.data.groups) {
      check(!ids.has(group.change));
      ids.add(group.change);
    }
    const groups = [...retained, ...response.data.groups].slice(0, 500);
    check(
      (!response.data.next || response.data.groups.length > 0) &&
        (!append ||
          !response.data.next ||
          response.data.next !== this.state.next),
    );
    this.#set({
      groups,
      ready: true,
      next: groups.length < 500 ? response.data.next : null,
      groupsLimitReached:
        retained.length + response.data.groups.length > 500 ||
        (groups.length === 500 && !!response.data.next),
    });
    // A complete single-change result has no choice to make. Retain explicit
    // selection for multiple/paged groups and ambiguous revision endpoints.
    if (!append && groups.length === 1 && !response.data.next)
      await this.#selectGroup(groups[0].change);
  }
  selectGroup(change: string) {
    return this.run(() => this.#selectGroup(change));
  }
  async #selectGroup(change: string) {
    const group = this.state.groups.find((g) => g.change === change);
    check(group);
    this.diffs.reset();
    this.#epoch++;
    this.#file++;
    this.#set({
      group,
      from: undefined,
      to: undefined,
      paths: [],
      pathsReady: false,
      pathsLimitReached: false,
      nextPath: null,
      path: undefined,
      diff: undefined,
    });
    if (group.comparison.status === "exact")
      await this.#compare(group.comparison.from, group.comparison.to);
  }
  compare(from: string, to: string) {
    return this.run(() => this.#compare(from, to));
  }
  async #compare(from: string, to: string) {
    const group = this.state.group;
    check(group);
    const comparison = group.comparison;
    check(
      comparison.status === "exact"
        ? comparison.from === from && comparison.to === to
        : comparison.status === "select" &&
            comparison.before.includes(from) &&
            comparison.after.includes(to),
    );
    this.diffs.reset();
    this.#epoch++;
    this.#file++;
    this.#set({
      from,
      to,
      paths: [],
      pathsReady: false,
      pathsLimitReached: false,
      nextPath: null,
      path: undefined,
      diff: undefined,
    });
    await this.#paths(false);
  }
  morePaths() {
    return this.run(() => this.#paths(true));
  }
  retryPaths() {
    return this.run(() => this.#paths(false));
  }
  async #paths(append: boolean) {
    const { from, to, nextPath } = this.state,
      epoch = this.#epoch;
    if (!from || !to || (append && !nextPath)) return;
    const response = await this.read({
      kind: "diff_paths",
      query: {
        from,
        to,
        path: "",
        limit: 100,
        anchor: append ? nextPath : null,
        direction: "forward",
      },
    });
    if (epoch !== this.#epoch) return;
    check(
      response.kind === "diff_paths" &&
        response.data.from === from &&
        response.data.to === to,
    );
    const retained = append ? this.state.paths : [];
    const incoming = response.data.changes;
    check(
      new Set(incoming.map((row) => row.path)).size === incoming.length &&
        !incoming.some((row) =>
          retained.some((item) => item.path === row.path),
        ) &&
        (!response.data.next || incoming.length > 0) &&
        (!append || !response.data.next || response.data.next !== nextPath),
    );
    const paths = [
      ...(append ? this.state.paths : []),
      ...response.data.changes,
    ].slice(0, 500);
    this.#set({
      paths,
      pathsReady: true,
      nextPath: paths.length < 500 ? response.data.next : null,
      pathsLimitReached:
        retained.length + incoming.length > 500 ||
        (paths.length === 500 && !!response.data.next),
    });
  }
  selectPath(path: string) {
    return this.run(async () => {
      if (!this.state.from || !this.state.to) return;
      check(this.state.paths.some((row) => row.path === path));
      const epoch = this.#epoch,
        request = ++this.#file;
      this.#set({
        path,
        diff: undefined,
        pathRequest: this.state.pathRequest + 1,
      });
      const diff = await this.#loadDiff(path);
      if (epoch === this.#epoch && request === this.#file) this.#set({ diff });
    });
  }
  loadDiff(path: string) {
    return this.run(async () => {
      await this.#loadDiff(path);
    });
  }
  async #loadDiff(path: string) {
    const { from, to } = this.state;
    if (!from || !to) return;
    check(this.state.paths.some((row) => row.path === path));
    return this.diffs.load(path, async () => {
      const response = await this.read({
        kind: "diff",
        query: { from, to, path, content: true },
      });
      check(
        response.kind === "diff" &&
          response.data.from === from &&
          response.data.to === to &&
          response.data.path === path,
      );
      const diff = response.data.changes.find((change) => change.path === path);
      check(diff);
      return diff;
    });
  }
}

import { HistoryController } from "../../logic/history-controller.js";
import type { HistoryReader } from "../../logic/history-reader.js";
import type { HistoryControllerOptions } from "../../logic/history-options.js";
import { initialHistoryState } from "../../logic/history-state.js";
import {
  bookmarkKey,
  branchRevset,
  type RepositoryBranchesPin,
  type RepositoryBranchesPort,
  type RepositoryBranchesState,
  type RepositoryBranchSelection,
} from "./types.js";

/** Host-retained reference scope + existing pinned graph/comparison controller. */
export class RepositoryBranchesController {
  readonly history: HistoryController;
  #state: RepositoryBranchesState = {
    phase: "idle",
    loadingMore: false,
    bookmarks: [],
    workingCopies: [],
    targets: [],
    next: null,
    limitReached: false,
    history: initialHistoryState(),
  };
  #listeners = new Set<(state: RepositoryBranchesState) => void>();
  #epoch = 0;
  #choice = 0;
  #closed = false;
  #abort = new AbortController();
  #pending = new Set<Promise<void>>();
  #cursors = new Set<string>();
  #unsubscribe: () => void;
  #closing?: Promise<void>;
  constructor(
    readonly port: RepositoryBranchesPort,
    reader: HistoryReader,
    readonly feedback: HistoryController["feedback"],
    readonly options: HistoryControllerOptions & {
      referencePageSize?: number;
      maxReferences?: number;
    } = {},
  ) {
    this.history = new HistoryController(reader, feedback, undefined, options);
    this.#unsubscribe = this.history.subscribe((history) =>
      this.#set({ history }),
    );
  }
  get state() {
    return this.#state;
  }
  subscribe(listener: (state: RepositoryBranchesState) => void) {
    this.#listeners.add(listener);
    listener(this.#state);
    return () => this.#listeners.delete(listener);
  }
  #set(patch: Partial<RepositoryBranchesState>) {
    if (this.#closed) return;
    this.#state = { ...this.#state, ...patch };
    for (const listener of this.#listeners) listener(this.#state);
  }
  #run(action: () => Promise<void>) {
    if (this.#closed) return Promise.resolve();
    const task = action();
    this.#pending.add(task);
    void task.finally(() => this.#pending.delete(task)).catch(() => {});
    return task;
  }
  open(
    pin: RepositoryBranchesPin,
    selection?: RepositoryBranchSelection,
  ): Promise<void> {
    const epoch = ++this.#epoch;
    this.#choice++;
    this.#abort.abort();
    this.#abort = new AbortController();
    this.#cursors.clear();
    this.#set({
      pin: { ...pin },
      phase: "loading",
      bookmarks: [],
      workingCopies: [],
      targets: [],
      selected: undefined,
      next: null,
      limitReached: false,
      loadingMore: false,
    });
    return this.#run(async () => {
      await this.history.clearRevision();
      if (this.#closed || epoch !== this.#epoch) return;
      await this.#read(false, epoch);
      if (
        epoch !== this.#epoch ||
        this.#closed ||
        this.#state.phase !== "ready"
      )
        return;
      if (selection) {
        const loaded = () =>
          selection.kind === "bookmark"
            ? this.#state.bookmarks.some(
                (item) => bookmarkKey(item) === bookmarkKey(selection),
              )
            : this.#state.workingCopies.some(
                (item) => item.workspace === selection.workspace,
              );
        while (
          !loaded() &&
          this.#state.next &&
          !this.#closed &&
          epoch === this.#epoch
        ) {
          const cursor = this.#state.next;
          await this.#read(true, epoch);
          if (this.#state.next === cursor) break;
        }
        if (epoch !== this.#epoch || this.#closed) return;
        if (!loaded()) {
          this.#set({ phase: "unavailable" });
          this.feedback.report(
            new Error("The requested captured reference is unavailable"),
          );
          return;
        }
      }
      const initial =
        selection ??
        this.#state.bookmarks.find((item) => item.default) ??
        this.#state.bookmarks[0];
      if (initial)
        await this.select(
          "kind" in initial
            ? initial
            : { kind: "bookmark", name: initial.name, remote: initial.remote },
        );
      else if (this.#state.workingCopies[0])
        await this.select({
          kind: "workspace",
          workspace: this.#state.workingCopies[0].workspace,
        });
      else await this.history.selectOperation(pin.operation, "none()");
    });
  }
  refresh() {
    return this.#state.pin
      ? this.open(this.#state.pin, this.#state.selected)
      : Promise.resolve();
  }
  more() {
    if (this.#state.loadingMore || !this.#state.next) return Promise.resolve();
    return this.#run(() => this.#read(true, this.#epoch));
  }
  async #read(append: boolean, epoch: number) {
    if (this.#closed || epoch !== this.#epoch) return;
    const pin = this.#state.pin!;
    const after = append ? this.#state.next : null;
    this.#set(append ? { loadingMore: true } : { phase: "loading" });
    try {
      const page = await this.port.read(
        {
          ...pin,
          after,
          limit: Math.max(
            1,
            Math.min(200, this.options.referencePageSize ?? 40),
          ),
        },
        this.#abort.signal,
      );
      if (this.#closed || epoch !== this.#epoch) return;
      const prior = append ? this.#state.bookmarks : [];
      const copies = append ? this.#state.workingCopies : [];
      const keys = page.bookmarks.map(bookmarkKey);
      if (
        page.operation !== pin.operation ||
        page.repository !== pin.repository ||
        new Set(keys).size !== keys.length ||
        keys.some((key) => prior.some((row) => bookmarkKey(row) === key)) ||
        new Set(page.workingCopies.map((row) => row.workspace)).size !==
          page.workingCopies.length ||
        page.workingCopies.some((row) =>
          copies.some((old) => old.workspace === row.workspace),
        ) ||
        (page.next !== null &&
          ((!page.bookmarks.length && !page.workingCopies.length) ||
            this.#cursors.has(page.next) ||
            page.next === after))
      )
        throw new Error("Invalid captured reference page");
      page.bookmarks.forEach((row) => branchRevset(row.targets));
      page.workingCopies.forEach((row) => branchRevset([row.commitId]));
      const max = Math.max(1, this.options.maxReferences ?? 500);
      const allBookmarks = [...prior, ...page.bookmarks];
      const allCopies = [...copies, ...page.workingCopies];
      const count = allBookmarks.length + allCopies.length;
      const bookmarks = allBookmarks.slice(0, max);
      const workingCopies = allCopies.slice(
        0,
        Math.max(0, max - bookmarks.length),
      );
      const limitReached = count > max || (count === max && page.next !== null);
      if (page.next) this.#cursors.add(page.next);
      this.#set({
        bookmarks,
        workingCopies,
        next: limitReached ? null : page.next,
        limitReached,
        phase: "ready",
      });
      this.feedback.recovered();
    } catch (error) {
      if (!this.#closed && epoch === this.#epoch) {
        this.#set({ phase: append ? "ready" : "unavailable" });
        this.feedback.report(error);
      }
    } finally {
      if (epoch === this.#epoch) this.#set({ loadingMore: false });
    }
  }
  select(selection: RepositoryBranchSelection): Promise<void> {
    const pin = this.#state.pin;
    if (!pin || this.#state.phase !== "ready") return Promise.resolve();
    const bookmark =
      selection.kind === "bookmark"
        ? this.#state.bookmarks.find(
            (item) => bookmarkKey(item) === bookmarkKey(selection),
          )
        : undefined;
    const copy =
      selection.kind === "workspace"
        ? this.#state.workingCopies.find(
            (item) => item.workspace === selection.workspace,
          )
        : undefined;
    if (!bookmark && !copy) return Promise.resolve();
    const targets = [...(bookmark?.targets ?? [copy!.commitId])];
    const epoch = this.#epoch,
      choice = ++this.#choice;
    this.#set({ selected: { ...selection }, targets });
    return this.#run(async () => {
      if (
        this.history.state.operation !== pin.operation ||
        !this.history.state.snapshot
      )
        await this.history.selectOperation(
          pin.operation,
          branchRevset(targets),
        );
      else await this.history.search(branchRevset(targets));
      if (
        copy &&
        !this.#closed &&
        epoch === this.#epoch &&
        choice === this.#choice
      ) {
        const row = this.history.state.commits.find(
          (item) => item.id === copy.commitId,
        );
        if (row) await this.history.selectRevision(row);
        else await this.history.openRevision(copy.commitId);
      }
    });
  }
  close(): Promise<void> {
    if (this.#closing) return this.#closing;
    this.#closed = true;
    this.#epoch++;
    this.#choice++;
    this.#abort.abort();
    this.#listeners.clear();
    this.#unsubscribe();
    return (this.#closing = Promise.all([
      Promise.allSettled([...this.#pending]),
      this.history.close(),
    ]).then(() => {}));
  }
}

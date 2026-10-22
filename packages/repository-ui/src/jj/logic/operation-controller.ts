import { OperationActivity, prepareOperation } from "./operation-lifetime.js";
import { OperationGraph } from "./operation-graph.js";
import {
  OperationMetadata,
  operationDifference,
} from "./operation-metadata.js";
import { operationParent } from "./operation-parent.js";
import { OperationFiles } from "./operation-files.js";
import type { Handle, LocalGraphOperationNode } from "@lapismd/jj-history";
import type { HistoryReader } from "./history-reader.js";
import { HistoryLifetime } from "./history-lifetime.js";
import { check, pause } from "./history-selection.js";
import {
  initialOperationState,
  resetOperationSelection,
  resetOperationQuery,
  operationFilesPatch,
  type OperationState,
} from "./operation-state.js";
import type { OperationControllerOptions } from "./operation-options.js";
export type { OperationControllerOptions } from "./operation-options.js";

/** Independent operation-pinned reader; it shares no mutable history selection. */
export class OperationController {
  #state = initialOperationState();
  readonly files: OperationFiles;
  readonly #graph: OperationGraph;
  readonly #metadata: OperationMetadata;
  #listeners = new Set<(state: OperationState) => void>();
  readonly #lifetime: HistoryLifetime;
  readonly #activity: OperationActivity;
  #handle?: Handle;
  #selection = 0;
  #detail = 0;
  #abort = new AbortController();
  #closed = false;
  #pinned = false;
  #closing?: Promise<void>;
  readonly reader: HistoryReader;
  readonly feedback: { report(error: unknown): void; recovered(): void };
  readonly wait: typeof pause;
  constructor(
    reader: HistoryReader,
    feedback: OperationController["feedback"],
    wait = pause,
    options: OperationControllerOptions = {},
  ) {
    this.#graph = new OperationGraph(
      reader,
      () => ({
        handle: this.#handle,
        state: this.#state,
        closed: this.#closed,
      }),
      (patch) => this.#set(patch),
      options,
    );
    this.files = new OperationFiles(
      async (query) => {
        check(this.#handle);
        return reader.read(this.#handle, query);
      },
      (action) => this.#run(action),
      (files) => this.#set(operationFilesPatch(this.#state, files)),
    );
    this.#metadata = new OperationMetadata(
      reader,
      () => ({
        handle: this.#handle,
        state: this.#state,
        closed: this.#closed,
        detail: this.#detail,
      }),
      (patch) => this.#set(patch),
    );
    this.reader = reader;
    this.feedback = feedback;
    this.wait = wait;
    this.#lifetime = new HistoryLifetime(reader);
    this.#activity = new OperationActivity(
      this.#lifetime,
      () => ({ closed: this.#closed, state: this.#state }),
      (patch) => this.#set(patch),
      feedback,
    );
  }
  get state(): OperationState {
    return this.#state;
  }
  get pinned() {
    return this.#pinned || !!this.#state.selected;
  }
  subscribe(listener: (state: OperationState) => void): () => void {
    this.#listeners.add(listener);
    listener(this.#state);
    return () => this.#listeners.delete(listener);
  }
  #set(patch: Partial<OperationState>): void {
    if (this.#closed) return;
    this.#state = { ...this.#state, ...patch };
    for (const listener of this.#listeners) listener(this.#state);
  }
  #run(action: () => Promise<void>): Promise<void> {
    return this.#activity.run(action);
  }
  refresh(preferred?: string): Promise<void> {
    if (preferred) this.#pinned = true;
    return this.#run(async () => {
      const selection = this.#selection;
      const heads = await this.reader.heads();
      if (selection !== this.#selection || this.#closed) return;
      this.#set({
        heads: heads.heads,
        headsReady: true,
        phase: this.#state.snapshot ? "ready" : "idle",
      });
      if (preferred && !this.#state.operation) await this.#pin(preferred);
      else if (this.#state.operation && !this.#state.snapshot)
        await this.#pin(this.#state.operation);
      else if (this.#state.operation && !this.#state.ready)
        await this.#graph.load(false);
      else if (!this.#state.operation && heads.heads.length === 1)
        await this.#pin(heads.heads[0]);
    });
  }
  selectPin(operation: string): Promise<void> {
    this.#pinned = true;
    return this.#run(() => this.#pin(operation));
  }
  checkpointChanged(operation: string): Promise<void> {
    if (
      this.#closed ||
      this.#pinned ||
      this.#state.selected ||
      this.#state.operation === operation
    )
      return Promise.resolve();
    return this.#run(() => this.#pin(operation));
  }
  async #pin(operation: string): Promise<void> {
    this.#graph.invalidate();
    const selection = ++this.#selection;
    this.#detail++;
    this.files.reset();
    this.#abort.abort();
    const abort = (this.#abort = new AbortController());
    const prior = this.#handle;
    this.#handle = undefined;
    this.#set({
      ...initialOperationState(),
      query: this.#state.query,
      heads: this.#state.heads,
      headsReady: this.#state.headsReady,
      operation,
      phase: "loading",
      busy: true,
    });
    const result = await prepareOperation(
      this.reader,
      this.#lifetime,
      operation,
      prior,
      abort.signal,
      this.wait,
      () => !this.#closed && selection === this.#selection,
    );
    if (!result) return;
    this.#handle = result.handle;
    this.#set({ snapshot: result.snapshot, phase: "ready" });
    await this.#graph.load(false);
  }
  more(): Promise<void> {
    return this.#run(() => this.#graph.load(true));
  }
  search(query: string): Promise<void> {
    this.#pinned = true;
    this.#detail++;
    this.#graph.invalidate();
    this.files.reset();
    return this.#run(async () => {
      this.#set(resetOperationQuery(query));
      await this.#graph.load(false);
    });
  }
  loadRevisions(): Promise<void> {
    return this.#run(() => this.#metadata.revisions());
  }
  loadWorkspaces(): Promise<void> {
    return this.#run(() => this.#graph.workspaces());
  }
  loadConflicts(): Promise<void> {
    return this.#run(() => this.#metadata.conflicts());
  }
  selectWorkspace(workspace: string | null): Promise<void> {
    return this.#run(async () => {
      this.#detail++;
      this.files.reset();
      this.#set({ workspace, ...resetOperationSelection() });
    });
  }
  clearSelection(): Promise<void> {
    return this.#run(async () => {
      this.#detail++;
      this.files.reset();
      this.#set(resetOperationSelection());
    });
  }
  select(node: LocalGraphOperationNode): Promise<void> {
    return this.#run(async () => {
      const selected =
        this.#state.selected?.id === node.id
          ? this.#state.selected
          : this.#state.nodes.find((item) => item.id === node.id);
      check(selected);
      await this.#selectNode(selected);
    });
  }
  selectId(id: string): Promise<void> {
    return this.#run(async () => {
      const known = this.#state.nodes.find((node) => node.id === id);
      if (known) return this.#selectNode(known);
      const handle = this.#handle;
      check(handle && this.#state.selected?.parents.includes(id));
      const request = ++this.#detail;
      const node = await operationParent(
        this.reader,
        handle,
        this.#state.operation!,
        this.#state.selected!.id,
        id,
        () =>
          !this.#closed && handle === this.#handle && request === this.#detail,
      );
      if (node) await this.#selectNode(node);
    });
  }
  async #selectNode(selected: LocalGraphOperationNode): Promise<void> {
    this.#detail++;
    this.files.reset();
    this.#set({
      selected,
      parent: undefined,
      detail: undefined,
      parentNodes: [],
    });
    if (selected.parents.length <= 1) await this.#compare(selected.parents[0]);
  }
  loadParents(): Promise<void> {
    return this.#run(() => this.#metadata.parents());
  }
  selectParent(parent: string): Promise<void> {
    return this.#run(async () => {
      check(this.#state.selected?.parents.includes(parent));
      await this.#compare(parent);
    });
  }
  async #compare(parent?: string): Promise<void> {
    const handle = this.#handle,
      selected = this.#state.selected;
    if (!handle || !selected) return;
    const request = ++this.#detail;
    this.files.reset();
    this.#set({ parent, detail: undefined });
    const detail = await operationDifference(
      this.reader,
      handle,
      selected,
      parent,
      () =>
        !this.#closed && handle === this.#handle && request === this.#detail,
    );
    if (!detail) return;
    this.#set({ detail });
    if (detail.status === "difference") {
      await this.files.load(selected.id, detail.parent);
      await this.loadRevisions();
    }
  }
  close(): Promise<void> {
    this.#closed = true;
    this.#selection++;
    this.#detail++;
    this.files.reset();
    this.#abort.abort();
    this.#listeners.clear();
    return (this.#closing ??= this.#lifetime.drain().catch((error) => {
      this.#closing = undefined;
      throw error;
    }));
  }
}

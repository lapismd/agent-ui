import type { Handle } from "@lapismd/jj-history";
import type { HistoryReader } from "./history-reader.js";
import type { OperationState } from "./operation-state.js";
import { check } from "./history-selection.js";
import { workspaceCommits } from "./operation-metadata.js";
import {
  operationBounds,
  type OperationControllerOptions,
} from "./operation-options.js";
type Scope = { handle?: Handle; state: OperationState; closed: boolean };
export class OperationGraph {
  #epoch = 0;
  readonly reader: HistoryReader;
  readonly scope: () => Scope;
  readonly publish: (patch: Partial<OperationState>) => void;
  constructor(
    reader: HistoryReader,
    scope: () => Scope,
    publish: (patch: Partial<OperationState>) => void,
    readonly options: OperationControllerOptions = {},
  ) {
    this.reader = reader;
    this.scope = scope;
    this.publish = publish;
  }
  invalidate() {
    this.#epoch++;
  }
  async load(append: boolean): Promise<void> {
    const epoch = ++this.#epoch;
    const handle = this.scope().handle,
      operation = this.scope().state.operation;
    if (!handle || !operation || (append && !this.scope().state.next)) return;
    const { state } = this.scope();
    const bounds = operationBounds(this.options);
    const response = await this.reader.read(handle, {
      kind: "graph",
      query: [
        state.query
          ? { graph: "operations_filtered", query: state.query }
          : { graph: "operations" },
        { limit: bounds.page, after: append ? state.next : null },
      ],
    });
    if (
      epoch !== this.#epoch ||
      handle !== this.scope().handle ||
      this.scope().closed
    )
      return;
    check(
      response.kind === "graph" &&
        response.data.operation === operation &&
        response.data.data.graph === "operations",
    );
    const retained = append ? this.scope().state.nodes : [];
    const incoming = response.data.data.nodes;
    check(
      (!response.data.next || incoming.length > 0) &&
        (!append ||
          !response.data.next ||
          response.data.next.id !== state.next?.id),
    );
    const ids = new Set(retained.map((node) => node.id));
    for (const node of incoming) {
      check(!ids.has(node.id));
      ids.add(node.id);
    }
    const all = [...retained, ...incoming],
      nodes = all.slice(0, bounds.max);
    this.publish({
      nodes,
      ready: true,
      next: nodes.length < bounds.max ? response.data.next : null,
      limitReached:
        all.length > bounds.max ||
        (nodes.length === bounds.max && !!response.data.next),
      displayLimit: bounds.max,
    });
  }
  async workspaces(): Promise<void> {
    const { handle, state } = this.scope();
    if (!handle || !state.operation) return;
    const commits = await workspaceCommits(
      this.reader,
      handle,
      state.operation,
    );
    if (!this.scope().closed && handle === this.scope().handle)
      this.publish({ workspaceCommits: commits });
  }
}

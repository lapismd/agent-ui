import type {
  Handle,
  LocalGraphCommit,
  LocalGraphOperationNode,
} from "@lapismd/jj-history";
import type { HistoryReader } from "./history-reader.js";
import type { OperationState } from "./operation-state.js";
import { parentCandidates } from "./parent-candidates.js";
import { check } from "./history-selection.js";
import { operationParents } from "./operation-parent.js";

type MetadataScope = {
  handle?: Handle;
  state: OperationState;
  closed: boolean;
  detail: number;
};
/** Immutable selection reads; the controller owns scheduling and feedback. */
export class OperationMetadata {
  constructor(
    readonly reader: HistoryReader,
    readonly scope: () => MetadataScope,
    readonly publish: (patch: Partial<OperationState>) => void,
  ) {}
  #current(prior: MetadataScope) {
    const now = this.scope();
    return (
      !now.closed && prior.handle === now.handle && prior.detail === now.detail
    );
  }
  async revisions() {
    const prior = this.scope();
    if (!prior.handle) return;
    const commits = await operationRevisionCards(
      this.reader,
      prior.handle,
      prior.state,
      () => this.#current(prior),
    );
    if (commits) this.publish({ commits });
  }
  async conflicts() {
    const prior = this.scope();
    if (!prior.handle || !prior.state.files.to) return;
    const conflicts = await operationConflicts(
      this.reader,
      prior.handle,
      prior.state,
      () =>
        this.#current(prior) &&
        prior.state.files.to === this.scope().state.files.to &&
        prior.state.files.group === this.scope().state.files.group,
    );
    if (conflicts) this.publish({ conflicts, conflictsReady: true });
  }
  async parents() {
    const prior = this.scope(),
      selected = prior.state.selected;
    if (!prior.handle || !selected) return;
    const parentNodes = await operationParents(
      this.reader,
      prior.handle,
      prior.state.operation!,
      selected.id,
      selected.parents,
      [...prior.state.nodes, ...prior.state.parentNodes],
      () => this.#current(prior),
    );
    if (parentNodes) this.publish({ parentNodes });
  }
}

export async function operationDifference(
  reader: HistoryReader,
  handle: Handle,
  selected: LocalGraphOperationNode,
  parent: string | undefined,
  current: () => boolean,
) {
  const response = await reader.read(handle, {
    kind: "operation_diff",
    query: { operation: selected.id, parent },
  });
  if (!current()) return;
  check(
    response.kind === "operation_diff" &&
      response.data.data.operation === selected.id,
  );
  const detail = response.data.data;
  if ("parent" in detail) check(detail.parent === parent);
  else if (detail.status === "root") check(!selected.parents.length);
  return detail;
}

export async function operationConflicts(
  reader: HistoryReader,
  handle: Handle,
  state: OperationState,
  current: () => boolean,
) {
  const commit = state.files.to,
    change = state.files.group?.change;
  check(commit && change);
  const response = await reader.read(handle, {
    kind: "conflicts",
    query: { commit, path: "" },
  });
  if (!current()) return;
  check(
    response.kind === "conflicts" &&
      response.data.commit === commit &&
      response.data.change === change,
  );
  return response.data.conflicts;
}

export function operationRevisionCards(
  reader: HistoryReader,
  handle: Handle,
  state: OperationState,
  current: () => boolean,
) {
  const ids = [
    ...new Set(state.files.groups.flatMap((g) => [...g.after, ...g.before])),
  ].slice(0, 64);
  return parentCandidates(reader, handle, ids, state.commits, current);
}

export async function workspaceCommits(
  reader: HistoryReader,
  handle: Handle,
  operation: string,
): Promise<LocalGraphCommit[]> {
  const response = await reader.read(handle, {
    kind: "graph",
    query: [
      {
        graph: "log",
        revset: "working_copies()",
        user_email: "",
        at_time_millis: Date.now(),
      },
      { limit: 64, after: null },
    ],
  });
  check(
    response.kind === "graph" &&
      response.data.operation === operation &&
      response.data.data.graph === "log",
  );
  return response.data.data.nodes.map((n) => n.commit);
}

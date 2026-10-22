import type { Handle } from "@lapismd/jj-history";
import type { HistoryReader } from "./history-reader.js";
import type { HistoryState } from "./history-state.js";
import { check } from "./history-selection.js";
import {
  historyBounds,
  type HistoryControllerOptions,
} from "./history-options.js";

type Scope = { handle?: Handle; state: HistoryState; closed: boolean };
/** Bounded commit paging; the controller retains its reader/lifetime authority. */
export class HistoryGraph {
  #epoch = 0;
  #query?: {
    graph: "log";
    revset: string;
    workspace: string | null;
    user_email: string;
    at_time_millis: number;
  };
  readonly reader: HistoryReader;
  readonly scope: () => Scope;
  readonly publish: (state: Partial<HistoryState>) => void;
  constructor(
    reader: HistoryReader,
    scope: () => Scope,
    publish: HistoryGraph["publish"],
    readonly options: HistoryControllerOptions = {},
  ) {
    this.reader = reader;
    this.scope = scope;
    this.publish = publish;
  }
  async exact(id: string, current: () => boolean) {
    const epoch = ++this.#epoch;
    const { handle } = this.scope();
    if (!handle || this.scope().closed) return;
    const response = await this.reader.read(handle, {
      kind: "commit",
      query: { commit: id },
    });
    if (
      epoch !== this.#epoch ||
      this.scope().handle !== handle ||
      this.scope().closed ||
      !current()
    )
      return;
    check(
      response.kind === "commit" &&
        response.data.commit.id === id &&
        response.data.object.key.id === id &&
        response.data.object.data.kind === "commit",
    );
    this.publish({
      commits: [response.data.commit],
      commitsReady: true,
      next: null,
      limitReached: false,
    });
    return response.data.commit;
  }
  async conflicts(current: () => boolean) {
    const { handle, state } = this.scope();
    const revision = state.revision;
    if (!handle || !revision?.conflicted || this.scope().closed) return;
    const response = await this.reader.read(handle, {
      kind: "conflicts",
      query: { commit: revision.id, path: "" },
    });
    if (!current() || this.scope().handle !== handle || this.scope().closed)
      return;
    check(
      response.kind === "conflicts" &&
        response.data.commit === revision.id &&
        response.data.change === revision.change_id,
    );
    this.publish({ conflicts: response.data.conflicts, conflictsReady: true });
  }
  async load(append: boolean): Promise<void> {
    const epoch = append ? this.#epoch : ++this.#epoch;
    const { handle, state, closed } = this.scope();
    const operation = state.operation;
    if (closed || !handle || !operation || (append && !state.next)) return;
    const bounds = historyBounds(this.options);
    if (!append)
      this.#query = {
        graph: "log",
        revset: state.revset,
        workspace: state.workspace,
        user_email: this.options.userEmail ?? "",
        at_time_millis: (this.options.now ?? Date.now)(),
      };
    const query = this.#query;
    if (!query) return;
    const response = await this.reader.read(handle, {
      kind: "graph",
      query: [query, { limit: bounds.page, after: append ? state.next : null }],
    });
    const current = this.scope();
    if (epoch !== this.#epoch || current.handle !== handle || current.closed)
      return;
    check(
      response.kind === "graph" &&
        response.data.operation === operation &&
        response.data.data.graph === "log",
    );
    const commits = response.data.data.nodes.map((node) => node.commit);
    const retained = append ? current.state.commits : [];
    check(
      new Set(commits.map((commit) => commit.id)).size === commits.length &&
        !commits.some((commit) =>
          retained.some((item) => item.id === commit.id),
        ) &&
        (!response.data.next || commits.length > 0) &&
        (!append ||
          !response.data.next ||
          response.data.next.id !== state.next?.id),
    );
    const all = [...retained, ...commits],
      combined = all.slice(0, bounds.max);
    const limitReached =
      all.length > bounds.max ||
      (combined.length === bounds.max && !!response.data.next);
    this.publish({
      commits: combined,
      commitsReady: true,
      next: combined.length < bounds.max ? response.data.next : null,
      limitReached,
      displayLimit: bounds.max,
    });
  }
}

import type {
  RepositoryPort,
  RepositorySnapshot,
  RepositoryAction,
  RepositoryOutcome,
  RepositoryQuery,
} from "../../packages/repository-ui/src/core/models.js";
import { repositoryFixture } from "./repository-data.js";
/** Isolated catalog effects. Nothing here touches a repository, forge or account. */
export class MemoryRepositoryPort implements RepositoryPort {
  snapshot: RepositorySnapshot;
  fault: "none" | "unknown" | "failed" = "none";
  calls: RepositoryAction[] = [];
  copied = "";
  #receipts = new Map<string, RepositoryOutcome>();
  constructor(snapshot = repositoryFixture()) {
    this.snapshot = structuredClone(snapshot);
  }
  async read(query: RepositoryQuery) {
    query.signal.throwIfAborted();
    const value = structuredClone(this.snapshot);
    if (query.pin) value.pin = structuredClone(query.pin);
    return value;
  }
  async act(action: RepositoryAction): Promise<RepositoryOutcome> {
    this.calls.push(structuredClone(action));
    const receipt = this.#receipts.get(action.id);
    if (receipt) return receipt;
    if (this.fault === "failed")
      return {
        status: "refused",
        reason: "The simulated host refused this action.",
      };
    if (action.pin.operation !== this.snapshot.pin.operation)
      return { status: "refused", reason: "The selected operation is stale." };
    const next = structuredClone(this.snapshot);
    if (action.kind === "save_settings")
      for (const setting of next.settings) {
        const value = action.values?.[setting.id];
        if (value !== undefined) setting.value = value;
      }
    if (action.kind === "resolve_conflict")
      next.conflicts = next.conflicts.filter((c) => c.path !== action.target);
    const pr = next.pullRequests.find((p) => p.id === action.target);
    if (action.kind === "edit_pr" && pr) {
      pr.title = String(action.values?.title ?? pr.title);
      pr.body = String(action.values?.body ?? pr.body);
    }
    if (action.kind === "draft_pr" && pr)
      pr.draft = Boolean(action.values?.draft);
    if (action.kind === "merge_pr" && pr) pr.state = "merged";
    if (action.kind === "create_pr")
      next.pullRequests.push({
        id: action.id,
        number: 43,
        title: String(action.values?.title),
        body: String(action.values?.body ?? ""),
        branch: "feature/new",
        state: "open",
        draft: true,
        url: "https://example.test/pulls/43",
        checks: [],
      });
    const result: RepositoryOutcome = { status: "committed", snapshot: next };
    this.#receipts.set(action.id, result);
    this.snapshot = next;
    if (this.fault === "unknown") {
      this.fault = "none";
      return { status: "unknown" };
    }
    return result;
  }
  async status(id: string): Promise<RepositoryOutcome> {
    return this.#receipts.get(id) ?? { status: "unknown" };
  }
  async copy(text: string) {
    this.copied = text;
  }
}

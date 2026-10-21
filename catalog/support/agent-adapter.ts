import type {
  AgentAction,
  AgentOutcome,
  AgentPort,
  AgentSnapshot,
} from "../../packages/agent-ui/src/core/models.js";
import { agentFixture, message } from "./agent-data.js";
/** In-memory adapter used only by the catalog/tests. Mutations are never external. */
export class MemoryAgentPort implements AgentPort {
  snapshot: AgentSnapshot;
  fault: "none" | "unknown" | "failed" = "none";
  calls: AgentAction[] = [];
  #receipts = new Map<string, AgentOutcome>();
  #listeners = new Set<(snapshot: AgentSnapshot) => void>();
  constructor(snapshot = agentFixture()) {
    this.snapshot = structuredClone(snapshot);
  }
  async read(signal: AbortSignal) {
    signal.throwIfAborted();
    return structuredClone(this.snapshot);
  }
  subscribe(listener: (snapshot: AgentSnapshot) => void) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }
  private publish() {
    for (const listener of this.#listeners)
      listener(structuredClone(this.snapshot));
  }
  async act(action: AgentAction): Promise<AgentOutcome> {
    this.calls.push(structuredClone(action));
    const receipt = this.#receipts.get(action.id);
    if (receipt) return receipt;
    if (this.fault === "failed")
      return {
        status: "refused",
        reason: "The simulated host refused this action.",
      };
    const next = structuredClone(this.snapshot);
    const session = next.sessions.find((s) => s.id === action.session);
    if (action.kind === "send" && session && action.submission) {
      if (next.busy) {
        next.queued.push({
          id: action.id,
          submission: action.submission,
          recipients: [{ id: "codex", label: "Codex", state: "queued" }],
        });
      } else {
        session.items.push(
          message(
            action.id,
            action.submission.text || "Comments on captured context",
            "user",
          ),
          message(
            action.id + "/reply",
            "I have retained your message and the exact selected context. The in-memory review is ready.",
          ),
        );
      }
    }
    if (action.kind === "chat_settings" && action.agentParticipants) {
      next.agents = action.agentParticipants.map((profile) => ({
        id: profile.id,
        name: profile.label,
        provider: profile.agent,
        model: profile.model ?? "",
        description: profile.description ?? "",
        enabled: true,
        profile,
      }));
    }
    if (action.kind === "chat_settings" && next.chat) {
      if (typeof action.values?.scope === "string")
        next.chat.scope = action.values.scope;
      if (
        action.values?.approvalPolicy === "ask" ||
        action.values?.approvalPolicy === "allow-all"
      )
        next.chat.approvalPolicy = action.values.approvalPolicy;
      if (typeof action.values?.automaticallyMentionAgents === "boolean")
        next.chat.automaticallyMentionAgents =
          action.values.automaticallyMentionAgents;
    }
    if (action.kind === "stop") next.busy = false;
    if (action.kind === "new_session") {
      const id = action.id;
      next.sessions.unshift({
        id,
        title: "New conversation",
        agent: "Codex",
        updatedAt: "Now",
        status: "active",
        items: [],
      });
    }
    if (action.kind === "archive") {
      const target = next.sessions.find((s) => s.id === action.target);
      if (target)
        target.status =
          typeof action.values?.archived === "boolean"
            ? action.values.archived
              ? "archived"
              : "active"
            : target.status === "active"
              ? "archived"
              : "active";
    }
    if (action.kind === "delete_session")
      next.sessions = next.sessions.filter((row) => row.id !== action.target);
    if (action.kind === "respond")
      next.requests = next.requests.filter(
        (request) => request.id !== action.target,
      );
    if (action.kind === "cancel_queued")
      next.queued = next.queued.filter((entry) => entry.id !== action.target);
    if (action.kind === "toggle_catalog") {
      const entry = next.catalog.find((c) => c.id === action.target);
      if (entry) entry.enabled = !entry.enabled;
    }
    if (action.kind === "import") {
      const capture = next.imports.find((c) => c.id === action.target);
      if (capture) {
        capture.status = "saved";
        next.sessions.push({
          id: capture.id,
          title: capture.title,
          agent: "Imported",
          updatedAt: "Now",
          status: "active",
          items: capture.items,
        });
      }
    }
    const outcome: AgentOutcome = { status: "acknowledged", snapshot: next };
    this.#receipts.set(action.id, outcome);
    this.snapshot = next;
    this.publish();
    if (this.fault === "unknown") {
      this.fault = "none";
      return { status: "unknown" };
    }
    return outcome;
  }
  async status(id: string): Promise<AgentOutcome> {
    return this.#receipts.get(id) ?? { status: "unknown" };
  }
  close() {
    this.#listeners.clear();
  }
}

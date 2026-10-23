import { selectAgentSession } from "./session-selection.js";
import { AgentRequestController } from "../chat/request-controller.svelte.js";
import {
  respondApproval,
  respondQuestion,
  checkRequestStatus,
} from "./request-actions.svelte.js";
import {
  TranscriptController,
  type TranscriptSubmission,
} from "@lapismd/design-core/chat";
import type {
  AgentAction,
  AgentOutcome,
  AgentPort,
  AgentScreen,
  AgentSnapshot,
  AgentControllerOptions,
} from "./models.js";
/** Host-owned presentation state. The adapter acknowledges every application effect. */
export class AgentUiController {
  snapshot = $state<AgentSnapshot>();
  screen = $state<AgentScreen>("chat");
  sessionId = $state("");
  view = $state<"document" | "classic">("document");
  loading = $state(false);
  pending = $state<AgentAction>();
  error = $state("");
  notice = $state("");
  sendFailure = $state<{
    session: string;
    submission: TranscriptSubmission;
    reason: string;
  }>();
  actionBusy = $state(false);
  query = $state("");
  selectedImport = $state("");
  importPaused = $state(false);
  selectedAgent = $state("");
  inspector = $state("");
  attachments = $state<string[]>([]);
  recipients = $state<string[]>([]);
  drafts = $state<Record<string, string>>({});
  readonly requests = new AgentRequestController();
  interaction = $state<import("./models.js").AgentRequest>();
  requestFeedback = $state<{
    requestId: string;
    state: import("../chat/request-state.js").AgentRequestState;
  }>();
  readonly transcript: TranscriptController;
  #closed = false;
  #epoch = 0;
  #abort?: AbortController;
  #unsubscribe?: () => void;
  #running?: Promise<unknown>;
  constructor(
    readonly port: AgentPort,
    initial?: AgentSnapshot,
    readonly options: AgentControllerOptions = {},
  ) {
    this.snapshot = initial;
    this.sessionId = initial?.sessions[0]?.id ?? "";
    this.selectedAgent = initial?.agents[0]?.id ?? "";
    this.transcript = new TranscriptController(() => ({
      ...this.options.transcript?.(),
      items: this.items,
      canComment: this.canComment,
      author: { id: "you", name: "You" },
      onSend: (submission) => this.send(submission),
    }));
    this.#unsubscribe = port.subscribe?.((value) => {
      if (!this.#closed) this.snapshot = value;
    });
  }
  get session() {
    return this.snapshot?.sessions.find((s) => s.id === this.sessionId);
  }
  get items() {
    return this.session?.items ?? [];
  }
  get busy() {
    return this.snapshot?.busy ?? false;
  }
  get canComment() {
    return (
      !this.#closed && !this.loading && (this.options.canComment?.() ?? true)
    );
  }
  get draftSendError() {
    const failure = this.sendFailure;
    const pending = this.transcript.pending;
    return failure?.session === this.sessionId &&
      failure.submission.text === this.transcript.message &&
      failure.submission.comments.length === pending.length &&
      failure.submission.comments.every((entry) =>
        pending.some(
          ({ thread, comment }) =>
            thread.id === entry.threadId &&
            comment.id === entry.commentId &&
            comment.text === entry.text,
        ),
      )
      ? failure.reason
      : undefined;
  }
  can(kind: string) {
    return (
      !this.#closed &&
      !this.actionBusy &&
      !this.pending &&
      !!this.snapshot?.capabilities.includes(kind)
    );
  }
  async refresh() {
    if (this.#closed) return;
    const epoch = ++this.#epoch;
    this.#abort?.abort();
    const abort = (this.#abort = new AbortController());
    this.loading = true;
    try {
      const value = await this.port.read(abort.signal);
      if (this.#closed || epoch !== this.#epoch) return;
      this.snapshot = value;
      if (!this.sessionId) this.sessionId = value.sessions[0]?.id ?? "";
      this.error = "";
    } catch (cause) {
      if (!abort.signal.aborted && epoch === this.#epoch) this.fail(cause);
    } finally {
      if (!this.#closed && epoch === this.#epoch) this.loading = false;
    }
  }
  selectSession(id: string) {
    return selectAgentSession(
      this,
      id,
      () => this.#closed,
      (cause) => this.fail(cause),
    );
  }
  async send(submission: TranscriptSubmission) {
    if (!this.can("send"))
      return {
        publication: "refused" as const,
        error: "Sending is unavailable; your draft is retained.",
      };
    this.sendFailure = undefined;
    let recipients: readonly string[];
    try {
      recipients =
        this.port.resolveRecipients?.({
          session: this.sessionId,
          submission: structuredClone(submission),
          selected: [...this.recipients],
        }) ?? this.recipients;
    } catch (cause) {
      this.fail(cause);
      this.sendFailure = {
        session: this.sessionId,
        submission,
        reason: this.error,
      };
      return { publication: "refused" as const, error: this.error };
    }
    const request: AgentAction = {
      id: submission.id,
      kind: "send",
      session: this.sessionId,
      submission,
      attachments: [...this.attachments],
      recipients: [...new Set(recipients)],
    };
    const outcome = await this.execute(request);
    if (outcome?.status === "acknowledged") {
      this.attachments = [];
      return { publication: "queued" as const, batchId: submission.id };
    }
    if (!this.#closed && outcome?.status === "refused")
      this.sendFailure = {
        session: request.session!,
        submission,
        reason: outcome.reason,
      };
    return {
      publication:
        outcome?.status === "refused"
          ? ("refused" as const)
          : ("unknown" as const),
      error:
        outcome?.status === "refused"
          ? outcome.reason
          : "Outcome unknown. Your original request is retained.",
    };
  }
  respondToApproval(request: string, option: string, item?: string) {
    return respondApproval(this, request, option, item);
  }
  respondToQuestion(
    request: string,
    answers: import("../chat/requests.js").UserInputAnswers,
    item?: string,
  ) {
    return respondQuestion(this, request, answers, item);
  }
  action(
    kind: string,
    target?: string,
    values?: Record<string, string | boolean>,
    agentParticipants?: AgentAction["agentParticipants"],
  ) {
    if (!this.can(kind)) return Promise.resolve(undefined);
    return this.execute({
      id: crypto.randomUUID(),
      kind,
      session: this.sessionId,
      target,
      values,
      agentParticipants,
    });
  }
  private execute(request: AgentAction) {
    this.actionBusy = true;
    this.error = "";
    return (this.#running = (async () => {
      try {
        const outcome = await this.port.act(structuredClone(request));
        if (!this.#closed) this.accept(outcome, request);
        return outcome;
      } catch (cause) {
        if (!this.#closed) {
          this.pending = request;
          this.fail(cause);
        }
        return undefined;
      } finally {
        if (!this.#closed) this.actionBusy = false;
      }
    })());
  }
  private accept(outcome: AgentOutcome, request: AgentAction) {
    if (outcome.status === "acknowledged") {
      this.snapshot = outcome.snapshot;
      this.pending = undefined;
      this.notice = "Action acknowledged";
      const interaction = this.interaction;
      if (
        request.kind === "respond" &&
        interaction &&
        interaction.id === request.target
      ) {
        const id =
          interaction.approval?.id ??
          interaction.question?.id ??
          interaction.id;
        this.requests.clear(request.session ?? "", id);
        this.interaction = undefined;
        this.requestFeedback = undefined;
      }
    } else if (outcome.status === "unknown") {
      this.pending = request;
      this.notice =
        "Outcome unknown. Check the original request before continuing.";
    } else {
      this.pending = undefined;
      this.fail(new Error(outcome.reason));
    }
  }
  checkStatus() {
    return checkRequestStatus(
      this,
      () => this.#closed,
      (outcome, request) => this.accept(outcome, request),
      (cause) => this.fail(cause),
    );
  }
  private fail(cause: unknown) {
    const error = cause instanceof Error ? cause : new Error(String(cause));
    this.error = error.message;
    this.port.report?.(error);
  }
  async close() {
    if (this.#closed) return;
    this.#closed = true;
    this.#epoch++;
    this.#abort?.abort();
    this.loading = false;
    this.#unsubscribe?.();
    this.requests.close();
    this.interaction = undefined;
    this.requestFeedback = undefined;
    await this.#running;
    await this.port.close?.();
  }
}

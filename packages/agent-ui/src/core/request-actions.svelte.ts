import type { AgentUiController } from "./controller.svelte.js";
import type { AgentRequest } from "./models.js";
import type { UserInputAnswers } from "../chat/requests.js";
/** Dismissal belongs to local presentation, never the host's permission decision. */
export function dismissCurrentPermission(
  owner: AgentUiController,
  itemId: string,
) {
  const request = currentAgentRequest(owner);
  if (request?.kind === "approval" && request.id === itemId)
    owner.requests.dismiss(owner.sessionId, request.id);
}
/** Keep the captured request only while its response is in flight or unresolved. */
export function currentAgentRequest(
  owner: AgentUiController,
): AgentRequest | undefined {
  const visible = (request: AgentRequest) =>
    !owner.requests.isDismissed(owner.sessionId, request.id);
  if (
    owner.interaction &&
    (owner.pending?.kind === "respond" || owner.actionBusy)
  )
    return visible(owner.interaction) ? owner.interaction : undefined;
  return owner.snapshot?.requests.find(
    (request) =>
      (!request.session || request.session === owner.sessionId) &&
      visible(request),
  );
}
function pending(
  owner: AgentUiController,
  requestId: string,
  itemId?: string,
): AgentRequest | undefined {
  const matches = owner.snapshot?.requests.filter(
    (request) =>
      (!request.session || request.session === owner.sessionId) &&
      !owner.requests.isDismissed(owner.sessionId, request.id) &&
      (!itemId || itemId === request.id) &&
      (request.approval?.id ?? request.question?.id ?? request.id) ===
        requestId,
  );
  return matches?.length === 1 ? matches[0] : undefined;
}
export async function respondApproval(
  owner: AgentUiController,
  requestId: string,
  optionId: string,
  itemId?: string,
) {
  const request = pending(owner, requestId, itemId);
  const options = request?.approval?.options ?? request?.options;
  if (
    request?.kind !== "approval" ||
    !options?.some((option) => option.id === optionId) ||
    !owner.can("respond")
  )
    return;
  return respond(owner, request, { option: optionId });
}
export async function respondQuestion(
  owner: AgentUiController,
  requestId: string,
  answers: UserInputAnswers,
  itemId?: string,
) {
  const request = pending(owner, requestId, itemId);
  if (request?.kind !== "question" || !owner.can("respond")) return;
  const questions = request.question?.questions;
  if (
    questions &&
    (Object.keys(answers).some(
      (id) => !questions.some((question) => question.id === id),
    ) ||
      questions.some((question) => {
        const values = answers[question.id];
        if (
          !Array.isArray(values) ||
          values.some((value) => typeof value !== "string" || !value.trim())
        )
          return true;
        if (question.required !== false && !values.length) return true;
        if (question.selectionMode !== "multiple" && values.length > 1)
          return true;
        if (
          !question.allowOther &&
          question.options?.length &&
          values.some(
            (value) =>
              !question.options!.some(
                (option) => (option.value ?? option.label) === value,
              ),
          )
        )
          return true;
        return (
          question.maxLength !== undefined &&
          values.some((value) => value.length > question.maxLength!)
        );
      }))
  )
    return;
  return respond(owner, request, { answers: JSON.stringify(answers) });
}
async function respond(
  owner: AgentUiController,
  request: AgentRequest,
  values: Record<string, string>,
) {
  owner.interaction = $state.snapshot(request);
  owner.requestFeedback = {
    requestId: request.id,
    state: { status: "submitting" },
  };
  const session = owner.sessionId;
  const outcome = await owner.action("respond", request.id, values);
  if (owner.sessionId === session && owner.interaction?.id === request.id) {
    owner.requestFeedback = {
      requestId: request.id,
      state:
        outcome?.status === "refused"
          ? { status: "refused", message: outcome.reason }
          : {
              status: "unknown",
              message: "Check the original response before continuing.",
            },
    };
  }
  return outcome;
}

export async function checkRequestStatus(
  owner: AgentUiController,
  closed: () => boolean,
  accept: (
    outcome: import("./models.js").AgentOutcome,
    request: import("./models.js").AgentAction,
  ) => void,
  fail: (cause: unknown) => void,
) {
  const request = owner.pending;
  if (!request || owner.actionBusy || closed()) return;
  owner.actionBusy = true;
  try {
    const outcome = await owner.port.status(request.id);
    if (!closed()) accept(outcome, request);
  } catch (cause) {
    if (!closed()) fail(cause);
  } finally {
    if (!closed()) owner.actionBusy = false;
  }
}

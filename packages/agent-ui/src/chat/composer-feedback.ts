import type { ComposerStatus } from "@lapismd/design-core/chat";
import { currentAgentRequest } from "../core/request-actions.svelte.js";
import type { AgentUiController } from "../core/controller.svelte.js";

/** Explicit errors take precedence over advisory status, without losing host wording. */
export function composerFeedback(
  ...statuses: readonly (ComposerStatus | undefined)[]
): ComposerStatus | undefined {
  const priority = { error: 3, warning: 2, info: 1, success: 0 };
  return statuses.reduce<ComposerStatus | undefined>(
    (selected, next) =>
      next && (!selected || priority[next.type] > priority[selected.type])
        ? next
        : selected,
    undefined,
  );
}

/** Presentation only: exact drafts and unresolved request identities remain controller-owned. */
export function controllerComposerFeedback(
  owner: AgentUiController,
): ComposerStatus | undefined {
  const failure = owner.sendFailure;
  const captured =
    failure?.session === owner.sessionId &&
    owner.items.some(
      (item) =>
        item.id === failure.capturedNoticeId &&
        item.notice === "error" &&
        item.blocks.some((block) => block.text === failure.reason),
    );
  if (owner.draftSendError && !captured)
    return { type: "error", message: owner.draftSendError };
  if (owner.pending || owner.transcript.retainedSubmission)
    return {
      type: "warning",
      message: [
        "Outcome unknown. Check the original request before continuing.",
        owner.error,
      ]
        .filter(Boolean)
        .join(" "),
    };
  const request = currentAgentRequest(owner);
  const requestError =
    owner.requestFeedback?.requestId === request?.id &&
    owner.requestFeedback?.state.status === "refused"
      ? owner.requestFeedback.state.message
      : undefined;
  if (requestError) return { type: "error", message: requestError };
  const dismissedFailure =
    owner.requestFeedback?.state.status === "refused" &&
    owner.requests.isDismissed(owner.sessionId, owner.requestFeedback.requestId)
      ? owner.requestFeedback.state.message
      : undefined;
  const error = [owner.error, owner.transcript.error].find(
    (message) =>
      message &&
      message !== owner.sendFailure?.reason &&
      message !== dismissedFailure,
  );
  return error ? { type: "error", message: error } : undefined;
}

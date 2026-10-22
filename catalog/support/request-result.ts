import type {
  AgentAction,
  AgentSnapshot,
} from "../../packages/agent-ui/src/core/models.js";
import type { AgentRequestResult } from "../../packages/agent-ui/src/chat/request-state.js";
/** Simulated host acknowledgement; answer values never enter the captured result. */
export function acknowledgeRequest(
  next: AgentSnapshot,
  action: AgentAction,
): boolean {
  const pending = next.requests.find(
    (request) =>
      request.id === action.target &&
      (!request.session || request.session === action.session),
  );
  const session = next.sessions.find(
    (session) => session.id === action.session,
  );
  if (!pending || !session) return false;
  let result: AgentRequestResult;
  if (pending.kind === "approval") {
    const request = pending.approval ?? {
      id: pending.id,
      kind: "other" as const,
      title: pending.title,
      details: { description: pending.details },
      options: pending.options.map((option) => ({
        ...option,
        kind: option.kind ?? ("unknown" as const),
      })),
    };
    const option = request.options.find(
      (option) => option.id === action.values?.option,
    );
    if (!option) return false;
    const status = ["allow-once", "allow-session", "allow-always"].includes(
      option.kind,
    )
      ? "approved"
      : ["deny-once", "deny-always"].includes(option.kind)
        ? "denied"
        : "answered";
    result = {
      kind: "approval",
      request,
      selectedOptionId: option.id,
      state: {
        status,
        message: option.label,
        timestamp: "2026-10-22T09:03:00.000Z",
      },
    };
  } else {
    const request = pending.question ?? {
      id: pending.id,
      title: pending.title,
      questions: [
        {
          id: pending.id,
          header: "Question",
          prompt: pending.title,
          options: pending.options,
          allowOther: true,
          secret: false,
        },
      ],
    };
    result = {
      kind: "question",
      request,
      state: {
        status: "answered",
        message:
          "The host acknowledged your response. Answer content is not captured.",
      },
    };
  }
  const block = `request-result/${pending.id}`;
  next.requestResults = { ...next.requestResults, [block]: result };
  session.items.push({
    id: block,
    kind: "context",
    defaultExpanded: false,
    label: "Request response",
    blocks: [
      {
        id: block,
        revision: "captured-response-v1",
        kind: "custom",
        label: pending.title,
        text: "Captured request response",
        surface: "plain",
        commentable: false,
      },
    ],
  });
  next.requests = next.requests.filter((request) => request !== pending);
  return true;
}

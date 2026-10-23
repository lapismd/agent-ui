import { expect, test } from "vitest";
import { createChatPresentation } from "../packages/agent-ui/src/chat/presentation-adapter.svelte.js";
import { requestTranscript } from "../packages/agent-ui/src/chat/request-transcript.js";
import { permissionRequest } from "../catalog/agents/requests/data.js";
import {
  AgentRequestController,
  questionAnswers,
  questionsComplete,
} from "../packages/agent-ui/src/chat/request-controller.svelte.js";
import { AgentUiController } from "../packages/agent-ui/src/core/controller.svelte.js";
import { MemoryAgentPort } from "../catalog/support/agent-adapter.js";
import type { UserInputRequest } from "../packages/agent-ui/src/chat/requests.js";
const question: UserInputRequest = {
  id: "q",
  title: "Configure search",
  questions: [
    {
      id: "environment",
      header: "Environment",
      prompt: "Choose an environment",
      allowOther: true,
      secret: false,
      options: [
        { id: "dev", label: "Same", value: "development" },
        { id: "prod", label: "Same", value: "production" },
      ],
    },
  ],
};
test("question drafts retain option identities across refreshed input and remain session scoped", () => {
  const c = new AgentRequestController();
  c.select("first", "q", question.questions[0], "prod");
  expect(
    questionAnswers(structuredClone(question), c.get("first", "q")),
  ).toEqual({ environment: ["production"] });
  expect(questionsComplete(question, c.get("second", "q"))).toBe(false);
  c.chooseOther("first", "q", question.questions[0]);
  c.text("first", "q", "environment", "  exact context  ");
  expect(questionAnswers(question, c.get("first", "q"))).toEqual({
    environment: ["exact context"],
  });
  c.close();
  expect(questionsComplete(question, c.get("first", "q"))).toBe(false);
});
test("multiple choices, required Other and text limits follow advertised capabilities", () => {
  const request = structuredClone(question);
  request.questions[0].selectionMode = "multiple";
  request.questions[0].maxLength = 5;
  const c = new AgentRequestController();
  c.select("s", "q", request.questions[0], "prod");
  c.select("s", "q", request.questions[0], "dev");
  expect(questionAnswers(request, c.get("s", "q"))).toEqual({
    environment: ["development", "production"],
  });
  c.chooseOther("s", "q", request.questions[0]);
  expect(questionsComplete(request, c.get("s", "q"))).toBe(false);
  c.text("s", "q", "environment", "sixsix");
  expect(questionsComplete(request, c.get("s", "q"))).toBe(false);
  c.text("s", "q", "environment", "five");
  expect(questionsComplete(request, c.get("s", "q"))).toBe(true);
  c.select("s", "q", request.questions[0], "forged");
  expect(c.get("s", "q").selections.environment).toEqual(["prod", "dev"]);
});
function setup() {
  const port = new MemoryAgentPort();
  port.snapshot.requests = [
    {
      id: "permission",
      kind: "approval",
      title: "Read docs",
      details: "Captured docs",
      options: [
        { id: "opaque-choice", label: "Allow once", kind: "allow-once" },
      ],
    },
  ];
  const c = new AgentUiController(port, port.snapshot);
  return { port, c };
}
test("dismissing a permission is local, scoped, refresh-stable and retains unresolved recovery", async () => {
  const { port, c } = setup();
  const presentation = createChatPresentation(() => c);
  c.transcript.message = "Retained draft";
  c.requests.dismiss(c.sessionId, "permission");
  expect(presentation.attachmentsState.pendingInteraction).toBeUndefined();
  expect(port.calls).toHaveLength(0);
  await c.respondToApproval("permission", "opaque-choice");
  expect(port.calls).toHaveLength(0);
  await c.refresh();
  expect(presentation.attachmentsState.pendingInteraction).toBeUndefined();
  expect(c.transcript.message).toBe("Retained draft");
  expect(c.requests.isDismissed("other-session", "permission")).toBe(false);
  c.requests.restore(c.sessionId, "permission");
  expect(presentation.attachmentsState.pendingInteraction?.id).toBe(
    "permission",
  );
  port.fault = "unknown";
  await c.respondToApproval("permission", "opaque-choice");
  const pending = c.pending;
  c.requests.dismiss(c.sessionId, "permission");
  expect(presentation.attachmentsState.pendingInteraction).toBeUndefined();
  expect(c.pending).toBe(pending);
  expect(c.interaction?.id).toBe("permission");
  expect(presentation.composerState.composerStatus?.type).toBe("warning");
  await c.checkStatus();
  expect(c.pending).toBeUndefined();
  expect(port.calls).toHaveLength(1);
  expect(c.transcript.message).toBe("Retained draft");
  await c.close();
  expect(c.requests.isDismissed(c.sessionId, "permission")).toBe(false);
});
test("unknown permission response retains the exact request and status never replays", async () => {
  const { port, c } = setup();
  port.fault = "unknown";
  await c.respondToApproval("permission", "forged");
  expect(port.calls).toHaveLength(0);
  await c.respondToApproval("permission", "opaque-choice");
  expect(
    createChatPresentation(() => c).composerState.composerStatus?.type,
  ).toBe("warning");
  expect(c.pending?.target).toBe("permission");
  expect(c.interaction?.id).toBe("permission");
  await c.respondToApproval("permission", "opaque-choice");
  expect(port.calls).toHaveLength(1);
  await c.checkStatus();
  expect(c.pending).toBeUndefined();
  expect(c.interaction).toBeUndefined();
  expect(port.calls).toHaveLength(1);
  await c.close();
});
test("refused responses retain drafts and an explicit retry requires a new action", async () => {
  const { port, c } = setup();
  port.fault = "failed";
  c.requests.permission(c.sessionId, "permission", "opaque-choice");
  await c.respondToApproval("permission", "opaque-choice");
  expect(c.requestFeedback?.state.status).toBe("refused");
  expect(
    createChatPresentation(() => c).composerState.composerStatus?.type,
  ).toBe("error");
  expect(c.requests.get(c.sessionId, "permission").optionId).toBe(
    "opaque-choice",
  );
  await c.refresh();
  expect(port.calls).toHaveLength(1);
  port.fault = "none";
  await c.respondToApproval("permission", "opaque-choice");
  expect(port.calls).toHaveLength(2);
  expect(c.requests.get(c.sessionId, "permission").optionId).toBeUndefined();
  await c.close();
});
test("pending requests from another session cannot dispatch and duplicate clicks share one effect", async () => {
  const { port, c } = setup();
  port.snapshot.requests[0].session = "other";
  await c.respondToApproval("permission", "opaque-choice");
  expect(port.calls).toHaveLength(0);
  delete port.snapshot.requests[0].session;
  await Promise.all([
    c.respondToApproval("permission", "opaque-choice"),
    c.respondToApproval("permission", "opaque-choice"),
  ]);
  expect(port.calls).toHaveLength(1);
  await c.close();
});

test("question answers validate advertised values and secret values stay outside captured results", async () => {
  const port = new MemoryAgentPort();
  const request = structuredClone(question);
  request.questions[0].allowOther = false;
  port.snapshot.requests = [
    {
      id: "q",
      kind: "question",
      title: "Configure",
      details: "Question",
      options: [],
      question: request,
    },
  ];
  const c = new AgentUiController(port, port.snapshot);
  await c.respondToQuestion("q", { environment: ["forged"] });
  expect(port.calls).toHaveLength(0);
  await c.respondToQuestion("q", {
    environment: ["development"],
    extra: ["value"],
  });
  expect(port.calls).toHaveLength(0);
  request.questions[0].options = [];
  request.questions[0].secret = true;
  c.requests.text(c.sessionId, "q", "environment", "a-private-answer");
  await c.respondToQuestion("q", { environment: ["a-private-answer"] });
  expect(port.calls).toHaveLength(1);
  expect(JSON.stringify(c.snapshot?.requestResults)).not.toContain(
    "a-private-answer",
  );
  expect(c.requests.get(c.sessionId, "q").text).toEqual({});
  await c.close();
});

test("disposal during a response drains the effect without reviving drafts or feedback", async () => {
  const { port, c } = setup();
  let finish!: (outcome: { status: "refused"; reason: string }) => void;
  port.act = () =>
    new Promise((resolve) => {
      finish = resolve;
    });
  const response = c.respondToApproval("permission", "opaque-choice");
  const closing = c.close();
  finish({ status: "refused", reason: "closed" });
  await response;
  await closing;
  expect(c.interaction).toBeUndefined();
  expect(c.requestFeedback).toBeUndefined();
  expect(c.requests.drafts).toEqual({});
});

test("custom answers alone are valid for multiple choice and a revoked capability cannot leak a retained draft", () => {
  const request = structuredClone(question);
  request.questions[0].selectionMode = "multiple";
  request.questions[0].optionLabels = "numbers";
  const c = new AgentRequestController();
  c.chooseOther("s", "q", request.questions[0]);
  c.text("s", "q", "environment", "A completely different answer");
  expect(questionsComplete(request, c.get("s", "q"))).toBe(true);
  expect(questionAnswers(request, c.get("s", "q"))).toEqual({
    environment: ["A completely different answer"],
  });
  request.questions[0].allowOther = false;
  expect(questionsComplete(request, c.get("s", "q"))).toBe(false);
  expect(questionAnswers(request, c.get("s", "q"))).toEqual({
    environment: [],
  });
  c.close();
});

test("captured permissions become collapsed native transcript rows without mutating host items", () => {
  const request = permissionRequest();
  const item = {
    id: "result",
    kind: "context" as const,
    label: "Request response",
    defaultExpanded: true,
    blocks: [
      {
        id: "result",
        revision: "v1",
        kind: "custom" as const,
        label: "Request",
        text: "Captured response",
      },
    ],
  };
  for (const status of ["approved", "denied"] as const) {
    const [row] = requestTranscript([item], {
      result: {
        kind: "approval",
        request,
        state: { status },
        selectedOptionId: request.options[0].id,
      },
    });
    expect(row.label).toBe(
      `${status === "approved" ? "Permission granted" : "Permission denied"}: ${request.title}`,
    );
    expect(row.defaultExpanded).toBe(false);
    expect(row.tone).toBe(status === "denied" ? "destructive" : undefined);
    expect(row.blocks).toBe(item.blocks);
    expect(item.defaultExpanded).toBe(true);
  }
  expect(requestTranscript([item])[0]).toBe(item);
});

test("captured permission results select the card renderer for Markdown host blocks", () => {
  const block = {
    id: "response/body",
    revision: "exact",
    kind: "markdown" as const,
    label: "Response",
    text: "Original captured result",
  };
  const [row] = requestTranscript(
    [
      {
        id: "response",
        kind: "context",
        label: "Captured permission",
        blocks: [block],
      },
    ],
    {
      [block.id]: {
        kind: "approval",
        request: permissionRequest(),
        state: { status: "approved" },
      },
    },
  );
  expect(row.blocks[0]).toEqual({ ...block, kind: "custom" });
  expect(block.kind).toBe("markdown");
});

test("refusal feedback follows the current request while unknown response retains its original capture", async () => {
  const { port, c } = setup();
  port.fault = "failed";
  await c.respondToApproval("permission", "opaque-choice");
  const presentation = createChatPresentation(() => c);
  expect(presentation.attachmentsState.requestState?.status).toBe("refused");
  const refreshed = structuredClone(c.snapshot!);
  refreshed.requests[0].options[0].label = "Refreshed allowance";
  c.snapshot = refreshed;
  const interaction = presentation.attachmentsState.pendingInteraction;
  expect(
    interaction?.type === "approval" && interaction.request.options[0].label,
  ).toBe("Refreshed allowance");
  c.snapshot.requests[0].id = "new-request";
  expect(presentation.attachmentsState.requestState?.status).toBe("pending");
  await c.close();
});

test("a refused permission stays visible when its wording matches an older send failure", async () => {
  const { port, c } = setup();
  port.fault = "failed";
  c.transcript.message = "Earlier failed draft";
  await c.transcript.send();
  c.transcript.message = "An edited draft";
  expect(
    createChatPresentation(() => c).composerState.composerStatus,
  ).toBeUndefined();
  await c.respondToApproval("permission", "opaque-choice");
  expect(createChatPresentation(() => c).composerState.composerStatus).toEqual({
    type: "error",
    message: "The simulated host refused this action.",
  });
  await c.close();
});

test("closing a refused permission clears only its feedback and new request identities remain visible", async () => {
  const { port, c } = setup();
  port.fault = "failed";
  await c.respondToApproval("permission", "opaque-choice");
  const panel = createChatPresentation(() => c);
  expect(panel.composerState.composerStatus?.type).toBe("error");
  panel.attachmentsState.dismissRequest?.("stale-permission");
  expect(panel.attachmentsState.pendingInteraction?.id).toBe("permission");
  panel.attachmentsState.dismissRequest?.("permission");
  expect(panel.composerState.composerStatus).toBeUndefined();
  expect(c.snapshot?.requests[0].id).toBe("permission");
  expect(port.calls).toHaveLength(1);
  c.snapshot!.requests = [{ ...c.snapshot!.requests[0], id: "new-permission" }];
  expect(panel.attachmentsState.pendingInteraction?.id).toBe("new-permission");
  await c.close();
});

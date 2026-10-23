import { expect, test } from "vitest";
import { createChatPresentation } from "../packages/agent-ui/src/chat/presentation-adapter.svelte.js";
import {
  composerFeedback,
  capturedComposerFeedback,
} from "../packages/agent-ui/src/chat/composer-feedback.js";
import { AgentUiController } from "../packages/agent-ui/src/core/controller.svelte.js";
import { MemoryAgentPort } from "../catalog/support/agent-adapter.js";

test.each([false, true])(
  "captured send notices deduplicate only a new matching outcome (historical: %s)",
  async (historical) => {
    const memory = new MemoryAgentPort();
    const notice = {
      id: "captured-refusal",
      kind: "context" as const,
      notice: "error" as const,
      label: "Turn interrupted",
      blocks: [
        {
          id: "captured-refusal/body",
          revision: "1",
          kind: "markdown" as const,
          label: "Failure",
          text: "Your message is retained",
        },
      ],
    };
    if (historical) memory.snapshot.sessions[0]!.items.push(notice);
    let publish!: (snapshot: typeof memory.snapshot) => void;
    const port = {
      read: memory.read.bind(memory),
      status: memory.status.bind(memory),
      subscribe(listener: typeof publish) {
        publish = listener;
        return () => {};
      },
      async act() {
        if (!historical) {
          memory.snapshot.sessions[0]!.items.push(notice);
          publish(structuredClone(memory.snapshot));
        }
        return { status: "refused" as const, reason: notice.blocks[0]!.text };
      },
    };
    const controller = new AgentUiController(port, memory.snapshot);
    controller.transcript.message = "Retain this exact message";
    await controller.transcript.send();
    const panel = createChatPresentation(() => controller);
    const external = {
      type: "error" as const,
      message: notice.blocks[0]!.text,
    };
    expect(capturedComposerFeedback(controller, external)).toEqual(
      historical ? external : undefined,
    );
    const warning = { type: "warning" as const, message: external.message };
    expect(capturedComposerFeedback(controller, warning)).toBe(warning);

    expect(controller.transcript.message).toBe("Retain this exact message");
    expect(panel.composerState.composerStatus).toEqual(
      historical
        ? { type: "error", message: notice.blocks[0]!.text }
        : undefined,
    );
    controller.snapshot = {
      ...memory.snapshot,
      sessions: memory.snapshot.sessions.map((session) => ({
        ...session,
        items: session.items.filter((item) => item.id !== notice.id),
      })),
    };
    expect(panel.composerState.composerStatus?.type).toBe("error");
    await controller.close();
  },
);

test("refused feedback belongs to the exact retained draft and session", async () => {
  const port = new MemoryAgentPort();
  port.fault = "failed";
  const controller = new AgentUiController(port, port.snapshot);
  controller.transcript.message = "Retain this exact message";
  await controller.transcript.send();
  expect(controller.draftSendError).toBe(
    "The simulated host refused this action.",
  );
  const panel = createChatPresentation(() => controller);
  expect(panel.composerState.composerStatus).toEqual({
    type: "error",
    message: controller.draftSendError,
  });
  const failed = controller.sendFailure!;
  expect(failed.submission.id).toBe(port.calls[0].id);
  expect(failed.submission.text).toBe(controller.transcript.message);
  controller.transcript.message = "Edited after the refusal";
  expect(controller.draftSendError).toBeUndefined();
  expect(panel.composerState.composerStatus).toBeUndefined();
  controller.transcript.message = failed.submission.text;
  controller.selectSession("planning");
  controller.transcript.message = failed.submission.text;
  expect(controller.draftSendError).toBeUndefined();
  controller.selectSession("review");
  expect(controller.draftSendError).toBe(failed.reason);
  port.fault = "none";
  await controller.transcript.send();
  expect(controller.sendFailure).toBeUndefined();
  expect(controller.transcript.message).toBe("");
  expect(port.calls).toHaveLength(2);
  await controller.close();
});

test("unknown delivery retains recovery identity without failed-send metadata or replay", async () => {
  const port = new MemoryAgentPort();
  port.fault = "unknown";
  const controller = new AgentUiController(port, port.snapshot);
  controller.transcript.message = "Unknown delivery";
  await controller.transcript.send();
  expect(controller.draftSendError).toBeUndefined();
  expect(controller.sendFailure).toBeUndefined();
  expect(
    createChatPresentation(() => controller).composerState.composerStatus?.type,
  ).toBe("warning");
  expect(controller.pending?.id).toBe(port.calls[0].id);
  expect(controller.transcript.retainedSubmission?.id).toBe(port.calls[0].id);
  await controller.transcript.send();
  expect(port.calls).toHaveLength(1);
  expect(controller.transcript.message).toBe("Unknown delivery");
  await controller.close();
});

test("editing attached inline comments stops attributing an earlier refusal to the draft", async () => {
  const port = new MemoryAgentPort();
  port.fault = "failed";
  const controller = new AgentUiController(port, port.snapshot);
  controller.transcript.open(
    controller.items[0].blocks[0],
    { from: 0, to: 6 },
    "Retain this inline comment",
  );
  await controller.transcript.send();
  expect(controller.draftSendError).toBe(
    "The simulated host refused this action.",
  );
  controller.transcript.edit(
    controller.transcript.pending[0].comment.id,
    "An edited inline comment",
  );
  expect(controller.draftSendError).toBeUndefined();
  expect(
    createChatPresentation(() => controller).composerState.composerStatus,
  ).toBeUndefined();
  expect(port.calls).toHaveLength(1);
  await controller.close();
});

test("an advisory warning cannot hide an explicit error", () => {
  const warning = {
    type: "warning" as const,
    message: "Context is nearly full",
  };
  const error = {
    type: "error" as const,
    message: "Host refused this request",
  };
  expect(composerFeedback(warning, error)).toBe(error);
  expect(warning.message).toBe("Context is nearly full");
});

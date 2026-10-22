import { expect, test } from "vitest";
import { AgentUiController } from "../packages/agent-ui/src/core/controller.svelte.js";
import { MemoryAgentPort } from "../catalog/support/agent-adapter.js";

test("refused feedback belongs to the exact retained draft and session", async () => {
  const port = new MemoryAgentPort();
  port.fault = "failed";
  const controller = new AgentUiController(port, port.snapshot);
  controller.transcript.message = "Retain this exact message";
  await controller.transcript.send();
  expect(controller.draftSendError).toBe(
    "The simulated host refused this action.",
  );
  const failed = controller.sendFailure!;
  expect(failed.submission.id).toBe(port.calls[0].id);
  expect(failed.submission.text).toBe(controller.transcript.message);
  controller.transcript.message = "Edited after the refusal";
  expect(controller.draftSendError).toBeUndefined();
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
  expect(port.calls).toHaveLength(1);
  await controller.close();
});

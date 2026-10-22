import { expect, test } from "vitest";
import { AgentUiController } from "../packages/agent-ui/src/core/controller.svelte.js";
import type { AgentPort } from "../packages/agent-ui/src/core/models.js";
import { MemoryAgentPort } from "../catalog/support/agent-adapter.js";

test("mentions do not derive recipients without an explicit host policy", async () => {
  const port = new MemoryAgentPort();
  const controller = new AgentUiController(port, port.snapshot);
  controller.transcript.message =
    "Ask [Reviewer](app:agent/reviewer) jj-store-agent:123;";
  await controller.transcript.send();
  expect(port.calls[0].recipients).toEqual([]);
  expect(port.calls[0].submission?.text).toContain("jj-store-agent:123;");
  await controller.close();
});
test("host routing receives exact authored text and retains recipients through unknown recovery", async () => {
  const port: MemoryAgentPort & AgentPort = new MemoryAgentPort();
  port.fault = "unknown";
  const inputs: unknown[] = [];
  port.resolveRecipients = (input) => {
    inputs.push(input);
    return [...input.selected, "reviewer", "reviewer"];
  };
  const controller = new AgentUiController(port, port.snapshot);
  controller.recipients = ["author"];
  controller.transcript.message = "Ask jj-store-agent:123; to review café 👋";
  await controller.transcript.send();
  expect(inputs).toEqual([
    {
      session: controller.sessionId,
      submission: port.calls[0].submission,
      selected: ["author"],
    },
  ]);
  expect(controller.pending?.recipients).toEqual(["author", "reviewer"]);
  controller.recipients = ["later"];
  await controller.transcript.send();
  expect(port.calls).toHaveLength(1);
  expect(controller.pending?.recipients).toEqual(["author", "reviewer"]);
  await controller.close();
});
test("failed recipient resolution refuses before executing and retains the draft", async () => {
  const port: MemoryAgentPort & AgentPort = new MemoryAgentPort();
  port.resolveRecipients = () => {
    throw new Error("Recipient lookup unavailable");
  };
  const controller = new AgentUiController(port, port.snapshot);
  controller.transcript.message = "Keep the authored draft";
  await controller.transcript.send();
  expect(port.calls).toHaveLength(0);
  expect(controller.transcript.message).toBe("Keep the authored draft");
  expect(controller.transcript.error).toBe("Recipient lookup unavailable");
  expect(controller.draftSendError).toBe("Recipient lookup unavailable");
  await controller.close();
});

test("host comment admission blocks opening comments without clearing the draft", async () => {
  const port = new MemoryAgentPort();
  const controller = new AgentUiController(port, port.snapshot, {
    canComment: () => false,
  });
  controller.transcript.message = "Retained message";
  controller.transcript.open(controller.items[0].blocks[0], { from: 0, to: 1 });
  expect(controller.canComment).toBe(false);
  expect(controller.transcript.active).toBeUndefined();
  expect(controller.transcript.message).toBe("Retained message");
  await controller.close();
});

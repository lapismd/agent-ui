import { expect, test } from "vitest";
import { AgentUiController } from "../packages/agent-ui/src/core/controller.svelte.js";
import { MemoryAgentPort } from "../catalog/support/agent-adapter.js";

test("withdrawn send capability preserves a busy draft without issuing a queued mutation", async () => {
  const port = new MemoryAgentPort();
  port.snapshot.busy = true;
  port.snapshot.capabilities = port.snapshot.capabilities.filter(
    (kind) => kind !== "send",
  );
  const controller = new AgentUiController(
    port,
    structuredClone(port.snapshot),
  );
  try {
    controller.transcript.message = "Keep this exact follow-up";
    expect(controller.transcript.canSend).toBe(false);
    expect(await controller.transcript.send()).toBe(false);
    expect(port.calls).toEqual([]);
    expect(controller.transcript.message).toBe("Keep this exact follow-up");
    port.snapshot.capabilities.push("send");
    await controller.refresh();
    expect(controller.transcript.canSend).toBe(true);
    expect(await controller.transcript.send()).toBe(true);
    expect(port.calls.map((call) => call.kind)).toEqual(["send"]);
    expect(controller.transcript.message).toBe("");
  } finally {
    await controller.close();
  }
});

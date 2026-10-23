import { expect, test } from "vitest";
import { AgentUiController } from "../packages/agent-ui/src/core/controller.svelte.js";
import type { AgentPort } from "../packages/agent-ui/src/core/models.js";
import { MemoryAgentPort } from "../catalog/support/agent-adapter.js";
test("host selection waits for admission, restores its retained draft, and never dispatches", async () => {
  const memory = new MemoryAgentPort();
  let release!: () => void;
  const ready = new Promise<void>((resolve) => {
    release = resolve;
  });
  const snapshot = structuredClone(memory.snapshot);
  snapshot.chat!.draft = {
    text: "retained",
    attachments: ["Notes/a.md"],
    threads: [],
  };
  const port: AgentPort = {
    read: async () => snapshot,
    act: (a) => memory.act(a),
    status: (id) => memory.status(id),
    selectSession: async () => {
      await ready;
      return snapshot;
    },
  };
  const owner = new AgentUiController(port, memory.snapshot),
    original = owner.sessionId;
  const selection = owner.selectSession("target");
  expect(owner.sessionId).toBe(original);
  release();
  await selection;
  expect(owner.sessionId).toBe("target");
  expect(owner.transcript.message).toBe("retained");
  expect(owner.attachments).toEqual(["Notes/a.md"]);
  expect(memory.calls).toEqual([]);
  await owner.close();
});
test("failed host selection retains the original draft and session", async () => {
  const memory = new MemoryAgentPort();
  const port: AgentPort = {
    read: async () => memory.snapshot,
    act: (a) => memory.act(a),
    status: (id) => memory.status(id),
    selectSession: async () => {
      throw new Error("Admission refused");
    },
  };
  const owner = new AgentUiController(port, memory.snapshot),
    original = owner.sessionId;
  owner.transcript.message = "keep this";
  await owner.selectSession("other");
  expect(owner.sessionId).toBe(original);
  expect(owner.transcript.message).toBe("keep this");
  await owner.close();
});

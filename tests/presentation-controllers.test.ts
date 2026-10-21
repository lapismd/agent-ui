import { expect, test } from "vitest";
import { RepositoryController } from "../packages/repository-ui/src/core/controller.svelte.js";
import type { RepositorySnapshot } from "../packages/repository-ui/src/core/models.js";
import { AgentUiController } from "../packages/agent-ui/src/core/controller.svelte.js";
import type { AgentSnapshot } from "../packages/agent-ui/src/core/models.js";
import { MemoryRepositoryPort } from "../catalog/support/repository-adapter.js";
import { MemoryAgentPort } from "../catalog/support/agent-adapter.js";

test("repository unknown outcomes retain one exact request and resolve without replay", async () => {
  const port = new MemoryRepositoryPort();
  port.fault = "unknown";
  const c = new RepositoryController(port, port.snapshot);
  c.drafts.name = "Retained name";
  expect(c.prepare("save_settings", undefined, { name: "Retained name" })).toBe(
    true,
  );
  const request = c.preview!;
  await c.apply();
  expect(c.pending?.id).toBe(request.id);
  expect(c.drafts.name).toBe("Retained name");
  await c.apply();
  expect(port.calls).toHaveLength(1);
  await c.checkStatus();
  expect(c.pending).toBeUndefined();
  expect(c.snapshot?.settings.find((s) => s.id === "name")?.value).toBe(
    "Retained name",
  );
  expect(port.calls).toHaveLength(1);
  await c.close();
});

test("late repository responses cannot replace newer selection or survive disposal", async () => {
  const port = new MemoryRepositoryPort();
  const reads: ((snapshot: RepositorySnapshot) => void)[] = [];
  port.read = () => new Promise((resolve) => reads.push(resolve));
  const c = new RepositoryController(port);
  const first = c.refresh();
  const second = c.refresh();
  const newer = structuredClone(port.snapshot);
  newer.name = "Newer";
  reads[1](newer);
  await second;
  reads[0](port.snapshot);
  await first;
  expect(c.snapshot?.name).toBe("Newer");
  const late = c.refresh();
  const index = reads.length - 1;
  await c.close();
  reads[index](port.snapshot);
  await late;
  expect(c.snapshot?.name).toBe("Newer");
});

test("repository pin mismatch is refused while retained data and drafts survive", async () => {
  const port = new MemoryRepositoryPort();
  const c = new RepositoryController(port, port.snapshot);
  c.drafts.remote = "https://example.test/retained.git";
  port.read = async () => ({
    ...structuredClone(port.snapshot),
    pin: { ...port.snapshot.pin, operation: "wrong-operation" },
  });
  await c.refresh();
  expect(c.error).toContain("does not match");
  expect(c.snapshot?.pin.operation).toBe("op-20261021-a");
  expect(c.drafts.remote).toContain("retained");
  await c.close();
});

test("agent unknown submission retains the original request and never resends on refresh or status", async () => {
  const port = new MemoryAgentPort();
  port.fault = "unknown";
  const c = new AgentUiController(port, port.snapshot);
  c.transcript.message = "Retain my authored message";
  const outcome = await c.send({
    id: "exact-submission",
    text: "Retain my authored message",
    comments: [],
  });
  expect(outcome.publication).toBe("unknown");
  expect(c.pending?.id).toBe("exact-submission");
  expect(c.transcript.message).toBe("Retain my authored message");
  await c.refresh();
  await c.checkStatus();
  expect(c.pending).toBeUndefined();
  expect(port.calls).toHaveLength(1);
  await c.close();
});

test("agent conversation switching and presentation changes preserve authored drafts", async () => {
  const port = new MemoryAgentPort();
  const c = new AgentUiController(port, port.snapshot);
  c.transcript.message = "Review draft";
  c.view = "classic";
  c.selectSession("planning");
  c.transcript.message = "Planning draft";
  c.selectSession("review");
  expect(c.transcript.message).toBe("Review draft");
  c.selectSession("planning");
  expect(c.transcript.message).toBe("Planning draft");
  expect(c.view).toBe("classic");
  await c.close();
});

test("disposed agent controller rejects late reads and host events", async () => {
  const port = new MemoryAgentPort();
  let finish!: (snapshot: AgentSnapshot) => void;
  port.read = () => new Promise((resolve) => (finish = resolve));
  const c = new AgentUiController(port);
  const work = c.refresh();
  await c.close();
  finish(port.snapshot);
  await work;
  expect(c.snapshot).toBeUndefined();
  expect(c.loading).toBe(false);
});

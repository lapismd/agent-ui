import { expect, test } from "vitest";
import { AgentUiController } from "../packages/agent-ui/src/core/controller.svelte.js";
import { HistoryController } from "../packages/agent-ui/src/history/controller.svelte.js";
import { MemoryAgentPort } from "../catalog/support/agent-adapter.js";

test("history initially reveals the current scope ancestry and creates chat in that scope", async () => {
  const port = new MemoryAgentPort();
  port.snapshot.chat!.scope = "Projects/agent-ui";
  const owner = new AgentUiController(port, port.snapshot);
  const history = new HistoryController(() => owner);
  expect(history.selectedScope).toBe("Projects/agent-ui");
  expect([...history.openScopes]).toEqual(["Projects", "Projects/agent-ui"]);
  await history.newConversation();
  expect(port.calls[0].values?.scope).toBe("Projects/agent-ui");
  await owner.close();
});

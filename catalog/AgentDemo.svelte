<script lang="ts">
  import { onDestroy, untrack } from "svelte";
  import { AgentWorkbench } from "../packages/agent-ui/src/screens/index.js";
  import { AgentUiController } from "../packages/agent-ui/src/core/index.js";
  import type { AgentScreen } from "../packages/agent-ui/src/core/models.js";
  import { memoryAgentImports } from "./support/agent-imports.svelte.js";
  import { MemoryAgentPort } from "./support/agent-adapter.js";
  let {
    screen = "chat",
    fault = "none",
    requests = false,
    busy = false,
    empty = false,
  }: {
    screen?: AgentScreen;
    fault?: "none" | "unknown" | "failed";
    requests?: boolean;
    busy?: boolean;
    empty?: boolean;
  } = $props();
  const port = new MemoryAgentPort();
  port.fault = untrack(() => fault);
  port.snapshot.busy = untrack(() => busy);
  if (untrack(() => empty)) {
    port.snapshot.sessions = [];
    port.snapshot.imports = [];
    port.snapshot.catalog = [];
  }
  if (untrack(() => requests))
    port.snapshot.requests = [
      {
        id: "approval-1",
        kind: "approval",
        title: "Allow editing src/settings.ts?",
        details: "The host requests approval for this exact file edit.",
        options: [
          { id: "allow-once", label: "Allow once" },
          { id: "deny", label: "Deny" },
        ],
      },
      {
        id: "question-1",
        kind: "question",
        title: "Which behavior should be retained?",
        details: "Choose an advertised answer or provide context.",
        options: [
          { id: "keep", label: "Keep current" },
          { id: "change", label: "Use new behavior" },
        ],
      },
    ];
  const controller = new AgentUiController(
    port,
    structuredClone(port.snapshot),
  );
  controller.screen = untrack(() => screen);
  const imports = memoryAgentImports(controller);
  void imports.load();
  onDestroy(() => {
    void controller.close();
    void imports.close();
  });
</script>

<div class="agent-demo">
  <AgentWorkbench {controller} {imports} />
</div>

<style>
  .agent-demo {
    height: 100dvh;
    min-width: 0;
    min-height: 0;
  }
</style>

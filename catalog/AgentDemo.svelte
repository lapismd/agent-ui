<script lang="ts">
  import { onDestroy, untrack } from "svelte";
  import { AgentWorkbench } from "../packages/agent-ui/src/screens/index.js";
  import {
    createDemo,
    type AgentScenario,
  } from "./agents/support/create-demo.svelte.js";
  import type { AgentScreen } from "../packages/agent-ui/src/core/models.js";
  import { memoryAgentImports } from "./support/agent-imports.svelte.js";
  let {
    screen = "chat",
    scenario = "default",
    fault = "none",
    requests = false,
    busy = false,
    empty = false,
  }: {
    screen?: AgentScreen;
    scenario?: AgentScenario;
    fault?: "none" | "unknown" | "failed";
    requests?: boolean;
    busy?: boolean;
    empty?: boolean;
  } = $props();
  const demo = untrack(() => createDemo(scenario));
  const { port, controller } = demo;
  if (untrack(() => fault !== "none")) port.fault = untrack(() => fault);
  if (untrack(() => busy)) port.snapshot.busy = true;
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
  controller.snapshot = structuredClone(port.snapshot);
  controller.screen = untrack(() => screen);
  const imports = memoryAgentImports(controller);
  void imports.load();
  onDestroy(() => {
    void demo.close();
    void imports.close();
  });
</script>

<div class="agent-demo">
  <AgentWorkbench {controller} {imports} transcriptOptions={demo.options} />
</div>

<style>
  .agent-demo {
    height: var(--ui-agent-story-height, 100dvh);
    min-width: 0;
    min-height: 0;
  }
</style>

<script lang="ts">
  import {
    permissionRequest,
    questionRequest,
  } from "./agents/requests/data.js";
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
    requestVariant = "basic",
    questionVariant = "basic",
    view = "document",
    busy = false,
    empty = false,
  }: {
    screen?: AgentScreen;
    scenario?: AgentScenario;
    fault?: "none" | "unknown" | "failed";
    requests?: boolean;
    requestVariant?: string;
    questionVariant?: string;
    view?: "document" | "classic";
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
  if (untrack(() => requests)) {
    const approval = permissionRequest(untrack(() => requestVariant));
    const question = questionRequest(untrack(() => questionVariant));
    port.snapshot.requests = [
      {
        id: approval.id,
        kind: "approval",
        title: approval.title,
        details: "Captured permission request",
        options: approval.options,
        approval,
      },
      {
        id: question.id,
        kind: "question",
        title: question.title,
        details: "Captured question",
        options: [],
        question,
      },
    ];
  }
  controller.view = untrack(() => view);
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

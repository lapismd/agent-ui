<script lang="ts">
  import {
    permissionRequest,
    questionRequest,
  } from "./agents/requests/data.js";
  import { onDestroy, onMount, untrack } from "svelte";
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
    streaming = false,
    draft,
    restrictedControls = false,
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
    streaming?: boolean;
    draft?: string;
    restrictedControls?: boolean;
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
  if (untrack(() => restrictedControls))
    port.snapshot.chat = {
      ...port.snapshot.chat,
      scope: "Repository",
      scopes: ["Repository"],
      files: [],
      controls: { attachments: false, approvalPolicy: false, runtime: false },
    };
  controller.view = untrack(() => view);
  controller.snapshot = structuredClone(port.snapshot);
  if (untrack(() => draft !== undefined))
    controller.transcript.message = untrack(() => draft!);
  let streamTicks = $state(0);
  const requestCalls = $derived.by(() => {
    void controller.snapshot;
    void controller.actionBusy;
    return port.calls.length;
  });
  onMount(() => {
    if (!streaming) return;
    port.snapshot.busy = true;
    const session = port.snapshot.sessions[0];
    session.items = [
      ...session.items,
      ...Array.from({ length: 12 }, (_, index) => ({
        id: `streaming-permission-${index}`,
        kind: "message" as const,
        role: "assistant" as const,
        label: "Streaming review",
        blocks: [
          {
            id: `streaming-permission-${index}/body`,
            revision: "0",
            kind: "markdown" as const,
            label: "Streaming review",
            text: `Review section ${index + 1}\n\n${"Captured review content continues while permission awaits a decision.\n\n".repeat(4)}`,
          },
        ],
      })),
    ];
    controller.snapshot = structuredClone(port.snapshot);
    const timer = setInterval(() => {
      if (streamTicks >= 16) {
        clearInterval(timer);
        return;
      }
      streamTicks++;
      const item = session.items.at(-1)!;
      item.blocks = [
        {
          ...item.blocks[0],
          revision: String(streamTicks),
          text: item.blocks[0].text + "\n\nMore captured review output.",
        },
      ];
      controller.snapshot = structuredClone(port.snapshot);
    }, 350);
    return () => clearInterval(timer);
  });
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
  {#if requests}<output
      hidden
      data-testid="request-story-state"
      data-calls={requestCalls}
    ></output>{/if}
  {#if streaming}<output
      hidden
      data-testid="permission-stream-state"
      data-ticks={streamTicks}
    ></output>{/if}
</div>

<style>
  .agent-demo {
    height: var(--ui-agent-story-height, 100dvh);
    min-width: 0;
    min-height: 0;
  }
</style>

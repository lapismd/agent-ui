<script lang="ts">
  import { onDestroy, onMount, untrack, type Snippet } from "svelte";
  import AgentTranscript from "./AgentTranscript.svelte";
  import AgentChatScreen from "../chat-screen/AgentChatScreen.svelte";
  import Footer from "../transcript-footer/AiTranscriptFooter.svelte";
  import Composer from "../message-composer/ChatMessageComposer.svelte";
  import Drawer from "../composer-drawer/ChatComposerDrawer.svelte";
  import Hint from "../transcript-send-hint/AiTranscriptSendHint.svelte";
  import * as Tooltip from "@lapismd/design-core/shadcn/tooltip";
  import Inspector from "../transcript-tool-inspector/AiTranscriptToolInspector.svelte";
  import Frame from "../../sessions/session-frame/AiSessionFrame.svelte";
  import Thread from "../../sessions/session-thread/AiSessionThread.svelte";
  import Toggle from "../../sessions/transcript-view-toggle/TranscriptViewToggle.svelte";
  import {
    createDemo,
    type AgentScenario,
  } from "../../../../../catalog/agents/support/create-demo.svelte.js";
  import type { TranscriptTool } from "@lapismd/design-core/chat";
  import "../panel.css";
  let {
    scenario = "default",
    part = "body",
    view = "document",
    styled = false,
  }: {
    scenario?: AgentScenario;
    part?:
      | "body"
      | "screen"
      | "composer"
      | "footer"
      | "drawer"
      | "inspector"
      | "hint";
    view?: "document" | "classic";
    styled?: boolean;
  } = $props();
  const demo = untrack(() => createDemo(scenario));
  const { controller, panel, port } = demo;
  controller.view = untrack(() => view);
  let documentActions = $state<Snippet>();
  let tool = $state<TranscriptTool>();
  let opener = $state<HTMLElement>();
  let height = $state(0);
  const evidence = $derived.by(() => {
    void controller.snapshot;
    void controller.pending;
    void controller.actionBusy;
    return {
      calls: port.calls.length,
      submission: JSON.stringify(port.calls.at(-1)?.submission),
    };
  });
  const send = () => void controller.transcript.send();
  onDestroy(() => void demo.close());
  onMount(() => {
    if (scenario !== "streaming") return;
    let count = 0;
    const timer = setInterval(() => {
      if (!controller.busy || count >= 4) return;
      const text = "Streaming captured output" + ".".repeat(++count);
      controller.snapshot!.sessions[0].items = [
        {
          id: "stream",
          kind: "message",
          role: "assistant",
          label: "Streaming response",
          blocks: [
            {
              id: "stream/body",
              revision: `stream-${count}`,
              kind: "markdown",
              label: "Streaming response",
              text,
            },
          ],
        },
      ];
      port.snapshot.sessions[0].items = [
        {
          id: "stream",
          kind: "message",
          role: "assistant",
          label: "Streaming response",
          blocks: [
            {
              id: "stream/body",
              revision: `stream-${count}`,
              kind: "markdown",
              label: "Streaming response",
              text,
            },
          ],
        },
      ];
    }, 180);
    return () => clearInterval(timer);
  });
</script>

{#snippet footer()}
  <Footer
    {panel}
    state={controller.transcript}
    blocked={controller.loading || !!controller.pending}
    {documentActions}
    onSend={send}
  />
{/snippet}
{#snippet inspector()}
  {#if tool && opener}<Inspector
      {tool}
      state={controller.transcript}
      {opener}
      onClose={() => (tool = undefined)}
      customBlock={undefined}
    />{/if}
{/snippet}
<Tooltip.Provider
  ><div
    class:compact={["composer", "footer", "drawer", "hint"].includes(part)}
    data-ui-component="ai-chat-panel"
    class="foundation-host"
    style={styled
      ? "--ui-transcript-font-size:1rem;--ui-transcript-max-width:46rem;--ui-agent-footer-controls-gap:0.5rem"
      : undefined}
  >
    {#if part === "screen"}<AgentChatScreen {controller} />
    {:else if part === "drawer"}
      <Drawer
        controller={panel.controller}
        actions={panel.actions}
        attachmentsState={panel.attachmentsState}
        presentation={view === "document" ? "document" : "framed"}
      />
    {:else if part === "hint"}
      <Hint {panel} error={controller.error} />
    {:else if part === "inspector"}
      <Frame label="Tool inspector foundation" toolInspector={inspector}>
        <button
          type="button"
          bind:this={opener}
          onclick={() => {
            tool = controller.items.flatMap((item) => item.tools ?? [])[0];
          }}>Inspect captured tool</button
        >
      </Frame>
    {:else if part === "composer" || part === "footer"}
      <div class="composer-host">
        <Composer
          bind:value={controller.transcript.message}
          bind:documentActions
          view={controller.view}
          onSend={send}
          disabled={controller.loading || !!controller.pending}
        />
        {#if part === "footer"}{@render footer()}{/if}
      </div>
    {:else}
      <Frame
        label="Agent transcript foundation"
        bind:height
        toolInspector={inspector}
      >
        <Thread
          {height}
          title="Agent transcript"
          status="Immutable captured conversation"
          selected
          listLabel="Conversations"
          {footer}
        >
          {#snippet actions()}<Toggle bind:view={controller.view} />{/snippet}
          <AgentTranscript
            {controller}
            {panel}
            bind:documentActions
            onInspectTool={(next, element) => {
              tool = next;
              opener = element;
            }}
          />
        </Thread>
      </Frame>
    {/if}
    <output
      hidden
      data-testid="agent-story-state"
      data-pending={controller.pending?.id ?? ""}
      data-calls={evidence.calls}
      data-draft={controller.transcript.message}
      data-submission={evidence.submission}
      data-anchors={JSON.stringify(
        controller.transcript.threads.map((thread) => thread.anchor),
      )}
    ></output>
  </div></Tooltip.Provider
>

<style>
  .foundation-host {
    height: var(--ui-agent-story-height, 100dvh);
    min-width: 0;
    min-height: 0;
  }
  .foundation-host.compact {
    height: auto;
  }
  .composer-host {
    margin-block: auto;
    padding: 1rem;
    width: 100%;
  }
</style>

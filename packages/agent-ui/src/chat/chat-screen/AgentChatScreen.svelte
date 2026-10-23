<!-- SPDX-License-Identifier: Apache-2.0; copied Desktop frame/transcript composition, with host-owned controller ports. -->
<script lang="ts">
  import { type Snippet } from "svelte";
  import ChangesButton from "../turn-changes/AiChangesButton.svelte";
  import ChangesRail from "../turn-changes/AiHistoryRail.svelte";
  import ChangesFile from "../turn-changes/AiHistoryFile.svelte";
  import ChangesDialogs from "../turn-changes/AiHistoryDialogs.svelte";
  import AgentTranscript from "../transcript/AgentTranscript.svelte";
  import type { TranscriptPanelProps } from "../presentation.js";
  import type { AgentTranscriptOptions } from "../transcript-options.js";
  import { AppShell } from "@lapismd/design-core/shell";
  import * as DropdownMenu from "@lapismd/design-core/shadcn/dropdown-menu";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import PlusIcon from "@lucide/svelte/icons/plus";
  import ArchiveIcon from "@lucide/svelte/icons/archive";
  import HistoryIcon from "@lucide/svelte/icons/history";
  import type { AgentUiController } from "../../core/controller.svelte.js";
  import AiChatSession from "../../sessions/chat-session/AiChatSession.svelte";
  import AiTranscriptToolInspector from "../transcript-tool-inspector/AiTranscriptToolInspector.svelte";
  import AiTranscriptFooter from "../transcript-footer/AiTranscriptFooter.svelte";
  import ChatConversationMenu from "../conversation-menu/ChatConversationMenu.svelte";
  import { createChatPresentation } from "../presentation-adapter.svelte.js";
  import { agentAvatar } from "../../identity/agent-avatar.js";
  import "../panel.css";
  let {
    controller,
    repositoryInspector,
    headerActions,
    transcriptOptions,
    presentation,
    conversationMenu,
  }: {
    controller: AgentUiController;
    repositoryInspector?: Snippet;
    headerActions?: Snippet;
    transcriptOptions?: AgentTranscriptOptions;
    presentation?: TranscriptPanelProps;
    conversationMenu?: Snippet;
  } = $props();
  const changes = $derived(transcriptOptions?.changes);
  const fallback = createChatPresentation(() => controller);
  const panel = $derived(presentation ?? fallback);
  let documentActions = $state<Snippet>();
  let opener = $state<HTMLElement>();
  const inspected = $derived(
    controller.items
      .flatMap((item) => item.tools ?? [])
      .find((tool) => tool.id === controller.inspector),
  );
  const items = $derived(
    (controller.snapshot?.sessions ?? []).map((session) => ({
      id: session.id,
      title: session.title,
      profile: session.profile ?? "Local chat",
      group: session.scope || "Vault root",
      path: session.path,
      updatedAt: session.updatedAt,
      harness: session.agent.toLowerCase(),
      status: session.status === "archived" ? "Archived" : undefined,
    })),
  );
  const avatars = $derived(
    (controller.recipients.length
      ? controller.recipients
      : [controller.selectedAgent]
    ).map((id) => ({
      id,
      name:
        controller.snapshot?.agents.find((agent) => agent.id === id)?.name ??
        id,
      src: agentAvatar(id),
      shape: "rounded" as const,
    })),
  );
  async function create() {
    const result = await controller.action("new_session");
    if (result?.status === "acknowledged")
      controller.selectSession(result.snapshot.sessions[0]?.id ?? "");
  }
  const send = () => {
    controller.transcript.message = panel.composerState.draft;
    return controller.transcript.send();
  };
</script>

{#snippet composerFooter()}
  <AiTranscriptFooter
    {panel}
    state={controller.transcript}
    blocked={controller.loading || !!controller.pending}
    {documentActions}
    onSend={send}
  />
{/snippet}

{#snippet toolInspector()}
  {#if inspected && opener}<AiTranscriptToolInspector
      tool={inspected}
      state={controller.transcript}
      {opener}
      onClose={() => (controller.inspector = "")}
      customBlock={transcriptOptions?.customBlock}
    />{/if}
{/snippet}
{#snippet bodySidebar(height: number, compact: boolean)}
  {#if changes}<ChangesRail
      inspection={changes}
      busy={controller.busy}
      {height}
      {compact}
    />{/if}
  {#if repositoryInspector}<AppShell.Body.Sidebar
      side="right"
      label="Repository context"
      open={controller.inspector === "repository"}
      style={`--ui-shell-body-sidebar-width:${compact ? "100%" : "20rem"};height:${height}px`}
    >
      {@render repositoryInspector()}
    </AppShell.Body.Sidebar>{/if}
{/snippet}
{#snippet savedFile()}{#if changes}<ChangesFile
      inspection={changes}
      busy={controller.busy}
    />{/if}{/snippet}
<div data-ui-component="ai-chat-panel">
  <div
    class="transcript-panel"
    data-testid="ai-transcript-panel"
    data-framed="true"
  >
    <AiChatSession
      {items}
      activeId={controller.sessionId}
      title={controller.session?.title ?? "New conversation"}
      status={`${controller.snapshot?.agents.find((agent) => agent.id === controller.selectedAgent)?.name ?? "Agent"} · ${panel.composerState.selectedModel || "Automatic model"} · ${panel.conversationsState.scopePathLabel}`}
      harness={controller.selectedAgent}
      {avatars}
      busy={controller.busy}
      loading={controller.loading}
      bind:view={controller.view}
      onSelect={(id) => controller.selectSession(id)}
      onCreate={() => void create()}
      footer={composerFooter}
      {toolInspector}
      {bodySidebar}
      bodySidebarOpen={!!changes?.open || controller.inspector === "repository"}
      mainInspector={changes?.path ? savedFile : undefined}
    >
      {#snippet headerActions()}{#if changes}<ChangesButton
            inspection={changes}
          />{/if}{@render headerActions?.()}{/snippet}
      {#snippet menu()}{#if conversationMenu}{@render conversationMenu()}{:else}<ChatConversationMenu
          >
            <DropdownMenu.Group>
              <DropdownMenu.Item onclick={() => (controller.screen = "history")}
                ><HistoryIcon data-icon="inline-start" aria-hidden="true" />AI
                conversations</DropdownMenu.Item
              >
              <DropdownMenu.Item
                disabled={!controller.can("archive")}
                onclick={() =>
                  void controller.action("archive", controller.sessionId)}
                ><ArchiveIcon
                  data-icon="inline-start"
                  aria-hidden="true"
                />{controller.session?.status === "archived"
                  ? "Restore Chat"
                  : "Archive Chat"}</DropdownMenu.Item
              >
              <DropdownMenu.Item
                disabled={!controller.can("new_session")}
                onclick={() => void create()}
                ><PlusIcon data-icon="inline-start" aria-hidden="true" />New
                Chat</DropdownMenu.Item
              >
            </DropdownMenu.Group>
          </ChatConversationMenu>{/if}{/snippet}
      <AgentTranscript
        {controller}
        {panel}
        bind:documentActions
        options={transcriptOptions}
        onInspectTool={(tool, element) => {
          controller.inspector = tool.id;
          opener = element;
        }}
      />
    </AiChatSession>
  </div>
</div>

{#if changes}<ChangesDialogs
    inspection={changes}
    history={changes.history}
  />{/if}

<style>
  .transcript-panel {
    box-sizing: border-box;
    padding-block-end: var(--ui-ai-chat-bottom-clearance);
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    flex: 1;
    height: 100%;
  }
  .transcript-panel[data-framed="true"] {
    padding-block-end: 0;
    background: var(--sidebar, var(--muted));
    --ui-transcript-body-footer-border: 0;
  }
</style>

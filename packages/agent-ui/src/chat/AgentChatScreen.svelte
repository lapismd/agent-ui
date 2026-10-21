<!-- SPDX-License-Identifier: Apache-2.0; copied Desktop frame/transcript composition, with host-owned controller ports. -->
<script lang="ts">
  import { type Snippet } from "svelte";
  import { AppShell } from "@lapismd/design-core/shell";
  import { Transcript, MessageQueue } from "@lapismd/design-core/chat";
  import * as DropdownMenu from "@lapismd/design-core/shadcn/dropdown-menu";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import PlusIcon from "@lucide/svelte/icons/plus";
  import ArchiveIcon from "@lucide/svelte/icons/archive";
  import HistoryIcon from "@lucide/svelte/icons/history";
  import type { AgentUiController } from "../core/controller.svelte.js";
  import AiChatSession from "../sessions/AiChatSession.svelte";
  import AiTranscriptToolInspector from "./AiTranscriptToolInspector.svelte";
  import AiTranscriptFooter from "./AiTranscriptFooter.svelte";
  import AiTranscriptSendHint from "./AiTranscriptSendHint.svelte";
  import AiTranscriptEmpty from "./AiTranscriptEmpty.svelte";
  import ChatMessageComposer from "./ChatMessageComposer.svelte";
  import ChatComposerDrawer from "./ChatComposerDrawer.svelte";
  import ChatConversationMenu from "./ChatConversationMenu.svelte";
  import { createChatPresentation } from "./presentation-adapter.svelte.js";
  import { agentAvatar } from "../identity/agent-avatar.js";
  import "./panel.css";
  let {
    controller,
    repositoryInspector,
    headerActions,
  }: {
    controller: AgentUiController;
    repositoryInspector?: Snippet;
    headerActions?: Snippet;
  } = $props();
  const panel = createChatPresentation(() => controller);
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
      profile: "Local chat",
      group: "Vault root",
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
  const send = () => void controller.transcript.send();
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
{#snippet attachmentsDrawer()}
  <ChatComposerDrawer
    controller={panel.controller}
    actions={panel.actions}
    attachmentsState={panel.attachmentsState}
  />
{/snippet}
{#snippet toolInspector()}
  {#if inspected && opener}<AiTranscriptToolInspector
      tool={inspected}
      state={controller.transcript}
      {opener}
      onClose={() => (controller.inspector = "")}
      customBlock={undefined}
    />{/if}
{/snippet}
{#snippet bodySidebar(height: number, compact: boolean)}
  {#if repositoryInspector}<AppShell.Body.Sidebar
      side="right"
      label="Repository context"
      open={controller.inspector === "repository"}
      style={`--ui-shell-body-sidebar-width:${compact ? "100%" : "20rem"};height:${height}px`}
    >
      {@render repositoryInspector()}
    </AppShell.Body.Sidebar>{/if}
{/snippet}
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
      bodySidebarOpen={controller.inspector === "repository"}
    >
      {#snippet headerActions()}{@render headerActions?.()}{/snippet}
      {#snippet menu()}<ChatConversationMenu>
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
              ><PlusIcon data-icon="inline-start" aria-hidden="true" />New Chat</DropdownMenu.Item
            >
          </DropdownMenu.Group>
        </ChatConversationMenu>{/snippet}
      <Transcript
        items={controller.items}
        view={controller.view}
        scrollButton
        busy={controller.busy}
        classicComposerPlacement="fixed"
        label="AI conversation"
        logLabel="AI conversation messages"
        loading={controller.loading}
        commentState={controller.transcript}
        canComment={!controller.loading}
        reactionsDisabled
        authorPopover={{ interaction: "hover" }}
        onInspectTool={(tool, element) => {
          controller.inspector = tool.id;
          opener = element;
        }}
      >
        {#snippet emptyState()}<AiTranscriptEmpty />{/snippet}
        {#snippet queuedMessages()}<MessageQueue
            entries={controller.snapshot?.queued ?? []}
            onCancel={(entry) =>
              void controller.action("cancel_queued", entry.id)}
          />{/snippet}
        {#snippet composer(view)}
          <ChatMessageComposer
            bind:value={controller.transcript.message}
            bind:documentActions
            {view}
            disabled={!!controller.pending}
            showHint={false}
            onSend={send}
            framedDrawer={view === "classic" &&
              (controller.attachments.length > 0 ||
                !!panel.attachmentsState.pendingInteraction)}
            drawer={attachmentsDrawer}
          >
            {#snippet before()}{#if view === "document"}<ChatComposerDrawer
                  controller={panel.controller}
                  actions={panel.actions}
                  attachmentsState={panel.attachmentsState}
                  presentation="document"
                />{/if}{/snippet}
          </ChatMessageComposer>
        {/snippet}
        {#snippet footer()}<AiTranscriptSendHint
            {panel}
            error={controller.error || controller.transcript.error}
          />{/snippet}
      </Transcript>
    </AiChatSession>
  </div>
</div>

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

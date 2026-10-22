<!-- SPDX-License-Identifier: Apache-2.0; the production transcript composition shared by stories and complete screens. -->
<script lang="ts">
  import type { Snippet } from "svelte";
  import {
    Transcript,
    MessageQueue,
    type TranscriptProps,
  } from "@lapismd/design-core/chat";
  import type { AgentUiController } from "../../core/controller.svelte.js";
  import type { TranscriptPanelProps } from "../presentation.js";
  import type { AgentTranscriptOptions } from "../transcript-options.js";
  import AiTranscriptEmpty from "../transcript-empty/AiTranscriptEmpty.svelte";
  import AiTranscriptSendHint from "../transcript-send-hint/AiTranscriptSendHint.svelte";
  import ChatMessageComposer from "../message-composer/ChatMessageComposer.svelte";
  import ChatComposerDrawer from "../composer-drawer/ChatComposerDrawer.svelte";
  let {
    controller,
    panel,
    documentActions = $bindable(),
    onInspectTool,
    options = {},
  }: {
    controller: AgentUiController;
    panel: TranscriptPanelProps;
    documentActions?: Snippet;
    onInspectTool?: TranscriptProps["onInspectTool"];
    options?: AgentTranscriptOptions;
  } = $props();
  const send = () => void controller.transcript.send();
</script>

{#snippet attachmentsDrawer()}
  <ChatComposerDrawer
    controller={panel.controller}
    actions={panel.actions}
    attachmentsState={panel.attachmentsState}
  />
{/snippet}
<Transcript
  {...options}
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
  reactionsDisabled={options.reactionsDisabled ?? true}
  authorPopover={options.authorPopover ?? { interaction: "hover" }}
  {onInspectTool}
>
  {#snippet emptyState()}<AiTranscriptEmpty />{/snippet}
  {#snippet queuedMessages()}<MessageQueue
      entries={controller.snapshot?.queued ?? []}
      onCancel={(entry) => void controller.action("cancel_queued", entry.id)}
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

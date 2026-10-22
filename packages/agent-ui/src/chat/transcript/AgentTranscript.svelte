<!-- SPDX-License-Identifier: Apache-2.0; the production transcript composition shared by stories and complete screens. -->
<script lang="ts">
  import { Spinner } from "@lapismd/design-core/shadcn/spinner";
  import AgentTranscriptBlock from "./AgentTranscriptBlock.svelte";
  import AgentMessageMetadata from "../message-metadata/AgentMessageMetadata.svelte";
  import { historyTranscript } from "../turn-changes/transcript.js";
  import { requestTranscript } from "../request-transcript.js";
  import type { Snippet } from "svelte";
  import {
    Transcript,
    MessageQueue,
    type TranscriptProps,
    chatReferenceDecorations,
    chatReferenceTriggers,
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
  const requestResults = $derived.by(() => {
    const results = { ...controller.snapshot?.requestResults };
    for (const [id, presentation] of Object.entries(options.blocks ?? {}))
      if (presentation.kind === "request") results[id] = presentation.result;
    if (controller.pending?.kind === "respond") {
      const request = controller.interaction;
      const unresolved =
        request?.approval?.id ?? request?.question?.id ?? request?.id;
      for (const [id, result] of Object.entries(results))
        if (result.request.id === unresolved) delete results[id];
    }
    return results;
  });
  const items = $derived(
    requestTranscript(
      historyTranscript(
        controller.items.map((item) => ({
          ...item,
          icon: options.icons?.[item.id] ?? item.icon,
          tools: item.tools?.map((tool) => ({
            ...tool,
            icon: options.icons?.[tool.id] ?? tool.icon,
          })),
        })),
        options.changes?.history.records ?? [],
      ),
      requestResults,
    ),
  );
  const send = () => void controller.transcript.send();
  const references = $derived(options.composer?.references);
  const markdown = $derived({
    ...options.markdown,
    references: options.markdown?.references ?? references,
  });
  const footerError = $derived.by(() => {
    const failure =
      controller.view === "document" ? controller.sendFailure : undefined;
    return [controller.error, controller.transcript.error].find(
      (message) => message && message !== failure?.reason,
    );
  });
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
  {markdown}
  commentComposer={{
    references,
    triggers: [
      ...(references
        ? chatReferenceTriggers(
            options.composer?.referenceSources ?? [],
            references,
          )
        : []),
      ...(options.composer?.triggers ?? []),
    ],
    ...options.commentComposer,
  }}
  inlineReferences={(block) => [
    ...(references ? chatReferenceDecorations(block.text, references) : []),
    ...(options.inlineReferences?.(block) ?? []),
  ]}
  {items}
  view={controller.view}
  scrollButton
  busy={controller.busy}
  classicComposerPlacement="fixed"
  label="AI conversation"
  logLabel="AI conversation messages"
  loading={controller.loading}
  commentState={controller.transcript}
  canComment={controller.canComment}
  reactionsDisabled={options.reactionsDisabled ?? true}
  authorPopover={options.authorPopover ?? { interaction: "hover" }}
  {onInspectTool}
>
  {#snippet customBlock(block)}<AgentTranscriptBlock
      {block}
      {options}
      result={requestResults[block.id]}
      busy={controller.busy}
    />{/snippet}
  {#snippet metadataSupplement(item)}<AgentMessageMetadata
      {item}
      {options}
      busy={controller.busy || controller.loading}
    />{@render options.metadataSupplement?.(item)}{/snippet}
  {#snippet afterItems()}{@render options.afterItems?.()}{#if controller.busy && options.workingLabel}<div
        class="transcript-activity"
        role="status"
      >
        <Spinner /><span>{options.workingLabel}</span>
      </div>{/if}{/snippet}
  {#snippet emptyState()}<AiTranscriptEmpty />{/snippet}
  {#snippet queuedMessages()}<MessageQueue
      entries={controller.snapshot?.queued ?? []}
      onCancel={(entry) => void controller.action("cancel_queued", entry.id)}
    />{/snippet}
  {#snippet composer(view)}
    <ChatMessageComposer
      {...options.composer}
      bind:value={controller.transcript.message}
      bind:documentActions
      {view}
      disabled={!!controller.pending}
      showHint={false}
      onSend={send}
      status={options.composerStatus}
      statusPosition={options.composerStatusPosition}
      sendError={controller.draftSendError}
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
      error={footerError}
    />{/snippet}
</Transcript>

<style>
  .transcript-activity {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8125rem;
    color: var(--muted-foreground);
  }
</style>

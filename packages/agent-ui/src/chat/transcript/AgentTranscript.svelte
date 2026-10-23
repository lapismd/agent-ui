<!-- SPDX-License-Identifier: Apache-2.0; the production transcript composition shared by stories and complete screens. -->
<script lang="ts">
  import { Spinner } from "@lapismd/design-core/shadcn/spinner";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import AgentTranscriptBlock from "./AgentTranscriptBlock.svelte";
  import AgentMessageMetadata from "../message-metadata/AgentMessageMetadata.svelte";
  import { historyTranscript } from "../turn-changes/transcript.js";
  import { requestTranscript } from "../request-transcript.js";
  import { composerFeedback } from "../composer-feedback.js";
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
  const send = () => {
    controller.transcript.message = panel.composerState.draft;
    return controller.transcript.send();
  };
  const references = $derived(options.composer?.references);
  const markdown = $derived({
    ...options.markdown,
    references: options.markdown?.references ?? references,
  });
  const permission = $derived(
    panel.attachmentsState.pendingInteraction?.type === "approval" &&
      !options.queueWhileAwaitingApproval,
  );
  const feedback = $derived(
    composerFeedback(
      panel.composerState.composerStatus,
      options.composer?.status,
      options.composerStatus,
    ),
  );
</script>

{#snippet attachmentsDrawer()}
  <ChatComposerDrawer
    controller={panel.controller}
    actions={panel.actions}
    attachmentsState={panel.attachmentsState}
  />
{/snippet}
{#snippet chatComposer(view: "document" | "classic")}
  <ChatMessageComposer
    {...options.composer}
    bind:value={panel.composerState.draft}
    bind:documentActions
    {view}
    disabled={controller.loading ||
      !!panel.panelProps.initializing ||
      !!controller.pending}
    showHint={false}
    onSend={send}
    status={feedback}
    statusPosition={options.composer?.statusPosition ??
      options.composerStatusPosition ??
      "bottom"}
    framedDrawer={view === "classic" &&
      (panel.attachmentsState.attachments.length > 0 ||
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
  composer={permission ? undefined : chatComposer}
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
    />
    {#if controller.snapshot?.queued.length && controller.snapshot.queueState}
      <div class="request-recovery">
        <Button
          variant="ghost"
          size="xs"
          disabled={controller.snapshot.queueState.saving ||
            controller.snapshot.queueState.resuming}
          onclick={() =>
            void controller.action(
              controller.snapshot?.queueState?.paused
                ? "resume_queue"
                : "pause_queue",
            )}
          >{controller.snapshot.queueState.paused
            ? "Resume queue"
            : "Pause queue"}</Button
        >
      </div>
    {/if}{/snippet}
  {#snippet footer()}{#if permission}<div class="permission-dock">
        <ChatComposerDrawer
          controller={panel.controller}
          actions={panel.actions}
          attachmentsState={panel.attachmentsState}
          presentation="request"
          status={feedback}
        />
      </div>{:else}<AiTranscriptSendHint />{/if}
    {#if controller.pending?.kind === "respond"}<div class="request-recovery">
        <Button
          variant="outline"
          size="sm"
          disabled={controller.actionBusy}
          onclick={() => void controller.checkStatus()}
          >Check original response</Button
        >
      </div>{/if}
  {/snippet}
</Transcript>

<style>
  .request-recovery {
    display: flex;
    justify-content: flex-end;
    padding: 0.25rem 0.5rem;
  }
  .permission-dock {
    box-sizing: border-box;
    width: 100%;
    max-width: var(
      --ui-agent-permission-dock-max-width,
      var(--ui-transcript-max-width, 62rem)
    );
    margin-inline: auto;
    padding: var(
      --ui-agent-permission-dock-padding,
      0.5rem 2.75rem 0.5rem 1rem
    );
  }

  .transcript-activity {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8125rem;
    color: var(--muted-foreground);
  }
</style>

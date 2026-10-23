<script lang="ts">
  import type { Snippet } from "svelte";
  import {
    TranscriptFooter,
    type TranscriptController,
  } from "@lapismd/design-core/chat";
  import type { TranscriptPanelProps } from "../presentation.js";
  import ChatComposerActions from "../composer-actions/ChatComposerActions.svelte";
  import ChatComposerOptions from "../composer-options/ChatComposerOptions.svelte";
  import ChatAgentPicker from "../agent-picker/ChatAgentPicker.svelte";
  import ChatScopeFooter from "../scope-footer/ChatScopeFooter.svelte";
  import ChatContextUsage from "../context-usage/ChatContextUsage.svelte";
  let {
    panel,
    state,
    blocked,
    queueWhileAwaitingApproval = false,
    documentActions,
    onSend,
  }: {
    panel: TranscriptPanelProps;
    state: TranscriptController;
    blocked: boolean;
    queueWhileAwaitingApproval?: boolean;
    documentActions?: Snippet;
    onSend: () => void;
  } = $props();
  const {
    panelProps,
    controller,
    composerState,
    attachmentsState,
    conversationsState,
  } = $derived(panel);
  const permissionRequested = $derived(
    attachmentsState.pendingInteraction?.type === "approval" &&
      !queueWhileAwaitingApproval,
  );
</script>

<TranscriptFooter
  style="--ui-transcript-footer-padding:var(--ui-agent-footer-padding,0);--ui-transcript-footer-gap:var(--ui-agent-footer-gap,0.25rem)"
  busy={controller.busy || !!controller.queuedMessages.pending.length}
  {state}
  sendPending={state.sending ||
    !!state.retainedSubmission ||
    controller.queuedMessages.saving}
  hasContent={!permissionRequested &&
    (!controller.busy || !!controller.repository) &&
    Boolean(composerState.draft.trim() || state.pending.length)}
  canSend={!permissionRequested &&
    !controller.queuedMessages.saving &&
    Boolean(composerState.draft.trim() || state.pending.length)}
  disabled={blocked}
  {onSend}
  onStop={controller.busy
    ? () => panel.actions.perform(() => controller.cancel())
    : undefined}
  showStatus={false}
>
  {#snippet actions()}
    <ChatComposerActions
      {panelProps}
      {controller}
      {attachmentsState}
      {composerState}
      actions={panel.actions}
    />
    {@render documentActions?.()}
  {/snippet}

  {#snippet controls()}
    <div class="transcript-controls">
      <ChatAgentPicker {panel} />
      {#if panelProps.transcriptFrame}<ChatContextUsage
          {controller}
          {composerState}
          actions={panel.actions}
          variant="ring"
        />{/if}
      <ChatComposerOptions {panelProps} {composerState} />
    </div>
  {/snippet}
  {#snippet workspace()}<ChatScopeFooter
      inline
      {panelProps}
      {controller}
      {conversationsState}
      actions={panel.actions}
    />{/snippet}
</TranscriptFooter>

<style>
  .transcript-controls {
    gap: var(--ui-agent-footer-controls-gap, 0.25rem);
    display: flex;
    align-items: center;
  }
</style>

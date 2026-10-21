<script lang="ts">
  import {
    ComposerStatusBanner,
    type ComposerStatus,
  } from "@lapismd/design-core/chat";
  import type { TranscriptPanelProps } from "./presentation.js";
  let {
    panel,
    error,
  }: { panel: TranscriptPanelProps; error?: string | null | undefined } =
    $props();
  const { composerState } = $derived(panel);
  const status = $derived<ComposerStatus | undefined>(
    composerState.composerStatus ??
      (error ? { type: "error", message: error } : undefined),
  );
</script>

<div class="transcript-send-hint">
  {#if status}<ComposerStatusBanner {status} position="standalone" />{/if}
  <span>Ctrl/⌘+Enter to send</span>
</div>

<style>
  .transcript-send-hint {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    gap: 0.25rem;
    min-height: 1.5rem;
    padding: 0.25rem 0.5rem;
    color: var(--muted-foreground);
    font-size: 0.6875rem;
    line-height: 1rem;
    --ui-composer-status-radius: var(--radius);
  }
  .transcript-send-hint > span {
    padding-inline: 0.5rem;
  }
</style>

<script lang="ts">
  import { untrack } from "svelte";
  import AiHistoryPanel from "../../history/history-panel/AiHistoryPanel.svelte";
  import {
    HistoryController,
    type HistoryState,
  } from "../../history/controller.svelte.js";
  import type { AgentUiController } from "../../core/controller.svelte.js";
  let {
    controller,
    history,
  }: { controller?: AgentUiController; history?: HistoryState } = $props();
  const fallback = untrack(() =>
    controller ? new HistoryController(() => controller!) : undefined,
  );
</script>

{#if history ?? fallback}<AiHistoryPanel
    history={(history ?? fallback)!}
  />{/if}

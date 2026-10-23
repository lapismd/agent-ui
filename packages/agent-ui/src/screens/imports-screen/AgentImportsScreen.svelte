<script lang="ts">
  import AiImportPanel from "../../imports/import-panel/AiImportPanel.svelte";
  import CapturedSessionBrowser from "../../sessions/captured-session-browser/CapturedSessionBrowser.svelte";
  import type { ImportState } from "../../imports/controller.svelte.js";
  import { capturedGroups } from "../../core/captures.js";
  import type { AgentUiController } from "../../core/controller.svelte.js";
  let {
    controller,
    imports,
    options,
  }: {
    controller?: AgentUiController;
    imports?: ImportState;
    options?: import("../../chat/transcript-options.js").AgentTranscriptOptions;
  } = $props();
  const sessions = $derived(
    capturedGroups(controller?.snapshot?.imports ?? []),
  );
</script>

{#if controller?.screen === "recorded"}<CapturedSessionBrowser
    {sessions}
  />{:else if imports}<AiImportPanel {imports} {options} />{/if}

<script lang="ts">
  import AiImportPanel from "../../imports/import-panel/AiImportPanel.svelte";
  import CapturedSessionBrowser from "../../sessions/captured-session-browser/CapturedSessionBrowser.svelte";
  import type { ImportController } from "../../imports/controller.svelte.js";
  import { capturedGroups } from "../../core/captures.js";
  import type { AgentUiController } from "../../core/controller.svelte.js";
  let {
    controller,
    imports,
  }: { controller: AgentUiController; imports?: ImportController } = $props();
  const sessions = $derived(capturedGroups(controller.snapshot?.imports ?? []));
</script>

{#if controller.screen === "recorded"}<CapturedSessionBrowser
    {sessions}
  />{:else if imports}<AiImportPanel {imports} />{/if}

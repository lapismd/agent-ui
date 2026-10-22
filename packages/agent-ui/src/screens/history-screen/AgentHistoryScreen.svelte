<script lang="ts">
  import AiHistoryPanel from "../../history/history-panel/AiHistoryPanel.svelte";
  import { HistoryController } from "../../history/controller.svelte.js";
  import type { AgentUiController } from "../../core/controller.svelte.js";
  let { controller }: { controller: AgentUiController } = $props();
  const history = new HistoryController(() => controller);
</script>

<AiHistoryPanel {history} />

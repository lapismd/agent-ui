<!-- SPDX-License-Identifier: Apache-2.0; Desktop AiTranscriptBlock's public fallback and host-registered result boundary. -->
<script lang="ts">
  import { ToolCallDetail } from "@lapismd/design-core/chat";
  import type { Snippet } from "svelte";
  import type { AgentToolResultData } from "../../chat/transcript-options.js";
  let {
    result,
    view,
  }: { result: AgentToolResultData; view?: Snippet<[AgentToolResultData]> } =
    $props();
</script>

<div class="agent-tool-result">
  {#if view && !result.error}{@render view(result)}{:else}<ToolCallDetail
      {...result}
      toolName={result.name}
    />{/if}
</div>

<style>
  .agent-tool-result {
    min-width: 0;
    font-size: var(--ui-agent-tool-result-font-size, 0.875rem);
  }
</style>

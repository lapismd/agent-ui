<script lang="ts">
  // SPDX-License-Identifier: Apache-2.0
  // Retained Lapis chat presentation; see src/lib/ai/NOTICE.md.
  import ChatAgentOptions from "../agent-options/ChatAgentOptions.svelte";
  import type { ComposerState } from "../presentation.js";
  import type { AiChatPanelProps } from "../presentation.js";

  let {
    panelProps,
    composerState,
  }: {
    panelProps: AiChatPanelProps;
    composerState: ComposerState;
  } = $props();
  const initializing = $derived(panelProps.initializing ?? false);
  const selectRuntime = $derived(panelProps.selectRuntime);
</script>

<ChatAgentOptions
  {composerState}
  initializing={initializing || panelProps.controls?.runtime === false}
  selectRuntime={!!selectRuntime}
/>

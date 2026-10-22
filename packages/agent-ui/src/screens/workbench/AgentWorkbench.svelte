<script lang="ts">
  import type { Snippet } from "svelte";
  import type { AgentTranscriptOptions } from "../../chat/transcript-options.js";
  import type { AgentUiController } from "../../core/controller.svelte.js";
  import type { ImportController } from "../../imports/controller.svelte.js";
  import AgentChatScreen from "../../chat/chat-screen/AgentChatScreen.svelte";
  import AgentHistoryScreen from "../history-screen/AgentHistoryScreen.svelte";
  import AgentCatalogScreen from "../catalog-screen/AgentCatalogScreen.svelte";
  import AgentImportsScreen from "../imports-screen/AgentImportsScreen.svelte";
  let {
    controller,
    imports,
    repositoryInspector,
    extraActions,
    transcriptOptions,
  }: {
    controller: AgentUiController;
    imports?: ImportController;
    repositoryInspector?: Snippet;
    extraActions?: Snippet;
    transcriptOptions?: AgentTranscriptOptions;
  } = $props();
</script>

{#if controller.screen === "chat"}<AgentChatScreen
    {controller}
    {repositoryInspector}
    headerActions={extraActions}
    {transcriptOptions}
  />
{:else if controller.screen === "history"}<AgentHistoryScreen {controller} />
{:else if controller.screen === "catalog"}<AgentCatalogScreen {controller} />
{:else if controller.screen === "imports" || controller.screen === "recorded"}<AgentImportsScreen
    {controller}
    {imports}
  />
{/if}

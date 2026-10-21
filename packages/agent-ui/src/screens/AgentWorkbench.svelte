<script lang="ts">
  import type { Snippet } from "svelte";
  import type { AgentUiController } from "../core/controller.svelte.js";
  import type { ImportController } from "../imports/controller.svelte.js";
  import AgentChatScreen from "../chat/AgentChatScreen.svelte";
  import AgentHistoryScreen from "./AgentHistoryScreen.svelte";
  import AgentCatalogScreen from "./AgentCatalogScreen.svelte";
  import AgentImportsScreen from "./AgentImportsScreen.svelte";
  let {
    controller,
    imports,
    repositoryInspector,
    extraActions,
  }: {
    controller: AgentUiController;
    imports?: ImportController;
    repositoryInspector?: Snippet;
    extraActions?: Snippet;
  } = $props();
</script>

{#if controller.screen === "chat"}<AgentChatScreen
    {controller}
    {repositoryInspector}
    headerActions={extraActions}
  />
{:else if controller.screen === "history"}<AgentHistoryScreen {controller} />
{:else if controller.screen === "catalog"}<AgentCatalogScreen {controller} />
{:else if controller.screen === "imports" || controller.screen === "recorded"}<AgentImportsScreen
    {controller}
    {imports}
  />
{/if}

<script lang="ts">
  import { untrack } from "svelte";
  import AiCatalogPanel from "../../catalog/catalog-panel/AiCatalogPanel.svelte";
  import {
    CatalogController,
    type CatalogState,
  } from "../../catalog/controller.svelte.js";
  import type { AgentUiController } from "../../core/controller.svelte.js";
  let {
    controller,
    catalog,
  }: { controller?: AgentUiController; catalog?: CatalogState } = $props();
  const fallback = untrack(() =>
    controller ? new CatalogController(() => controller!) : undefined,
  );
</script>

{#if catalog ?? fallback}<AiCatalogPanel
    catalog={(catalog ?? fallback)!}
  />{/if}

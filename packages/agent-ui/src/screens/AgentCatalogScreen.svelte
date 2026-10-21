<script lang="ts">
  import AiCatalogPanel from "../catalog/AiCatalogPanel.svelte";
  import { CatalogController } from "../catalog/controller.svelte.js";
  import type { AgentUiController } from "../core/controller.svelte.js";
  let { controller }: { controller: AgentUiController } = $props();
  const catalog = new CatalogController(() => controller);
</script>

<AiCatalogPanel {catalog} />

<script lang="ts">
  import { onDestroy } from "svelte";
  import Toolbar from "./CatalogToolbar.svelte";
  import { CatalogController } from "../controller.svelte.js";
  import { createDemo } from "../../../../../catalog/agents/support/create-demo.svelte.js";
  import * as Tooltip from "@lapismd/design-core/shadcn/tooltip";
  import "../panel.css";
  const demo = createDemo();
  const state = new CatalogController(() => demo.controller);
  onDestroy(() => void demo.close());
</script>

<Tooltip.Provider
  ><div class="ai-catalog" style="height:auto">
    <Toolbar catalog={state} />
    <output aria-live="polite">Filter: {state.query}</output>
  </div></Tooltip.Provider
>

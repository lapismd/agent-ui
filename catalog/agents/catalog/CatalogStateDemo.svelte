<script lang="ts">
  import { onDestroy, untrack } from "svelte";
  import { AgentWorkbench } from "../../../packages/agent-ui/src/screens/index.js";
  import { createDemo } from "../support/create-demo.svelte.js";

  let { state }: { state: "loading" | "unavailable" } = $props();
  const initialState = untrack(() => state);
  const demo = createDemo();
  demo.controller.screen = "catalog";
  demo.controller.loading = initialState === "loading";
  if (initialState === "unavailable") {
    demo.controller.error = "The configured catalog source could not be read.";
  }
  onDestroy(() => void demo.close());
</script>

<div class="catalog-state-demo">
  <AgentWorkbench controller={demo.controller} />
</div>

<style>
  .catalog-state-demo {
    height: var(--ui-agent-story-height, 100dvh);
    min-width: 0;
    min-height: 0;
  }
</style>

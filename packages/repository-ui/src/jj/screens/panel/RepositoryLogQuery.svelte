<script lang="ts">
  import { untrack } from "svelte";
  import { Input } from "@lapismd/design-core/shadcn/input";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import type { HistoryController } from "../../logic/history-controller.js";
  let { controller, busy }: { controller: HistoryController; busy: boolean } =
    $props();
  let value = $state(untrack(() => controller.state.revset));
</script>

<form
  class="repository-log-query"
  aria-label="Filter revision history"
  onsubmit={(event) => {
    event.preventDefault();
    void controller.search(value);
  }}
>
  <Input
    aria-label="Revision query"
    placeholder="all()"
    bind:value
    disabled={busy}
  />
  <Button type="submit" size="sm" disabled={busy}>Apply query</Button>
  <Button
    type="button"
    size="sm"
    variant="ghost"
    disabled={busy}
    aria-label="Clear revision query"
    onclick={() => {
      value = "all()";
      void controller.search(value);
    }}>Clear</Button
  >
</form>

<style>
  .repository-log-query {
    display: flex;
    align-items: center;
    gap: var(--ui-repository-panel-query-gap, 0.5rem);
    padding: var(--ui-repository-panel-query-padding, 0.5rem);
    border-bottom: 1px solid var(--border);
  }
</style>

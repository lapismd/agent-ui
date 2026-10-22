<script lang="ts">
  import { untrack } from "svelte";
  import { Input } from "@lapismd/design-core/shadcn/input";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import type { OperationController } from "../../logic/operation-controller.js";
  let { controller, busy }: { controller: OperationController; busy: boolean } =
    $props();
  let value = $state(untrack(() => controller.state.query));
</script>

<form
  class="operation-query"
  aria-label="Filter operation history"
  onsubmit={(event) => {
    event.preventDefault();
    void controller.search(value);
  }}
>
  <Input
    aria-label="Operation query"
    placeholder={'description:"rebase" user:steve'}
    bind:value
    disabled={busy}
  />
  <Button type="submit" size="sm" disabled={busy}>Apply query</Button>
  <Button
    type="button"
    size="sm"
    variant="ghost"
    aria-label="Clear operation query"
    disabled={busy}
    onclick={() => {
      value = "";
      void controller.search("");
    }}>Clear</Button
  >
</form>

<style>
  .operation-query {
    display: flex;
    align-items: center;
    gap: var(--ui-repository-operations-query-gap, 0.5rem);
    padding: var(--ui-repository-operations-query-padding, 0.5rem);
    border-bottom: 1px solid var(--border);
  }
</style>

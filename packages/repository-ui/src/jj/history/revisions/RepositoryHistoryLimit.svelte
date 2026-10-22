<script lang="ts">
  let { limit, label = "revisions" }: { limit: number; label?: string } =
    $props();
</script>

<p class="repository-history-limit" role="status">
  Showing the first {limit}
  {label}. Refine the query to narrow the results.
</p>

<style>
  .repository-history-limit {
    flex: none;
    margin: 0;
    padding: var(--ui-repository-revisions-padding, 0.75rem);
    border-block-start: 1px solid var(--border);
    background: var(--background);
    font-size: 0.8125rem;
  }
</style>

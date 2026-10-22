<script lang="ts">
  import RepositoryHistoryQuery from "../../history/query/RepositoryHistoryQuery.svelte";
  import type { RepositoryHistoryQueryInfo } from "../../history/query/types.js";
  import type { OperationController } from "../../logic/operation-controller.js";
  let {
    controller,
    busy,
    info,
  }: {
    controller: OperationController;
    busy: boolean;
    info?: RepositoryHistoryQueryInfo;
  } = $props();
  const value = $derived.by(() => {
    void busy;
    return controller.state.query;
  });
  const symbols = $derived.by(() => {
    void busy;
    return controller.state.commits.flatMap((commit) =>
      commit.bookmarks.map((bookmark) => bookmark.name),
    );
  });
</script>

<div class="query-adapter">
  <RepositoryHistoryQuery
    language="operations"
    {value}
    {busy}
    {info}
    {symbols}
    onApply={(query) => void controller.search(query)}
  />
</div>

<style>
  .query-adapter {
    --ui-repository-history-query-padding: var(
      --ui-repository-operations-query-padding,
      0.5rem 0.75rem
    );
    --ui-repository-history-query-gap: var(
      --ui-repository-operations-query-gap,
      0.75rem
    );
  }
</style>

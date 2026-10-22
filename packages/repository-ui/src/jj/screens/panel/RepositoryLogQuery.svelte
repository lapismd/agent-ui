<script lang="ts">
  import RepositoryHistoryQuery from "../../history/query/RepositoryHistoryQuery.svelte";
  import type { RepositoryHistoryQueryInfo } from "../../history/query/types.js";
  import type { HistoryController } from "../../logic/history-controller.js";
  let {
    controller,
    busy,
    info,
  }: {
    controller: HistoryController;
    busy: boolean;
    info?: RepositoryHistoryQueryInfo;
  } = $props();
  const value = $derived.by(() => {
    void busy;
    return controller.state.revset;
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
    language="revset"
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
      --ui-repository-panel-query-padding,
      0.5rem 0.75rem
    );
    --ui-repository-history-query-gap: var(
      --ui-repository-panel-query-gap,
      0.75rem
    );
  }
</style>

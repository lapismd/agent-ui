<script lang="ts">
  import { untrack } from "svelte";
  import { RepositoryHistoryQuery } from "../../packages/repository-ui/src/jj/index.js";
  let {
    language = "revset",
    busy = false,
  }: { language?: "revset" | "operations"; busy?: boolean } = $props();
  let value = $state(
    untrack(() =>
      language === "operations" ? 'description:"rebase"' : "all()",
    ),
  );
</script>

<div style="padding:1.5rem;max-width:48rem">
  <RepositoryHistoryQuery
    {language}
    {value}
    {busy}
    symbols={["main", "review/portable"]}
    onApply={(query) => (value = query)}
  />
</div>

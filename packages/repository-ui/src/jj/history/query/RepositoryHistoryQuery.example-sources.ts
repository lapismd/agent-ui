export const Basic =
  '<script lang="ts">\n  import { RepositoryHistoryQuery } from "@lapismd/repository-ui/jj";\n  let query = $state("all()");\n</script>\n<RepositoryHistoryQuery language="revset" value={query} onApply={value => query = value} />';
export const Operations =
  '<script lang="ts">\n  import { RepositoryHistoryQuery } from "@lapismd/repository-ui/jj";\n  let query = $state(\'description:"rebase"\');\n</script>\n<RepositoryHistoryQuery language="operations" value={query} onApply={value => query = value} />';
export const Styling =
  '<script lang="ts">\n  import { RepositoryHistoryQuery } from "@lapismd/repository-ui/jj";\n  let query = $state("all()");\n</script>\n<div style="--ui-repository-history-query-padding:0.75rem">\n<RepositoryHistoryQuery language="revset" value={query} onApply={value => query = value} />\n</div>';

export const Pending = `<script lang="ts">
  import { RepositoryHistoryQuery } from "@lapismd/repository-ui/jj";
  let query = $state("all()");
</script>
<RepositoryHistoryQuery busy language="revset" value={query} onApply={value => query = value} />`;

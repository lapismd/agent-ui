export const Basic = `<script lang="ts">
  import { RepositoryForgePanel, RepositoryChecks } from "@lapismd/repository-ui/jj";
  let { checks, sha } = $props();
</script>
<RepositoryForgePanel title="Package acceptance" label="Workflow">
  <RepositoryChecks {checks} currentSha={sha} />
</RepositoryForgePanel>`;
export const Styling = `<div style="--ui-repository-forge-panel-background:var(--card);--ui-repository-forge-panel-font-size:0.8125rem">
  <RepositoryForgePanel title="Package acceptance"><RepositoryChecks {checks} currentSha={sha} /></RepositoryForgePanel>
</div>`;

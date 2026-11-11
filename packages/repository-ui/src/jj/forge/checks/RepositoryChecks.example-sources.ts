export const Basic = `<script lang="ts">
  import { RepositoryChecks, type RepositoryChecksSnapshot } from "@lapismd/repository-ui/jj";
  let { checks, sha, refresh }: { checks: RepositoryChecksSnapshot; sha: string; refresh: () => void } = $props();
</script>
<RepositoryChecks {checks} currentSha={sha} onRefresh={refresh} />`;
export const Styling = `<div style="--ui-repository-checks-max-height:18rem;--ui-repository-checks-font-size:0.8125rem">
  <RepositoryChecks {checks} currentSha={sha} onRefresh={refresh} />
</div>`;

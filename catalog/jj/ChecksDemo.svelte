<script lang="ts">
  import RepositoryChecks from "../../packages/repository-ui/src/jj/forge/checks/RepositoryChecks.svelte";
  import type { RepositoryChecksSnapshot } from "../../packages/repository-ui/src/jj/forge/checks/model.js";
  let { variant = "Mixed" }: { variant?: string } = $props();
  const sha = "a1b2c3d4e5f678901234567890123456789012345";
  const checks: RepositoryChecksSnapshot = $derived({
    sha: variant === "Stale" ? "old-revision" : sha,
    complete: variant !== "Incomplete",
    items:
      variant === "Empty"
        ? []
        : [
            {
              id: "types",
              name: "Types and contracts",
              state: "passed",
              description: "Type checking and specification validation passed.",
            },
            {
              id: "format",
              name: "Formatting",
              state: variant === "Passed" ? "passed" : "failed",
              description: "Inspect the formatting report.",
            },
            {
              id: "ui",
              name: "UI interactions",
              state: variant === "Passed" ? "passed" : "running",
            },
          ],
  });
  let requests = $state(0);
</script>

<div class="checks-demo">
  <RepositoryChecks
    checks={variant === "Unavailable" ? undefined : checks}
    currentSha={sha}
    disabled={variant === "Disabled"}
    onRefresh={() => requests++}
  />
  <output aria-label="Refresh requests">{requests}</output>
</div>

<style>
  .checks-demo {
    max-width: 36rem;
    padding: 1rem;
  }
</style>

<script lang="ts">
  import RepositoryForgePanel from "../../packages/repository-ui/src/jj/forge/panel/RepositoryForgePanel.svelte";
  import RepositoryChecks from "../../packages/repository-ui/src/jj/forge/checks/RepositoryChecks.svelte";
  import { Badge } from "@lapismd/design-core/shadcn/badge";
  import Workflow from "@lucide/svelte/icons/workflow";
  let { variant = "Workflow" }: { variant?: string } = $props();
  const sha = "a1b2c3d4";
</script>

<div class="forge-panel-demo" data-ui-theme="lapis">
  <RepositoryForgePanel
    title={variant === "Approval"
      ? "Production approval"
      : "Package acceptance"}
    label={variant === "Approval" ? "Deployment" : "Workflow"}
  >
    {#snippet leading()}<Workflow size={16} aria-hidden="true" />{/snippet}
    {#snippet context()}<Badge variant="secondary"
        >{variant === "Approval" ? "Waiting" : "Failed"}</Badge
      >{/snippet}
    <p class="description">
      Host-supplied results for the current workflow attempt.
    </p>
    <RepositoryChecks
      currentSha={sha}
      checks={{
        sha,
        complete: true,
        items: [
          {
            id: "job",
            name: "Package smoke",
            state: variant === "Approval" ? "passed" : "failed",
            description: "Observed on the current attempt.",
          },
        ],
      }}
    />
  </RepositoryForgePanel>
</div>

<style>
  .forge-panel-demo {
    padding: 1rem;
    max-width: 48rem;
  }
  .description {
    padding: 0.75rem;
  }
</style>

<script lang="ts">
  import RepositoryChecks from "../checks/RepositoryChecks.svelte";
  import type { RepositoryPullRequestReview } from "./review.svelte.js";
  import type {
    RepositoryPullRequestRecord,
    PullRequestRequest,
  } from "./types.js";
  let {
    review,
    pr,
    disabled,
    onAction,
  }: {
    review: RepositoryPullRequestReview;
    pr: RepositoryPullRequestRecord;
    disabled: boolean;
    onAction?(request: PullRequestRequest): void;
  } = $props();
</script>

<RepositoryChecks
  checks={pr.checks}
  currentSha={pr.sha}
  disabled={disabled || !onAction || !pr.capabilities.includes("checks")}
  onRefresh={() => {
    const request = review.request(pr, { kind: "checks" });
    if (request) onAction?.(request);
  }}
/>

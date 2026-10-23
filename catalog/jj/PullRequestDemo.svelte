<script lang="ts">
  import { untrack } from "svelte";
  import PullRequest from "../../packages/repository-ui/src/jj/forge/pull-request/RepositoryPullRequest.svelte";
  import { RepositoryPullRequestReview } from "../../packages/repository-ui/src/jj/forge/pull-request/review.svelte.js";
  import { recordedPullRequest } from "./support/pull-request-data.js";
  let { variant = "Basic" }: { variant?: string } = $props();
  const review = new RepositoryPullRequestReview();
  untrack(() => {
    const pr = recordedPullRequest();
    if (variant === "Draft") pr.draft = true;
    if (variant === "ChecksUnavailable") pr.checks = undefined;
    if (variant === "NoDescription") pr.body = "";
    if (variant === "Disabled") pr.capabilities = [];
    review.sync(
      {
        repository: "recorded",
        revision: 1,
        readKey: "op:1",
        workspace: "daily",
      },
      [pr],
    );
    review.select(pr.head);
  });
  let requested = $state("");
</script>

<div class="standalone">
  <PullRequest
    {review}
    branch="feature/portable-api"
    disabled={variant === "Disabled"}
    onAction={(request) => (requested = JSON.stringify(request))}
    onClose={() => (review.expanded = false)}
  /><output aria-label="Host PR request">{requested}</output>
</div>

<style>
  .standalone {
    width: min(100%, 60rem);
    height: 40rem;
    padding: 1rem;
    box-sizing: border-box;
    overflow: auto;
  }
  output {
    font-size: 0.75rem;
    overflow-wrap: anywhere;
  }
</style>

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
    if (variant === "LongChecks")
      pr.checks = {
        sha: pr.sha,
        complete: true,
        items: Array.from({ length: 24 }, (_, index) => ({
          id: `check-${index}`,
          name: `Check ${index + 1}`,
          state: index < 2 ? "failed" : "passed",
          description: "A detailed result for the current revision.",
        })),
      };
    if (variant === "WideDescription") {
      const columns = Array.from(
        { length: 12 },
        (_, index) => `Column ${index + 1}`,
      );
      pr.body = `| ${columns.join(" | ")} |\n| ${columns.map(() => "---").join(" | ")} |\n| ${columns.map(() => "Dependency release").join(" | ")} |`;
    }
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
  let theme = $state("lapis");
</script>

<div
  class="standalone"
  data-ui-theme={theme}
  style={variant === "LongChecks" || variant === "WideDescription"
    ? "width:min(100%,24rem)"
    : undefined}
>
  <PullRequest
    {review}
    branch="feature/portable-api"
    disabled={variant === "Disabled"}
    onAction={(request) => (requested = JSON.stringify(request))}
    onClose={() => (review.expanded = false)}
  /><button onclick={() => (theme = "default")}>Change host theme</button
  ><output aria-label="Host PR request">{requested}</output>
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

export const Basic = `<script lang="ts">
  import { RepositoryPullRequest, type RepositoryPullRequestReview, type PullRequestRequest } from "@lapismd/repository-ui/jj";
  let { review, branch, onAction }: { review: RepositoryPullRequestReview; branch: string; onAction(request: PullRequestRequest): void } = $props();
</script>
<RepositoryPullRequest {review} {branch} {onAction} onClose={() => review.close()} />`;
export const Styling = `<div style="--ui-repository-pull-request-padding:1rem; --ui-repository-pull-request-font-size:0.8125rem">
  <!-- Render RepositoryPullRequest with the host-owned review above. -->
</div>`;

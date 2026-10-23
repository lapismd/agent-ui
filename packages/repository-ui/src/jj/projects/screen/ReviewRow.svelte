<!-- Copied/adapted from JJ Store StoreWorkReviewRow, Apache-2.0. -->
<script lang="ts">
  import RepositoryAuthorAvatar from "../../foundations/author-avatar/RepositoryAuthorAvatar.svelte";
  import WorkTime from "./WorkTime.svelte";
  import {
    CircleCheck as CircleCheckIcon,
    MessageSquare as MessageSquareIcon,
    GitBranch as GitBranchIcon,
  } from "@lucide/svelte";
  import type { WorkReview } from "../logic/types.js";
  let { review, onOpen }: { review: WorkReview; onOpen?(id: string): void } =
    $props();
  const title = $derived(review.title);
  const artifact = $derived(review.anchorLabel ?? "Repository");
</script>

<article
  class="community-projects__review-row store-projects__native-review-row"
>
  <span class="community-projects__review-status-icon" title={review.status}>
    {#if review.status === "open"}<MessageSquareIcon
        aria-hidden="true"
      />{:else}<CircleCheckIcon aria-hidden="true" />{/if}
    <span class="sr-only">{review.status}</span>
  </span>
  <button
    type="button"
    class="community-projects__review-row-title"
    {title}
    disabled={!onOpen}
    onclick={() => onOpen?.(review.id)}
    aria-label={`Open ${title}, ${artifact}, ${review.status} review with ${review.commentCount ?? review.comments.length} comments`}
    >{title}</button
  >
  <button
    type="button"
    class="community-projects__review-row-id"
    title={review.id}
    disabled={!onOpen}
    onclick={() => onOpen?.(review.id)}
    aria-label={`Open review ${review.id}`}>#{review.id.slice(0, 8)}</button
  >
  <span class="community-projects__review-row-branch" title={artifact}
    ><span aria-hidden="true">›</span><GitBranchIcon aria-hidden="true" /><span
      >{artifact}</span
    ></span
  >
  <span
    class="community-projects__review-row-comments"
    aria-label={`${review.commentCount ?? review.comments.length} comments`}
    ><MessageSquareIcon aria-hidden="true" />{review.commentCount ??
      review.comments.length}</span
  >
  {#if review.actor}<span class="community-member-hover-card__trigger"
      ><RepositoryAuthorAvatar
        name={review.actor.name ?? review.actor.created_by}
        avatarUrl={review.actor.avatarUrl}
        size="xs"
      /></span
    ><WorkTime timestamp={review.actor.updated_at_millis / 1000} />
  {:else}<span
      class="store-projects__review-unavailable"
      aria-label="Review author unavailable">—</span
    ><span
      class="store-projects__review-unavailable"
      aria-label="Review activity date unavailable">—</span
    >{/if}
</article>

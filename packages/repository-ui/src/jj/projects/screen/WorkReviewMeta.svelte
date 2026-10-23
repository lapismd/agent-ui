<!-- Adapted from JJ Store StoreReviewDetail/AnchorIdentity, Apache-2.0. -->
<script lang="ts">
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { GitPullRequest, User, CircleCheck, RotateCcw } from "@lucide/svelte";
  import RepositoryIdentifiers from "../../foundations/identifiers/RepositoryIdentifiers.svelte";
  import type { WorkReview } from "../logic/types.js";
  let {
    review,
    writable,
    disabled,
    setResolved,
    copyText,
  }: {
    review: WorkReview;
    writable: boolean;
    disabled: boolean;
    setResolved(): void;
    copyText?(text: string): Promise<void>;
  } = $props();
</script>

{#snippet identity(value: string, label: string)}
  {#if copyText}<RepositoryIdentifiers
      commitId={value}
      commitLabel={label}
      placement="inline"
      {copyText}
    />
  {:else}<code title={value}>{value.slice(0, 8)}</code>{/if}
{/snippet}
<dl class="community-projects__review-meta">
  <div>
    <dt><GitPullRequest aria-hidden="true" />Anchor</dt>
    <dd>
      {review.anchor?.label ?? review.anchorLabel ?? "Anchor unavailable"}
      {#if review.anchor?.commitId}
        {#if copyText}<RepositoryIdentifiers
            commitId={review.anchor.commitId}
            changeId={review.anchor.changeId}
            placement="inline"
            {copyText}
          />
        {:else}<code>{review.anchor.commitId.slice(0, 8)}</code>{/if}
      {/if}
      {#if review.anchor?.operationId}{@render identity(
          review.anchor.operationId,
          "operation ID",
        )}{/if}
      {#if review.anchor?.sessionId}{@render identity(
          review.anchor.sessionId,
          "agent session ID",
        )}{/if}
    </dd>
  </div>
  <div>
    <dt><User aria-hidden="true" />Author</dt>
    <dd>
      {review.actor?.name ?? review.actor?.created_by ?? "Unknown author"}
    </dd>
  </div>
  <div>
    <dt><GitPullRequest aria-hidden="true" />Status</dt>
    <dd>
      {review.status}
      {#if writable}<Button
          variant="secondary"
          size="xs"
          {disabled}
          onclick={setResolved}
        >
          {#if review.status === "open"}<CircleCheck
              data-icon="inline-start"
            />Resolve{:else}<RotateCcw data-icon="inline-start" />Reopen{/if}
        </Button>{/if}
    </dd>
  </div>
  <div>
    <dt>Snapshot</dt>
    <dd>
      {#if review.reviewRoot}{@render identity(
          review.reviewRoot,
          "review root",
        )}{/if}
      {@render identity(review.id, "review thread ID")}
    </dd>
  </div>
</dl>

<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store StoreForgeDetails. -->
<script lang="ts">
  import * as Tooltip from "@lapismd/design-core/shadcn/tooltip";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { Badge } from "@lapismd/design-core/shadcn/badge";
  import Pencil from "@lucide/svelte/icons/pencil";
  import GitPullRequest from "@lucide/svelte/icons/git-pull-request";
  import Panel from "../panel/RepositoryForgePanel.svelte";
  import Body from "./RepositoryPullRequestBody.svelte";
  import Actions from "./RepositoryPullRequestActions.svelte";
  import type { RepositoryPullRequestReview } from "./review.svelte.js";
  import type { PullRequestRequest } from "./types.js";
  import "./pull-request.css";
  let {
    review,
    branch,
    disabled = false,
    onAction,
    onClose,
  }: {
    review: RepositoryPullRequestReview;
    branch: string;
    disabled?: boolean;
    onAction?(request: PullRequestRequest): void;
    onClose(): void;
  } = $props();
  const pr = $derived(review.pr(branch));
  const selected = $derived(review.selectedBranch === branch);
  const expanded = $derived(selected && review.expanded);
  const blocked = $derived(disabled || review.busy || review.pending);
  function expand(open: boolean) {
    if (open) review.select(branch);
    else review.expanded = false;
  }
</script>

{#if pr}
  {#key review.key(pr)}
    <Panel
      title={review.drafts[review.key(pr)]?.title || pr.title}
      windowTitle={`PR #${pr.number} · ${pr.head}`}
      label="PR"
      ariaLabel={`Pull request for ${branch}`}
      class="repository-pr"
      {expanded}
      onExpandedChange={expand}
      {onClose}
    >
      {#snippet leading()}<GitPullRequest
          aria-label={pr.provider === "github" ? "GitHub" : "Forgejo"}
          size={16}
        />{/snippet}
      {#snippet context()}<a
          class="repository-pr__number"
          href={pr.url}
          target="_blank"
          rel="noreferrer">#{pr.number}</a
        ><Badge variant="secondary">{pr.draft ? "Draft" : pr.state}</Badge
        >{/snippet}
      {#snippet beforeActions()}<Tooltip.Provider
          ><Tooltip.Root
            ><Tooltip.Trigger
              >{#snippet child({ props })}<Button
                  {...props}
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Edit PR details"
                  aria-pressed={review.drafts[review.key(pr)]?.editing ?? false}
                  disabled={blocked ||
                    !onAction ||
                    !pr.capabilities.includes("edit")}
                  onclick={() => {
                    expand(true);
                    const draft = review.draft(pr);
                    draft.editing = !draft.editing;
                  }}><Pencil aria-hidden="true" /></Button
                >{/snippet}</Tooltip.Trigger
            ><Tooltip.Content>Edit details</Tooltip.Content></Tooltip.Root
          ></Tooltip.Provider
        >{/snippet}
      {#snippet actions()}<Actions
          {review}
          {pr}
          disabled={blocked}
          {onAction}
        />{/snippet}
      <Body {review} {pr} disabled={blocked} {onAction} />
    </Panel>
  {/key}
{/if}

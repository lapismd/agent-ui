<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store StoreForgeDetails. -->
<script lang="ts">
  import * as Collapsible from "@lapismd/design-core/shadcn/collapsible";
  import * as Tooltip from "@lapismd/design-core/shadcn/tooltip";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { Badge } from "@lapismd/design-core/shadcn/badge";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import Pencil from "@lucide/svelte/icons/pencil";
  import PictureInPicture2 from "@lucide/svelte/icons/picture-in-picture-2";
  import GitPullRequest from "@lucide/svelte/icons/git-pull-request";
  import X from "@lucide/svelte/icons/x";
  import Detachable from "./RepositoryDetachablePanel.svelte";
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
    <Detachable title={`PR #${pr.number} · ${pr.head}`}>
      {#snippet children({ floating, toggle })}
        <section
          class="repository-pr"
          class:repository-pr--floating={floating}
          aria-label={`Pull request for ${branch}`}
        >
          <Collapsible.Root
            open={expanded}
            onOpenChange={expand}
            disabled={floating}
          >
            <header class="repository-pr__summary">
              <GitPullRequest
                aria-label={pr.provider === "github" ? "GitHub" : "Forgejo"}
                size={16}
              />
              <h2 class="repository-pr__title">
                <Collapsible.Trigger>
                  {#snippet child({ props })}<Button
                      {...props}
                      variant="ghost"
                      size="sm"
                      aria-label={`${review.drafts[review.key(pr)]?.title || pr.title} · ${expanded ? "Collapse" : "Expand"} pull request #${pr.number}`}
                    >
                      {#if expanded}<ChevronDown
                          aria-hidden="true"
                        />{:else}<ChevronRight aria-hidden="true" />{/if}
                      <span
                        >{review.drafts[review.key(pr)]?.title ||
                          pr.title}</span
                      >
                    </Button>{/snippet}
                </Collapsible.Trigger>
              </h2>
              <a
                class="repository-pr__number"
                href={pr.url}
                target="_blank"
                rel="noreferrer">#{pr.number}</a
              >
              <Badge variant="secondary">{pr.draft ? "Draft" : pr.state}</Badge>
              <div class="repository-pr__actions">
                <Tooltip.Provider>
                  <Tooltip.Root
                    ><Tooltip.Trigger
                      >{#snippet child({ props })}<Button
                          {...props}
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Edit PR details"
                          aria-pressed={review.drafts[review.key(pr)]
                            ?.editing ?? false}
                          disabled={blocked ||
                            !onAction ||
                            !pr.capabilities.includes("edit")}
                          onclick={() => {
                            expand(true);
                            const draft = review.draft(pr);
                            draft.editing = !draft.editing;
                          }}><Pencil aria-hidden="true" /></Button
                        >{/snippet}</Tooltip.Trigger
                    ><Tooltip.Content>Edit details</Tooltip.Content
                    ></Tooltip.Root
                  >
                  <Tooltip.Root
                    ><Tooltip.Trigger
                      >{#snippet child({ props })}<Button
                          {...props}
                          variant="ghost"
                          size="icon-sm"
                          aria-label={floating
                            ? "Dock PR details"
                            : "Float PR details"}
                          onclick={() => {
                            expand(true);
                            toggle();
                          }}><PictureInPicture2 aria-hidden="true" /></Button
                        >{/snippet}</Tooltip.Trigger
                    ><Tooltip.Content
                      >{floating
                        ? "Dock PR details"
                        : "Float PR details"}</Tooltip.Content
                    ></Tooltip.Root
                  >
                </Tooltip.Provider>
                <Actions {review} {pr} disabled={blocked} {onAction} />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Close PR details"
                  onclick={onClose}><X aria-hidden="true" /></Button
                >
              </div>
            </header>
            <Collapsible.Content>
              {#if expanded}<Body
                  {review}
                  {pr}
                  disabled={blocked}
                  {onAction}
                />{/if}
            </Collapsible.Content>
          </Collapsible.Root>
        </section>
      {/snippet}
    </Detachable>
  {/key}
{/if}

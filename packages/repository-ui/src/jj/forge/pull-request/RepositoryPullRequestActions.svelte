<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store StoreForgePullRequestActions. -->
<script lang="ts">
  import { Button } from "@lapismd/design-core/shadcn/button";
  import * as Menu from "@lapismd/design-core/shadcn/dropdown-menu";
  import GitMerge from "@lucide/svelte/icons/git-merge";
  import Ellipsis from "@lucide/svelte/icons/ellipsis-vertical";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import Refresh from "@lucide/svelte/icons/refresh-cw";
  import Layers from "@lucide/svelte/icons/layers";
  import FilePen from "@lucide/svelte/icons/file-pen-line";
  import CircleCheck from "@lucide/svelte/icons/circle-check";
  import CircleX from "@lucide/svelte/icons/circle-x";
  import CircleHelp from "@lucide/svelte/icons/circle-help";
  import type { RepositoryPullRequestReview } from "./review.svelte.js";
  import type {
    PullRequestAction,
    RepositoryPullRequestRecord,
    PullRequestRequest,
    PullRequestMergeMethod,
  } from "./types.js";
  let {
    review,
    pr,
    disabled,
    onAction,
    footer = false,
  }: {
    review: RepositoryPullRequestReview;
    pr: RepositoryPullRequestRecord;
    disabled: boolean;
    onAction?(request: PullRequestRequest): void;
    footer?: boolean;
  } = $props();
  const draft = $derived(review.drafts[review.key(pr)]!);
  const mergeDisabled = $derived(
    disabled ||
      !onAction ||
      !review.request(pr, { kind: "merge", method: draft.method }),
  );
  const mergeLabel = (method: string) =>
    method === "squash"
      ? "Squash and merge"
      : method === "rebase"
        ? "Rebase and merge"
        : "Merge pull request";
  function request(action: PullRequestAction) {
    if (disabled || !onAction) return;
    const value = review.request(pr, action);
    if (value) onAction(value);
  }
</script>

{#if footer}
  <footer class="repository-pr__merge" aria-label="Pull request merge actions">
    <div class="repository-pr__merge-status">
      {#if pr.mergeable === true}<CircleCheck
          aria-hidden="true"
        />{:else if pr.mergeable === false}<CircleX
          aria-hidden="true"
        />{:else}<CircleHelp aria-hidden="true" />{/if}
      <div>
        <strong
          >{pr.state === "merged"
            ? "Pull request merged"
            : pr.state !== "open"
              ? "Pull request closed"
              : pr.draft
                ? "Draft pull request"
                : pr.mergeable === true
                  ? "No conflicts with base branch"
                  : pr.mergeable === false
                    ? "Conflicts with base branch"
                    : "Mergeability needs refresh"}</strong
        ><span
          >{pr.draft
            ? "Mark ready for review before merging."
            : "Forge protection and stack order are checked before merging."}</span
        >
      </div>
    </div>
    {#if pr.state === "open"}<div class="repository-pr__merge-bar">
        <Button
          size="sm"
          variant="outline"
          disabled={mergeDisabled}
          onclick={() => request({ kind: "merge", method: draft.method })}
          ><GitMerge data-icon="inline-start" />{mergeLabel(
            draft.method,
          )}</Button
        ><Menu.Root
          ><Menu.Trigger
            >{#snippet child({ props })}<Button
                {...props}
                variant="outline"
                size="icon-sm"
                disabled={disabled ||
                  !onAction ||
                  !pr.capabilities.includes("merge")}
                aria-label="Choose merge method"
                ><ChevronDown aria-hidden="true" /></Button
              >{/snippet}</Menu.Trigger
          ><Menu.Content align="start"
            ><Menu.Group
              ><Menu.Label>Merge method</Menu.Label><Menu.RadioGroup
                value={draft.method}
                onValueChange={(value) =>
                  (draft.method = value as PullRequestMergeMethod)}
                >{#each pr.mergeMethods ?? [] as method}<Menu.RadioItem
                    value={method}>{mergeLabel(method)}</Menu.RadioItem
                  >{/each}</Menu.RadioGroup
              ></Menu.Group
            ></Menu.Content
          ></Menu.Root
        >
      </div>{/if}
  </footer>
{:else}
  <Menu.Root
    ><Menu.Trigger
      >{#snippet child({ props })}<Button
          {...props}
          variant="ghost"
          size="icon-sm"
          aria-label="Pull request actions"
          {disabled}><Ellipsis aria-hidden="true" /></Button
        >{/snippet}</Menu.Trigger
    ><Menu.Content align="end" style="min-width:15rem;white-space:nowrap"
      ><Menu.Group
        ><Menu.Label>Pull request actions</Menu.Label><Menu.Item
          disabled={!onAction || !pr.capabilities.includes("refresh")}
          onSelect={() => request({ kind: "refresh" })}
          ><Refresh aria-hidden="true" />Refresh pull request</Menu.Item
        ><Menu.Item
          disabled={!onAction ||
            pr.state !== "open" ||
            !pr.capabilities.includes("draft")}
          onSelect={() => request({ kind: "draft", draft: !pr.draft })}
          ><FilePen aria-hidden="true" />{pr.draft
            ? "Ready for review"
            : "Convert to draft"}</Menu.Item
        ><Menu.Item
          disabled={!onAction || !pr.capabilities.includes("restack")}
          onSelect={() => request({ kind: "restack" })}
          ><Layers aria-hidden="true" />Restack…</Menu.Item
        ><Menu.Item
          disabled={mergeDisabled}
          onSelect={() => request({ kind: "merge", method: draft.method })}
          ><GitMerge aria-hidden="true" />Merge next…</Menu.Item
        ></Menu.Group
      ></Menu.Content
    ></Menu.Root
  >
{/if}

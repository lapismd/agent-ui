<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store StoreForgePullRequest and StoreForgeDescription. -->
<script lang="ts">
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { Input } from "@lapismd/design-core/shadcn/input";
  import * as Field from "@lapismd/design-core/shadcn/field";
  import { MarkdownContent, MarkdownComposer } from "@lapismd/design-core/chat";
  import Checks from "./RepositoryPullRequestChecks.svelte";
  import Actions from "./RepositoryPullRequestActions.svelte";
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
  const draft = $derived(review.drafts[review.key(pr)]!);
  const changed = $derived(draft.title !== pr.title || draft.body !== pr.body);
  function save() {
    if (disabled || !onAction) return;
    const request = review.request(pr, {
      kind: "edit",
      title: draft.title,
      body: draft.body,
    });
    if (request) onAction(request);
  }
</script>

<section class="repository-pr__body" aria-label={`PR ${pr.number} details`}>
  <div class="repository-pr__content">
    {#if draft.editing}<Field.Field
        ><Field.Label for={`pr-title-${pr.id}`}>Title</Field.Label><Input
          id={`pr-title-${pr.id}`}
          bind:value={draft.title}
          {disabled}
        /></Field.Field
      >{/if}
    <p class="repository-pr__branches">
      <code>{pr.head}</code><span aria-label="into">→</span><code
        >{pr.base}</code
      >
    </p>
    {#if draft.editing}
      <MarkdownComposer
        bind:value={draft.body}
        presentation="document"
        label="PR description"
        inputLabel="PR description"
        placeholder="Add context for reviewers"
        {disabled}
        showSendButton={false}
        showHint={false}
        onSubmit={save}
      />
    {:else if draft.body.trim()}<MarkdownContent
        content={draft.body}
        fullWidth
        style="--mira-preview-background: transparent"
      />
    {:else}<p>No description yet.</p>{/if}
    {#if pr.details?.length}<dl class="repository-pr__metadata">
        {#each pr.details as detail}<div>
            <dt>{detail.label}</dt>
            <dd>{detail.value}</dd>
          </div>{/each}
      </dl>{/if}
    {#if changed || draft.editing}<div class="repository-pr__edit-actions">
        <Button
          size="sm"
          disabled={disabled || !onAction || !changed || !draft.title.trim()}
          onclick={save}>Save changes</Button
        ><Button
          size="sm"
          variant="ghost"
          {disabled}
          onclick={() => (draft.editing = false)}>Preview description</Button
        >
      </div>{/if}
  </div>
  <Checks {review} {pr} {disabled} {onAction} />
  <Actions {review} {pr} {disabled} {onAction} footer />
</section>

<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store StoreStackBookmarkCard/Header. -->
<script lang="ts">
  import * as Card from "@lapismd/design-core/shadcn/card";
  import { TagList } from "@lapismd/design-core/shadcn/tag-list";
  import GitBranch from "@lucide/svelte/icons/git-branch";
  import { RelativeTime } from "@lapismd/design-core/shadcn/relative-time";
  import RepositoryAuthorAvatar from "../../foundations/author-avatar/RepositoryAuthorAvatar.svelte";
  import RepositoryGraph from "../../history/graph/RepositoryGraph.svelte";
  import RepositoryCommitMessage from "../../history/commit-message/RepositoryCommitMessage.svelte";
  import Files from "../source-files/RepositoryWorkspaceFiles.svelte";
  import { stackCardSelection } from "../../../stacks/card-selection.js";
  import { toggleStackSource } from "../../../stacks/selection-actions.js";
  import type {
    StackWorkspaceController,
    WorkspaceStack,
    StackCommit,
  } from "../../../stacks/index.js";
  import { workspaceRevisionRows } from "./presentation.js";
  import type { RepositoryStackHost } from "./types.js";
  let {
    controller,
    stack,
    name,
    aliases = [],
    shared = false,
    commits,
    host,
    now,
  }: {
    controller: StackWorkspaceController;
    stack: WorkspaceStack;
    name: string;
    aliases?: string[];
    shared?: boolean;
    commits: StackCommit[];
    host: RepositoryStackHost;
    now?: number;
  } = $props();
  const card = $derived(
    stackCardSelection(
      controller.snapshot!,
      controller.stackSelections,
      stack,
      name,
      aliases,
      commits,
    ),
  );
  const diff = $derived(
    controller.diffs.find((diff) => diff.origin === `stack-${card.owner}`),
  );
  const tip = $derived(commits[0]);
  const revisions = $derived(workspaceRevisionRows(stack, commits));
</script>

<Card.Root class="workspace-bookmark-card" data-loaded-commits={commits.length}>
  <Card.Header
    class="workspace-bookmark-header"
    data-selected={card.branchSelected || undefined}
  >
    <GitBranch aria-hidden="true" />
    <div>
      <Card.Title
        ><button
          type="button"
          class="workspace-branch-title"
          disabled={controller.locked}
          aria-label={`Show all changes in ${name}`}
          aria-pressed={card.branchSelected}
          onclick={() =>
            toggleStackSource(controller, card.owner, { branch: card.branch })}
          >{name}</button
        ></Card.Title
      >
      {#if tip && controller.page === "workspace"}<Card.Description
          ><RepositoryAuthorAvatar
            name={tip.author}
            email={tip.email}
            size="xs"
          />{tip.author} · <RelativeTime
            timestamp={tip.createdAt * 1000}
            now={now === undefined ? undefined : now * 1000}
          /></Card.Description
        >{/if}
      <TagList
        label={`Tags for ${name}`}
        tags={[
          { id: "local", label: "Local bookmark", variant: "secondary" },
          ...(shared
            ? [{ id: "shared", label: "Shared", variant: "secondary" as const }]
            : []),
          ...aliases.map((alias) => ({
            id: alias,
            label: alias,
            variant: "secondary" as const,
          })),
        ]}
      />
    </div>
  </Card.Header>
  {#if card.branchSelected}<Card.Content class="workspace-branch-files"
      ><Files
        {controller}
        source={card.branchSource}
        label={`Changed files in ${name}`}
        selectedPath={diff?.source === card.branchSource
          ? diff.path
          : undefined}
        onSelect={(path) =>
          controller.selectFile(card.branchSource, path, undefined, card.owner)}
        actions={host.fileActions ? fileActions : undefined}
      /></Card.Content
    >{/if}
  {#if host.branchActions}<Card.Content class="workspace-bookmark-actions"
      >{@render host.branchActions(stack, name)}</Card.Content
    >{/if}
  <RepositoryGraph
    {revisions}
    selectedId={card.commit?.id}
    copyText={host.copyText}
    label={`Commits in ${name}`}
    onSelect={(id) => toggleStackSource(controller, card.owner, { commit: id })}
    rowActions={host.commitActions ? commitActions : undefined}
  >
    {#snippet selectedFiles()}{#if card.commit}
        {#if card.commit.message.includes("\n")}<RepositoryCommitMessage
            description={card.commit.message}
          />{/if}
        <Files
          {controller}
          source={card.commit.id}
          label={`Changed files in ${name}`}
          selectedPath={diff?.source === card.commit.id ? diff.path : undefined}
          onSelect={(path) =>
            controller.selectFile(card.commit!.id, path, undefined, card.owner)}
          actions={host.fileActions ? fileActions : undefined}
        />
      {/if}{/snippet}
  </RepositoryGraph>
</Card.Root>
{#snippet commitActions(
  revision: import("../../logic/graph/model.js").RepositoryLogRevision,
)}
  {@const commit = commits.find((item) => item.id === revision.eventId)!}
  {@render host.commitActions?.(commit, stack)}
{/snippet}
{#snippet fileActions()}{@render host.fileActions?.(
    card.commit?.id ?? card.branchSource,
  )}{/snippet}

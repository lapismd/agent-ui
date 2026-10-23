<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store StoreStackBookmarkCard/Header. -->
<script lang="ts">
  import * as Card from "@lapismd/design-core/shadcn/card";
  import { TagList } from "@lapismd/design-core/shadcn/tag-list";
  import GitBranch from "@lucide/svelte/icons/git-branch";
  import ArrowLeftRight from "@lucide/svelte/icons/arrow-left-right";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { RelativeTime } from "@lapismd/design-core/shadcn/relative-time";
  import RepositoryAuthorAvatar from "../../foundations/author-avatar/RepositoryAuthorAvatar.svelte";
  import RepositoryGraph from "../../history/graph/RepositoryGraph.svelte";
  import BranchActions from "./RepositoryStackBranchActions.svelte";
  import CommitActions from "./RepositoryStackCommitActions.svelte";
  import {
    isWorkspaceBranch,
    isAppliedBranch,
  } from "../../../stacks/presentation.js";
  import { selectedWorkspaceChanges } from "./drag-handlers.js";
  import { pullRequestScope } from "../../forge/pull-request/scope.js";
  import Files from "../source-files/RepositoryWorkspaceFiles.svelte";
  import DropGuide from "./RepositoryWorkspaceDropGuide.svelte";
  import {
    workspaceDropHandlers,
    workspaceCommitHandlers,
  } from "./drag-handlers.js";
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
  const pr = $derived(
    host.pullRequests?.matches(pullRequestScope(controller.snapshot!))
      ? host.pullRequests.pr(name)
      : undefined,
  );
  const head = $derived(stack.heads.find((head) => head.name === name));
  const canRewrite = $derived(!commits.some((commit) => commit.immutable));
  const target = $derived({
    kind: "stack" as const,
    id: card.owner,
    branch: card.branch,
  });
</script>

<Card.Root class="workspace-bookmark-card" data-loaded-commits={commits.length}>
  <Card.Header
    class="workspace-bookmark-header workspace-drop-target"
    data-drop-target-state={controller.drag.state(target)}
    {...workspaceDropHandlers(controller, host, () => target)}
    data-selected={card.branchSelected || undefined}
  >
    <DropGuide feedback={controller.drag.for(target)} />
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
        compact
        draggable={Boolean(host.onCommand)}
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
  <BranchActions
    stack={card.owner}
    commitStack={card.owner}
    {name}
    applied={isAppliedBranch(controller.snapshot!, name)}
    canAddCommit={isWorkspaceBranch(controller.snapshot!, name) &&
      head?.baseCommit !== null}
    commit={head?.commit ?? stack.base}
    empty={!commits.length}
    below={head?.baseCommit ?? stack.base}
    {canRewrite}
    canSquash={commits.length > 1 && canRewrite}
    disabled={controller.locked || !host.onCommand}
    enabled={(kind) => Boolean(host.onCommand) && controller.can(kind)}
    reason={(kind) => controller.eligibility(kind).reason}
    onCommand={(command) => host.onCommand?.(command, controller.snapshot!)}
    copyText={host.copyText}
    onCopyError={host.onCopyError}
    onPush={host.onPushBranch
      ? () => host.onPushBranch?.(name, controller.snapshot!)
      : undefined}
  >
    {#snippet afterPush()}
      {#if pr}<Button
          variant="outline"
          size="xs"
          aria-label={`PR #${pr.number} · Pull request for ${name}`}
          onclick={() => host.pullRequests?.select(name)}
          >PR #{pr.number}</Button
        >
      {:else if host.onCreatePullRequest}<Button
          variant="outline"
          size="xs"
          disabled={controller.locked || stack.conflicts}
          onclick={() => host.onCreatePullRequest?.(name, controller.snapshot!)}
          >Create PR</Button
        >{/if}
      {@render host.branchActions?.(stack, name)}
    {/snippet}
  </BranchActions>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div {...workspaceCommitHandlers(controller, host, () => commits)}>
    <RepositoryGraph
      continuous
      {revisions}
      selectedId={card.commit?.id}
      copyText={host.copyText}
      label={`Commits in ${name}`}
      onSelect={(id) =>
        toggleStackSource(controller, card.owner, { commit: id })}
      rowActions={commitActions}
      draggable={(revision) =>
        Boolean(host.onCommand) &&
        !controller.locked &&
        Boolean(
          commits.find(
            (commit) => commit.id === revision.eventId && !commit.immutable,
          ),
        ) &&
        (controller.can("move_commit") || controller.can("reorder_commit"))}
      rowDropState={(revision) =>
        controller.drag.state({ kind: "commit", id: revision.eventId })}
      rowDropPlacement={(revision) =>
        controller.drag.for({ kind: "commit", id: revision.eventId })
          ?.placement}
    >
      {#snippet selectedFiles()}{#if card.commit}
          <Files
            compact
            draggable={Boolean(host.onCommand)}
            {controller}
            source={card.commit.id}
            label={`Changed files in ${name}`}
            selectedPath={diff?.source === card.commit.id
              ? diff.path
              : undefined}
            onSelect={(path) =>
              controller.selectFile(
                card.commit!.id,
                path,
                undefined,
                card.owner,
              )}
            actions={host.fileActions ? fileActions : undefined}
          />
        {/if}{/snippet}
    </RepositoryGraph>
  </div>
</Card.Root>
{#snippet commitActions(
  revision: import("../../logic/graph/model.js").RepositoryLogRevision,
)}
  {@const commit = commits.find((item) => item.id === revision.eventId)!}
  <DropGuide
    feedback={controller.drag.for({ kind: "commit", id: commit.id })}
  />
  {#if host.onCommand && controller.can("move_commit")}<Button
      variant="ghost"
      size="icon-xs"
      disabled={controller.locked || commit.immutable}
      title="Move commit"
      aria-label={`Move commit ${commit.message.split("\n")[0]}`}
      onclick={() =>
        host.onCommand?.(
          { kind: "move_commit", commit: commit.id, stack: "" },
          controller.snapshot!,
        )}><ArrowLeftRight aria-hidden="true" /></Button
    >{/if}
  <CommitActions
    {commit}
    {stack}
    disabled={controller.locked || !host.onCommand}
    selection={selectedWorkspaceChanges(controller)}
    enabled={(kind) => Boolean(host.onCommand) && controller.can(kind)}
    reason={(kind) => controller.eligibility(kind).reason}
    onCommand={(command) => host.onCommand?.(command, controller.snapshot!)}
    copyText={host.copyText}
    onCopyError={host.onCopyError}
  />
  {@render host.commitActions?.(commit, stack)}
{/snippet}
{#snippet fileActions()}{@render host.fileActions?.(
    card.commit?.id ?? card.branchSource,
  )}{/snippet}

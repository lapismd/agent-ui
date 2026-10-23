<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store StoreStackLane. -->
<script lang="ts">
  import "./stack-lane.css";
  import { untrack } from "svelte";
  import * as ColumnCanvas from "@lapismd/design-core/shadcn/column-canvas";
  import * as Card from "@lapismd/design-core/shadcn/card";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { Badge } from "@lapismd/design-core/shadcn/badge";
  import * as Menu from "@lapismd/design-core/shadcn/dropdown-menu";
  import GitPullRequest from "@lucide/svelte/icons/git-pull-request";
  import GitBranch from "@lucide/svelte/icons/git-branch";
  import RepositorySkeleton from "../../foundations/skeleton/RepositorySkeleton.svelte";
  import Status from "../source-files/RepositoryWorkspaceStatus.svelte";
  import BookmarkCard from "./RepositoryStackCard.svelte";
  import Composer from "./RepositoryStackCommitComposer.svelte";
  import LaneMenu from "./RepositoryStackLaneMenu.svelte";
  import DropGuide from "./RepositoryWorkspaceDropGuide.svelte";
  import { workspaceDropHandlers } from "./drag-handlers.js";
  import {
    stackGroups,
    isAppliedBranch,
  } from "../../../stacks/presentation.js";
  import { toggleStackSource } from "../../../stacks/selection-actions.js";
  import type {
    StackWorkspaceController,
    WorkspaceStack,
  } from "../../../stacks/index.js";
  import type { RepositoryStackHost } from "./types.js";
  let {
    controller,
    stack,
    host,
    now,
  }: {
    controller: StackWorkspaceController;
    stack: WorkspaceStack;
    host: RepositoryStackHost;
    now?: number;
  } = $props();
  const history = $derived(controller.histories.state(stack.id));
  const preparing = $derived(
    Boolean(controller.adapter.readStackHistory) &&
      !history.loaded &&
      stack.heads.length > 0,
  );
  const applied = $derived(isAppliedBranch(controller.snapshot!, stack.name));
  $effect(() => {
    const id = stack.id;
    controller.snapshot?.readKey;
    untrack(() => {
      void controller.histories.load(id);
    });
  });
</script>

<ColumnCanvas.Column
  class="workspace-stack-lane"
  id={`stack-${stack.id}`}
  columnTitle={stack.name}
  resizable
  aria-label={`Stack ${stack.name}`}
>
  <ColumnCanvas.Header class="workspace-stack-header">
    <GitBranch aria-hidden="true" /><ColumnCanvas.Title
      ><button
        type="button"
        class="workspace-branch-title"
        disabled={controller.locked}
        aria-label={`Show all changes in stack ${stack.name}`}
        onclick={() =>
          toggleStackSource(controller, stack.id, { branch: stack.name })}
        >{stack.name}</button
      ></ColumnCanvas.Title
    ><ColumnCanvas.Count>{stack.commits.length}</ColumnCanvas.Count>
    {#if stack.conflicts}<Badge variant="outline">Conflicts</Badge>{/if}
    <ColumnCanvas.HeaderActions
      ><LaneMenu
        {controller}
        {stack}
        {applied}
        disabled={!host.onCommand}
        onCommand={(command) => host.onCommand?.(command, controller.snapshot!)}
      >
        {#snippet forgeAction()}{#if host.onSubmitStack}<Menu.Item
              disabled={controller.locked || stack.conflicts}
              onSelect={() => host.onSubmitStack?.(stack, controller.snapshot!)}
              ><GitPullRequest aria-hidden="true" />Submit stack</Menu.Item
            >{/if}{/snippet}
      </LaneMenu>{@render host.columnActions?.(stack)}<ColumnCanvas.Toggle
        aria-label={`Collapse ${stack.name}`}
      /></ColumnCanvas.HeaderActions
    >
  </ColumnCanvas.Header>
  <ColumnCanvas.Body
    scrollStrategy="styled"
    orientation="both"
    class="workspace-drop-target"
    data-drop-target-state={controller.drag.state({
      kind: "stack",
      id: stack.id,
    })}
    {...workspaceDropHandlers(controller, host, () => ({
      kind: "stack",
      id: stack.id,
    }))}
  >
    <DropGuide
      feedback={controller.drag.for({ kind: "stack", id: stack.id })}
    />
    {#if history.error}<Status
        unavailable
        title="Stack history unavailable"
        description={history.error}
        onRetry={() =>
          void controller.histories.load(stack.id, Boolean(history.cursor))}
      />{/if}
    {#if controller.page === "branches" && host.onCommand}<Card.Root
        class="workspace-stage-card"
        ><Card.Content class="workspace-branch-actions"
          ><Button
            size="sm"
            disabled={!controller.can(
              applied ? "unapply_stack" : "apply_stack",
            )}
            onclick={() =>
              host.onCommand?.(
                {
                  kind: applied ? "unapply_stack" : "apply_stack",
                  stack: stack.id,
                  branch: stack.name,
                },
                controller.snapshot!,
              )}
            >{applied ? "Unapply from workspace" : "Apply to workspace"}</Button
          ><Button
            variant="outline"
            size="sm"
            disabled={!controller.can("delete_stack")}
            onclick={() =>
              host.onCommand?.(
                { kind: "delete_stack", stack: stack.id },
                controller.snapshot!,
              )}>Delete local</Button
          ></Card.Content
        ></Card.Root
      >{/if}
    {#if controller.page === "workspace"}
      {#if host.composer}{@render host.composer(stack)}{:else}
        <Composer
          {controller}
          {stack}
          disabled={!host.onCommand}
          onCommand={(command) =>
            host.onCommand?.(command, controller.snapshot!)}
          onOtherDrop={workspaceDropHandlers(controller, host, () => ({
            kind: "stage",
            id: stack.id,
          })).ondrop}
        />
      {/if}
    {/if}
    {#if preparing}<RepositorySkeleton
        kind="log"
        label={`Loading history for ${stack.name}`}
      />
    {:else}<div class="workspace-bookmarks">
        {#each stackGroups(stack) as group, index (group.head.name)}
          {#if index > 0}<svg class="workspace-bookmark-link" aria-hidden="true"
              ><line
                x1="14"
                x2="14"
                y1="0"
                y2="100%"
                stroke="var(--ui-log-lane-1,#2563eb)"
                stroke-width="2"
              /></svg
            >{/if}
          {#if group.unloaded}<RepositorySkeleton
              kind="log"
              label={`Loading history for ${group.head.name}`}
            /><Button
              size="sm"
              variant="outline"
              disabled={history.loading}
              onclick={() => void controller.histories.load(stack.id, true)}
              >Load history for {group.head.name}</Button
            >
          {:else}<BookmarkCard
              {controller}
              {stack}
              {host}
              {now}
              name={group.head.name}
              aliases={group.head.aliases}
              shared={group.head.shared}
              commits={group.commits}
            />{/if}
        {/each}
        {#if !stack.commits.length && !history.error}<Status
            title="No commits"
            description="No commits outside the workspace target in this branch."
          />{/if}
        {#if history.hasMore}<Button
            variant="ghost"
            class="workspace-more"
            disabled={history.loading}
            onclick={() => void controller.histories.load(stack.id, true)}
            >More commits in {stack.name}</Button
          >{/if}
      </div>{/if}
  </ColumnCanvas.Body>
</ColumnCanvas.Column>

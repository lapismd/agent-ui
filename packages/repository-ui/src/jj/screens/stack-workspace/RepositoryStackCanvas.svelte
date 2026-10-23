<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store StoreStackWorkspaceCanvas. -->
<script lang="ts">
  import { onDestroy, untrack } from "svelte";
  import { ScrollArea } from "@lapismd/design-core/shadcn/scroll-area";
  import * as ColumnCanvas from "@lapismd/design-core/shadcn/column-canvas";
  import * as Empty from "@lapismd/design-core/shadcn/empty";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import GitBranchPlus from "@lucide/svelte/icons/git-branch-plus";
  import RepositoryBranchCommand from "../../branches/branch-command/RepositoryBranchCommand.svelte";
  import Unstaged from "../../workspace/source-files/RepositoryUnstagedColumn.svelte";
  import Lane from "../../workspace/stack-lane/RepositoryStackLane.svelte";
  import Diff from "../../workspace/diff/RepositoryWorkspaceDiff.svelte";
  import Target from "./RepositoryTargetHistory.svelte";
  import DropGuide from "../../workspace/stack-lane/RepositoryWorkspaceDropGuide.svelte";
  import { workspaceDropHandlers } from "../../workspace/stack-lane/drag-handlers.js";
  import {
    appliedStacks,
    browsingStack,
    stackBookmarks,
  } from "../../../stacks/presentation.js";
  import { stackDetailsColumns } from "../../../stacks/details-columns.js";
  import {
    toggleStackBranch,
    toggleTargetBranch,
  } from "../../../stacks/selection-actions.js";
  import { TARGET_HISTORY_ORIGIN } from "../../../stacks/target-history.svelte.js";
  import { createStackWorkspaceCanvas, stackColumnConfig } from "./canvas.js";
  import type {
    StackWorkspaceController,
    WorkspaceStack,
  } from "../../../stacks/index.js";
  import {
    bookmarkKey,
    type RepositoryBookmark,
  } from "../../branches/logic/types.js";
  import type { RepositoryStackHost } from "../../workspace/stack-lane/types.js";
  let {
    controller,
    host,
    now,
  }: {
    controller: StackWorkspaceController;
    host: RepositoryStackHost;
    now?: number;
  } = $props();
  const canvas = untrack(() =>
    createStackWorkspaceCanvas(controller.snapshot, host.layoutPersistence),
  );
  let scrollViewport = $state<HTMLElement | null>(null);
  let registeredStacks = $state<string[]>([]),
    registeredDiffs = $state<string[]>([]);
  const snapshot = $derived(controller.snapshot!);
  const dragScope = $derived(
    JSON.stringify([
      snapshot.repository,
      snapshot.active,
      snapshot.revision,
      snapshot.readKey,
    ]),
  );
  $effect(() => {
    dragScope;
    untrack(() => controller.drag.clear());
  });
  const stacks = $derived(
    controller.page === "workspace"
      ? appliedStacks(snapshot)
      : [browsingStack(snapshot, controller.selectedStack)].filter(
          (stack): stack is WorkspaceStack => Boolean(stack),
        ),
  );
  const details = $derived(
    stacks.flatMap((stack) =>
      stackDetailsColumns(controller, stack).map((detail) => ({
        ...detail,
        stack: stack.id,
      })),
    ),
  );
  const bookmarks = $derived(stackBookmarks(snapshot) as RepositoryBookmark[]);
  $effect(() => {
    canvas.trailingSpacerWidth = controller.page === "workspace" ? 390 : 240;
  });
  $effect.pre(() => {
    const ids = snapshot.stacks.map((stack) => stack.id);
    untrack(() => {
      for (const id of ids)
        canvas.ensureColumn(`stack-${id}`, { ...stackColumnConfig });
    });
    registeredStacks = ids;
  });
  $effect.pre(() => {
    const origins = [
      ...controller.diffs.map((diff) => diff.origin),
      ...(controller.targetHistory.diff ? [TARGET_HISTORY_ORIGIN] : []),
    ];
    untrack(() => {
      for (const origin of origins) {
        const id = `diff-${origin}`;
        canvas.ensureColumn(id, {
          resizable: true,
          defaultWidth: 580,
          minWidth: 360,
          maxWidth: 980,
          pathLevel: 0,
          closeable: true,
        });
        canvas.open(id);
      }
    });
    registeredDiffs = origins;
  });
  onDestroy(() => void canvas.dispose());
  function select(key: string) {
    const name =
      bookmarks.find((bookmark) => bookmarkKey(bookmark) === key)?.name ??
      (snapshot.target && bookmarkKey({ name: snapshot.target.name }) === key
        ? snapshot.target.name
        : undefined);
    if (!name) return;
    if (name === snapshot.target?.name) {
      toggleTargetBranch(controller);
      return;
    }
    const stack = snapshot.stacks.find(
      (stack) =>
        stack.name === name ||
        stack.heads.some(
          (head) => head.name === name || head.aliases?.includes(name),
        ),
    );
    if (stack) toggleStackBranch(controller, stack.id, name);
    else
      controller.validation =
        snapshot.branchUnavailableReasons?.[name] ??
        "This recorded branch is unavailable.";
  }
</script>

<ScrollArea
  orientation="horizontal"
  scrollStrategy="styled"
  fillContent
  bind:viewportRef={scrollViewport}
  class="workspace-canvas-scroll"
  ondragend={() => controller.drag.clear()}
>
  <ColumnCanvas.Root
    displayMode="fixed"
    controller={canvas}
    {scrollViewport}
    class="workspace-canvas"
    aria-label="Stack workspace columns"
  >
    {#snippet trailingSpacer()}<div
        class="workspace-branch-spacer workspace-drop-target"
        data-drop-target-state={controller.page === "workspace"
          ? controller.drag.state({ kind: "new-stack" })
          : undefined}
        {...workspaceDropHandlers(controller, host, () => ({
          kind: controller.page === "workspace" ? "new-stack" : "workspace",
        }))}
      >
        <DropGuide
          feedback={controller.drag.for({
            kind: controller.page === "workspace" ? "new-stack" : "workspace",
          })}
        />
        <Empty.Root
          ><Empty.Header
            ><Empty.Media variant="icon"
              ><GitBranchPlus aria-hidden="true" /></Empty.Media
            ><Empty.Title
              >{controller.page === "workspace"
                ? "Another stack"
                : "Resize columns"}</Empty.Title
            ><Empty.Description
              >{controller.page === "workspace"
                ? "Add a stack or resize the last column to review more changes."
                : "Drag a column edge to adjust the available space."}</Empty.Description
            ></Empty.Header
          >{#if controller.page === "workspace" && host.onCommand}<Empty.Content
              ><Button
                variant="outline"
                size="sm"
                disabled={!controller.can("create_stack") ||
                  Boolean(snapshot.conflicts.length)}
                onclick={() =>
                  host.onCommand?.(
                    { kind: "create_stack", name: "" },
                    snapshot,
                  )}>Create a new branch</Button
              ></Empty.Content
            >{/if}</Empty.Root
        >
      </div>{/snippet}
    {#if controller.page === "workspace"}<Unstaged
        {controller}
        {host}
      />{#each controller.diffs.filter((diff) => diff.origin === "working" && registeredDiffs.includes(diff.origin)) as diff (diff.origin)}<Diff
          {controller}
          {diff}
          {host}
        />{/each}{/if}
    {#if controller.page === "branches"}<ColumnCanvas.Column
        id="branches"
        title="Branches"
        fixed
        resizable
        count={bookmarks.length}
        aria-label="Stack branches"
        ><ColumnCanvas.Body scrollStrategy="styled"
          ><RepositoryBranchCommand
            {bookmarks}
            groupWorkspaceBookmarks
            scrollStrategy="styled"
            targetBookmark={snapshot.target
              ? {
                  name: snapshot.target.name,
                  targets: [snapshot.target.commit],
                  description: snapshot.target.message,
                  author: snapshot.target.author,
                  authorEmail: snapshot.target.email,
                  updatedAt: snapshot.target.createdAt,
                }
              : undefined}
            selected={controller.targetHistory.active
              ? bookmarkKey({ name: snapshot.target?.name ?? "" })
              : bookmarkKey({ name: controller.selectedBranch ?? "" })}
            hasMore={Boolean(snapshot.branchesNextCursor)}
            loading={controller.branches.loading}
            onLoadMore={() => void controller.branches.load()}
            onSelect={select}
            {now}
          /></ColumnCanvas.Body
        ></ColumnCanvas.Column
      >
      {#if controller.targetHistory.active}<Target
          {controller}
          {host}
          {now}
        />{#if controller.targetHistory.diff && registeredDiffs.includes(TARGET_HISTORY_ORIGIN)}<Diff
            {controller}
            diff={controller.targetHistory.diff}
            {host}
          />{/if}{/if}
    {/if}
    {#each stacks.filter( (stack) => registeredStacks.includes(stack.id) ) as stack (stack.id)}<Lane
        {controller}
        {stack}
        {host}
        {now}
      />{#each details.filter((detail) => detail.stack === stack.id && detail.diff && registeredDiffs.includes(detail.origin)) as detail (detail.origin)}<Diff
          {controller}
          diff={detail.diff!}
          {host}
        />{/each}{/each}
  </ColumnCanvas.Root>
</ScrollArea>

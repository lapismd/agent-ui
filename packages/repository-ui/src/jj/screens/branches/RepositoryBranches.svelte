<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store repository log Branches composition. -->
<script lang="ts">
  import { onMount, onDestroy, untrack, type Snippet } from "svelte";
  import * as ColumnCanvas from "@lapismd/design-core/shadcn/column-canvas";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import RefreshIcon from "@lucide/svelte/icons/refresh-cw";
  import RepositoryShell from "../../foundations/shell/RepositoryShell.svelte";
  import RepositoryCanvasSpacer from "../../foundations/shell/RepositoryCanvasSpacer.svelte";
  import RepositorySkeleton from "../../foundations/skeleton/RepositorySkeleton.svelte";
  import RepositoryBranchCommand from "../../branches/branch-command/RepositoryBranchCommand.svelte";
  import RepositoryBranchesStatus from "./RepositoryBranchesStatus.svelte";
  import RepositoryRevisions from "../../history/revisions/RepositoryRevisions.svelte";
  import RepositoryDiffColumn from "../../history/diff-column/RepositoryDiffColumn.svelte";
  import RepositoryHistoryLimit from "../../history/revisions/RepositoryHistoryLimit.svelte";
  import RepositoryConflictResolution from "../../conflicts/conflict-resolution/RepositoryConflictResolution.svelte";
  import { createBranchesCanvas } from "./canvas.js";
  import {
    bookmarkKey,
    type RepositoryBookmark,
    type RepositoryBranchesState,
  } from "../../branches/logic/types.js";
  import type { RepositoryBranchesController } from "../../branches/logic/controller.js";
  import type { RepositoryDiffPreferences } from "../../history/diff-viewer/types.js";
  import type { LocalGraphCommit } from "@lapismd/jj-history";
  import type { HistoryState } from "../../logic/history-state.js";
  let {
    controller,
    copyText,
    now,
    canvas: suppliedCanvas,
    branchHeaderActions,
    revisionHeaderActions,
    branchActions,
    revisionActions,
    fileActions,
    diffActions,
    allChangesActions,
    diffFileMode = "single",
    onDiffFileModeChange,
    diffPageSize,
    getDiffMenuItems,
    getDiffStats,
  }: {
    controller: RepositoryBranchesController;
    copyText(value: string): Promise<void>;
    now?: number;
    /** Host owns disposal when supplying persisted layout view. */
    canvas?: ReturnType<typeof createBranchesCanvas>;
    branchHeaderActions?: Snippet<[RepositoryBranchesState]>;
    revisionHeaderActions?: Snippet<[RepositoryBranchesState]>;
    branchActions?: Snippet<[RepositoryBookmark]>;
    revisionActions?: Snippet<[LocalGraphCommit]>;
    fileActions?: Snippet<[HistoryState]>;
    diffActions?: Snippet<[Pick<HistoryState, "path" | "diff" | "busy">]>;
    allChangesActions?: Snippet<[HistoryState]>;
  } & RepositoryDiffPreferences = $props();
  const canvas = untrack(() => suppliedCanvas ?? createBranchesCanvas());
  let view = $state(untrack(() => controller.state));
  let conflictsOpen = $state(false);
  onMount(() => controller.subscribe((value) => (view = value)));
  onDestroy(() => {
    if (!suppliedCanvas) void canvas.dispose();
  });
  const history = $derived(view.history);
  const selected = $derived(
    view.selected?.kind === "bookmark" ? bookmarkKey(view.selected) : "",
  );
  const workspace = $derived(
    view.selected?.kind === "workspace" ? view.selected.workspace : null,
  );
  $effect(() => {
    const key = selected || workspace;
    const revision = history.revision?.id,
      path = history.path;
    const showDiff = !!path || (diffFileMode === "all" && history.pathsReady);
    untrack(() => {
      canvas.clear();
      if (key) canvas.select(0, key);
      if (revision) canvas.select(1, revision);
      if (path) canvas.select(2, path);
      if (showDiff) canvas.open("diff");
      else canvas.close("diff");
      conflictsOpen = false;
    });
  });
</script>

<RepositoryShell>
  <section
    class="repository-branches"
    aria-label="Repository branches"
    aria-busy={view.phase === "loading" || history.busy}
  >
    <ColumnCanvas.Root
      controller={canvas}
      displayMode="fixed"
      aria-label="Branches columns"
    >
      {#snippet trailingSpacer()}<RepositoryCanvasSpacer />{/snippet}
      <ColumnCanvas.Column
        id="branches"
        columnTitle="Branches"
        aria-label="Branches"
      >
        <ColumnCanvas.Header>
          <ColumnCanvas.Title>Branches</ColumnCanvas.Title><ColumnCanvas.Count
            >{view.bookmarks.length}</ColumnCanvas.Count
          >
          <ColumnCanvas.HeaderActions>
            {@render branchHeaderActions?.(view)}
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Refresh branches"
              title="Refresh branches"
              disabled={view.phase === "loading"}
              onclick={() => void controller.refresh()}><RefreshIcon /></Button
            >
            <ColumnCanvas.Toggle columnTitle="Branches" />
          </ColumnCanvas.HeaderActions>
        </ColumnCanvas.Header>
        <ColumnCanvas.Body>
          {#if view.phase === "loading"}<RepositorySkeleton
              label="Loading branches"
            />
          {:else if view.phase === "unavailable" || view.phase === "idle"}<RepositoryBranchesStatus
              unavailable={view.phase === "unavailable"}
              onRetry={() => void controller.refresh()}
            />
          {:else}<RepositoryBranchCommand
              bookmarks={view.bookmarks}
              workingCopies={view.workingCopies}
              {selected}
              selectedWorkspace={workspace}
              selectedCommit={workspace ? (history.revision?.id ?? null) : null}
              {now}
              hasMore={!!view.next}
              loading={view.loadingMore}
              actions={branchActions}
              onSelect={(key) => {
                const bookmark = view.bookmarks.find(
                  (item) => bookmarkKey(item) === key,
                );
                if (bookmark)
                  void controller.select({
                    kind: "bookmark",
                    name: bookmark.name,
                    remote: bookmark.remote,
                  });
              }}
              onSelectWorkingCopy={(_commit, workspace) => {
                if (workspace)
                  void controller.select({ kind: "workspace", workspace });
              }}
              onLoadMore={() => void controller.more()}
            />{/if}
        </ColumnCanvas.Body>
        {#if view.limitReached}<div
            class="repository-branches__limit"
            role="status"
          >
            Showing the loaded references. Refine the host query to narrow the
            results.
          </div>{/if}
      </ColumnCanvas.Column>
      <ColumnCanvas.Column
        id="revisions"
        columnTitle="Revisions"
        aria-label="Branch revisions"
      >
        <ColumnCanvas.Header>
          <ColumnCanvas.Title>Revisions</ColumnCanvas.Title><ColumnCanvas.Count
            >{history.commits.length}</ColumnCanvas.Count
          >
          <ColumnCanvas.HeaderActions
            >{@render revisionHeaderActions?.(view)}<ColumnCanvas.Toggle
              columnTitle="Revisions"
            /></ColumnCanvas.HeaderActions
          >
        </ColumnCanvas.Header>
        <ColumnCanvas.Body orientation="both">
          {#if view.phase !== "ready" || !view.selected}<RepositoryBranchesStatus
              unavailable={view.phase === "unavailable"}
            />
          {:else if history.busy && !history.commitsReady}<RepositorySkeleton
              label="Loading branch history"
            />
          {:else}<RepositoryRevisions
              state={history}
              controller={controller.history}
              {copyText}
              actions={revisionActions}
              {fileActions}
              showLimitNotice={false}
              onOpenDiff={() => canvas.open("diff")}
              onResolveConflicts={() => (conflictsOpen = true)}
            />{/if}
        </ColumnCanvas.Body>
        {#if history.limitReached}<RepositoryHistoryLimit
            limit={history.displayLimit}
          />{/if}
      </ColumnCanvas.Column>
      <RepositoryDiffColumn
        state={history}
        controller={controller.history}
        actions={diffActions}
        {allChangesActions}
        {diffFileMode}
        {onDiffFileModeChange}
        {diffPageSize}
        {getDiffMenuItems}
        {getDiffStats}
      />
    </ColumnCanvas.Root>
  </section>
  {#snippet surface()}
    {#if history.revision?.conflicted}<RepositoryConflictResolution
        open={conflictsOpen}
        conflicts={history.conflicts}
        ready={history.conflictsReady}
        busy={history.busy}
        onLoad={() => void controller.history.loadConflicts()}
        onClose={() => (conflictsOpen = false)}
      />{/if}
  {/snippet}
</RepositoryShell>

<style>
  .repository-branches {
    height: var(--ui-repository-branches-height, 100%);
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    color: var(--foreground);
    background: var(--background);
    font-size: var(--ui-repository-branch-body-font-size, 0.875rem);
  }
  .repository-branches__limit {
    padding: 0.75rem;
    color: var(--muted-foreground);
    font-size: var(--ui-repository-branch-secondary-font-size, 0.75rem);
    border-top: 1px solid var(--border);
  }
</style>

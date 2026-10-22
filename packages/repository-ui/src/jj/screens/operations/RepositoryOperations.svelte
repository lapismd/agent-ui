<!-- SPDX-License-Identifier: Apache-2.0; copied from Lapis Desktop with explicit host boundaries. -->
<script lang="ts">
  import type { RepositoryOperationsProps } from "./types.js";
  import RepositoryOperationEmpty from "../../operations/operation-column/RepositoryOperationEmpty.svelte";
  import SearchIcon from "@lucide/svelte/icons/search";
  import RepositoryOperationQuery from "./RepositoryOperationQuery.svelte";
  import RepositoryHistoryLimit from "../../history/revisions/RepositoryHistoryLimit.svelte";
  import RepositoryConflictResolution from "../../conflicts/conflict-resolution/RepositoryConflictResolution.svelte";
  import FileQuestionIcon from "@lucide/svelte/icons/file-question-mark";
  import * as Empty from "@lapismd/design-core/shadcn/empty";
  import RepositorySkeleton from "../../foundations/skeleton/RepositorySkeleton.svelte";
  import { repositoryWorkspaces } from "../../logic/workspaces.js";
  import { onMount, onDestroy, untrack } from "svelte";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import RepositoryLogHeader from "../../history/log-header/RepositoryLogHeader.svelte";
  import * as ColumnCanvas from "@lapismd/design-core/shadcn/column-canvas";
  import {
    initialOperationState,
    operationPins,
  } from "../../logic/operation-state.js";
  import { operationGraphRows } from "../../logic/operation-metadata.js";
  import { createLogCanvas } from "../../logic/log-canvas.js";
  import RepositoryOperationFiles from "../../operations/operation-files/RepositoryOperationFiles.svelte";
  import RepositoryOperationColumn from "../../operations/operation-column/RepositoryOperationColumn.svelte";
  import RepositoryShell from "../../foundations/shell/RepositoryShell.svelte";
  import RepositoryGraph from "../../history/graph/RepositoryGraph.svelte";
  let {
    controller,
    sources,
    initialOperation,
    copyText,
    onHistory,
    searchable = true,
    queryInfo,
    headerControls,
    headerActions,
    operationActions,
    metadataActions,
    fileActions,
    diffActions,
    allChangesActions,
    diffFileMode = "single",
    onDiffFileModeChange,
    diffPageSize,
    getDiffMenuItems,
    getDiffStats,
    onRevert,
  }: RepositoryOperationsProps = $props();
  let snapshot = $state(initialOperationState());
  let queryOpen = $state(false),
    conflictsOpen = $state(false);
  const conflictScope = $derived(
    `${snapshot.operation}/${snapshot.selected?.id}/${snapshot.parent}/${snapshot.files.group?.change}/${snapshot.files.to}`,
  );
  $effect(() => {
    void conflictScope;
    conflictsOpen = false;
  });
  const pins = $derived(operationPins(snapshot));
  const rows = $derived(operationGraphRows(snapshot));
  const selection = $derived(
    `${snapshot.selected?.id ?? ""}/${snapshot.files.path ?? ""}`,
  );
  const canvas = createLogCanvas();
  let selectedOperation: string | undefined;
  onDestroy(() => void canvas.dispose());
  $effect(() => {
    selection;
    const id = untrack(() => snapshot.selected?.id);
    const path = untrack(() => snapshot.files.path);
    untrack(() => {
      canvas.clear();
      if (id) {
        canvas.select(0, id);
      }
      if (id && id !== selectedOperation) canvas.open("diff");
      selectedOperation = id;
      if (path) {
        canvas.select(1, path);
        canvas.open("diff");
      } else if (!id) canvas.close("diff");
    });
  });
  onMount(() => {
    const unsubscribe = controller.subscribe((value) => (snapshot = value));
    void controller.refresh(initialOperation);
    return unsubscribe;
  });
</script>

{#snippet controls()}{@render headerControls?.(snapshot)}{/snippet}
{#snippet actions()}
  {#if searchable}<Button
      variant="ghost"
      size="icon-xs"
      aria-label="Search operations"
      title="Search operations"
      aria-expanded={queryOpen}
      onclick={() => (queryOpen = !queryOpen)}
      ><SearchIcon aria-hidden="true" /></Button
    >{/if}
  {@render headerActions?.(snapshot)}
{/snippet}

<RepositoryShell>
  <section
    class="repository-operations"
    aria-label="Repository operation log"
    aria-busy={snapshot.busy}
  >
    <div class="operation-columns">
      <ColumnCanvas.Root controller={canvas} aria-label="Operation log columns">
        <ColumnCanvas.Column
          id="revisions"
          columnTitle="Op Log"
          aria-label="Operations"
        >
          <RepositoryLogHeader
            controls={headerControls ? controls : undefined}
            {actions}
            {sources}
            {copyText}
            nodes={snapshot.nodes}
            workspaces={repositoryWorkspaces(snapshot.workspaceCommits)}
            workspace={snapshot.workspace}
            onWorkspaceSelect={(next) => void controller.selectWorkspace(next)}
            onWorkspaceOpen={() => void controller.loadWorkspaces()}
            title="Op Log"
            count={snapshot.nodes.length}
            operations={pins}
            operation={snapshot.operation}
            selectionLabel="Pinned operation"
            busy={snapshot.busy}
            onSelect={(operation) => controller.selectPin(operation)}
            onRefresh={() => controller.refresh()}
          />
          {#if searchable && queryOpen}<RepositoryOperationQuery
              info={queryInfo}
              {controller}
              busy={snapshot.busy}
            />{/if}
          <ColumnCanvas.Body>
            {#if snapshot.phase === "loading"}<RepositorySkeleton
                label="Preparing operation log…"
              />
            {:else if snapshot.phase === "unavailable"}<RepositoryOperationEmpty
                title="Operation log unavailable"
                description="Operation log is unavailable for this vault. Refresh to try again."
              />
            {:else if !snapshot.headsReady}<RepositorySkeleton
                label="Loading repository operations…"
              />
            {:else if !snapshot.operation}<Empty.Root role="status"
                ><Empty.Header
                  ><Empty.Media variant="icon"
                    ><FileQuestionIcon aria-hidden="true" /></Empty.Media
                  ><Empty.Title
                    >{snapshot.heads.length > 1
                      ? "Choose an operation"
                      : "No repository operations"}</Empty.Title
                  ><Empty.Description
                    >{snapshot.heads.length > 1
                      ? "Choose an operation to inspect its ancestry."
                      : "No repository operations available."}</Empty.Description
                  ></Empty.Header
                ></Empty.Root
              >{/if}
            {#if snapshot.snapshot}
              {#if snapshot.selected && !snapshot.nodes.some((node) => node.id === snapshot.selected?.id)}
                <section aria-label="Selected operation outside loaded graph">
                  <p>The selected operation is outside this graph page.</p>
                  <RepositoryOperationFiles
                    actions={operationActions}
                    {fileActions}
                    {onRevert}
                    onConflicts={() => (conflictsOpen = true)}
                    {copyText}
                    commits={snapshot.commits}
                    onHistory={onHistory && snapshot.selected
                      ? () => onHistory?.(snapshot.selected!.id)
                      : undefined}
                    state={snapshot}
                    {controller}
                    onOpenDiff={() => canvas.open("diff")}
                    onOpenDetails={() => canvas.open("diff")}
                  />
                </section>
              {/if}
              {#if !snapshot.ready && !snapshot.busy}<RepositoryOperationEmpty
                  title="Operations unavailable"
                  description="Retry the query or refresh the pinned operation."
                />
              {:else if snapshot.ready && !snapshot.nodes.length}<RepositoryOperationEmpty
                  title="No operations"
                  description="No operations in this history."
                />{/if}
              {#if snapshot.nodes.length}<RepositoryGraph
                  operationTitles
                  {copyText}
                  commitLabel="operation ID"
                  revisions={rows}
                  selectedId={snapshot.selected?.id}
                  label="Operation graph"
                  onSelect={(id) => {
                    const node = snapshot.nodes.find((item) => item.id === id);
                    if (node)
                      void (snapshot.selected?.id === id
                        ? controller.clearSelection()
                        : controller.select(node));
                  }}
                >
                  {#snippet selectedFiles()}<RepositoryOperationFiles
                      actions={operationActions}
                      {fileActions}
                      {onRevert}
                      onConflicts={() => (conflictsOpen = true)}
                      {copyText}
                      commits={snapshot.commits}
                      onHistory={onHistory && snapshot.selected
                        ? () => onHistory?.(snapshot.selected!.id)
                        : undefined}
                      state={snapshot}
                      {controller}
                      onOpenDiff={() => canvas.open("diff")}
                      onOpenDetails={() => canvas.open("diff")}
                    />{/snippet}
                </RepositoryGraph>{/if}
              {#if snapshot.next}<Button
                  size="sm"
                  variant="ghost"
                  style="width: 100%; font-weight: 400; color: var(--ui-repository-operations-more-foreground, var(--muted-foreground))"
                  disabled={snapshot.busy}
                  onclick={() => controller.more()}>More operations</Button
                >{/if}
            {/if}
          </ColumnCanvas.Body>
          {#if snapshot.limitReached}<RepositoryHistoryLimit
              limit={snapshot.displayLimit}
              label="operations"
            />{/if}
        </ColumnCanvas.Column>
        <RepositoryOperationColumn
          {diffFileMode}
          {onDiffFileModeChange}
          {diffPageSize}
          {getDiffMenuItems}
          {getDiffStats}
          state={snapshot}
          {controller}
          {copyText}
          {metadataActions}
          {diffActions}
          {allChangesActions}
        />
      </ColumnCanvas.Root>
    </div>
  </section>
  {#snippet surface()}
    {#key `${snapshot.selected?.id}/${snapshot.parent}/${snapshot.files.group?.change}/${snapshot.files.to}`}
      {#if snapshot.files.to}<RepositoryConflictResolution
          open={conflictsOpen}
          conflicts={snapshot.conflicts}
          ready={snapshot.conflictsReady}
          busy={snapshot.busy}
          onLoad={() => void controller.loadConflicts()}
          onClose={() => (conflictsOpen = false)}
        />{/if}
    {/key}
  {/snippet}
</RepositoryShell>

<style>
  .repository-operations {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    background: var(--ui-workspace-view-background, var(--background));
    color: var(--ui-workspace-view-foreground, var(--foreground));
    font-size: var(--ui-repository-operations-font-size, 0.875rem);
  }
  .operation-columns {
    display: block;
    width: 100%;
    min-width: 0;
    min-height: 0;
    flex: 1;
    overflow: hidden;
  }
  p {
    padding: 0.75rem;
  }
</style>

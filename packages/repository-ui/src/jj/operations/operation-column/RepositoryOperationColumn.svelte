<!-- SPDX-License-Identifier: Apache-2.0; copied from Lapis Desktop with explicit host boundaries. -->
<script lang="ts">
  import type { Snippet } from "svelte";
  import RepositoryFileTitle from "../../history/file-title/RepositoryFileTitle.svelte";
  import RepositorySkeleton from "../../foundations/skeleton/RepositorySkeleton.svelte";
  import * as ColumnCanvas from "@lapismd/design-core/shadcn/column-canvas";
  import {
    FileChangeStats,
    type FileDiffViewMode,
  } from "@lapismd/design-core/diff";
  import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
  import type { OperationState } from "../../logic/operation-state.js";
  import type { OperationController } from "../../logic/operation-controller.js";
  import { changeStats } from "../../logic/history-files.js";
  import RepositoryOperationParentPicker from "../operation-parent-picker/RepositoryOperationParentPicker.svelte";
  import RepositoryOperationRail from "../operation-rail/RepositoryOperationRail.svelte";
  import RepositoryOperationArguments from "../operation-arguments/RepositoryOperationArguments.svelte";
  import RepositoryOperationMessage from "../operation-message/RepositoryOperationMessage.svelte";
  import RepositoryDiffViewer from "../../history/diff-viewer/RepositoryDiffViewer.svelte";
  import RepositoryDiffMenu from "../../history/diff-viewer/RepositoryDiffMenu.svelte";
  import type { RepositoryDiffPreferences } from "../../history/diff-viewer/types.js";
  import RepositoryDiffControls from "../../history/diff-controls/RepositoryDiffControls.svelte";
  import "../../styles/repository-operation-column.css";
  let {
    state: snapshot,
    controller,
    copyText,
    metadataActions,
    diffActions,
    allChangesActions,
    diffFileMode = "single",
    onDiffFileModeChange,
    diffPageSize,
    getDiffMenuItems,
    getDiffStats,
  }: {
    state: OperationState;
    controller: OperationController;
    copyText(value: string): Promise<void>;
    metadataActions?: Snippet<[OperationState]>;
    diffActions?: Snippet<[OperationState]>;
    allChangesActions?: Snippet<[OperationState]>;
  } & RepositoryDiffPreferences = $props();
  let expanded = $state(true);
  let viewMode = $state<FileDiffViewMode>("unified"),
    wrap = $state(false);
  const comparisonKey = $derived(
    `${snapshot.operation}/${snapshot.selected?.id}/${snapshot.files.group?.change}/${snapshot.files.from}/${snapshot.files.to}`,
  );
  const selected = $derived(
    snapshot.files.diff ??
      snapshot.files.paths.find((file) => file.path === snapshot.files.path),
  );
  const menuContext = $derived(
    selected && snapshot.files.from && snapshot.files.to
      ? {
          comparisonKey,
          operation: snapshot.operation,
          from: snapshot.files.from,
          to: snapshot.files.to,
          path: selected.path,
          change: selected,
        }
      : undefined,
  );
  const stats = $derived(
    diffFileMode === "all"
      ? snapshot.files.from && snapshot.files.to
        ? getDiffStats?.({
            comparisonKey,
            operation: snapshot.operation,
            from: snapshot.files.from,
            to: snapshot.files.to,
          })
        : undefined
      : changeStats(snapshot.files.diff),
  );
  const panelId = $derived(
    `operation-metadata-${snapshot.selected?.id ?? "none"}`,
  );
  const operationId = $derived(snapshot.selected?.id);
  $effect(() => {
    operationId;
    expanded = true;
  });
</script>

<ColumnCanvas.Column
  id="diff"
  columnTitle="Diff"
  aria-label="Revision changes"
  style="border:0;border-radius:0;background:transparent"
>
  <ColumnCanvas.Body>
    <div
      class="operation-diff-stack"
      data-view-mode={viewMode}
      data-file-mode={diffFileMode}
    >
      {#if snapshot.busy && !snapshot.detail && !snapshot.selected}<RepositorySkeleton
          kind="operation"
          label="Loading operation details"
        />{:else}
        {#if snapshot.selected}
          <section class="operation-card" aria-label="Selected operation">
            <header class="operation-card-header">
              <button
                class="operation-toggle"
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                aria-label={expanded
                  ? "Collapse operation details"
                  : "Expand operation details"}
                style="flex:none;padding:0.25rem"
                onclick={() => (expanded = !expanded)}
              >
                <ChevronDownIcon aria-hidden="true" />
              </button>
              <RepositoryOperationMessage
                textHover={false}
                message={snapshot.selected.description || "No description"}
                {copyText}
                onSelect={() => (expanded = !expanded)}
              />
              <div class="operation-card-actions">
                {@render metadataActions?.(snapshot)}
              </div>
            </header>
            {#if expanded}
              <div id={panelId}>
                <RepositoryOperationRail
                  operation={snapshot.selected}
                  onSelect={(id) => void controller.selectId(id)}
                  {copyText}
                />
                {#if snapshot.selected.parents.length > 0}
                  <RepositoryOperationParentPicker
                    {copyText}
                    parents={snapshot.selected.parents}
                    nodes={[...snapshot.nodes, ...snapshot.parentNodes]}
                    target={snapshot.parent}
                    loading={snapshot.busy}
                    onOpen={() => void controller.loadParents()}
                    onSelect={(id) => void controller.selectParent(id)}
                  />
                  {#if !snapshot.parent}<p class="operation-parent-hint">
                      Choose a parent to compare this operation.
                    </p>{/if}
                {/if}
                <RepositoryOperationArguments
                  attributes={snapshot.selected.attributes}
                />
              </div>
            {/if}
          </section>
        {/if}
        <section
          class="operation-file-card"
          aria-label={diffFileMode === "all"
            ? "All changes diff"
            : "Selected file diff"}
        >
          <header class="operation-card-header">
            <span class="operation-file-path"
              >{#if diffFileMode === "all"}All changes{:else}<RepositoryFileTitle
                  path={snapshot.files.path}
                />{/if}</span
            >
            <div class="operation-card-actions">
              {#if diffFileMode === "all"}{@render allChangesActions?.(
                  snapshot,
                )}{:else}{@render diffActions?.(snapshot)}{/if}
              {#if stats}<FileChangeStats {...stats} showZero />{/if}
              <RepositoryDiffControls
                bind:viewMode
                bind:wrap
                fileMode={diffFileMode}
                onFileModeChange={onDiffFileModeChange}
              />
              {#if diffFileMode === "single"}<RepositoryDiffMenu
                  context={menuContext}
                  getItems={getDiffMenuItems}
                />{/if}
              <ColumnCanvas.Close
                aria-label="Close Diff column"
                title="Close Diff"
              />
            </div>
          </header>
          <RepositoryDiffViewer
            {comparisonKey}
            from={snapshot.files.from ?? ""}
            to={snapshot.files.to ?? ""}
            operation={snapshot.operation}
            files={snapshot.files.paths}
            entries={snapshot.files.diffs}
            selectedPath={snapshot.files.path}
            selectionRequest={snapshot.files.pathRequest}
            fileMode={diffFileMode}
            pageSize={diffPageSize}
            {viewMode}
            {wrap}
            hasMore={!!snapshot.files.nextPath}
            loadingPaths={snapshot.busy}
            limitReached={snapshot.files.pathsLimitReached}
            onLoad={(path) => controller.files.loadDiff(path)}
            onMore={() => controller.files.morePaths()}
            {getDiffMenuItems}
          />
        </section>
      {/if}
    </div>
  </ColumnCanvas.Body>
</ColumnCanvas.Column>

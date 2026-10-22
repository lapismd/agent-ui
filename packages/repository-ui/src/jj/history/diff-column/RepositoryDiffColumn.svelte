<!-- SPDX-License-Identifier: Apache-2.0; copied from Lapis Desktop with explicit host boundaries. -->
<script lang="ts">
  import type { Snippet } from "svelte";
  import RepositoryFileTitle from "../file-title/RepositoryFileTitle.svelte";
  import {
    FileChangeStats,
    type FileDiffViewMode,
  } from "@lapismd/design-core/diff";
  import * as ColumnCanvas from "@lapismd/design-core/shadcn/column-canvas";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import type { HistoryState } from "../../logic/history-state.js";

  import { changeStats } from "../../logic/history-files.js";
  import RepositoryDiffControls from "../diff-controls/RepositoryDiffControls.svelte";
  import RepositoryDiffViewer from "../diff-viewer/RepositoryDiffViewer.svelte";
  import RepositoryDiffMenu from "../diff-viewer/RepositoryDiffMenu.svelte";
  import type {
    RepositoryDiffPreferences,
    RepositoryDiffMenuProvider,
  } from "../diff-viewer/types.js";
  import type { HistoryController } from "../../logic/history-controller.js";
  import RotateCcwIcon from "@lucide/svelte/icons/rotate-ccw";
  let {
    state: snapshot,
    controller,
    columnId = "diff",
    label = "Revision changes",
    closeLabel = "Close Diff column",
    onRestore,
    actions,
    allChangesActions,
    diffFileMode = "single",
    onDiffFileModeChange,
    diffPageSize,
    getDiffMenuItems,
    getDiffStats,
  }: {
    state: HistoryState;
    controller: Pick<
      HistoryController,
      "selectPath" | "loadDiff" | "morePaths"
    >;
    columnId?: string;
    label?: string;
    closeLabel?: string;
    onRestore?(path: string): void | Promise<void>;
    actions?: Snippet<[Pick<HistoryState, "path" | "diff" | "busy">]>;
    allChangesActions?: Snippet<[HistoryState]>;
  } & RepositoryDiffPreferences = $props();
  let viewMode = $state<FileDiffViewMode>("split");
  let wrap = $state(false);
  const comparisonKey = $derived(
    `${snapshot.operation}/${snapshot.base}/${snapshot.revision?.id}`,
  );
  const selected = $derived(
    snapshot.diff ?? snapshot.paths.find((file) => file.path === snapshot.path),
  );
  const menuContext = $derived(
    selected && snapshot.base && snapshot.revision
      ? {
          comparisonKey,
          operation: snapshot.operation,
          from: snapshot.base,
          to: snapshot.revision.id,
          path: selected.path,
          change: selected,
        }
      : undefined,
  );
  const stats = $derived(
    diffFileMode === "all"
      ? snapshot.base && snapshot.revision
        ? getDiffStats?.({
            comparisonKey,
            operation: snapshot.operation,
            from: snapshot.base,
            to: snapshot.revision.id,
          })
        : undefined
      : changeStats(snapshot.diff),
  );
  const fileMenu: RepositoryDiffMenuProvider = (context) => [
    ...(getDiffMenuItems?.(context) ?? []),
    ...(onRestore
      ? [
          {
            id: "restore-file-version",
            label: "Restore this file version",
            icon: RotateCcwIcon,
            disabled: snapshot.busy,
            onSelect: () => onRestore!(context.path),
          },
        ]
      : []),
  ];
</script>

<ColumnCanvas.Column id={columnId} columnTitle="Diff" aria-label={label}>
  <ColumnCanvas.Header>
    <ColumnCanvas.Title
      >{#if diffFileMode === "all"}All changes{:else}<RepositoryFileTitle
          path={snapshot.path}
        />{/if}</ColumnCanvas.Title
    >
    <ColumnCanvas.HeaderActions class="repository-review-column-actions">
      {#if stats}<FileChangeStats {...stats} showZero />{/if}
      {#if onRestore && diffFileMode === "single" && snapshot.path}<Button
          variant="ghost"
          size="icon-sm"
          aria-label="Restore this file version"
          title="Restore this file version"
          disabled={snapshot.busy}
          onclick={() => void onRestore!(snapshot.path!)}
          ><RotateCcwIcon /></Button
        >{/if}
      <RepositoryDiffControls
        bind:viewMode
        bind:wrap
        fileMode={diffFileMode}
        onFileModeChange={onDiffFileModeChange}
      />
      {#if diffFileMode === "all"}{@render allChangesActions?.(
          snapshot,
        )}{:else}{@render actions?.(snapshot)}{/if}
      {#if diffFileMode === "single"}<RepositoryDiffMenu
          context={menuContext}
          getItems={getDiffMenuItems}
        />{/if}
      <ColumnCanvas.Close aria-label={closeLabel} />
    </ColumnCanvas.HeaderActions>
  </ColumnCanvas.Header>
  <ColumnCanvas.Body orientation={diffFileMode === "all" ? "vertical" : "both"}>
    <RepositoryDiffViewer
      {comparisonKey}
      from={snapshot.base ?? ""}
      to={snapshot.revision?.id ?? ""}
      operation={snapshot.operation}
      files={snapshot.paths}
      entries={snapshot.diffs}
      selectedPath={snapshot.path}
      selectionRequest={snapshot.pathRequest}
      fileMode={diffFileMode}
      pageSize={diffPageSize}
      {viewMode}
      {wrap}
      hasMore={!!snapshot.nextPath}
      loadingPaths={snapshot.busy}
      limitReached={snapshot.pathsLimitReached}
      onLoad={(path) => controller.loadDiff(path)}
      onMore={() => controller.morePaths()}
      getDiffMenuItems={onRestore ? fileMenu : getDiffMenuItems}
    />
  </ColumnCanvas.Body>
</ColumnCanvas.Column>

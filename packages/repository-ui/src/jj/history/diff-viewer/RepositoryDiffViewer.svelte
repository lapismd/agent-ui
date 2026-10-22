<script lang="ts">
  import { untrack } from "svelte";
  import {
    FileDiffComposer,
    FileChangeStats,
    type FileDiffViewMode,
  } from "@lapismd/design-core/diff";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { Badge } from "@lapismd/design-core/shadcn/badge";
  import TriangleAlertIcon from "@lucide/svelte/icons/triangle-alert";
  import type { LocalFileDiffChange } from "@lapismd/jj-history";
  import type { RepositoryDiffEntries } from "../../logic/comparison-diffs.js";
  import { changeStats } from "../../logic/history-files.js";
  import RepositoryDiffMenu from "./RepositoryDiffMenu.svelte";
  import RepositoryDiffBody from "./RepositoryDiffBody.svelte";
  import type {
    RepositoryDiffFileMode,
    RepositoryDiffMenuProvider,
    RepositoryDiffActionContext,
  } from "./types.js";
  let {
    comparisonKey,
    from,
    to,
    operation,
    files,
    entries,
    selectedPath,
    selectionRequest = 0,
    fileMode = "single",
    pageSize = 20,
    viewMode = "unified",
    wrap = false,
    hasMore = false,
    loadingPaths = false,
    limitReached = false,
    onLoad,
    onMore,
    getDiffMenuItems,
  }: {
    comparisonKey: string;
    from: string;
    to: string;
    operation?: string;
    files: readonly LocalFileDiffChange[];
    entries: RepositoryDiffEntries;
    selectedPath?: string;
    selectionRequest?: number;
    fileMode?: RepositoryDiffFileMode;
    pageSize?: number;
    viewMode?: FileDiffViewMode;
    wrap?: boolean;
    hasMore?: boolean;
    loadingPaths?: boolean;
    limitReached?: boolean;
    onLoad(path: string): Promise<void>;
    onMore(): Promise<void>;
    getDiffMenuItems?: RepositoryDiffMenuProvider;
  } = $props();
  const batch = $derived(
    Number.isFinite(pageSize) ? Math.max(1, Math.floor(pageSize)) : 20,
  );
  let visible = $state(20),
    expanded = $state<string[]>([]);
  let scrollRequest = $state<{ path: string; requestId: number } | null>(null);
  let requestId = 0,
    paging = $state(false),
    pagingError = $state("");
  $effect(() => {
    comparisonKey;
    untrack(() => {
      visible = batch;
      expanded = [];
      scrollRequest = null;
      pagingError = "";
    });
  });
  $effect(() => {
    const path = selectedPath ?? files[0]?.path;
    const list = files,
      mode = fileMode;
    selectionRequest;
    comparisonKey;
    untrack(() => {
      if (mode !== "all" || !path) return;
      const index = list.findIndex((file) => file.path === path);
      if (index < 0) return;
      visible = Math.max(visible, Math.ceil((index + 1) / batch) * batch);
      if (!expanded.includes(path)) expanded = [...expanded, path];
      scrollRequest = { path, requestId: ++requestId };
    });
  });
  $effect(() => {
    const paths =
      fileMode === "all" ? expanded : selectedPath ? [selectedPath] : [];
    for (const path of paths) if (!entries[path]) void onLoad(path);
  });
  function context(path: string): RepositoryDiffActionContext {
    const listed = files.find((file) => file.path === path)!;
    const entry = entries[path];
    return {
      comparisonKey,
      operation,
      from,
      to,
      path,
      change: entry?.phase === "ready" ? entry.change : listed,
    };
  }
  function toggle(path: string, collapsed: boolean) {
    expanded = collapsed
      ? expanded.filter((value) => value !== path)
      : [...new Set([...expanded, path])];
  }
  async function more() {
    if (paging) return;
    const key = comparisonKey,
      target = visible + batch;
    paging = true;
    pagingError = "";
    try {
      if (visible >= files.length && hasMore) await onMore();
      if (key === comparisonKey) visible = target;
    } catch (error) {
      if (key === comparisonKey) pagingError = String(error);
    } finally {
      paging = false;
    }
  }
</script>

<div class="repository-diff-viewer" data-file-mode={fileMode}>
  {#if fileMode === "all" && files.length > 0}
    {#key comparisonKey}
      <FileDiffComposer
        files={files.slice(0, visible).map(({ path }) => ({ path }))}
        {selectedPath}
        scrollToFile={scrollRequest}
        stickyHeaders
        expandOnHeaderClick
        collapsedFilePaths={files
          .filter((file) => !expanded.includes(file.path))
          .map(({ path }) => path)}
        onFileToggle={toggle}
      >
        {#snippet fileHeaderMeta({ path })}
          {@const target = context(path)}
          {@const stats = changeStats(target.change)}
          {#if stats}<FileChangeStats {...stats} />{/if}
          {#if target.change.after.length > 1 || (target.change.content.status === "unavailable" && target.change.content.reason === "conflict")}
            <Badge variant="destructive"
              ><TriangleAlertIcon aria-hidden="true" />Conflicted</Badge
            >
          {:else if target.change.sources.some((source) => source.kind === "rename")}<Badge
              variant="secondary">Renamed</Badge
            >
          {:else}<Badge variant="secondary">Modified</Badge>{/if}
        {/snippet}
        {#snippet fileHeaderTrailing({ path })}
          <RepositoryDiffMenu
            context={context(path)}
            getItems={getDiffMenuItems}
          />
        {/snippet}
        {#snippet fileContent({ path })}
          <RepositoryDiffBody
            {path}
            entry={entries[path]}
            {onLoad}
            {viewMode}
            {wrap}
            sizing="content"
          />
        {/snippet}
      </FileDiffComposer>
    {/key}
    {#if visible < files.length || hasMore}<Button
        variant="ghost"
        class="repository-diff-more"
        disabled={paging || loadingPaths}
        onclick={() => void more()}>Load more file diffs</Button
      >{/if}
    {#if pagingError}<p role="alert">{pagingError}</p>{/if}
    {#if limitReached}<p role="status">
        Showing the first 500 changed files. Narrow the comparison to see more.
      </p>{/if}
  {:else}
    <RepositoryDiffBody
      path={selectedPath}
      entry={selectedPath ? entries[selectedPath] : undefined}
      {onLoad}
      {viewMode}
      {wrap}
    />
  {/if}
</div>

<style>
  .repository-diff-viewer {
    min-width: 0;
    min-height: 0;
    padding: var(--ui-repository-diff-viewer-padding, 0);
  }
  .repository-diff-viewer[data-file-mode="all"] {
    /* The column's overlay scrollbar must not cover section selection edges. */
    padding-inline-end: var(
      --ui-repository-diff-viewer-scrollbar-inset,
      0.5rem
    );
    --ui-diff-frame-radius: 0px;
    --ui-diff-file-gap: 0;
    --ui-diff-file-section-border: 0;
    --ui-diff-file-section-separator: 1px solid var(--border);
    --ui-diff-file-selection-outline: 1px solid var(--ring);
    --ui-diff-file-selection-outline-offset: -1px;
    --ui-diff-file-selected-header: var(--ui-diff-selected);
    --ui-diff-file-content-padding-bottom: 0;
  }
  .repository-diff-viewer[data-file-mode="single"] {
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
  }
  .repository-diff-viewer :global(.repository-diff-more) {
    width: 100%;
    justify-content: center;
    color: var(--muted-foreground);
  }
</style>

<script lang="ts">
  import RepositorySkeleton from "../../foundations/skeleton/RepositorySkeleton.svelte";
  import RepositoryBrowserEmpty from "../file-preview/RepositoryBrowserEmpty.svelte";
  import type { Snippet } from "svelte";
  import {
    FileListing,
    FileListingViewModeToggle,
    FileChangeStats,
    type FileListingFile,
    type FileListingDirectory,
    type FileListingViewMode,
  } from "@lapismd/design-core/diff";
  import "./file-tree-resize.css";
  import "./file-tree.css";

  let {
    files,
    directories = [],
    mode = "tree",
    collapsedDirectoryPaths,
    selectedPath = "",
    hasMore = false,
    loading = false,
    showChangeStats = false,
    onSelectPath,
    onLoadMore,
    onModeChange,
    onDirectoryToggle,
    empty,
    header,
  }: {
    files: readonly FileListingFile[];
    directories?: readonly FileListingDirectory[];
    mode?: FileListingViewMode;
    collapsedDirectoryPaths?: ReadonlySet<string>;
    selectedPath?: string | undefined;
    hasMore?: boolean;
    loading?: boolean;
    showChangeStats?: boolean;
    onSelectPath: (path: string) => void;
    onLoadMore?: () => void;
    onModeChange?: (mode: FileListingViewMode) => void;
    onDirectoryToggle?: (path: string) => void;
    empty?: Snippet;
    header?: Snippet<[Snippet]>;
  } = $props();
</script>

<div class="repository-browser__file-tree">
  {#snippet controls()}
    <span class="repository-browser__file-tree-title">Files</span>
    <span class="repository-browser__file-tree-count">{files.length}</span>
    <FileListingViewModeToggle {mode} {onModeChange} />
  {/snippet}
  {#if header}{@render header(controls)}{:else}<div
      class="repository-browser__file-tree-actions"
    >
      {@render controls()}
    </div>{/if}
  {#if loading && !files.length && !directories.length}
    <RepositorySkeleton kind="files" label="Loading repository file tree" />
  {:else if !files.length && !directories.length}
    {#if empty}{@render empty()}{:else}<RepositoryBrowserEmpty
        folder
        title="No repository files"
        description="The selected revision has no loaded files."
      />{/if}
  {:else}
    <FileListing
      files={[...files]}
      directories={[...directories]}
      {mode}
      {collapsedDirectoryPaths}
      selectedPath={selectedPath || null}
      virtualize
      {hasMore}
      {loading}
      loadingLabel="Loading more repository files"
      {onSelectPath}
      {onLoadMore}
      {onDirectoryToggle}
    >
      {#snippet fileMeta({ file })}
        {#if showChangeStats}
          {#if typeof file.additions === "number" && typeof file.deletions === "number"}
            <FileChangeStats
              additions={file.additions}
              deletions={file.deletions}
            />
          {:else}<span class="sr-only">Line counts unavailable</span>{/if}
        {:else}<span class="sr-only">Repository file</span>{/if}
      {/snippet}
    </FileListing>
  {/if}
</div>

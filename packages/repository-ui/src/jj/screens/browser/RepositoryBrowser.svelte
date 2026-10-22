<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store's repository files AppShell composition. -->
<script lang="ts">
  import { browserTreeEntries } from "../../browse/logic/state.js";
  import { pathPageKey } from "../../browse/logic/requests.js";
  import { onMount, untrack, type Snippet } from "svelte";
  import { AppShell } from "@lapismd/design-core/shell";
  import RepositorySidebarResize from "./RepositorySidebarResize.svelte";
  import RepositoryShell from "../../foundations/shell/RepositoryShell.svelte";
  import RepositoryBreadcrumb from "../../browse/breadcrumb/RepositoryBreadcrumb.svelte";
  import RepositoryFileTree from "../../browse/file-tree/RepositoryFileTree.svelte";
  import RepositoryDirectory from "../../browse/directory/RepositoryDirectory.svelte";
  import RepositoryFilePreview from "../../browse/file-preview/RepositoryFilePreview.svelte";
  import RepositorySkeleton from "../../foundations/skeleton/RepositorySkeleton.svelte";
  import RepositoryBrowserEmpty from "../../browse/file-preview/RepositoryBrowserEmpty.svelte";
  import type { RepositoryBrowserController } from "../../browse/logic/controller.js";
  import type {
    RepositoryBrowserCommit,
    RepositoryBrowserEntry,
    RepositoryBrowserSelection,
  } from "../../browse/logic/types.js";
  import "../../browse/file-tree/file-tree-resize.css";
  import "../../browse/file-preview/files.css";
  let {
    controller,
    repositoryName,
    now,
    copyText,
    fileTreeOpen = $bindable(false),
    fileTreeWidth = $bindable(256),
    inspectorWidth = $bindable(420),
    onInspectorResize,
    onLayoutChange,
    onOpenRepository,
    onSelectCommit,
    onHistory,
    onBlame,
    blame,
    headerActions,
    directoryControls,
    directoryActions,
    rowActions,
    fileActions,
    inspector,
  }: {
    controller: RepositoryBrowserController;
    repositoryName: string;
    now: number;
    copyText(value: string): Promise<void>;
    fileTreeOpen?: boolean;
    fileTreeWidth?: number;
    inspectorWidth?: number;
    onInspectorResize?(width: number): void;
    onLayoutChange?(layout: { open: boolean; width: number }): void;
    onOpenRepository?(): void;
    onSelectCommit?(commit: RepositoryBrowserCommit): void;
    onHistory?(selection: RepositoryBrowserSelection): void;
    onBlame?(selection: RepositoryBrowserSelection): void;
    headerActions?: Snippet<[RepositoryBrowserSelection]>;
    directoryControls?: Snippet;
    directoryActions?: Snippet;
    rowActions?: Snippet<[RepositoryBrowserEntry]>;
    fileActions?: Snippet<[RepositoryBrowserSelection]>;
    inspector?: Snippet<[RepositoryBrowserSelection]>;
    blame?: Snippet<[RepositoryBrowserSelection]>;
  } = $props();
  let view = $state(untrack(() => controller.state));
  const selection = $derived({
    pin: view.pin,
    path: view.path ?? view.directory,
  });
  const entries = $derived(browserTreeEntries(view));
  const files = $derived(entries.filter((entry) => entry.type === "blob"));
  const directories = $derived(
    entries
      .filter((entry) => entry.type === "tree")
      .map((entry) => ({ path: entry.path })),
  );
  const window = $derived(view.pages[pathPageKey(view.directory)]);
  const treeLoading = $derived(view.loadingPages.size > 0);
  onMount(() => controller.subscribe((state) => (view = state)));
  const clamp = (width: number) =>
    Math.min(
      420,
      Math.max(208, Number.isFinite(width) ? Math.round(width) : 256),
    );
  function saveLayout() {
    onLayoutChange?.({ open: fileTreeOpen, width: clamp(fileTreeWidth) });
  }
  function toggleFileTree() {
    fileTreeOpen = !fileTreeOpen;
    saveLayout();
  }
</script>

{#snippet treeHeader(controls: Snippet)}<AppShell.Toolbar
    label="Repository files header"
    style="min-height:var(--ui-shell-toolbar-height);margin-inline:-0.5rem;--ui-shell-toolbar-padding-inline:0.5rem;--ui-shell-toolbar-padding-block:0"
    >{@render controls()}</AppShell.Toolbar
  >{/snippet}

<div class="repository-browser-screen">
  <RepositoryShell>
    <section class="repository-browser-layout" aria-label="Repository browser">
      {#if fileTreeOpen}
        <AppShell.Body.Sidebar
          panelId="repository-file-tree"
          side="left"
          label="Repository file tree"
          mobileLabel="Repository file tree"
          bind:open={fileTreeOpen}
          scrollbarVisibility="hover"
          class="repository-browser__file-tree-region"
          style={`--ui-shell-body-sidebar-width:${clamp(fileTreeWidth)}px`}
        >
          {#if view.directoryPhase === "loading" && !entries.length}<RepositorySkeleton
              kind="files"
              label="Loading repository file tree"
            />
          {:else}<RepositoryFileTree
              {files}
              header={treeHeader}
              {directories}
              mode={view.mode}
              collapsedDirectoryPaths={view.collapsedDirectoryPaths}
              selectedPath={view.path}
              hasMore={!!view.pages[pathPageKey("", view.mode !== "tree")]
                ?.nextCursor &&
                !view.pages[pathPageKey("", view.mode !== "tree")]
                  ?.limitReached}
              loading={treeLoading}
              onSelectPath={(path) => void controller.openFile(path)}
              onLoadMore={() => void controller.more("", view.mode !== "tree")}
              onModeChange={(mode) => void controller.setMode(mode)}
              onDirectoryToggle={(path) =>
                void controller.toggleDirectory(
                  path,
                  !view.collapsedDirectoryPaths.has(path),
                )}
            >
              {#snippet empty()}<RepositoryBrowserEmpty
                  folder
                  title="No repository files"
                  description="The selected revision has no loaded files."
                />{/snippet}
            </RepositoryFileTree>{/if}
        </AppShell.Body.Sidebar>
        <RepositorySidebarResize
          bind:width={fileTreeWidth}
          label="Resize repository file tree"
          onResize={saveLayout}
        />
      {/if}
      <AppShell.Body.Content
        label="Repository file browser"
        scrollbarVisibility="hover"
        class="repository-browser__files-content"
      >
        <section
          class="repository-browser__files-surface"
          aria-label="Repository files"
        >
          <AppShell.Toolbar
            label="Repository path header"
            class="repository-browser-toolbar"
            style="min-height:var(--ui-shell-toolbar-height);--ui-shell-toolbar-padding-inline:0;--ui-shell-toolbar-padding-block:0"
          >
            <RepositoryBreadcrumb
              {repositoryName}
              path={view.path ?? view.directory}
              onOpenDirectory={(path) => void controller.openDirectory(path)}
              {onOpenRepository}
            />{@render headerActions?.(selection)}
          </AppShell.Toolbar>
          {#if view.path}
            <RepositoryFilePreview
              file={view.file}
              phase={view.filePhase}
              {selection}
              display={view.display}
              {now}
              {fileTreeOpen}
              onToggleFileTree={toggleFileTree}
              onDisplayChange={(display) => controller.setDisplay(display)}
              onRetry={() => void controller.openFile(view.path!, true)}
              {onHistory}
              {onBlame}
              {blame}
              {copyText}
              actions={fileActions}
            />
          {:else}<RepositoryDirectory
              bind:fileTreeOpen
              onToggleFileTree={toggleFileTree}
              {now}
              currentPath={view.directory}
              entries={window?.entries ?? []}
              latestCommit={window?.latestCommit}
              documents={window?.documents}
              phase={view.directoryPhase}
              hasMore={!!window?.nextCursor && !window.limitReached}
              loading={view.directoryPhase === "loading"}
              limitReached={window?.limitReached ?? false}
              onOpenDirectory={(path) => void controller.openDirectory(path)}
              onOpenFile={(path) => void controller.openFile(path)}
              {onSelectCommit}
              onLoadMore={() => void controller.more()}
              onRetry={() => void controller.refresh()}
              {copyText}
              controls={directoryControls}
              actions={directoryActions}
              {rowActions}
            />{/if}
        </section>
      </AppShell.Body.Content>
      {#if inspector && view.path}<RepositorySidebarResize
          side="right"
          bind:width={inspectorWidth}
          minimum={280}
          maximum={800}
          defaultWidth={420}
          label="Resize file history sidebar"
          onResize={onInspectorResize}
        /><AppShell.Body.Sidebar
          side="right"
          panelId="repository-file-inspector"
          label="File inspector"
          style={`--ui-shell-body-sidebar-width:${Math.min(800, Math.max(280, Number.isFinite(inspectorWidth) ? inspectorWidth : 420))}px;background:var(--background)`}
          scrollbarVisibility="hover"
          >{@render inspector(selection)}</AppShell.Body.Sidebar
        >{/if}
    </section>
  </RepositoryShell>
</div>

<style>
  .repository-browser-screen {
    height: var(--ui-repository-browser-height, 100%);
    min-width: 0;
    min-height: 0;
  }
  .repository-browser-layout {
    display: flex;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    flex: 1;
    overflow: hidden;
  }
  :global(.repository-browser-toolbar) {
    display: flex;
    align-items: center;
    flex: none;
    min-width: 0;
    padding-inline-end: 0.5rem;
  }
  :global(.repository-browser-toolbar .repository-breadcrumb) {
    flex: 1;
    min-width: 0;
  }
</style>

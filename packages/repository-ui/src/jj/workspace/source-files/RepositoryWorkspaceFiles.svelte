<!-- SPDX-License-Identifier: Apache-2.0; copied/adapted from JJ Store StoreStackSourceFiles. -->
<script lang="ts">
  import { untrack, type Snippet } from "svelte";
  import {
    FileListing,
    FileListingViewModeToggle,
    type FileListingViewMode,
  } from "@lapismd/design-core/diff";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import RepositorySkeleton from "../../foundations/skeleton/RepositorySkeleton.svelte";
  import Status from "./RepositoryWorkspaceStatus.svelte";
  import { workspaceListingFiles } from "../stack-lane/presentation.js";
  import type { StackWorkspaceController } from "../../../stacks/index.js";
  import { workspaceFileDrag } from "../../../stacks/file-drag.js";
  let {
    controller,
    source,
    label = "Changed files",
    title = "Changed files",
    compact = false,
    draggable = false,
    selectedPath,
    onSelect,
    actions,
    showHeader = true,
  }: {
    controller: StackWorkspaceController;
    source: string;
    label?: string;
    title?: string;
    compact?: boolean;
    draggable?: boolean;
    selectedPath?: string;
    onSelect(path: string): void;
    actions?: Snippet;
    showHeader?: boolean;
  } = $props();
  let mode = $state<FileListingViewMode>("tree");
  const readState = $derived(controller.details.fileState(source));
  const files = $derived(
    workspaceListingFiles(
      controller.filesFor(source),
      controller.snapshot?.conflicts.map((item) => item.path),
    ),
  );
  const scope = $derived(
    JSON.stringify([
      controller.snapshot?.repository,
      controller.snapshot?.active,
      controller.snapshot?.revision,
      controller.snapshot?.readKey,
    ]),
  );
  $effect(() => {
    const selected = source;
    scope;
    untrack(() => {
      void controller.details.loadFiles(selected);
    });
    return () => untrack(() => controller.details.cancelFiles(selected));
  });
</script>

<section
  class="workspace-files"
  class:compact
  aria-label={label}
  aria-busy={readState.loading}
  ondragend={() => controller.drag.clear()}
>
  {#if showHeader}<header>
      <strong>{title}</strong><span>{files.length}</span
      ><FileListingViewModeToggle bind:mode />{@render actions?.()}
    </header>{/if}
  <div class="workspace-files__body">
    {#if readState.error}<Status
        unavailable
        title="Changed files unavailable"
        description={readState.error}
        onRetry={() => void controller.details.loadFiles(source)}
      />
    {:else if controller.details.lazy && !readState.loaded}<RepositorySkeleton
        kind="files"
        label={`Loading ${label}`}
      />
    {:else if !files.length}<Status />
    {:else}<FileListing
        {files}
        {mode}
        {selectedPath}
        virtualize={false}
        loading={readState.loading}
        hasMore={Boolean(readState.nextCursor)}
        onLoadMore={() => void controller.details.loadFiles(source, true)}
        onSelectPath={onSelect}
        {...draggable ? workspaceFileDrag(controller, () => source) : {}}
      />{#if readState.nextCursor}<Button
          variant="ghost"
          disabled={readState.loading}
          onclick={() => void controller.details.loadFiles(source, true)}
          >More changed files</Button
        >{/if}{/if}
  </div>
</section>

<style>
  .workspace-files {
    display: flex;
    flex-direction: column;
    min-width: 0;
    background: var(
      --ui-repository-workspace-files-background,
      var(--background)
    );
  }
  .workspace-files.compact {
    border: 1px solid var(--border);
    border-radius: 0.5rem;
  }
  .compact .workspace-files__body {
    padding: 0.25rem 0.35rem 0.35rem;
  }
  .workspace-files__body {
    min-width: 0;
    min-height: 0;
  }
  header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.45rem 0.65rem;
    border-bottom: 1px solid var(--border);
    font-size: var(--ui-repository-workspace-files-font-size, 0.8125rem);
  }
  strong {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  header > span {
    flex: none;
    padding: 0.05rem 0.4rem;
    border-radius: 999px;
    background: color-mix(in srgb, var(--foreground) 7%, var(--background));
    font-size: 0.75rem;
  }
</style>

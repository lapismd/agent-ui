<!-- SPDX-License-Identifier: Apache-2.0; copied from Lapis Desktop with explicit host boundaries. -->
<script lang="ts">
  import type { Snippet } from "svelte";
  import RepositoryCommitPicker from "../commit-picker/RepositoryCommitPicker.svelte";
  import { FileChangeStats } from "@lapismd/design-core/diff";
  import { changeStats } from "../../logic/history-files.js";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import type { HistoryController } from "../../logic/history-controller.js";
  import type { HistoryState } from "../../logic/history-state.js";
  import { listingFiles } from "../../logic/history-files.js";
  import RepositoryChangedFiles from "../changed-files/RepositoryChangedFiles.svelte";
  let {
    state,
    controller,
    onOpenDiff,
    copyText,
    comparisonTargets,
    comparisonLabel,
    separateActions = false,
    actions,
  }: {
    state: HistoryState;
    controller: Pick<
      HistoryController,
      "loadParents" | "selectBase" | "selectPath" | "morePaths"
    >;
    onOpenDiff(): void;
    copyText(value: string): Promise<void>;
    comparisonTargets?: readonly string[];
    comparisonLabel?: string;
    separateActions?: boolean;
    actions?: Snippet<[HistoryState]>;
  } = $props();
  const files = $derived(listingFiles(state.paths, state.diff));
  const targets = $derived(comparisonTargets ?? state.revision?.parents ?? []);
</script>

{#snippet headerActions()}{@render actions?.(state)}{/snippet}

{#if targets.length}
  <div class="revision-files" data-after-actions={separateActions || undefined}>
    <RepositoryCommitPicker
      {copyText}
      parents={targets}
      {comparisonLabel}
      revisions={[...state.commits, ...state.parentCommits]}
      target={state.base}
      loading={state.busy}
      onOpen={() => void controller.loadParents()}
      onSelect={(id) => void controller.selectBase(id)}
    >
      {#snippet statistics()}
        <div
          class="comparison-statistics"
          aria-label="Selected comparison statistics"
        >
          {#if state.base && state.pathsReady}<span
              >{state.paths.length}{state.nextPath ? "+" : ""}
              {state.paths.length === 1 && !state.nextPath ? "file" : "files"} in
              selected comparison</span
            >{/if}
          {#if state.path && changeStats(state.diff)}<span
              >Selected file: {state.path}
              <FileChangeStats {...changeStats(state.diff)} /></span
            >{/if}
        </div>
      {/snippet}
    </RepositoryCommitPicker>
    {#if state.base}
      {#if state.pathsReady || state.busy}<RepositoryChangedFiles
          actions={actions ? headerActions : undefined}
          {files}
          selectedPath={state.path}
          initialLoading={!state.pathsReady && state.busy}
          loading={state.busy}
          hasMore={!!state.nextPath}
          onSelect={(path) => {
            onOpenDiff();
            void controller.selectPath(path);
          }}
          onMore={() => void controller.morePaths()}
        />{/if}
      {#if !state.pathsReady && !state.busy}<p role="status">
          File changes are unavailable.
        </p>
        <Button size="sm" onclick={() => controller.selectBase(state.base!)}
          >Retry comparison</Button
        >
      {:else if state.pathsReady && !state.paths.length && !state.busy}<p>
          No changed files in this comparison.
        </p>{/if}
      {#if state.paths.length === 500}<p>
          Showing the first 500 changed files.
        </p>{/if}
    {/if}
  </div>
{/if}

<style>
  .revision-files {
    padding: 0 0.5rem 0.5rem;
    font-size: 0.8125rem;
  }
  .revision-files[data-after-actions] {
    padding-block-start: 0.5rem;
  }
  .comparison-statistics {
    display: grid;
    gap: 0.25rem;
  }
  .comparison-statistics > span {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.375rem;
  }
</style>

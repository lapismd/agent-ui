<!-- SPDX-License-Identifier: Apache-2.0; copied from Lapis Desktop with explicit host boundaries. -->
<script lang="ts">
  import type { Snippet } from "svelte";
  import type { LocalGraphCommit } from "@lapismd/jj-history";
  import FileQuestionIcon from "@lucide/svelte/icons/file-question-mark";
  import * as Empty from "@lapismd/design-core/shadcn/empty";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import type { HistoryController } from "../../logic/history-controller.js";
  import { type HistoryState } from "../../logic/history-state.js";
  let {
    state,
    controller,
    copyText,
    onOpenDiff,
    onOpenEvolution,
    onResolveConflicts,
    onRestoreVault,
    evolutionOpen = false,
    graphRevisions,
    graphLabel = "Revision graph",
    comparisonTargets,
    comparisonLabel,
    comparisonUnavailable,
    actions,
    fileActions,
  }: {
    state: HistoryState;
    controller: Pick<
      HistoryController,
      | "clearRevision"
      | "selectRevision"
      | "moreCommits"
      | "loadParents"
      | "selectBase"
      | "selectPath"
      | "morePaths"
    >;
    onOpenDiff(): void;
    onOpenEvolution?(): void;
    onResolveConflicts?(): void;
    onRestoreVault?(): void;
    evolutionOpen?: boolean;
    graphRevisions?: import("../../logic/graph/model.js").RepositoryLogRevision[];
    graphLabel?: string;
    comparisonTargets?: readonly string[];
    comparisonLabel?: string;
    comparisonUnavailable?: string;
    actions?: Snippet<[LocalGraphCommit]>;
    fileActions?: Snippet<[HistoryState]>;
    copyText(value: string): Promise<void>;
  } = $props();
  import RepositoryRevisionFiles from "../revision-files/RepositoryRevisionFiles.svelte";
  import RepositoryCommitMessage from "../commit-message/RepositoryCommitMessage.svelte";
  import RepositoryRevisionActions from "../revision-actions/RepositoryRevisionActions.svelte";
  import RepositoryGraph from "../graph/RepositoryGraph.svelte";
  import { commitRows } from "../../logic/graph/model.js";
  const hasMessageBody = $derived(
    Boolean(state.revision?.description.split("\n").slice(1).join("\n").trim()),
  );
  const revisions = $derived(graphRevisions ?? commitRows(state.commits));
</script>

<div class="repository-revisions">
  {#if !state.commitsReady && !state.busy}<Empty.Root role="status"
      ><Empty.Header
        ><Empty.Media variant="icon"
          ><FileQuestionIcon aria-hidden="true" /></Empty.Media
        ><Empty.Title>Revisions unavailable</Empty.Title><Empty.Description
          >Refresh to try reading the pinned operation again.</Empty.Description
        ></Empty.Header
      ></Empty.Root
    >
  {:else if state.commitsReady && !state.commits.length && !state.busy}<Empty.Root
      role="status"
      ><Empty.Header
        ><Empty.Media variant="icon"
          ><FileQuestionIcon aria-hidden="true" /></Empty.Media
        ><Empty.Title>No revisions</Empty.Title><Empty.Description
          >No revisions in this operation.</Empty.Description
        ></Empty.Header
      ></Empty.Root
    >{/if}
  {#if revisions.length}<RepositoryGraph
      commits={state.commits}
      {revisions}
      {copyText}
      selectedId={state.revision?.id}
      label={graphLabel}
      onSelect={(id) => {
        const commit = state.commits.find((item) => item.id === id);
        if (state.revision?.id === id) void controller.clearRevision();
        else if (commit) void controller.selectRevision(commit);
      }}
    >
      {#snippet selectedFiles()}
        {#if actions || onOpenEvolution || onRestoreVault || (state.revision?.conflicted && onResolveConflicts)}<RepositoryRevisionActions
            expanded={evolutionOpen}
            onEvolution={onOpenEvolution}
            onResolve={state.revision?.conflicted
              ? onResolveConflicts
              : undefined}
            onRestore={onRestoreVault}
            >{#if state.revision}{@render actions?.(
                state.revision,
              )}{/if}</RepositoryRevisionActions
          >{/if}
        <RepositoryCommitMessage
          description={state.revision?.description ?? ""}
        />
        {#if !comparisonUnavailable}<RepositoryRevisionFiles
            actions={fileActions}
            {copyText}
            {state}
            {controller}
            {onOpenDiff}
            {comparisonTargets}
            {comparisonLabel}
            separateActions={!hasMessageBody &&
              Boolean(
                onOpenEvolution ||
                onRestoreVault ||
                (state.revision?.conflicted && onResolveConflicts),
              )}
          />{/if}{/snippet}
    </RepositoryGraph>{/if}
  {#if state.next}<Button
      size="sm"
      disabled={state.busy}
      onclick={() => controller.moreCommits()}>More revisions</Button
    >{/if}
  {#if state.limitReached}<p role="status">
      Showing the first {state.displayLimit} revisions. Refine the query to narrow
      the results.
    </p>{/if}
</div>

<style>
  .repository-revisions {
    min-width: 0;
  }
  p {
    padding: var(--ui-repository-revisions-padding, 0.75rem);
  }
</style>

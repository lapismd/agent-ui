<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store StoreStackWorkspaceDiff. -->
<script lang="ts">
  import { untrack } from "svelte";
  import * as ColumnCanvas from "@lapismd/design-core/shadcn/column-canvas";
  import Actions from "./RepositoryWorkspaceDiffActions.svelte";
  import Hunk from "./RepositoryWorkspaceDiffHunk.svelte";
  import {
    workspaceHunkSelection,
    workspaceAggregateSource,
  } from "../../../stacks/files.js";
  import { TARGET_HISTORY_ORIGIN } from "../../../stacks/target-history.svelte.js";
  import { FileDiff } from "@lapismd/design-core/diff";
  import RepositoryFileTitle from "../../history/file-title/RepositoryFileTitle.svelte";
  import RepositorySkeleton from "../../foundations/skeleton/RepositorySkeleton.svelte";
  import Controls from "../../history/diff-controls/RepositoryDiffControls.svelte";
  import Status from "../source-files/RepositoryWorkspaceStatus.svelte";
  import { workspaceHunkContext } from "../../../stacks/hunk-context.js";
  import type {
    StackWorkspaceController,
    WorkspaceOpenDiff,
  } from "../../../stacks/index.js";
  import type { RepositoryStackHost } from "../stack-lane/types.js";
  let {
    controller,
    diff,
    host,
    embedded = false,
  }: {
    controller: StackWorkspaceController;
    diff: WorkspaceOpenDiff;
    host: RepositoryStackHost;
    embedded?: boolean;
  } = $props();
  let viewMode = $state<"unified" | "split">("unified"),
    wrap = $state(false);
  const file = $derived(
    controller.filesFor(diff.source).find((file) => file.path === diff.path),
  );
  const read = $derived(controller.details.patchState(diff.source, diff.path));
  const context = $derived(
    file ? workspaceHunkContext(file) : new Map<string, string>(),
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
    const source = diff.source,
      path = diff.path;
    scope;
    untrack(() => {
      void controller.details.loadFiles(source);
    });
    return () => untrack(() => controller.details.cancelDiff(source, path));
  });
  $effect(() => {
    if (file?.content?.status === "unloaded") {
      const source = diff.source,
        path = diff.path;
      untrack(() => {
        void controller.details.loadDiff(source, path);
      });
    }
  });
  const selectionSource = $derived(file?.selectionSource ?? diff.source);
  const selectable = $derived(
    diff.origin !== TARGET_HISTORY_ORIGIN &&
      !workspaceAggregateSource(selectionSource) &&
      (controller.can("create_commit") ||
        controller.can("transfer") ||
        controller.can("split")),
  );
  function selection(hunk: string) {
    if (
      !file ||
      !controller.snapshot ||
      !selectable ||
      (controller.details.lazy && !/^native:[0-9a-f]{64}$/u.test(hunk))
    )
      return null;
    return workspaceHunkSelection(
      controller.snapshot,
      selectionSource,
      file.path,
      hunk,
    );
  }
  function choose(hunk: string, checked: boolean) {
    if (!file || controller.locked) return;
    const current = diff.hunks ?? file.hunks.map((item) => item.id);
    const hunks = checked
      ? [...new Set([...current, hunk])]
      : current.filter((value) => value !== hunk);
    controller.selectFile(
      diff.source,
      file.path,
      hunks,
      diff.origin.startsWith("stack-") ? diff.origin.slice(6) : undefined,
    );
  }
</script>

{#snippet header()}
  <ColumnCanvas.Header
    ><ColumnCanvas.Title
      ><RepositoryFileTitle path={diff.path} /></ColumnCanvas.Title
    ><ColumnCanvas.HeaderActions
      ><Controls bind:viewMode bind:wrap /><Actions
        {controller}
        {diff}
        {host}
      />{@render host.diffActions?.(diff)}<ColumnCanvas.Close
        aria-label={`Close diff from ${diff.origin}`}
        onclick={() => controller.closeDiff(diff.origin)}
      /></ColumnCanvas.HeaderActions
    ></ColumnCanvas.Header
  >
{/snippet}
{#snippet content()}
  {#if read.error}<Status
      unavailable
      title="Diff unavailable"
      description={read.error}
      onRetry={() => void controller.details.loadDiff(diff.source, diff.path)}
    />
  {:else if !file || file.content?.status === "unloaded"}<RepositorySkeleton
      kind="files"
      label={`Loading diff for ${diff.path}`}
    />
  {:else if file.content?.status === "unavailable"}<Status
      unavailable
      title={file.content.reason === "binary"
        ? "Binary file"
        : "Preview unavailable"}
      description={`This file cannot be displayed as a text diff (${file.content.reason}).`}
    />
  {:else if !file.hunks.length && !file.patch}<Status
      title="No text changes"
      description="There are no changed text hunks for this file."
    />
  {:else}<section
      class="workspace-hunks"
      aria-label={`Diff hunks from ${diff.origin} · ${file.path}`}
    >
      {#if file.hunks.length}{#each file.hunks as hunk (hunk.id)}
          {@const selected = selection(hunk.id)}
          <Hunk
            {hunk}
            displayPatch={context.get(hunk.id)}
            path={file.path}
            origin={diff.origin}
            {viewMode}
            {wrap}
            checked={!diff.hunks || diff.hunks.includes(hunk.id)}
            selectable={Boolean(selected)}
            disabled={controller.locked}
            onDragStart={selected &&
            host.onCommand &&
            (controller.can("transfer") || controller.can("create_commit"))
              ? (event) =>
                  controller.drag.start(event, {
                    kind: "selection",
                    selection: selected,
                  })
              : undefined}
            onDragEnd={() => controller.drag.clear()}
            onChecked={(checked) => choose(hunk.id, checked)}
            onAssign={selected && host.onCommand && controller.can("transfer")
              ? () =>
                  host.onCommand?.(
                    { kind: "transfer", selection: selected, target: "" },
                    controller.snapshot!,
                  )
              : undefined}
          />
        {/each}
      {:else}<FileDiff
          path={file.path}
          patch={file.patch}
          {viewMode}
          {wrap}
          sizing="content"
        />{/if}
    </section>{/if}
{/snippet}
{#if embedded}
  <section class="workspace-embedded-diff" aria-label="Selected file diff">
    {@render header()}
    <div>{@render content()}</div>
  </section>
{:else}
  <ColumnCanvas.Column
    id={`diff-${diff.origin}`}
    columnTitle="Diff"
    resizable
    aria-label={`Selected changes from ${diff.origin}`}
  >
    {@render header()}<ColumnCanvas.Body
      scrollStrategy="styled"
      orientation="both">{@render content()}</ColumnCanvas.Body
    >
  </ColumnCanvas.Column>
{/if}

<style>
  .workspace-embedded-diff {
    min-width: 0;
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: var(--ui-column-canvas-radius, var(--radius));
    background: var(--background);
  }
  .workspace-hunks {
    display: grid;
    gap: var(--ui-repository-workspace-diff-gap, 0.5rem);
    margin: 0;
    padding: 0.5rem;
  }
</style>

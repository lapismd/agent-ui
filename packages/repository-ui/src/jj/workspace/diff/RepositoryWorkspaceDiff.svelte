<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store StoreStackWorkspaceDiff. -->
<script lang="ts">
  import { untrack } from "svelte";
  import * as ColumnCanvas from "@lapismd/design-core/shadcn/column-canvas";
  import * as Card from "@lapismd/design-core/shadcn/card";
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
  }: {
    controller: StackWorkspaceController;
    diff: WorkspaceOpenDiff;
    host: RepositoryStackHost;
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
</script>

<ColumnCanvas.Column
  id={`diff-${diff.origin}`}
  columnTitle="Diff"
  resizable
  aria-label={`Selected changes from ${diff.origin}`}
>
  <ColumnCanvas.Header
    ><ColumnCanvas.Title
      ><RepositoryFileTitle path={diff.path} /></ColumnCanvas.Title
    ><ColumnCanvas.HeaderActions
      ><Controls bind:viewMode bind:wrap />{@render host.diffActions?.(
        diff,
      )}<ColumnCanvas.Close
        aria-label={`Close diff from ${diff.origin}`}
        onclick={() => controller.closeDiff(diff.origin)}
      /></ColumnCanvas.HeaderActions
    ></ColumnCanvas.Header
  >
  <ColumnCanvas.Body scrollStrategy="styled" orientation="both">
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
        {#if file.hunks.length}{#each file.hunks as hunk (hunk.id)}<Card.Root
              class="workspace-hunk-card"
              ><Card.Header class="workspace-hunk-header"
                ><Card.Title><code>{hunk.label}</code></Card.Title></Card.Header
              ><Card.Content class="workspace-hunk-content"
                ><FileDiff
                  path={file.path}
                  patch={context.get(hunk.id) ?? hunk.patch}
                  {viewMode}
                  {wrap}
                  sizing="content"
                /></Card.Content
              ></Card.Root
            >{/each}
        {:else}<FileDiff
            path={file.path}
            patch={file.patch}
            {viewMode}
            {wrap}
            sizing="content"
          />{/if}
      </section>{/if}
  </ColumnCanvas.Body>
</ColumnCanvas.Column>

<style>
  .workspace-hunks {
    display: grid;
    gap: var(--ui-repository-workspace-diff-gap, 0.5rem);
    margin: 0;
    padding: 0.5rem;
  }
  :global(.workspace-hunk-card) {
    padding: 0;
    gap: 0;
    overflow: hidden;
  }
  :global(.workspace-hunk-header) {
    display: flex;
    align-items: center;
    padding: 0.25rem 0.5rem;
    background: var(--muted);
    border-bottom: 1px solid var(--border);
  }
  code {
    font-family: var(--font-mono);
    font-size: var(--ui-repository-workspace-hunk-font-size, 0.6875rem);
    font-weight: 400;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
  :global(.workspace-hunk-content) {
    padding: 0;
    min-width: 0;
  }
</style>

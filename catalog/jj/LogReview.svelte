<script lang="ts">
  import { onMount, onDestroy, untrack } from "svelte";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import * as Tooltip from "@lapismd/design-core/shadcn/tooltip";
  import ExternalLinkIcon from "@lucide/svelte/icons/external-link";
  import CopyIcon from "@lucide/svelte/icons/copy";
  import {
    RepositoryPanel,
    createRepositoryDiffMenu,
    type RepositoryDiffFileMode,
    type RepositoryDiffMenuItem,
    initialHistoryState,
    type HistoryState,
  } from "../../packages/repository-ui/src/jj/index.js";
  import type { LocalGraphCommit } from "@lapismd/jj-history";
  import { createJjDemo } from "./support/create-demo.svelte.js";
  import { useDemoAuthors } from "./support/authors.svelte.js";
  let { variant = "DenseHistory" }: { variant?: string } = $props();
  const collectionStory = untrack(() =>
    ["AllInOne", "PagedFiles", "FileActions"].includes(variant),
  );
  let diffFileMode: RepositoryDiffFileMode = $state(
    collectionStory ? "all" : "single",
  );
  useDemoAuthors();
  const demo = untrack(() => createJjDemo("RepositoryPanel", variant));
  const menuItems: RepositoryDiffMenuItem[] = [
    ...createRepositoryDiffMenu({
      copyText: demo.copyText,
      absolutePath: ({ path }) => `/workspace/lapis/${path}`,
      reveal: ({ path, from, to }) => {
        demo.state.actions.push(`reveal:${path}:${from}:${to}`);
      },
    }),
    ...(untrack(() => variant === "FileActions")
      ? [
          {
            id: "open-in-editor",
            label: "Open in editor",
            icon: ExternalLinkIcon,
            onSelect: ({ path }: { path: string }) => {
              demo.state.actions.push(`editor:${path}`);
            },
          },
        ]
      : []),
  ];
  let snapshot = $state(initialHistoryState());
  onMount(() => {
    let selected = false;
    return demo.history.subscribe((value) => {
      snapshot = value;
      if (
        collectionStory &&
        !selected &&
        value.pathsReady &&
        value.paths.length
      ) {
        selected = true;
        void demo.history.selectPath(value.paths[0].path);
      }
    });
  });
  onDestroy(() => void demo.close());
</script>

{#snippet headerActions(state: HistoryState)}
  <Button
    size="icon-xs"
    variant="ghost"
    aria-label="Open repository"
    title="Open repository"
    onclick={() => demo.state.actions.push(`repository:${state.operation}`)}
    ><ExternalLinkIcon aria-hidden="true" /></Button
  >
{/snippet}
{#snippet headerControls(state: HistoryState)}
  <Button
    size="xs"
    variant="outline"
    onclick={() => demo.state.actions.push(`host-controls:${state.operation}`)}
    >Host source controls</Button
  >
{/snippet}
{#snippet revisionActions(commit: LocalGraphCommit)}
  <Button
    size="xs"
    variant="outline"
    onclick={() => demo.state.actions.push(`review:${commit.id}`)}
    >Review selected revision</Button
  >
{/snippet}
{#snippet diffActions(state: { path?: string })}
  <Button
    size="icon-sm"
    variant="ghost"
    aria-label="Open file in workspace"
    title="Open file in workspace"
    onclick={() => demo.state.actions.push(`file:${state.path}`)}
    ><ExternalLinkIcon aria-hidden="true" /></Button
  >
{/snippet}
{#snippet fileActions(state: HistoryState)}
  <Button
    size="icon-xs"
    variant="ghost"
    aria-label="Copy changed file paths"
    title="Copy changed file paths"
    onclick={() =>
      demo.state.actions.push(
        `paths:${state.paths.map((change) => change.path).join(",")}`,
      )}><CopyIcon aria-hidden="true" /></Button
  >
{/snippet}

<Tooltip.Provider
  ><div class="log-review" data-testid="log-review">
    <RepositoryPanel
      {diffFileMode}
      onDiffFileModeChange={(mode) => {
        diffFileMode = mode;
        demo.state.actions.push(`preference:${mode}`);
      }}
      diffPageSize={variant === "PagedFiles" ? 4 : 20}
      getDiffMenuItems={() => menuItems}
      controller={demo.history}
      sources={demo.source}
      copyText={demo.copyText}
      restore={demo.restore}
      searchable
      initialRevision={demo.commits[0].id}
      {headerActions}
      headerControls={variant === "HostControls" ? headerControls : undefined}
      {revisionActions}
      {diffActions}
      {fileActions}
    />
    <output
      hidden
      data-testid="log-review-state"
      data-errors={JSON.stringify(demo.state.errors)}
      data-actions={JSON.stringify(demo.state.actions)}
      data-state={JSON.stringify({
        operation: snapshot.operation,
        revision: snapshot.revision?.id,
        path: snapshot.path,
        base: snapshot.base,
        revset: snapshot.revset,
        count: snapshot.commits.length,
        limitReached: snapshot.limitReached,
      })}
    ></output>
  </div></Tooltip.Provider
>

<style>
  .log-review {
    height: var(--ui-repository-story-height, 100dvh);
    min-height: 0;
  }
</style>

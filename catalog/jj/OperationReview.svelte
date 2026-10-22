<script lang="ts">
  import { onMount, onDestroy, untrack } from "svelte";
  import ExternalLinkIcon from "@lucide/svelte/icons/external-link";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import * as Tooltip from "@lapismd/design-core/shadcn/tooltip";
  import {
    RepositoryOperations,
    createRepositoryDiffMenu,
    type RepositoryDiffFileMode,
    type RepositoryDiffMenuItem,
    initialOperationState,
    type OperationState,
  } from "../../packages/repository-ui/src/jj/index.js";
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
  const demo = untrack(() => createJjDemo("OperationReview", variant));
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
  let snapshot = $state(initialOperationState());
  onMount(() => {
    let selected = false,
      fileSelected = false;
    const unsubscribe = demo.operations.subscribe((next) => {
      snapshot = next;
      if (
        collectionStory &&
        !fileSelected &&
        next.files.pathsReady &&
        next.files.paths.length
      ) {
        fileSelected = true;
        void demo.operations.files.selectPath(next.files.paths[0].path);
      }
      const node = next.nodes[variant === "MergeParents" ? 3 : 0];
      if (!selected && next.ready && node) {
        selected = true;
        void demo.operations.select(node);
      }
    });
    return unsubscribe;
  });
  onDestroy(() => void demo.close());
  function action(name: string, state: OperationState) {
    demo.state.actions.push(
      `${name}:${state.operation}:${state.selected?.id}:${state.parent}:${state.files.to}:${state.files.path}`,
    );
  }
</script>

{#snippet headerControls(context: OperationState)}
  <Button size="xs" onclick={() => action("controls", context)}
    >Host source controls</Button
  >
{/snippet}
{#snippet headerActions(context: OperationState)}
  <Button
    size="xs"
    variant="ghost"
    onclick={() => action("repository", context)}>Open repository</Button
  >
{/snippet}
{#snippet operationActions(context: OperationState)}
  <Button size="xs" variant="outline" onclick={() => action("review", context)}
    >Review operation</Button
  >
{/snippet}
{#snippet metadataActions(context: OperationState)}
  <Button size="xs" variant="ghost" onclick={() => action("metadata", context)}
    >Copy metadata</Button
  >
{/snippet}
{#snippet fileActions(context: OperationState)}
  <Button size="xs" variant="ghost" onclick={() => action("paths", context)}
    >Copy paths</Button
  >
{/snippet}
{#snippet diffActions(context: OperationState)}
  <Button size="xs" variant="ghost" onclick={() => action("file", context)}
    >Open file</Button
  >
{/snippet}

<Tooltip.Provider>
  <div class="operation-review">
    <RepositoryOperations
      {diffFileMode}
      onDiffFileModeChange={(mode) => {
        diffFileMode = mode;
        demo.state.actions.push(`preference:${mode}`);
      }}
      diffPageSize={variant === "PagedFiles" ? 4 : 20}
      getDiffMenuItems={() => menuItems}
      controller={demo.operations}
      sources={demo.source}
      copyText={demo.copyText}
      searchable
      headerControls={variant === "HostControls" ? headerControls : undefined}
      {headerActions}
      {operationActions}
      {metadataActions}
      {fileActions}
      {diffActions}
      onHistory={(operation) => demo.state.actions.push(`history:${operation}`)}
      onRevert={(context) => action("revert-request", context)}
    />
  </div>
</Tooltip.Provider>
<output
  hidden
  data-testid="operation-review-state"
  data-state={JSON.stringify({
    operation: snapshot.operation,
    selected: snapshot.selected?.id,
    parent: snapshot.parent,
    group: snapshot.files.group?.change,
    from: snapshot.files.from,
    to: snapshot.files.to,
    path: snapshot.files.path,
    query: snapshot.query,
    count: snapshot.nodes.length,
  })}
  data-errors={JSON.stringify(demo.state.errors)}
  data-actions={JSON.stringify(demo.state.actions)}
></output>

<style>
  .operation-review {
    height: var(--ui-repository-story-height, 100dvh);
    min-width: 0;
    min-height: 0;
  }
</style>

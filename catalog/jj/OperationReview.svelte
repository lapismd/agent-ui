<script lang="ts">
  import { onMount, onDestroy, untrack } from "svelte";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import * as Tooltip from "@lapismd/design-core/shadcn/tooltip";
  import {
    RepositoryOperations,
    initialOperationState,
    type OperationState,
  } from "../../packages/repository-ui/src/jj/index.js";
  import { createJjDemo } from "./support/create-demo.svelte.js";
  import { useDemoAuthors } from "./support/authors.svelte.js";
  let { variant = "DenseHistory" }: { variant?: string } = $props();
  useDemoAuthors();
  const demo = untrack(() => createJjDemo("OperationReview", variant));
  let state = $state(initialOperationState());
  onMount(() => {
    let selected = false;
    const unsubscribe = demo.operations.subscribe((next) => {
      state = next;
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
    operation: state.operation,
    selected: state.selected?.id,
    parent: state.parent,
    group: state.files.group?.change,
    from: state.files.from,
    to: state.files.to,
    path: state.files.path,
    query: state.query,
    count: state.nodes.length,
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

<script lang="ts">
  import { onMount, onDestroy, untrack } from "svelte";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import * as ColumnCanvas from "@lapismd/design-core/shadcn/column-canvas";
  import * as Card from "@lapismd/design-core/shadcn/card";
  import { Input } from "@lapismd/design-core/shadcn/input";
  import ExternalLink from "@lucide/svelte/icons/external-link";
  import {
    RepositoryStackWorkspace,
    RepositoryStackLane,
    RepositoryWorkspaceFiles,
    RepositoryWorkspaceDiff,
    createStackWorkspaceCanvas,
  } from "../../packages/repository-ui/src/jj/index.js";
  import type {
    WorkspaceStack,
    StackCommit,
  } from "../../packages/repository-ui/src/stacks/index.js";
  import {
    createStackReview,
    stackNow,
  } from "./support/stack-workspace-fixture.js";
  import { useDemoAuthors } from "./support/authors.svelte.js";
  let {
    variant = "Basic",
    page = "workspace",
    kind = "screen",
  }: {
    variant?: string;
    page?: "branches" | "workspace";
    kind?: "screen" | "lane" | "files" | "diff";
  } = $props();
  useDemoAuthors();
  const demo = untrack(() =>
    createStackReview(
      kind === "diff"
        ? ((
            {
              Basic: "SelectedFiles",
              Unavailable: "DiffUnavailable",
              Loading: "DiffLoading",
              Empty: "NoText",
            } as Record<string, string>
          )[variant] ?? variant)
        : kind === "files" && variant === "Unavailable"
          ? "FilesUnavailable"
          : kind === "lane"
            ? ((
                {
                  Loading: "StackLoading",
                  Unavailable: "StackUnavailable",
                } as Record<string, string>
              )[variant] ?? variant)
            : variant,
      page,
    ),
  );
  const controller = demo.controller;
  let events = $state<string[]>([]);
  const commandLog = $derived.by(() => {
    events.length;
    return JSON.stringify(demo.commands);
  });
  const canvas = untrack(() => createStackWorkspaceCanvas());
  canvas.ensureColumn("stack-lane-1", {
    defaultWidth: 390,
    minWidth: 310,
    maxWidth: 640,
    resizable: true,
  });
  canvas.ensureColumn("diff-working", {
    defaultWidth: 580,
    minWidth: 360,
    maxWidth: 980,
    resizable: true,
  });
  const readLog = $derived.by(() => {
    controller.snapshot;
    controller.details.files;
    controller.details.fileState("unassigned");
    return JSON.stringify(demo.requests);
  });
  const host = $derived({
    copyText: async (value: string) => {
      await demo.copyText(value);
      events.push("copy");
    },
    onCommand: (
      command: import("../../packages/repository-ui/src/stacks/index.js").WorkspaceCommand,
      snapshot: import("../../packages/repository-ui/src/stacks/index.js").WorkspaceSnapshot,
    ) => {
      demo.requestCommand(command, snapshot);
      events.push(command.kind);
    },
    onSelectWorkspace: (
      workspace: import("../../packages/repository-ui/src/stacks/index.js").NamedWorkspace,
    ) => void demo.selectWorkspace(workspace.id),
    ...(variant === "HostActions"
      ? {
          headerActions,
          columnActions,
          branchActions,
          commitActions,
          fileActions,
          diffActions,
        }
      : {}),
    ...(variant === "RetainedDraft" ? { composer } : {}),
  });
  onMount(() => {
    void demo.start();
  });
  onDestroy(() => {
    demo.close();
    void canvas.dispose();
  });
</script>

{#snippet headerActions()}<Button
    size="sm"
    variant="ghost"
    onclick={() => events.push("header")}>Host action</Button
  >{/snippet}
{#snippet columnActions(stack: WorkspaceStack)}<Button
    size="icon-sm"
    variant="ghost"
    aria-label={`Inspect stack ${stack.name}`}
    onclick={() => events.push(`column:${stack.id}`)}><ExternalLink /></Button
  >{/snippet}
{#snippet branchActions(stack: WorkspaceStack, name: string)}<Button
    size="sm"
    variant="ghost"
    onclick={() => events.push(`branch:${stack.id}:${name}`)}
    >Open branch in host</Button
  >{/snippet}
{#snippet commitActions(commit: StackCommit, stack: WorkspaceStack)}<Button
    size="icon-sm"
    variant="ghost"
    aria-label={`Inspect commit ${commit.id}`}
    onclick={() => events.push(`commit:${stack.id}:${commit.id}`)}
    ><ExternalLink /></Button
  >{/snippet}
{#snippet fileActions(source: string)}<Button
    size="sm"
    variant="ghost"
    onclick={() => events.push(`files:${source}`)}>Open source in host</Button
  >{/snippet}
{#snippet diffActions(
  diff: import("../../packages/repository-ui/src/stacks/index.js").WorkspaceOpenDiff,
)}<Button
    size="sm"
    variant="ghost"
    onclick={() => events.push(`diff:${diff.origin}:${diff.path}`)}
    >Open file in host</Button
  >{/snippet}
{#snippet composer(stack: WorkspaceStack)}
  <Card.Root style="margin:0.5rem"
    ><Card.Header><Card.Title>Host commit draft</Card.Title></Card.Header
    ><Card.Content>
      {#if controller.snapshot?.active && controller.commitDrafts.get(controller.snapshot.active, stack.id)}{@const draft =
          controller.commitDrafts.get(
            controller.snapshot.active,
            stack.id,
          )!}<Input
          aria-label={`Draft for ${stack.name}`}
          bind:value={draft.title}
        />
      {:else}<Button
          variant="outline"
          onclick={() =>
            controller.snapshot &&
            controller.commitDrafts.open(controller.snapshot, stack.id)}
          >Start host draft in {stack.name}</Button
        >{/if}
    </Card.Content></Card.Root
  >
{/snippet}
<div
  class:complete={kind === "screen"}
  class:bounded={kind !== "screen"}
  class:narrow={variant === "Bounded"}
>
  {#if kind === "screen"}<RepositoryStackWorkspace
      showViewTabs={variant !== "Embedded"}
      {controller}
      {...host}
      now={stackNow}
    />
  {:else if kind === "files"}<RepositoryWorkspaceFiles
      {controller}
      source="unassigned"
      onSelect={(path) => controller.selectFile("unassigned", path)}
    />
  {:else if controller.snapshot}
    <ColumnCanvas.Root controller={canvas} displayMode="fixed">
      {#if kind === "lane" && controller.snapshot.stacks[0]}<RepositoryStackLane
          {controller}
          stack={controller.snapshot.stacks[0]}
          {host}
          now={stackNow}
        />
      {:else if kind === "diff" && controller.diffs[0]}<RepositoryWorkspaceDiff
          {controller}
          diff={controller.diffs[0]}
          {host}
        />{/if}
    </ColumnCanvas.Root>
  {/if}
  <output
    hidden
    data-testid="stack-workspace-state"
    data-loaded={controller.snapshotLoaded}
    data-page={controller.page}
    data-workspace={controller.snapshot?.active ?? ""}
    data-pin={controller.snapshot?.readKey ?? ""}
    data-diffs={JSON.stringify(controller.diffs)}
    data-selections={JSON.stringify(controller.stackSelections)}
    data-pending={Boolean(controller.pending)}
    data-requests={demo.requests.length}
    data-reads={readLog}
    data-events={events.join("|")}
    data-command-log={commandLog}
    data-commands={JSON.parse(commandLog).length}
  ></output>
</div>

<style>
  .complete {
    height: 100dvh;
    min-height: 0;
  }
  .bounded {
    height: 36rem;
    width: min(100%, 48rem);
    padding: 1rem;
    box-sizing: border-box;
  }
  .narrow {
    width: min(100%, 44rem);
  }
</style>

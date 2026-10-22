<script lang="ts">
  import { onDestroy, onMount, untrack } from "svelte";
  import * as Tooltip from "@lapismd/design-core/shadcn/tooltip";
  import * as ColumnCanvas from "@lapismd/design-core/shadcn/column-canvas";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import {
    RepositoryPanel,
    RepositoryOperations,
    RepositoryFileHistory,
    RepositoryBlamePanel,
    RepositoryRevisions,
    RepositoryOperationColumn,
    RepositoryRestoreDialog,
    RepositoryConflictResolution,
    RepositoryShell,
  } from "../../packages/repository-ui/src/jj/index.js";
  import { initialHistoryState } from "../../packages/repository-ui/src/jj/logic/history-state.js";
  import { initialOperationState } from "../../packages/repository-ui/src/jj/logic/operation-state.js";
  import { createLogCanvas } from "../../packages/repository-ui/src/jj/logic/log-canvas.js";
  import { createJjDemo } from "./support/create-demo.svelte.js";
  import JjControls from "./JjControls.svelte";
  import { useDemoAuthors } from "./support/authors.svelte.js";
  import AvatarDemo from "./AvatarDemo.svelte";
  let {
    part = "RepositoryPanel",
    variant = "Basic",
  }: { part?: string; variant?: string } = $props();
  useDemoAuthors();
  const demo = untrack(() => createJjDemo(part, variant));
  let history = $state(initialHistoryState()),
    operations = $state(initialOperationState()),
    conflictsOpen = $state(true);
  let conflictReady = $state(
    untrack(() => variant !== "Loading" && variant !== "Unavailable"),
  );
  let conflictAttempts = 0;
  function loadConflicts() {
    demo.state.actions.push("read-conflicts");
    if (variant === "Unavailable" && ++conflictAttempts > 1)
      conflictReady = true;
  }
  const canvas = createLogCanvas();
  const conflict = {
    path: "Welcome.md",
    fingerprint: "ad".repeat(32),
    terms: [],
    editor: {
      status: "text" as const,
      executable: false,
      contents: [
        "# Notes\nYour version\n",
        "# Notes\nBase version\n",
        "# Notes\nOther version\n",
      ],
    },
  };
  $effect(() => {
    const selected = operations.selected?.id;
    if (part !== "RepositoryOperationColumn") return;
    untrack(() => {
      canvas.clear();
      if (selected) {
        canvas.select(0, selected);
        canvas.open("diff");
      }
    });
  });
  onMount(() => {
    const unsubscribe = demo.history.subscribe((value) => (history = value)),
      unsubscribeOperations = demo.operations.subscribe(
        (value) => (operations = value),
      );
    if (part === "RepositoryOperationColumn") canvas.open("diff");
    void demo.start();
    return () => {
      unsubscribe();
      unsubscribeOperations();
    };
  });
  onDestroy(() => {
    void canvas.dispose();
    void demo.close();
  });
  async function recover() {
    demo.fixture.recover();
    if (part === "RepositoryConflictResolution") {
      conflictReady = true;
      return;
    }
    if (part === "RepositoryBlamePanel") await demo.blame.refresh();
    else if (part === "RepositoryFileHistory") await demo.files.refresh();
    else if (
      part === "RepositoryOperations" ||
      part === "RepositoryOperationColumn"
    )
      await demo.operations.refresh();
    else await demo.history.refresh();
  }
</script>

<Tooltip.Provider
  ><div
    data-testid="jj-story-host"
    class="jj-story-host"
    class:jj-story-compact={![
      "RepositoryPanel",
      "RepositoryOperations",
      "RepositoryFileHistory",
      "RepositoryBlamePanel",
      "RepositoryRevisions",
      "RepositoryOperationColumn",
      "RepositoryConflictResolution",
      "RepositoryLogHeader",
      "RepositoryShell",
    ].includes(part)}
    data-part={part}
  >
    {#if part === "RepositoryAuthorAvatar"}<AvatarDemo
        {variant}
      />{:else if part === "RepositoryPanel"}<RepositoryPanel
        controller={demo.history}
        sources={demo.source}
        copyText={demo.copyText}
        restore={demo.restore}
      />
    {:else if part === "RepositoryOperations"}<RepositoryOperations
        controller={demo.operations}
        sources={demo.source}
        copyText={demo.copyText}
        onHistory={(operation) =>
          demo.state.actions.push(`history:${operation}`)}
      />
    {:else if part === "RepositoryFileHistory"}<RepositoryShell
        ><RepositoryFileHistory
          controller={demo.files}
          copyText={demo.copyText}
          onOpen={(id) => demo.state.actions.push(`history:${id}`)}
          onBlame={() => demo.state.actions.push("open-blame")}
          onBrowse={(id) => demo.state.actions.push(`browse:${id}`)}
        /></RepositoryShell
      >
    {:else if part === "RepositoryBlamePanel"}<RepositoryBlamePanel
        controller={demo.blame}
        copyText={demo.copyText}
        onOpen={(id) => demo.state.actions.push(`history:${id}`)}
        commitStats={demo.largeCommitStats}
        wrap={variant !== "NoWrap"}
      />
    {:else if part === "RepositoryRevisions"}<ColumnCanvas.Root
        controller={canvas}
        ><ColumnCanvas.Column id="revisions" columnTitle="JJ Log"
          ><ColumnCanvas.Body
            ><RepositoryRevisions
              state={history}
              controller={demo.history}
              copyText={demo.copyText}
              onOpenDiff={() => canvas.open("diff")}
            /></ColumnCanvas.Body
          ></ColumnCanvas.Column
        ></ColumnCanvas.Root
      >
    {:else if part === "RepositoryOperationColumn"}<ColumnCanvas.Root
        controller={canvas}
        ><ColumnCanvas.Column id="revisions" columnTitle="Operations"
          ><ColumnCanvas.Body
            ><p>
              Select a recorded operation to inspect its metadata.
            </p></ColumnCanvas.Body
          ></ColumnCanvas.Column
        ><RepositoryOperationColumn
          state={operations}
          controller={demo.operations}
          copyText={demo.copyText}
        /></ColumnCanvas.Root
      >
    {:else if part === "RepositoryRestoreDialog"}<Button
        variant="outline"
        onclick={() => demo.restore.prepare(demo.commits[0].id, "Welcome.md")}
        >Preview restore</Button
      ><RepositoryRestoreDialog controller={demo.restore} />
    {:else if part === "RepositoryConflictResolution"}<RepositoryShell
        ><p>Recorded revision conflict inspection.</p>
        {#snippet surface()}<RepositoryConflictResolution
            open={conflictsOpen}
            conflicts={variant === "Empty" ? [] : [conflict]}
            ready={conflictReady}
            busy={variant === "Loading"}
            onLoad={loadConflicts}
            onClose={() => (conflictsOpen = false)}
          />{/snippet}</RepositoryShell
      >
    {:else}<JjControls {demo} {part} {variant} />{/if}
    {#if variant === "Unavailable"}<div class="fixture-recovery">
        <Button variant="outline" size="sm" onclick={recover}
          >Recover in-memory fixture</Button
        >
      </div>{/if}
    <output
      hidden
      data-testid="jj-story-state"
      data-errors={JSON.stringify(demo.state.errors)}
      data-actions={JSON.stringify(demo.state.actions)}
      data-history={JSON.stringify({
        operation: history.operation,
        revision: history.revision?.id,
        path: history.path,
        base: history.base,
      })}
      data-operations={JSON.stringify({
        operation: operations.operation,
        selected: operations.selected?.id,
        parent: operations.parent,
      })}
    ></output>
  </div></Tooltip.Provider
>

<style>
  .jj-story-host {
    height: var(--ui-repository-story-height, 100dvh);
    min-width: 0;
    min-height: 0;
    position: relative;
    font-size: 0.875rem;
  }
  .jj-story-compact {
    height: auto;
  }
  .fixture-recovery {
    position: absolute;
    inset: auto 1rem 1rem auto;
  }
</style>

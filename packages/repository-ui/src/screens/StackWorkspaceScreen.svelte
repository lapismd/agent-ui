<script lang="ts">
  import { onDestroy, untrack } from "svelte";
  import * as ColumnCanvas from "@lapismd/design-core/shadcn/column-canvas";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import type { StackWorkspaceController } from "../stacks/controller.svelte.js";
  import type { WorkspaceCommand } from "../stacks/types.js";
  import { appliedStacks, selectedWorkspace } from "../stacks/presentation.js";
  import StackSourceFiles from "./StackSourceFiles.svelte";
  import StackLane from "./StackLane.svelte";
  import StackDropZone from "./StackDropZone.svelte";
  import StackDiff from "./StackDiff.svelte";
  import StackCommandDialog from "./StackCommandDialog.svelte";
  let {
    controller,
    page = "workspace",
  }: { controller: StackWorkspaceController; page?: "workspace" | "branches" } =
    $props();
  $effect(() => {
    controller.page = page;
  });
  let form = $state<WorkspaceCommand | null>(null);
  const snapshot = $derived(controller.snapshot);
  const current = $derived(snapshot ? selectedWorkspace(snapshot) : undefined);
  const stacks = $derived(
    snapshot
      ? page === "workspace"
        ? appliedStacks(snapshot)
        : snapshot.stacks
      : [],
  );
  const canvas = ColumnCanvas.createColumnCanvasController({
    trailingSpacerWidth: 120,
    columns: {
      ...Object.fromEntries(
        untrack(() => stacks).map((stack) => [
          `stack-${stack.id}`,
          { defaultWidth: 370, minWidth: 280, resizable: true },
        ]),
      ),
      unassigned: { defaultWidth: 300, minWidth: 220, resizable: true },
      target: { defaultWidth: 320, minWidth: 220, resizable: true },
    },
  });
  onDestroy(() => void canvas.dispose());
  $effect.pre(() => {
    const ids = stacks.map((stack) => stack.id);
    const origins = controller.diffs.map((diff) => diff.origin);
    untrack(() => {
      for (const id of ids)
        canvas.ensureColumn(`stack-${id}`, {
          defaultWidth: 370,
          minWidth: 280,
          resizable: true,
        });
      for (const origin of origins)
        canvas.ensureColumn(`diff-${origin}`, {
          defaultWidth: 550,
          minWidth: 300,
          resizable: true,
        });
    });
  });
  function command(value: WorkspaceCommand) {
    if (
      (value.kind === "create_commit" && !value.message.trim()) ||
      (value.kind === "create_commit" && value.message === "Selected changes")
    ) {
      const selections =
        value.selections ?? (value.selection ? [value.selection] : []);
      for (const selection of selections)
        controller.commitDrafts.open(snapshot!, value.stack, selection);
      return;
    }
    if (
      ("name" in value &&
        value.kind !== "delete_branch" &&
        value.kind !== "squash_branch") ||
      value.kind === "reword"
    ) {
      form = value;
      return;
    }
    void controller.prepare(value);
  }
</script>

<section class="rui-screen" aria-label="Stack workspace">
  <header class="rui-toolbar">
    <h2>{page === "workspace" ? "Workspace" : "Branches"}</h2>
    <label
      >Named workspace<select
        class="rui-select"
        value={snapshot?.active ?? ""}
        disabled={controller.locked}
        onchange={(event) =>
          command({
            kind: "switch_workspace",
            workspace: event.currentTarget.value,
          })}
        >{#each snapshot?.workspaces ?? [] as workspace}<option
            value={workspace.id}>{workspace.name}</option
          >{/each}</select
      ></label
    ><Button
      size="sm"
      variant="outline"
      disabled={!controller.can("create_workspace")}
      onclick={() => command({ kind: "create_workspace", name: "" })}
      >New workspace</Button
    ><Button
      size="sm"
      variant="outline"
      disabled={!controller.can("create_stack")}
      onclick={() => command({ kind: "create_stack", name: "" })}
      >New branch</Button
    ><Button
      size="sm"
      variant="ghost"
      disabled={!snapshot?.canUndo || controller.locked}
      onclick={() => command({ kind: "undo" })}>Undo</Button
    ><Button
      size="sm"
      variant="ghost"
      disabled={!snapshot?.canRedo || controller.locked}
      onclick={() => command({ kind: "redo" })}>Redo</Button
    ><Button
      size="sm"
      variant="ghost"
      disabled={controller.locked}
      onclick={() => void controller.refresh()}>Refresh workspace</Button
    >
  </header>
  {#if !snapshot}<div class="rui-empty" role="status">
      {controller.loading ? "Loading workspace…" : "No workspace available"}
    </div>{:else if snapshot.availability !== "ready"}<div class="rui-empty">
      Workspace unavailable. Connect an admitted local repository.
    </div>{:else}
    <ColumnCanvas.Root controller={canvas}
      ><ColumnCanvas.Column id="unassigned" columnTitle="Unstaged"
        ><ColumnCanvas.Header
          ><ColumnCanvas.Title>Unstaged</ColumnCanvas.Title><ColumnCanvas.Count
            >{current?.unassigned.length ?? 0}</ColumnCanvas.Count
          ></ColumnCanvas.Header
        ><ColumnCanvas.Body
          ><StackDropZone
            {controller}
            target={{ kind: "working" }}
            label="Return changes to Unstaged"
            onCommand={command}
            ><StackSourceFiles
              {controller}
              source="unassigned"
            /></StackDropZone
          ><StackDropZone
            {controller}
            target={{ kind: "new-stack" }}
            label="Create a branch from changes"
            onCommand={command}
            ><div class="rui-empty">
              Drop files or hunks to create a branch
            </div></StackDropZone
          >
          <div class="rui-toolbar">
            <Button
              size="sm"
              variant="ghost"
              onclick={() => void controller.selectTargetBranch()}
              >Browse target · {snapshot.target?.name ??
                "Choose target"}</Button
            >
          </div>
          {#if controller.targetHistory.active}{#each controller.targetHistory.commits as commit}<Button
                variant="ghost"
                onclick={() => controller.targetHistory.selectCommit(commit.id)}
                >{commit.message}</Button
              >{/each}{#if controller.targetHistory.hasMore}<Button
                onclick={() => void controller.targetHistory.loadMore()}
                >Load older target history</Button
              >{/if}{/if}</ColumnCanvas.Body
        ></ColumnCanvas.Column
      >
      {#each stacks as stack}<ColumnCanvas.Column
          id={`stack-${stack.id}`}
          columnTitle={stack.name}
          ><ColumnCanvas.Header
            ><ColumnCanvas.Title>{stack.name}</ColumnCanvas.Title
            ><ColumnCanvas.HeaderActions
              ><Button
                size="sm"
                variant="ghost"
                disabled={controller.locked}
                onclick={() =>
                  command({
                    kind: current?.applied.includes(stack.id)
                      ? "unapply_stack"
                      : "apply_stack",
                    stack: stack.id,
                  })}
                >{current?.applied.includes(stack.id)
                  ? "Unapply"
                  : "Apply"}</Button
              ></ColumnCanvas.HeaderActions
            ></ColumnCanvas.Header
          ><ColumnCanvas.Body
            ><StackLane
              {controller}
              {stack}
              onCommand={command}
            /></ColumnCanvas.Body
          ></ColumnCanvas.Column
        >{/each}
      {#each controller.diffs as diff}<ColumnCanvas.Column
          id={`diff-${diff.origin}`}
          columnTitle={diff.path}
          ><StackDiff
            {controller}
            {diff}
            onCommand={command}
          /></ColumnCanvas.Column
        >{/each}</ColumnCanvas.Root
    >{/if}
  {#if controller.validation}<p class="rui-status" role="status">
      {controller.validation}
    </p>{/if}{#if controller.error}<p class="rui-status" role="alert">
      {controller.error}
    </p>{/if}{#if controller.outcome}<p class="rui-status" role="status">
      {controller.outcome}
    </p>{/if}{#if controller.pending && !controller.preview}<footer
      class="rui-toolbar"
    >
      <p role="status">Outcome unknown. The original request is retained.</p>
      <Button onclick={() => void controller.checkStatus()}
        >Check request status</Button
      >
    </footer>{/if}
  <StackCommandDialog {controller} bind:command={form} />
</section>

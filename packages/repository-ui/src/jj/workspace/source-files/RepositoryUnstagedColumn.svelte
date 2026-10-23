<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store StoreStackUnstaged. -->
<script lang="ts">
  import * as ColumnCanvas from "@lapismd/design-core/shadcn/column-canvas";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import GitBranchPlus from "@lucide/svelte/icons/git-branch-plus";
  import Files from "./RepositoryWorkspaceFiles.svelte";
  import DropGuide from "../stack-lane/RepositoryWorkspaceDropGuide.svelte";
  import {
    workspaceDropHandlers,
    selectedWorkspaceChanges,
  } from "../stack-lane/drag-handlers.js";
  import type { StackWorkspaceController } from "../../../stacks/index.js";
  import type { RepositoryStackHost } from "../stack-lane/types.js";
  let {
    controller,
    host,
  }: { controller: StackWorkspaceController; host: RepositoryStackHost } =
    $props();
  const selected = $derived(
    controller.diffs.find((diff) => diff.origin === "working"),
  );
</script>

<ColumnCanvas.Column
  id="working"
  columnTitle="Unstaged"
  fixed
  resizable
  aria-label="Unstaged column"
>
  <ColumnCanvas.Header
    ><ColumnCanvas.Title>Unstaged</ColumnCanvas.Title><ColumnCanvas.Count
      >{controller.filesFor("unassigned").length}</ColumnCanvas.Count
    ><ColumnCanvas.HeaderActions
      ><Button
        variant="ghost"
        size="icon-sm"
        aria-label="Browse stacks"
        title="Browse stacks"
        onclick={() => (controller.page = "branches")}><GitBranchPlus /></Button
      ><ColumnCanvas.Toggle
        aria-label="Collapse Unstaged"
      /></ColumnCanvas.HeaderActions
    ></ColumnCanvas.Header
  >
  <ColumnCanvas.Body
    scrollStrategy="styled"
    class="workspace-drop-target"
    data-drop-target-state={controller.drag.state({ kind: "working" })}
    {...workspaceDropHandlers(controller, host, () => ({ kind: "working" }))}
    ><DropGuide feedback={controller.drag.for({ kind: "working" })} />
    {#if host.onCommand && selectedWorkspaceChanges(controller)?.source !== "unassigned" && selectedWorkspaceChanges(controller)}<Button
        variant="ghost"
        size="sm"
        onclick={() =>
          host.onCommand?.(
            {
              kind: "transfer",
              selection: selectedWorkspaceChanges(controller)!,
              target: "unassigned",
            },
            controller.snapshot!,
          )}>Move selected changes to Unstaged</Button
      >{/if}
    <Files
      draggable={Boolean(host.onCommand)}
      {controller}
      source="unassigned"
      label="Unstaged files"
      selectedPath={selected?.path}
      onSelect={(path) => controller.selectFile("unassigned", path)}
      actions={host.fileActions ? fileActions : undefined}
    /></ColumnCanvas.Body
  >
</ColumnCanvas.Column>
{#snippet fileActions()}{@render host.fileActions?.("unassigned")}{/snippet}

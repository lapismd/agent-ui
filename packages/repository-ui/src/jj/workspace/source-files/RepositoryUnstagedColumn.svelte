<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store StoreStackUnstaged. -->
<script lang="ts">
  import * as ColumnCanvas from "@lapismd/design-core/shadcn/column-canvas";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import GitBranchPlus from "@lucide/svelte/icons/git-branch-plus";
  import Files from "./RepositoryWorkspaceFiles.svelte";
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
  <ColumnCanvas.Body scrollStrategy="styled"
    ><Files
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

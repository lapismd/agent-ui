<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store StoreStackStagedFiles. -->
<script lang="ts">
  import * as Card from "@lapismd/design-core/shadcn/card";
  import * as ColumnCanvas from "@lapismd/design-core/shadcn/column-canvas";
  import {
    FileListing,
    FileListingViewModeToggle,
    type FileListingViewMode,
  } from "@lapismd/design-core/diff";
  import Check from "@lucide/svelte/icons/circle-check";
  import type { WorkspaceSelection } from "../../../stacks/types.js";
  let {
    name,
    selections,
    onSelect,
  }: {
    name: string;
    selections: WorkspaceSelection[];
    onSelect: (selection: WorkspaceSelection) => void;
  } = $props();
  let mode = $state<FileListingViewMode>("list");
  const files = $derived(
    [...new Set(selections.map((selection) => selection.path))].map((path) => ({
      path,
    })),
  );
</script>

<div
  role="group"
  aria-label={`Staged files for ${name}`}
  class="workspace-staged-files"
>
  <Card.Header class="workspace-staged-header">
    <Check aria-hidden="true" /><ColumnCanvas.Title>Staged</ColumnCanvas.Title
    ><ColumnCanvas.Count>{files.length}</ColumnCanvas.Count>
    <Card.Action class="workspace-staged-actions"
      ><FileListingViewModeToggle bind:mode /></Card.Action
    >
  </Card.Header>
  <Card.Content class="workspace-staged-list">
    <FileListing
      {files}
      {mode}
      onSelectPath={(path) => {
        const selection = selections.find(
          (selection) => selection.path === path,
        );
        if (selection) onSelect(selection);
      }}
    />
  </Card.Content>
</div>

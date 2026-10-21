<script lang="ts">
  import {
    FileListing,
    FileListingViewModeToggle,
  } from "@lapismd/design-core/diff";
  import type { StackWorkspaceController } from "../stacks/controller.svelte.js";
  import { workspaceFileDrag } from "../stacks/file-drag.js";
  let {
    controller,
    source,
    stack,
  }: { controller: StackWorkspaceController; source: string; stack?: string } =
    $props();
  let mode = $state<"list" | "tree" | "package">("tree");
  const files = $derived(controller.filesFor(source));
  const drag = $derived(workspaceFileDrag(controller, () => source));
</script>

<div class="rui-stack-files">
  <div class="rui-toolbar">
    <span class="rui-muted">{files.length} files</span
    ><FileListingViewModeToggle
      {mode}
      onModeChange={(value) => (mode = value)}
    />
  </div>
  <FileListing
    {files}
    {mode}
    selectedPath={controller.selectedPath}
    {...drag}
    onSelectPath={(path) =>
      controller.selectFile(source, path, undefined, stack)}
  />{#if !files.length}<p class="rui-empty">No changed files</p>{/if}
</div>

<script lang="ts">
  import { FileDiff, type FileDiffViewMode } from "@lapismd/design-core/diff";
  import * as Empty from "@lapismd/design-core/shadcn/empty";
  import FileQuestion from "@lucide/svelte/icons/file-question-mark";
  import type { LocalFileDiffChange } from "./models.js";
  import { diffText } from "./models.js";
  let {
    change,
    viewMode = "unified",
    wrap = false,
    compact = false,
  }: {
    change: LocalFileDiffChange;
    viewMode?: FileDiffViewMode;
    wrap?: boolean;
    compact?: boolean;
  } = $props();
  const content = $derived(diffText(change));
</script>

<section
  class="repository-diff"
  data-compact={compact || undefined}
  data-view-mode={viewMode}
  aria-label={`Changes to ${change.path}`}
>
  {#if "unavailable" in content}<Empty.Root
      ><Empty.Header
        ><Empty.Media variant="icon"
          ><FileQuestion aria-hidden="true" /></Empty.Media
        ><Empty.Title>Preview unavailable</Empty.Title><Empty.Description
          >{content.unavailable}</Empty.Description
        ></Empty.Header
      ></Empty.Root
    >
  {:else}<FileDiff
      path={change.path}
      oldText={content.oldText}
      newText={content.newText}
      {viewMode}
      {wrap}
    />{/if}
</section>

<style>
  .repository-diff {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 16rem;
  }
  .repository-diff[data-view-mode="split"] {
    height: 100%;
    min-height: 0;
    flex: 1 1 0;
  }
  .repository-diff[data-compact] {
    min-height: 0;
  }
</style>

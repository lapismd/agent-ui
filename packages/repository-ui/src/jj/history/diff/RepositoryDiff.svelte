<!-- SPDX-License-Identifier: Apache-2.0; copied from Lapis Desktop with explicit host boundaries. -->
<script lang="ts">
  import FileQuestionIcon from "@lucide/svelte/icons/file-question-mark";
  import * as Empty from "@lapismd/design-core/shadcn/empty";
  import { FileDiff, type FileDiffViewMode } from "@lapismd/design-core/diff";
  import type { LocalFileDiffChange } from "@lapismd/jj-history";
  import { diffText } from "../../logic/history-state.js";
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
  {#if "unavailable" in content}<Empty.Root role="status"
      ><Empty.Header
        ><Empty.Media variant="icon"
          ><FileQuestionIcon aria-hidden="true" /></Empty.Media
        ><Empty.Title>Preview unavailable</Empty.Title><Empty.Description
          >This file cannot be shown as text: {content.unavailable}.</Empty.Description
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
    min-height: var(--ui-repository-diff-min-height, 16rem);
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

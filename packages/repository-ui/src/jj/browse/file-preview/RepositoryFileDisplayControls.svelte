<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store's StoreFileDisplayControls. -->
<script lang="ts">
  import * as ButtonGroup from "@lapismd/design-core/shadcn/button-group";
  import CodeXmlIcon from "@lucide/svelte/icons/code-xml";
  import EyeIcon from "@lucide/svelte/icons/eye";
  import HistoryIcon from "@lucide/svelte/icons/history";
  import RepositoryFileAction from "./RepositoryFileAction.svelte";
  let {
    mode,
    isMarkdown,
    canBlame = false,
    onSelect,
  }: {
    mode: "source" | "preview" | "blame";
    isMarkdown: boolean;
    canBlame?: boolean;
    onSelect(mode: "source" | "preview" | "blame"): void;
  } = $props();
</script>

<ButtonGroup.Root
  class="repository-browser__file-view-toggle"
  aria-label="File display"
>
  {#if isMarkdown}<RepositoryFileAction
      label="Show formatted preview"
      text="Preview"
      selected={mode === "preview"}
      onclick={() => onSelect("preview")}
      ><EyeIcon
        data-icon="inline-start"
        aria-hidden="true"
      /></RepositoryFileAction
    >{/if}
  <RepositoryFileAction
    label="Show source"
    text="Source"
    selected={mode === "source"}
    onclick={() => onSelect("source")}
    ><CodeXmlIcon
      data-icon="inline-start"
      aria-hidden="true"
    /></RepositoryFileAction
  >
  {#if canBlame}<RepositoryFileAction
      label="Show line origins"
      text="Blame"
      selected={mode === "blame"}
      onclick={() => onSelect("blame")}
      ><HistoryIcon
        data-icon="inline-start"
        aria-hidden="true"
      /></RepositoryFileAction
    >{/if}
</ButtonGroup.Root>

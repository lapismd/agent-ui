<script lang="ts">
  import CameraIcon from "@lucide/svelte/icons/camera";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import type { RepositoryBrowserCommit } from "../logic/types.js";

  let {
    commit,
    path,
    onSelectCommit,
  }: {
    commit?: RepositoryBrowserCommit;
    path?: string;
    onSelectCommit?: (commit: RepositoryBrowserCommit) => void;
  } = $props();
  const subject = $derived(commit?.message.split(/\r?\n/u, 1)[0] ?? "—");
</script>

<div class="repository-browser__file-attribution">
  {#if commit?.attribution === "snapshot"}
    <span
      class="repository-browser__file-snapshot"
      role="img"
      title="Showing the selected commit's message and date; no path change was found within the history limit."
      aria-label="Snapshot details, not a confirmed last path change"
      ><CameraIcon aria-hidden="true" size={14} /></span
    >
  {/if}
  {#if commit && onSelectCommit}
    <Button
      variant="link"
      size="sm"
      class="repository-browser__file-commit-message"
      title={subject}
      aria-label={`View ${commit.attribution === "snapshot" ? "snapshot" : "path change"} commit for ${path}: ${subject}`}
      onclick={() => onSelectCommit?.(commit)}>{subject}</Button
    >
  {:else}
    <span class="repository-browser__file-commit-message" title={subject}
      >{subject}</span
    >
  {/if}
</div>

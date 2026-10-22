<script lang="ts">
  import FileSearchIcon from "@lucide/svelte/icons/file-search";
  import * as Empty from "@lapismd/design-core/shadcn/empty";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import type { FileDiffViewMode } from "@lapismd/design-core/diff";
  import RepositorySkeleton from "../../foundations/skeleton/RepositorySkeleton.svelte";
  import RepositoryDiff from "../diff/RepositoryDiff.svelte";
  import type { RepositoryDiffEntry } from "../../logic/comparison-diffs.js";
  let {
    path,
    entry,
    onLoad,
    viewMode,
    wrap,
    sizing = "fill",
  }: {
    path?: string;
    entry?: RepositoryDiffEntry;
    onLoad(path: string): Promise<void>;
    viewMode: FileDiffViewMode;
    wrap: boolean;
    sizing?: "fill" | "content";
  } = $props();
</script>

{#if entry?.phase === "ready"}
  <RepositoryDiff compact change={entry.change} {viewMode} {wrap} {sizing} />
{:else if path && (!entry || entry.phase === "loading")}
  <RepositorySkeleton kind="diff" label={`Loading changes to ${path}`} />
{:else}
  <Empty.Root role="status"
    ><Empty.Header
      ><Empty.Media variant="icon"
        ><FileSearchIcon aria-hidden="true" /></Empty.Media
      >
      <Empty.Title
        >{path
          ? "File preview is unavailable"
          : "No file selected"}</Empty.Title
      >
      <Empty.Description
        >{entry?.phase === "failed"
          ? entry.message
          : "Select a changed file to preview the diff."}</Empty.Description
      >
    </Empty.Header>
    {#if path}<Button size="sm" onclick={() => void onLoad(path!)}
        >Retry preview</Button
      >{/if}
  </Empty.Root>
{/if}

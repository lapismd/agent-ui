<!-- SPDX-License-Identifier: Apache-2.0; adapted from jj-store StoreWorkspaceInspector. -->
<script lang="ts">
  import { untrack } from "svelte";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { Skeleton } from "@lapismd/design-core/shadcn/skeleton";
  import * as Empty from "@lapismd/design-core/shadcn/empty";
  import FileQuestion from "@lucide/svelte/icons/file-question-mark";
  import { ScrollArea } from "@lapismd/design-core/shadcn/scroll-area";
  import { Toggle } from "@lapismd/design-core/shadcn/toggle";
  import { MarkdownContent } from "@lapismd/design-core/chat";
  import { CodeBlock } from "@lapismd/design-core/shadcn/code-block";
  import XIcon from "@lucide/svelte/icons/x";
  import { FileTypeIcon } from "@lapismd/design-core/shadcn/file-type-icon";
  import UndoIcon from "@lucide/svelte/icons/undo-2";
  import AiSessionTabs from "../../sessions/session-tabs/AiSessionTabs.svelte";
  import RepositoryDiff from "./RepositoryDiff.svelte";
  import { diffText } from "./models.js";
  import type { AiHistoryInspection } from "./controller.svelte.js";
  let {
    inspection,
    busy = false,
  }: { inspection: AiHistoryInspection; busy?: boolean } = $props();
  let view = $state("diff");
  $effect(() => {
    inspection.path;
    untrack(() => {
      view = "diff";
    });
  });
  const content = $derived(
    inspection.diff ? diffText(inspection.diff) : undefined,
  );
  const text = $derived(
    content && !("unavailable" in content)
      ? view === "before"
        ? content.oldText
        : content.newText
      : undefined,
  );
  function toggleSelected() {
    if (!inspection.path) return;
    inspection.selected = inspection.selected.includes(inspection.path)
      ? inspection.selected.filter((path) => path !== inspection.path)
      : [...inspection.selected, inspection.path];
  }
</script>

<section
  class="history-file"
  aria-label={`Saved changes to ${inspection.path}`}
>
  <header>
    <div class="file-title">
      <FileTypeIcon path={inspection.path ?? ""} size="md" /><strong
        title={inspection.path}>{inspection.path}</strong
      >
    </div>
    <Toggle
      pressed={inspection.selected.includes(inspection.path ?? "")}
      aria-label="Select for undo"
      disabled={busy}
      onPressedChange={toggleSelected}>Select for undo</Toggle
    >
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Undo file"
      disabled={busy || inspection.undoBusy}
      onclick={() =>
        inspection.record &&
        inspection.path &&
        void inspection.previewUndo(inspection.record, [inspection.path])}
      ><UndoIcon /></Button
    >
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Close saved file"
      onclick={() => inspection.closeFile()}><XIcon /></Button
    >
  </header>
  <AiSessionTabs
    value={view}
    sections={[
      { value: "diff", label: "Diff" },
      { value: "before", label: "Before" },
      { value: "after", label: "After" },
    ]}
    label="File presentation"
    onSelect={(next) => (view = next)}
  />
  <ScrollArea class="history-file-scroll">
    <div class="file-content">
      {#if inspection.fileUnavailable}<Empty.Root
          ><Empty.Header
            ><Empty.Media variant="icon"
              ><FileQuestion aria-hidden="true" /></Empty.Media
            ><Empty.Title>Saved file unavailable</Empty.Title><Empty.Description
              >Read this file from the captured comparison again.</Empty.Description
            ></Empty.Header
          ><Empty.Content
            ><Button
              variant="ghost"
              size="sm"
              onclick={() =>
                inspection.path && void inspection.select(inspection.path)}
              >Retry saved file</Button
            >
          </Empty.Content></Empty.Root
        >
      {:else if !inspection.diff}<div
          role="status"
          aria-label="Loading saved file"
          aria-busy="true"
        >
          {#each [72, 54, 86, 61, 78, 48] as width, row (row)}<Skeleton
              style={`height:0.875rem;width:${width}%;margin-block:0.75rem`}
            />{/each}
        </div>
      {:else if view === "diff"}<RepositoryDiff change={inspection.diff} wrap />
      {:else if text !== undefined}
        {#if /\.(md|mdx|markdown)$/iu.test(inspection.path ?? "")}<MarkdownContent
            content={text}
            fullWidth
          />
        {:else}<CodeBlock
            code={text}
            language={inspection.path?.split(".").at(-1)}
            width="100%"
            hasLineNumbers
          />{/if}
      {:else}<Empty.Root
          ><Empty.Header
            ><Empty.Media variant="icon"
              ><FileQuestion aria-hidden="true" /></Empty.Media
            ><Empty.Title>Text preview unavailable</Empty.Title
            ><Empty.Description
              >Text preview is unavailable for this file.</Empty.Description
            ></Empty.Header
          ></Empty.Root
        >{/if}
    </div>
  </ScrollArea>
</section>

<style>
  .history-file {
    display: flex;
    flex-direction: column;
    height: var(--ai-session-body-height, 100%);
    min-width: 0;
    min-height: 0;
    background: var(--background);
  }
  header {
    display: flex;
    align-items: center;
    flex: none;
    gap: 0.375rem;
    padding: 0.5rem;
  }
  .file-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    min-width: 0;
  }
  .file-title :global(svg) {
    width: 1rem;
    height: 1rem;
    flex: none;
  }
  strong {
    font-size: 0.8125rem;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .file-content {
    min-width: 0;
    padding: 0.75rem;
  }
  :global(.history-file-scroll) {
    flex: 1;
    min-height: 0;
  }
</style>

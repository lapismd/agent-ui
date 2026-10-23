<script lang="ts">
  // CommunityProjectsPullRequestDiffWorkbench, native comparison data (Apache-2.0).
  import {
    FileChangeStats,
    FileDiffComposer,
    FileListing,
    FileListingViewModeToggle,
    type FileListingViewMode,
    type FileDiffViewMode,
  } from "@lapismd/design-core/diff";
  import { ScrollArea } from "@lapismd/design-core/shadcn/scroll-area";
  import { PanelLeft } from "@lucide/svelte";
  import "./community-native-diff.css";
  import { Input } from "@lapismd/design-core/shadcn/input";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { Checkbox } from "@lapismd/design-core/shadcn/checkbox";
  import * as DropdownMenu from "@lapismd/design-core/shadcn/dropdown-menu";
  import SettingsIcon from "@lucide/svelte/icons/settings-2";
  import type { WorkReviewContext } from "../logic/review-context.js";
  import WorkEmpty from "./WorkEmpty.svelte";
  let { context }: { context: Extract<WorkReviewContext, { state: "ready" }> } =
    $props();
  let filter = $state(""),
    selectedPath = $state(""),
    mode = $state<FileListingViewMode>("tree"),
    viewMode = $state<FileDiffViewMode>("unified"),
    viewed = $state<string[]>([]),
    fileListOpen = $state(true);
  const files = $derived(
    context.files.filter((file) =>
      file.path.toLowerCase().includes(filter.toLowerCase()),
    ),
  );
</script>

{#if !context.files.length}<WorkEmpty
    title="No files changed for this anchor"
    description="This review has no recorded code comparison."
  />
{:else}
  <div class="community-projects__diff-summary">
    <span class="community-projects__diff-summary-copy"
      ><strong>{context.files.length} changed files</strong><span
        >{viewed.length} of
        {context.files.length} viewed</span
      ></span
    ><span class="community-projects__diff-summary-actions"
      >{#if context.files.every((file) => file.additions !== undefined && file.deletions !== undefined)}<FileChangeStats
          additions={context.files.reduce(
            (sum, file) => sum + (file.additions ?? 0),
            0,
          )}
          deletions={context.files.reduce(
            (sum, file) => sum + (file.deletions ?? 0),
            0,
          )}
        />
      {/if}<DropdownMenu.Root
        ><DropdownMenu.Trigger
          >{#snippet child({ props })}<Button
              {...props}
              variant="outline"
              size="icon-sm"
              aria-label="Diff settings"
              ><SettingsIcon aria-hidden="true" /></Button
            >{/snippet}</DropdownMenu.Trigger
        ><DropdownMenu.Content align="end"
          ><DropdownMenu.Group
            ><DropdownMenu.Label>Diff layout</DropdownMenu.Label
            ><DropdownMenu.RadioGroup bind:value={viewMode}
              ><DropdownMenu.RadioItem value="unified"
                >Unified diff</DropdownMenu.RadioItem
              ><DropdownMenu.RadioItem value="split"
                >Split diff</DropdownMenu.RadioItem
              ></DropdownMenu.RadioGroup
            ></DropdownMenu.Group
          ></DropdownMenu.Content
        ></DropdownMenu.Root
      ></span
    >
  </div>
  <div
    class="community-projects__diff-layout"
    data-file-list-open={fileListOpen}
  >
    {#if fileListOpen}<aside aria-label="Changed files">
        <ScrollArea
          type="hover"
          orientation="vertical"
          class="community-projects__changed-files-scroll-area"
        >
          <Input
            class="community-projects__changed-files-filter"
            type="search"
            bind:value={filter}
            aria-label="Filter changed files"
            placeholder="Filter changed files"
          />
          <div class="community-projects__changed-files-toolbar">
            <span>Files</span><FileListingViewModeToggle bind:mode />
          </div>
          <FileListing
            {files}
            {mode}
            {selectedPath}
            onSelectPath={(path) => (selectedPath = path)}
          />
        </ScrollArea>
      </aside>{/if}
    <div class="community-projects__diff-content">
      {#snippet fileLeading()}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          class="community-projects__diff-sidebar-toggle"
          aria-label={fileListOpen
            ? "Hide changed files"
            : "Show changed files"}
          aria-expanded={fileListOpen}
          data-ui-part="sidebar-toggle"
          data-side="left"
          data-state={fileListOpen ? "expanded" : "collapsed"}
          title={fileListOpen ? "Hide changed files" : "Show changed files"}
          onclick={() => (fileListOpen = !fileListOpen)}><PanelLeft /></Button
        >
      {/snippet}
      {#snippet fileTrailing(file: { path: string })}<label
          class="community-projects__viewed-file"
          ><Checkbox
            checked={viewed.includes(file.path)}
            onCheckedChange={(checked) =>
              (viewed = checked
                ? [...viewed, file.path]
                : viewed.filter((path) => path !== file.path))}
            aria-label={`Mark ${file.path} as viewed`}
          /><span>Viewed</span></label
        >{/snippet}
      <FileDiffComposer
        {files}
        {viewMode}
        {selectedPath}
        stickyHeaders
        fileHeaderLeading={fileLeading}
        fileHeaderTrailing={fileTrailing}
      />
    </div>
  </div>
{/if}

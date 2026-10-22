<!-- SPDX-License-Identifier: Apache-2.0 -->
<script lang="ts">
  import { untrack } from "svelte";
  import { AppShell } from "@lapismd/design-core/shell";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import * as Empty from "@lapismd/design-core/shadcn/empty";
  import FolderIcon from "@lucide/svelte/icons/folder-open";
  import PauseIcon from "@lucide/svelte/icons/pause";
  import PlayIcon from "@lucide/svelte/icons/play";
  import RefreshIcon from "@lucide/svelte/icons/refresh-cw";
  import { type ImportState } from "../controller.svelte.js";
  import { profileLabel } from "../../sessions/model.js";
  import { agentAvatar } from "../../identity/agent-avatar.js";
  import AiSessionFrame from "../../sessions/session-frame/AiSessionFrame.svelte";
  import AiSessionThread from "../../sessions/session-thread/AiSessionThread.svelte";
  import AiRecordedTranscript from "../../sessions/recorded-transcript/AiRecordedTranscript.svelte";
  import TranscriptViewToggle from "../../sessions/transcript-view-toggle/TranscriptViewToggle.svelte";
  import AiTranscriptLoading from "../../chat/transcript-loading/AiTranscriptLoading.svelte";
  import AiImportSources from "../import-sources/AiImportSources.svelte";
  import AiImportFooter from "../import-footer/AiImportFooter.svelte";
  import AiImportProgress from "../import-progress/AiImportProgress.svelte";
  let { imports }: { imports: ImportState } = $props();
  let width = $state(0),
    height = $state(0),
    open = $state(true),
    view = $state<"document" | "classic">("document");
  const compact = $derived(width > 0 && width < 640),
    selected = $derived(imports.selectedRow);
  const folder = $derived(
    selected
      ? imports.browser.indexes[selected.kind].folders.find(
          (f) => f.selector === selected.folder,
        )
      : undefined,
  );
  $effect(() => {
    if (compact && selected) untrack(() => (open = false));
  });
  function select(selector: string) {
    void imports.select(selector);
    if (compact) open = false;
  }
</script>

<div class="import-panel" data-testid="ai-import-panel">
  <AiSessionFrame
    label="Importable AI sessions"
    bind:width
    bind:height
    contentHidden={compact && open}
  >
    {#snippet navigation()}<AppShell.Body.Sidebar
        side="left"
        panelId="ai-import-sources"
        label="Import sources"
        bind:open
        class="ai-session-list-region"
        style={`--ui-shell-body-sidebar-width:${compact ? "100%" : "min(23rem, 38%)"}`}
      >
        <AiImportSources
          browser={imports.browser}
          {selected}
          available={!!imports.available}
          onSelect={select}
          onClose={compact ? () => (open = false) : undefined}
        />
      </AppShell.Body.Sidebar>{/snippet}
    <AiSessionThread
      {height}
      title={selected?.title ?? "Import AI sessions"}
      status={selected
        ? `${profileLabel(selected.profile)} · ${folder?.location ?? "Local history"} · Read-only preview`
        : "Browse local history by harness and project"}
      harness={selected?.kind}
      selected={!!selected}
      listLabel="Import sources"
      expanded={open}
      onToggle={() => (open = !open)}
    >
      {#snippet actions()}
        {#if imports.phase === "reading"}<Button
            variant="ghost"
            size="icon-sm"
            aria-label={imports.paused
              ? "Resume transcript loading"
              : "Pause transcript loading"}
            title={imports.paused
              ? "Resume transcript loading"
              : "Pause transcript loading"}
            onclick={() => imports.togglePause()}
            >{#if imports.paused}<PlayIcon
                aria-hidden="true"
              />{:else}<PauseIcon aria-hidden="true" />{/if}</Button
          >{/if}
        {#if imports.phase === "ready"}<Button
            variant="ghost"
            size="icon-sm"
            aria-label="Reload preview"
            title="Reload preview"
            onclick={() => void imports.reload()}
            ><RefreshIcon aria-hidden="true" /></Button
          >{/if}
        {#if selected}<TranscriptViewToggle bind:view />{/if}
      {/snippet}
      {#snippet footer()}<AiImportFooter
          {imports}
          canOpen={!!imports.canOpen}
        />{/snippet}
      {#if selected}
        <AiImportProgress {imports} {selected} />
        {#if imports.phase === "reading" && !imports.entries.length}<AiTranscriptLoading
            composer={false}
          />{:else}<AiRecordedTranscript
            entries={imports.entries}
            bind:view
            showViewToolbar={false}
            assistant={{
              name: profileLabel(selected.profile),
              image: agentAvatar(selected.kind),
            }}
          />{/if}
      {:else}<Empty.Root
          ><Empty.Header
            ><Empty.Media variant="icon"><FolderIcon /></Empty.Media
            ><Empty.Title
              >{imports.available
                ? "Your local AI history"
                : "Local import is unavailable"}</Empty.Title
            ><Empty.Description
              >{imports.available
                ? "Expand a harness and choose a project folder. Sessions load only when you open that folder. Preview does not save or start an agent."
                : "This host has no configured transcript source. Existing conversations remain available."}</Empty.Description
            ></Empty.Header
          ></Empty.Root
        >{/if}
    </AiSessionThread>
  </AiSessionFrame>
</div>

<style>
  .import-panel {
    height: 100%;
    min-width: 0;
    min-height: 0;
  }
</style>

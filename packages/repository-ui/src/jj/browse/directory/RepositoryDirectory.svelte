<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store's repository directory. -->
<script lang="ts">
  import type { Snippet } from "svelte";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { RelativeTime } from "@lapismd/design-core/shadcn/relative-time";
  import * as Table from "@lapismd/design-core/shadcn/table";
  import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
  import RepositoryFileAction from "../file-preview/RepositoryFileAction.svelte";
  import RepositoryAuthorAvatar from "../../foundations/author-avatar/RepositoryAuthorAvatar.svelte";
  import RepositoryIdentifiers from "../../foundations/identifiers/RepositoryIdentifiers.svelte";
  import RepositorySkeleton from "../../foundations/skeleton/RepositorySkeleton.svelte";
  import RepositoryDirectoryRows from "./RepositoryDirectoryRows.svelte";
  import RepositoryDocuments from "./RepositoryDocuments.svelte";
  import RepositoryBrowserEmpty from "../file-preview/RepositoryBrowserEmpty.svelte";
  import type {
    RepositoryBrowserCommit,
    RepositoryBrowserEntry,
    RepositoryBrowserFile,
    RepositoryBrowserPhase,
  } from "../logic/types.js";
  import "../file-preview/files.css";
  import "./directory.css";
  let {
    fileTreeOpen = $bindable(false),
    now,
    currentPath = "",
    entries,
    latestCommit,
    documents = [],
    phase = "ready",
    hasMore = false,
    loading = false,
    limitReached = false,
    onToggleFileTree,
    onOpenDirectory,
    onOpenFile,
    onSelectCommit,
    onLoadMore = () => {},
    onRetry,
    copyText,
    controls,
    actions,
    rowActions,
  }: {
    fileTreeOpen?: boolean;
    now: number;
    currentPath?: string;
    entries: readonly RepositoryBrowserEntry[];
    latestCommit?: RepositoryBrowserCommit;
    documents?: readonly RepositoryBrowserFile[];
    phase?: RepositoryBrowserPhase;
    hasMore?: boolean;
    loading?: boolean;
    limitReached?: boolean;
    onToggleFileTree?: () => void;
    onOpenDirectory(path: string): void;
    onOpenFile(path: string): void;
    onSelectCommit?(commit: RepositoryBrowserCommit): void;
    onLoadMore?: () => void;
    onRetry(): void;
    copyText(value: string): Promise<void>;
    controls?: Snippet;
    actions?: Snippet;
    rowActions?: Snippet<[RepositoryBrowserEntry]>;
  } = $props();
  const pathCommits = $derived(
    Object.fromEntries(entries.map((entry) => [entry.path, entry.commit])),
  );
</script>

<section
  class="repository-browser__file-browser"
  aria-label={currentPath ? `Directory ${currentPath}` : "Repository directory"}
>
  <div class="repository-browser__file-browser-card">
    <div class="repository-browser__file-browser-summary">
      <div class="repository-browser__file-browser-summary-primary">
        <RepositoryFileAction
          panelExpanded={fileTreeOpen}
          class="repository-browser__file-browser-tree-toggle"
          label={fileTreeOpen
            ? "Hide repository file tree"
            : "Show repository file tree"}
          onclick={() => {
            if (onToggleFileTree) onToggleFileTree();
            else fileTreeOpen = !fileTreeOpen;
          }}
        />
        {#if latestCommit}
          <RepositoryAuthorAvatar
            name={latestCommit.author}
            email={latestCommit.authorEmail}
            size="xs"
          />
          <strong class="repository-browser__file-browser-summary-author"
            >{latestCommit.author}</strong
          >
          <span class="repository-browser__file-browser-summary-verb"
            >committed</span
          >
          <button
            type="button"
            class="repository-browser__file-browser-commit-link"
            title={`View commit ${latestCommit.message}`}
            aria-label={`View commit ${latestCommit.message}`}
            disabled={!onSelectCommit}
            onclick={() => onSelectCommit?.(latestCommit)}
            >{latestCommit.message}</button
          >
          {#if onSelectCommit}<Button
              variant="ghost"
              size="icon-sm"
              class="repository-browser__file-browser-commit-details"
              title="Open commit details"
              aria-label="Open commit details"
              onclick={() => onSelectCommit?.(latestCommit)}
              ><EllipsisIcon aria-hidden="true" /></Button
            >{/if}
        {/if}
      </div>
      <div class="repository-browser__file-browser-summary-actions">
        {#if latestCommit}<RepositoryIdentifiers
            commitId={latestCommit.eventId}
            changeId={latestCommit.changeId}
            placement="inline"
            {copyText}
          /><RelativeTime
            timestamp={latestCommit.createdAt * 1000}
            now={now * 1000}
          />{/if}
        {@render controls?.()}{@render actions?.()}
      </div>
    </div>
    {#if phase === "loading" && !entries.length}<RepositorySkeleton
        kind="files"
        label="Loading repository directory"
      />
    {:else if !entries.length && phase !== "unavailable"}<RepositoryBrowserEmpty
        folder
        title="Empty directory"
        description="This directory does not contain any files at the selected revision."
      />
    {:else if entries.length}
      <Table.Root
        class="repository-browser__file-browser-table"
        aria-label={currentPath
          ? `Files in ${currentPath}`
          : "Repository files"}
      >
        <Table.Header
          ><Table.Row
            ><Table.Head>Name</Table.Head><Table.Head>Description</Table.Head
            ><Table.Head>Updated</Table.Head></Table.Row
          ></Table.Header
        >
        <RepositoryDirectoryRows
          {currentPath}
          {entries}
          {pathCommits}
          {now}
          {hasMore}
          {loading}
          {onOpenDirectory}
          {onOpenFile}
          {onSelectCommit}
          {onLoadMore}
          {rowActions}
        />
      </Table.Root>
    {/if}
    {#if phase === "unavailable"}<RepositoryBrowserEmpty
        folder
        title="Directory unavailable"
        description="The recorded directory could not be read. Retry without changing the selected revision."
        {onRetry}
      />{/if}
    {#if hasMore}<Button
        variant="ghost"
        class="repository-directory-more"
        disabled={loading}
        onclick={onLoadMore}>More files</Button
      >{/if}
    {#if limitReached}<p class="repository-directory-limit" role="status">
        The directory limit has been reached. Open a narrower directory to
        continue.
      </p>{/if}
  </div>
  <RepositoryDocuments {currentPath} previewDocuments={documents} />
</section>

<style>
  :global(.repository-directory-more) {
    width: 100%;
    justify-content: center;
    color: var(--muted-foreground);
  }
  .repository-directory-limit {
    padding: 0.5rem;
    margin: 0;
    color: var(--muted-foreground);
    font-size: 0.75rem;
  }
</style>

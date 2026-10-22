<!-- SPDX-License-Identifier: Apache-2.0; copied/adapted from JJ Store. -->
<script lang="ts">
  import "./branch-command.css";
  import * as CommandView from "@lapismd/design-core/shadcn/command-view";
  import GitBranchIcon from "@lucide/svelte/icons/git-branch";
  import RepositoryWorkingCopyCard from "./RepositoryWorkingCopyCard.svelte";
  import { Badge } from "@lapismd/design-core/shadcn/badge";
  import RepositoryAuthorAvatar from "../../foundations/author-avatar/RepositoryAuthorAvatar.svelte";
  import RepositoryReferenceRows from "../../browse/reference-picker/RepositoryReferenceRows.svelte";
  import { RelativeTime } from "@lapismd/design-core/shadcn/relative-time";
  import {
    bookmarkKey,
    bookmarkLabel,
    type RepositoryBookmark as Bookmark,
  } from "../logic/types.js";
  import type { RepositoryWorkingCopy } from "../logic/types.js";
  import RepositoryBranchEmpty from "./RepositoryBranchEmpty.svelte";
  import type { ScrollAreaStrategy } from "@lapismd/design-core/shadcn/scroll-area";
  import type { Snippet } from "svelte";
  let {
    bookmarks,
    targetBookmark,
    groupWorkspaceBookmarks = false,
    scrollStrategy = "auto",
    workingCopies = [],
    selected = "",
    selectedCommit = null,
    selectedWorkspace = null,
    now,
    hasMore = false,
    loading = false,
    onSelect,
    onSelectWorkingCopy = () => {},
    onLoadMore,
    actions,
  }: {
    actions?: Snippet<[Bookmark]>;
    bookmarks: readonly Bookmark[];
    /** Optional workspace target card, independent of the loaded bookmark filters. */
    targetBookmark?: Bookmark;
    /** Group the loaded applied bookmarks without changing repository picker defaults. */
    groupWorkspaceBookmarks?: boolean;
    scrollStrategy?: ScrollAreaStrategy;
    workingCopies?: readonly RepositoryWorkingCopy[];
    selected?: string;
    selectedCommit?: string | null;
    selectedWorkspace?: string | null;
    now?: number;
    hasMore?: boolean;
    loading?: boolean;
    onSelect: (name: string) => void;
    onSelectWorkingCopy?: (commit: string, workspace?: string) => void;
    onLoadMore?: () => void;
  } = $props();
  let query = $state(""),
    filter = $state("all"),
    commandValue = $state("");
  const visible = $derived.by(() => {
    const search = query.trim().toLocaleLowerCase();
    return bookmarks.filter((bookmark) => {
      const inFilter =
        filter === "all" ||
        (filter === "workspace"
          ? bookmark.workspace
          : bookmark.targets.length > 1);
      const searchable = [
        bookmark.name,
        bookmark.remote,
        bookmark.description,
        bookmark.author,
        ...(bookmark.searchTerms ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();
      return inFilter && (!search || searchable.includes(search));
    });
  });
  const groups = $derived(
    groupWorkspaceBookmarks
      ? [
          {
            heading: "Applied",
            bookmarks: visible.filter((item) => item.workspace),
          },
          {
            heading: "Local branches",
            bookmarks: visible.filter((item) => !item.workspace),
          },
        ].filter((group) => group.bookmarks.length)
      : [{ heading: "Bookmarks", bookmarks: visible }],
  );
</script>

{#snippet bookmarkRow(bookmark: Bookmark)}
  <CommandView.Item
    role="row"
    value={bookmarkKey(bookmark)}
    class="repository-bookmark-card"
    data-current={bookmarkKey(bookmark) === selected || undefined}
    onSelect={() => onSelect(bookmarkKey(bookmark))}
  >
    <div role="gridcell" class="repository-bookmark-card__cell">
      <span class="repository-bookmark-card__heading"
        ><GitBranchIcon aria-hidden="true" /><CommandView.ItemLabel
          title={bookmarkLabel(bookmark)}
          >{bookmarkLabel(bookmark)}</CommandView.ItemLabel
        >
        {#if bookmark.workspace}<Badge
            variant="secondary"
            class="repository-bookmark-card__status"
            >{bookmark.partiallyApplied
              ? "Partially applied"
              : "Workspace"}</Badge
          >{:else if bookmark.default}<Badge variant="secondary">default</Badge
          >{/if}
      </span>
      <CommandView.ItemDescription
        >{bookmark.description ?? "No description"}</CommandView.ItemDescription
      >
      {#if bookmark.targets.length > 1}<span
          ><Badge variant="secondary"
            >Conflicted · {bookmark.targets.length} targets</Badge
          ></span
        >{:else if bookmark.targets.length === 0}<span
          ><Badge variant="secondary">deleted</Badge></span
        >{/if}
      <span class="repository-bookmark-card__footer">
        <RepositoryAuthorAvatar
          name={bookmark.author ?? "Unknown author"}
          email={bookmark.authorEmail}
          size="xs"
        />
        <span>{bookmark.remote ?? "local"}</span><span
          class="repository-bookmark-card__author"
          >{#if bookmark.updatedAt}<span class="repository-bookmark-card__time"
              ><RelativeTime
                timestamp={bookmark.updatedAt * 1000}
                now={now === undefined ? undefined : now * 1000}
              />{" by "}</span
            >
          {/if}{bookmark.author ?? "Unknown author"}</span
        >
      </span>
      {#if actions}<div
          class="repository-bookmark-card__actions"
          role="presentation"
          onclick={(event) => event.stopPropagation()}
          onkeydown={(event) => event.stopPropagation()}
        >
          {@render actions(bookmark)}
        </div>{/if}
    </div>
  </CommandView.Item>
{/snippet}

<CommandView.Root
  bind:value={commandValue}
  label="Bookmarks"
  class="repository-bookmark-cards"
  shouldFilter={false}
  disablePointerSelection
>
  {#if targetBookmark}
    <CommandView.List
      role="grid"
      {scrollStrategy}
      aria-label="Workspace target branch"
    >
      <CommandView.Group role="rowgroup" heading="Target branch">
        {@render bookmarkRow(targetBookmark)}
      </CommandView.Group>
    </CommandView.List>
  {/if}
  {#each workingCopies as workingCopy (workingCopy.workspace)}
    <RepositoryWorkingCopyCard
      copy={workingCopy}
      {selectedCommit}
      {selectedWorkspace}
      {now}
      onSelect={onSelectWorkingCopy}
    />
  {/each}
  <CommandView.Filters
    bind:value={filter}
    onValueChange={() => (commandValue = "")}
    label="Bookmark filters"
    tabs={[
      { id: "all", label: "All" },
      { id: "workspace", label: "Workspace" },
      { id: "conflicted", label: "Conflicted" },
    ]}
  />
  <CommandView.Input
    bind:value={query}
    placeholder="Search branches"
    aria-label="Search branches"
  />
  <CommandView.List role="grid" {scrollStrategy}>
    {#if visible.length > 0}
      {#each groups as group, index (group.heading)}
        <CommandView.Group role="rowgroup" heading={group.heading}>
          <RepositoryReferenceRows
            rows={group.bookmarks}
            row={bookmarkRow}
            getKey={bookmarkKey}
            estimateSize={() => 132}
            hasMore={index === groups.length - 1 && hasMore}
            {loading}
            loadingLabel="Loading more bookmarks"
            {onLoadMore}
          />
        </CommandView.Group>
      {/each}
    {/if}
  </CommandView.List>
  {#if visible.length === 0}<RepositoryBranchEmpty {filter} {query} />{/if}
</CommandView.Root>

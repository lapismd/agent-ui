<script lang="ts">
  import * as Collapsible from "@lapismd/design-core/shadcn/collapsible";
  import * as Empty from "@lapismd/design-core/shadcn/empty";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { Skeleton } from "@lapismd/design-core/shadcn/skeleton";
  import { ChevronRight, FolderGit2, MessagesSquare } from "@lucide/svelte";
  import ThreadRow from "./ThreadRow.svelte";
  import {
    threadKey,
    type ThreadsState,
    type ThreadIdentity,
    type ThreadHome,
  } from "../logic/types.js";
  let {
    view,
    selected,
    query,
    filter,
    onSelect,
    onRetry,
    onMore,
    onRepository,
  }: {
    view: ThreadsState;
    selected?: ThreadIdentity;
    query: string;
    filter: string;
    onSelect(value: ThreadIdentity): void;
    onRetry(home?: string): void;
    onMore(home?: string): void;
    onRepository?(home: ThreadHome): void;
  } = $props();
  let closed = $state<Record<string, boolean>>({});
  const count = $derived(
    view.homes.reduce((n, h) => n + (h.page?.rows.length ?? 0), 0),
  );
  function visible(row: import("../logic/types.js").ThreadRow) {
    return (
      (filter !== "active" ||
        !["archived", "tombstoned"].includes(row.status)) &&
      (filter !== "archived" || row.status === "archived") &&
      [row.title, row.author.name, row.excerpt].some((t) =>
        t?.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
      )
    );
  }
</script>

<nav aria-label="Threads by repository" class="threads-tree">
  {#if view.loading}<div
      role="status"
      aria-label="Loading threads"
      aria-busy="true"
    >
      <Skeleton style="height:2.25rem" />{#each [0, 1, 2] as i (i)}<Skeleton
          style="height:3.25rem;margin-block:0.25rem"
        />{/each}
    </div>{/if}
  {#if view.error}<Empty.Root
      ><Empty.Header
        ><Empty.Media variant="icon"><MessagesSquare /></Empty.Media
        ><Empty.Title>Threads unavailable</Empty.Title><Empty.Description
          >Read the registered repository directory again.</Empty.Description
        ></Empty.Header
      ><Empty.Content
        ><Button onclick={() => onRetry()}>Retry Threads</Button></Empty.Content
      ></Empty.Root
    >{/if}
  {#each view.homes as home (home.id)}
    <Collapsible.Root
      open={!closed[home.id]}
      onOpenChange={(open) => (closed = { ...closed, [home.id]: !open })}
      role="group"
      aria-label={`${home.name} Threads`}
      data-repository-id={home.id}
    >
      <div class="threads-tree__header">
        <Collapsible.Trigger
          >{#snippet child({ props })}<Button
              {...props}
              variant="ghost"
              class="threads-tree__repository"
              aria-label={`${closed[home.id] ? "Expand" : "Collapse"} ${home.name} Threads`}
              ><FolderGit2 aria-hidden="true" /><span>{home.name}</span></Button
            >{/snippet}</Collapsible.Trigger
        >
        {#if onRepository}<Button
            variant="ghost"
            size="icon-xs"
            disabled={home.available === false}
            aria-label={`Open ${home.name} repository`}
            onclick={() => onRepository?.(home)}
            ><FolderGit2 aria-hidden="true" /></Button
          >{/if}
        <Collapsible.Trigger
          >{#snippet child({ props })}<Button
              {...props}
              variant="ghost"
              size="icon-xs"
              class="threads-tree__toggle"
              aria-label={`Toggle ${home.name} Threads`}
              ><ChevronRight aria-hidden="true" /></Button
            >{/snippet}</Collapsible.Trigger
        >
      </div>
      <Collapsible.Content
        ><div class="threads-tree__children">
          {#each home.page?.rows.filter(visible) ?? [] as item (threadKey(item))}<ThreadRow
              {item}
              active={!!selected && threadKey(item) === threadKey(selected)}
              onSelect={() => onSelect({ home: item.home, id: item.id })}
            />{/each}
          {#if home.loading}<div
              role="status"
              aria-label={`Loading ${home.name} threads`}
              aria-busy="true"
            >
              {#each [0, 1, 2] as row (row)}<Skeleton
                  style="height:3.25rem;margin-block:0.25rem"
                />{/each}
            </div>{/if}
          {#if home.error}<Empty.Root
              role="group"
              aria-label={`${home.name} unavailable`}
              ><Empty.Header
                ><Empty.Media variant="icon"
                  ><MessagesSquare aria-hidden="true" /></Empty.Media
                ><Empty.Title>Threads unavailable for {home.name}</Empty.Title
                ><Empty.Description
                  >Read this registered repository again.</Empty.Description
                ></Empty.Header
              ><Empty.Content
                ><Button
                  variant="outline"
                  size="sm"
                  onclick={() => onRetry(home.id)}>Retry {home.name}</Button
                >
              </Empty.Content></Empty.Root
            >
          {:else if home.page?.next}<Button
              variant="ghost"
              disabled={home.loading}
              onclick={() => onMore(home.id)}>More Threads · {home.name}</Button
            >{/if}
        </div></Collapsible.Content
      >
    </Collapsible.Root>
  {/each}
  {#if view.remaining}<Button variant="ghost" onclick={() => onMore()}
      >Load more repositories ({view.remaining})</Button
    >{/if}
  {#if !view.loading && !view.error && !view.homes.some((h) => h.loading || h.error) && !count}<Empty.Root
      ><Empty.Header
        ><Empty.Media variant="icon"><MessagesSquare /></Empty.Media
        ><Empty.Title>No threads yet</Empty.Title><Empty.Description
          >Create a thread in a registered repository to start a conversation.</Empty.Description
        ></Empty.Header
      ></Empty.Root
    >
  {:else if count && !view.homes.some((h) => h.loading || h.page?.rows.some(visible))}<Empty.Root
      ><Empty.Header
        ><Empty.Media variant="icon"
          ><MessagesSquare aria-hidden="true" /></Empty.Media
        ><Empty.Title>No matching threads</Empty.Title><Empty.Description
          >No loaded threads match this view. Try another search or filter.</Empty.Description
        ></Empty.Header
      ></Empty.Root
    >{/if}
</nav>

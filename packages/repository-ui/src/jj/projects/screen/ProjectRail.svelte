<!-- Copied/adapted from JJ Store StoreProjectsRail, Apache-2.0. -->
<script lang="ts">
  import type { Component } from "svelte";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import {
    FolderKanban,
    GitBranch,
    MessageCircle,
    ListTodo,
    CircleDot,
    Link,
  } from "@lucide/svelte";
  import type { WorkPage, WorkHome, WorkRoute } from "../logic/types.js";
  let {
    page,
    homes,
    home,
    navigate,
    onOpenRepository,
    onCopyLink,
    onError,
  }: {
    page: WorkPage;
    homes: WorkHome[];
    home: WorkHome;
    navigate(route: WorkRoute): void;
    onOpenRepository?(home: WorkHome): void;
    onCopyLink?(): Promise<void>;
    onError(error: unknown): void;
  } = $props();
  let copied = $state(false);
  async function copy() {
    try {
      await onCopyLink?.();
      copied = true;
    } catch (error) {
      onError(error);
    }
  }
</script>

{#snippet item(
  Icon: Component,
  label: string,
  value: string | number = "",
  action?: () => void,
)}
  <Button
    variant="ghost"
    class="community-application__project-overview-item"
    onclick={action}
  >
    <Icon data-icon="inline-start" aria-hidden="true" /><span>{label}</span
    ><span
      class="community-application__project-overview-count"
      title={String(value)}>{value}</span
    >
  </Button>
{/snippet}
<nav class="store-projects__rail" aria-label="Project details">
  <p>Details</p>
  {#if page.project}{@render item(FolderKanban, page.project.title, "", () =>
      navigate({ tab: "tasks", home: home.id, project: page.project!.id }),
    )}{/if}
  {#if page.task}
    {@render item(
      CircleDot,
      "Status",
      page.task.state === "in_progress"
        ? "In progress"
        : page.task.state[0].toUpperCase() + page.task.state.slice(1),
    )}
    {@render item(
      MessageCircle,
      "Comments",
      `${page.comments.length}${page.next ? "+" : ""}`,
    )}
    {#if page.task.parent}{@render item(ListTodo, "Parent task", "", () =>
        navigate({
          tab: "tasks",
          home: home.id,
          project: page.task!.project,
          task: page.task!.parent!,
        }),
      )}{/if}
  {/if}
  {#if onCopyLink}{@render item(
      Link,
      copied ? "Link copied" : "Copy Link",
      "",
      () => void copy(),
    )}{/if}
  <p>Metadata home</p>
  <span class="store-projects__home">{home.name}</span>
  <p>Repositories</p>
  {#each Object.entries(page.project?.repositories ?? {}) as [id, active]}
    {@const target = homes.find((h) => h.repository === id)}
    <Button
      variant="ghost"
      class="community-application__project-overview-item"
      disabled={!target?.available || !onOpenRepository}
      title={id}
      onclick={() => target && onOpenRepository?.(target)}
    >
      <GitBranch data-icon="inline-start" aria-hidden="true" /><span
        >{target?.name ?? id.slice(0, 12)}</span
      ><span class="community-application__project-overview-count"
        >{active ? "" : "Retired"}</span
      >
    </Button>
    {#if !target?.available}<small>Separate access required</small>{/if}
  {/each}
</nav>

<style>
  .store-projects__rail {
    display: grid;
    gap: 0.4rem;
    padding: 0.75rem;
    font-size: var(--ui-projects-font-size, 0.8125rem);
  }
  .store-projects__rail p {
    color: var(--muted-foreground);
    margin: 0.75rem 0 0.2rem;
  }
  .store-projects__home {
    padding-inline: 0.5rem;
  }
  small {
    color: var(--muted-foreground);
  }
  :global(
    .store-projects__rail
      .community-application__project-overview-item[data-ui-component="button"]
  ) {
    display: grid;
    width: 100%;
    height: 1.75rem;
    grid-template-columns: 0.875rem minmax(0, 1fr) auto;
    justify-content: stretch;
    gap: 0.75rem;
    padding-inline: 0.5rem;
    color: var(--muted-foreground);
    font-size: var(--ui-projects-font-size, 0.8125rem);
    font-weight: 400;
    line-height: 1.25rem;
    text-align: start;
  }
  :global(
    .store-projects__rail
      .community-application__project-overview-item:hover:not(:disabled)
  ),
  :global(
    .store-projects__rail
      .community-application__project-overview-item:focus-visible
  ) {
    background-color: color-mix(in oklab, currentColor 10%, transparent);
  }
  :global(
    .store-projects__rail .community-application__project-overview-item > span
  ) {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  :global(
    .store-projects__rail .community-application__project-overview-item > svg
  ) {
    width: 0.875rem;
    height: 0.875rem;
  }
  .community-application__project-overview-count {
    max-width: 9rem;
    overflow: hidden;
    color: var(--muted-foreground);
    font-weight: 400;
    font-variant-numeric: tabular-nums;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>

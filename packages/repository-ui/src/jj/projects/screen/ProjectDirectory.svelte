<!-- Copied/adapted from JJ Store StoreProjectsDirectory/OwnershipGroups, Apache-2.0. -->
<script lang="ts">
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { Skeleton } from "@lapismd/design-core/shadcn/skeleton";
  import { FolderKanban, ListTodo } from "@lucide/svelte";
  import ProjectCollection from "./ProjectCollection.svelte";
  import ProjectRows from "./ProjectRows.svelte";
  import TaskRows from "./TaskRows.svelte";
  import WorkEmpty from "./WorkEmpty.svelte";
  import type { ProjectsController } from "../logic/controller.js";
  import type { ProjectsState, WorkRoute, WorkActor } from "../logic/types.js";
  let {
    controller,
    view,
    layout,
    navigate,
    repositoryName,
  }: {
    controller: ProjectsController;
    view: ProjectsState;
    layout: "list" | "grid";
    navigate(route: WorkRoute): void;
    repositoryName(id: string): string;
  } = $props();
  const kind = $derived(view.route.tab === "tasks" ? "tasks" : "projects");
  const owned = (actor: WorkActor, principal?: string) =>
    Boolean(principal && actor.created_by === principal);
  const count = (mine: boolean) =>
    view.homes.reduce(
      (n, h) =>
        n +
        (h.page?.[kind] ?? []).filter(
          (r) => owned(r.actor, h.home.principal) === mine,
        ).length,
      0,
    );
</script>

<div class="community-projects__collection-groups">
  {#each [true, false] as mine}{#if count(mine)}<ProjectCollection
        title={mine ? "Mine" : `Other ${kind}`}
        Icon={kind === "tasks" ? ListTodo : FolderKanban}
      >
        {#each view.homes as entry (entry.home.id)}
          {#if kind === "tasks"}{@const tasks = (
              entry.page?.tasks ?? []
            ).filter((r) => owned(r.actor, entry.home.principal) === mine)}
            {#if tasks.length}<TaskRows
                {tasks}
                {layout}
                {repositoryName}
                hierarchy={!!view.route.project}
                select={(task) =>
                  navigate({
                    tab: "tasks",
                    home: entry.home.id,
                    project: task.project,
                    task: task.id,
                  })}
              />{/if}
          {:else}{@const projects = (entry.page?.projects ?? []).filter(
              (r) => owned(r.actor, entry.home.principal) === mine,
            )}
            {#if projects.length}<ProjectRows
                {projects}
                {layout}
                select={(project) =>
                  navigate({
                    tab: "tasks",
                    home: entry.home.id,
                    project: project.id,
                  })}
              />{/if}
          {/if}
        {/each}
      </ProjectCollection>{/if}{/each}
</div>
{#each view.homes as entry (entry.home.id)}
  {#if entry.loading && !entry.page}<div class="work-loading" role="status">
      Loading {entry.home.name}<Skeleton class="h-12" />
    </div>{/if}
  {#if entry.error}<WorkEmpty
      title={`${entry.home.name} unavailable`}
      description="Other repositories remain available. Previously loaded rows are retained."
      retry={() => void controller.read(entry.home.id)}
    />{/if}
  {#if entry.page?.next}<Button
      variant="outline"
      disabled={entry.loading}
      onclick={() => void controller.read(entry.home.id, true)}
      >More {kind} in {entry.home.name}</Button
    >{/if}
  {#if entry.page?.bounded}<p class="work-filter">
      Showing a bounded selection. Refine the filters to see more.
    </p>{/if}
{/each}
{#if !view.loading && view.homes.every((h) => !h.loading && !h.error) && !count(true) && !count(false)}<WorkEmpty
    title={`No matching ${kind}`}
    description="Create an item or change the filters to see work across your repositories."
  />{/if}

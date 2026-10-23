<!-- Copied/adapted from JJ Store WorkRepositories/ProjectsRepositories, Apache-2.0. -->
<script lang="ts">
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { GitBranch, Archive, Undo2, ListTodo } from "@lucide/svelte";
  import ProjectCollection from "./ProjectCollection.svelte";
  import RepositoryDirectoryRow from "./RepositoryDirectoryRow.svelte";
  import LinkRepositoryDialog from "./LinkRepositoryDialog.svelte";
  import WorkEmpty from "./WorkEmpty.svelte";
  import type { WorkHome, WorkProject, WorkRoute } from "../logic/types.js";
  import type { ProjectsController } from "../logic/controller.js";
  let {
    homes,
    home,
    project,
    controller,
    disabled = false,
    onOpenRepository,
    navigate,
    layout,
    query = "",
    open = $bindable(false),
  }: {
    homes: WorkHome[];
    home?: WorkHome;
    project?: WorkProject;
    controller: ProjectsController;
    disabled?: boolean;
    onOpenRepository?(home: WorkHome): void;
    navigate(route: WorkRoute): void;
    layout: "list" | "grid";
    query?: string;
    open?: boolean;
  } = $props();
  const entries = $derived(
    (project
      ? Object.entries(project.repositories).map(([id, active]) => ({
          id,
          active,
          home: homes.find((h) => h.repository === id),
        }))
      : homes.map((home) => ({
          id: home.repository ?? home.id,
          active: true,
          home,
        }))
    ).filter((entry) =>
      `${entry.home?.name ?? ""} ${entry.home?.description ?? ""} ${entry.id}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    ),
  );
</script>

{#snippet rows(items: typeof entries)}
  <div
    class="community-projects__list"
    role="list"
    aria-label="Repositories"
    data-layout={layout}
  >
    {#each items as entry (entry.id)}<div role="listitem">
        <RepositoryDirectoryRow
          id={entry.id}
          home={entry.home}
          status={entry.active ? "" : "Retired"}
          onOpen={onOpenRepository}
        >
          {#snippet actions()}{#if project && home?.writable}<Button
                variant="ghost"
                size="icon-sm"
                aria-label={`${entry.active ? "Retire" : "Restore"} link to ${entry.home?.name ?? entry.id}`}
                title={entry.active ? "Retire link" : "Restore link"}
                {disabled}
                onclick={() =>
                  void controller.submit(home!.id, {
                    kind: "link-repository",
                    project: project!.id,
                    version: project!.version,
                    repository: entry.id,
                    active: !entry.active,
                  })}
                >{#if entry.active}<Archive />{:else}<Undo2 />{/if}</Button
              >{:else if entry.home}<Button
                variant="ghost"
                size="icon-sm"
                aria-label="Projects and tasks"
                title="Projects and tasks"
                onclick={() =>
                  navigate({ tab: "projects", repository: entry.id })}
                ><ListTodo /></Button
              >{/if}{/snippet}
        </RepositoryDirectoryRow>
      </div>{/each}
  </div>
{/snippet}
{#if project}{@render rows(
    entries,
  )}{:else}{#each [true, false] as mine}{@const items = entries.filter(
      (r) => !!r.home?.writable === mine,
    )}{#if items.length}<ProjectCollection
        title={mine ? "Mine" : "Other repositories"}
        Icon={GitBranch}>{@render rows(items)}</ProjectCollection
      >{/if}{/each}{/if}
{#if !entries.length}<WorkEmpty
    title="No repositories match"
    description="Change the search or link a repository to this project."
  />{/if}
{#if open && project && home}<LinkRepositoryDialog
    {homes}
    {home}
    {project}
    {controller}
    {disabled}
    onClose={() => (open = false)}
  />{/if}

<!-- Copied/adapted from JJ Store StoreProjectsActivity, Apache-2.0. -->
<script lang="ts">
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { Skeleton } from "@lapismd/design-core/shadcn/skeleton";
  import ProjectActivity from "./ProjectActivity.svelte";
  import WorkEmpty from "./WorkEmpty.svelte";
  import type { ProjectsController } from "../logic/controller.js";
  import type { ProjectsState, WorkActivity } from "../logic/types.js";
  let {
    controller,
    view,
    repositoryName,
    onOpen,
    copyText,
  }: {
    controller: ProjectsController;
    view: ProjectsState;
    repositoryName(id: string): string;
    onOpen?(row: WorkActivity): void;
    copyText?(text: string): Promise<void>;
  } = $props();
  // One chronological timeline across metadata homes. The same code repository
  // can be linked by multiple homes; keep its exact recorded revisions once.
  const rows = $derived(
    [
      ...new Map(
        view.homes
          .flatMap((h) => h.page?.activity ?? [])
          .map((row) => [
            JSON.stringify([
              row.repository,
              row.operation,
              row.revision.eventId,
            ]),
            row,
          ]),
      ).values(),
    ].sort((a, b) => b.revision.createdAt - a.revision.createdAt),
  );
</script>

<section
  aria-label="Project activity"
  aria-busy={view.homes.some((h) => h.loading)}
>
  {#if rows.length}<ProjectActivity
      {rows}
      {repositoryName}
      {onOpen}
      {copyText}
    />{/if}
  {#each view.homes as entry (entry.home.id)}
    {#if entry.loading && !entry.page}<div class="work-loading" role="status">
        Loading {entry.home.name} activity<Skeleton class="h-12" />
      </div>{/if}
    {#if entry.error}<WorkEmpty
        title={`${entry.home.name} activity unavailable`}
        description="Other repositories remain available. Previously loaded activity is retained."
        retry={() => void controller.read(entry.home.id)}
      />{/if}
    {#if entry.page?.next}<Button
        variant="outline"
        disabled={entry.loading}
        onclick={() => void controller.read(entry.home.id, true)}
        >More activity in {entry.home.name}</Button
      >{/if}
    {#if entry.page?.bounded}<p class="work-filter">
        Showing a bounded selection. Refine the filters to see more.
      </p>{/if}
  {/each}
  {#if !rows.length && view.homes.every((h) => !h.loading && !h.error)}<WorkEmpty
      title="No repository activity yet"
      description="Commits from accessible linked repositories will appear here."
    />{/if}
</section>

<!-- Adapted from JJ Store ProjectsDirectory per-home body, Apache-2.0. -->
<script lang="ts">
  import { Button } from "@lapismd/design-core/shadcn/button";
  import ReviewRow from "./ReviewRow.svelte";
  import { Skeleton } from "@lapismd/design-core/shadcn/skeleton";
  import type { ProjectsController } from "../logic/controller.js";
  import type {
    WorkHomeState,
    WorkRoute,
    WorkHome,
    WorkContext,
    WorkActivity,
  } from "../logic/types.js";
  import ProjectCollection from "./ProjectCollection.svelte";
  import ProjectRows from "./ProjectRows.svelte";
  import TaskRows from "./TaskRows.svelte";
  import WorkEmpty from "./WorkEmpty.svelte";
  import WorkReviewDetail from "./WorkReviewDetail.svelte";
  import WorkDetails from "./WorkDetails.svelte";
  let {
    controller,
    entry,
    route,
    layout,
    busy,
    navigate,
    openEditor,
    repositoryName,
    onError,
    homes,
    onOpenRepository,
    onChat,
    onOpenActivity,
    copyText,
  }: {
    controller: ProjectsController;
    entry: WorkHomeState;
    route: WorkRoute;
    layout: "list" | "grid";
    busy: boolean;
    navigate(route: WorkRoute): void;
    openEditor(
      mode: "project" | "task" | "review",
      edit?: boolean,
      parent?: string,
    ): void;
    repositoryName(id: string): string;
    onError(error: unknown): void;
    homes: WorkHome[];
    onOpenRepository?(home: WorkHome): void;
    onChat?(context: WorkContext): void;
    onOpenActivity?(row: WorkActivity): void;
    copyText?(text: string): Promise<void>;
  } = $props();
  const page = $derived(entry.page);
</script>

{#snippet body()}
  {#if entry.loading && !page}<div class="work-loading" role="status">
      Loading {entry.home.name}<Skeleton class="h-12" />
    </div>{/if}
  {#if entry.error}<WorkEmpty
      title={`${entry.home.name} unavailable`}
      description="Other repositories remain available. Previously loaded rows are retained."
      retry={() => void controller.read(entry.home.id)}
    />{/if}
  {#if page}
    {#if page.review}{#key `${entry.home.id}:${page.review.id}`}<WorkReviewDetail
          {controller}
          {page}
          home={entry.home}
          disabled={busy}
          {navigate}
          {onError}
          {onChat}
          {onOpenActivity}
          {copyText}
          {repositoryName}
        />{/key}
    {:else if page.task}<WorkDetails
        {controller}
        {page}
        home={entry.home}
        disabled={busy}
        {navigate}
        {onError}
        {homes}
        {onOpenRepository}
        {onChat}
        edit={() => openEditor("task", true)}
        createTask={() => openEditor("task", false, page?.task?.id)}
      />
    {:else if route.tab === "projects"}<ProjectRows
        projects={page.projects}
        {layout}
        select={(project) =>
          navigate({
            tab: "tasks",
            home: entry.home.id,
            project: project.id,
          })}
      />{#if !page.projects.length && !entry.error}<WorkEmpty
          title="No matching projects"
          description="Create a project or change your search."
        />{/if}
    {:else if route.tab === "tasks"}<TaskRows
        tasks={page.tasks}
        {layout}
        {repositoryName}
        hierarchy={!!page.project}
        select={(task) =>
          navigate({
            tab: "tasks",
            home: entry.home.id,
            project: task.project,
            task: task.id,
          })}
      />{#if !page.tasks.length && !entry.error}<WorkEmpty
          title="No matching tasks"
          description="Select a project and create a task, or change the filters."
        />{/if}
    {:else if route.tab === "reviews"}<div
        class="community-projects__review-group-list community-projects__list"
        role="list"
        aria-label="Reviews"
        data-layout={layout}
      >
        {#each page.reviews as review (review.id)}<div role="listitem">
            <ReviewRow
              {review}
              onOpen={(review) =>
                navigate({ ...route, home: entry.home.id, review })}
            />
          </div>{/each}{#if !page.reviews.length}<WorkEmpty
            title="No reviews"
            description="Create a review for this repository."
          />{/if}
      </div>
    {/if}
    {#if page.next}<Button
        variant="outline"
        disabled={entry.loading}
        onclick={() => void controller.read(entry.home.id, true)}
        >More {route.tab} in {entry.home.name}</Button
      >{/if}
    {#if page.bounded}<p class="work-filter">
        Showing a bounded selection. Refine the filters to see more.
      </p>{/if}
  {/if}
{/snippet}
{#if page?.task || page?.review}{@render body()}{:else}<ProjectCollection
    title={entry.home.name}>{@render body()}</ProjectCollection
  >{/if}

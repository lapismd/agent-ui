<!-- Adapted from JJ Store StoreProjects/Directory/Viewport, Apache-2.0. -->
<script lang="ts">
  import { onMount, untrack, type Snippet } from "svelte";
  import { PanelRight } from "@lucide/svelte";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import ProjectSearch from "./ProjectSearch.svelte";
  import ProjectFilters from "./ProjectFilters.svelte";
  import { Skeleton } from "@lapismd/design-core/shadcn/skeleton";
  import RepositoryPageFrame from "../../navigation/page-frame/RepositoryPageFrame.svelte";
  import type { ProjectsController } from "../logic/controller.js";
  import type {
    WorkRoute,
    WorkHome,
    WorkContext,
    WorkTab,
    WorkActivity,
  } from "../logic/types.js";
  import ProjectToolbar from "./ProjectToolbar.svelte";
  import WorkEmpty from "./WorkEmpty.svelte";
  import WorkEditor from "./WorkEditor.svelte";
  import ProjectDirectory from "./ProjectDirectory.svelte";
  import ActivityDirectory from "./ActivityDirectory.svelte";
  import ProjectHomeContent from "./ProjectHomeContent.svelte";
  import ProjectRail from "./ProjectRail.svelte";
  import LinkedRepositories from "./LinkedRepositories.svelte";
  import "./projects.css";
  let {
    controller,
    header,
    agents,
    onNavigate,
    onOpenRepository,
    onChat,
    onOpenActivity,
    copyText,
    onCopyLink,
    onError,
    showRail = $bindable(false),
  }: {
    controller: ProjectsController;
    header?: Snippet;
    agents?: Snippet<[WorkContext]>;
    onNavigate?(route: WorkRoute): void;
    onOpenRepository?(home: WorkHome): void;
    onChat?(context: WorkContext): void;
    onOpenActivity?(activity: WorkActivity): void;
    copyText?(text: string): Promise<void>;
    onCopyLink?(route: WorkRoute): Promise<void>;
    onError(error: unknown): void;
    showRail?: boolean;
  } = $props();
  let view = $state(untrack(() => controller.state));
  onMount(() => controller.subscribe((value) => (view = value)));
  let layout = $state<"list" | "grid">("list"),
    editor = $state<"project" | "task" | "review">(),
    editing = $state(false),
    createHome = $state(""),
    searchOpen = $state(false),
    initialParent = $state(""),
    linkOpen = $state(false);
  const selected = $derived(
    view.homes.find((h) => h.home.id === view.route.home),
  );
  const project = $derived(selected?.page?.project),
    task = $derived(selected?.page?.task);
  const owner = $derived(
    view.directory.find((h) => h.id === (view.route.home ?? createHome)) ??
      view.directory.find((h) => h.writable && h.available),
  );
  const context = $derived<WorkContext>({
    home: view.route.home ?? owner?.id ?? "",
    repository: selected?.home.repository,
    project: view.route.project,
    task: view.route.task,
    review: view.route.review,
  });
  const busy = $derived(
    !!owner &&
      (view.writing.has(owner.id) ||
        view.pending.some((r) => r.home === owner.id)),
  );
  const title = $derived(
    view.route.tab[0].toUpperCase() + view.route.tab.slice(1),
  );
  function navigate(route: WorkRoute) {
    editor = undefined;
    linkOpen = false;
    onNavigate?.(route);
    void controller.open(route);
  }
  const repositoryName = (id: string) =>
    view.directory.find((h) => h.repository === id)?.name ??
    `${id.slice(0, 12)} · unavailable`;
  function openEditor(
    mode: "project" | "task" | "review",
    edit = false,
    parent = "",
  ) {
    initialParent = parent;
    editing = edit;
    editor = mode;
  }
</script>

{#snippet projectDetails()}{#if showRail && selected?.page && (project || task)}<ProjectRail
      page={selected.page}
      home={selected.home}
      homes={view.directory}
      {navigate}
      {onOpenRepository}
      onCopyLink={onCopyLink ? () => onCopyLink!(view.route) : undefined}
      {onError}
    />{/if}{/snippet}

<div class="repository-projects">
  <RepositoryPageFrame
    title="Projects"
    context={project ? "project" : "projects"}
    value={view.route.tab}
    onSelect={(value) =>
      navigate({
        ...view.route,
        task: undefined,
        review: undefined,
        tab: value as WorkTab,
      })}
    {header}
    showNavigation={!view.route.task && !view.route.review}
    scrollable={!view.route.task && !view.route.review}
    hideTabs={searchOpen}
    details={showRail && selected?.page && (project || task)
      ? projectDetails
      : undefined}
  >
    {#snippet headerActions()}{#if project || task}<Button
          variant="ghost"
          size="icon-sm"
          aria-label="Toggle details"
          aria-expanded={showRail}
          onclick={() => (showRail = !showRail)}><PanelRight /></Button
        >{/if}{/snippet}
    {#snippet search()}{#if view.route.tab !== "reviews"}<ProjectSearch
          label={`Search ${view.route.tab}`}
          scope={`${view.route.home}:${view.route.project}:${view.route.tab}`}
          query={view.route.query ?? ""}
          bind:open={searchOpen}
          onQuery={(query) => navigate({ ...view.route, query })}
        />{/if}{/snippet}
    {#snippet actions()}<ProjectFilters {view} {project} {navigate} />{/snippet}
    <section
      class="community-projects"
      class:work-detail-page={!!view.route.task || !!view.route.review}
      aria-label="Projects and tasks"
      aria-busy={view.loading}
    >
      {#if !view.route.task && !view.route.review}<ProjectToolbar
          {view}
          {project}
          {task}
          {title}
          {owner}
          {busy}
          {context}
          {onChat}
          {navigate}
          {openEditor}
          onLink={() => (linkOpen = true)}
          bind:layout
          refresh={() => void controller.open()}
        />{/if}
      {#each view.pending as request (request.id)}<section
          class="work-recovery"
          aria-label="Pending metadata request"
        >
          <p>
            Saved request in {view.directory.find((h) => h.id === request.home)
              ?.name ?? request.home}. Its outcome needs inspection.
          </p>
          <Button
            variant="outline"
            disabled={view.writing.has(request.home)}
            onclick={() => void controller.resolve(request)}
            >Check outcome</Button
          >
        </section>{/each}
      {#if view.loading}<div class="work-loading" role="status">
          <span>Loading projects</span><Skeleton class="h-12" />
        </div>
      {:else if view.error}<WorkEmpty
          title="Projects unavailable"
          description="The repository directory could not be read."
          retry={() => void controller.open()}
        />
      {:else if view.route.tab === "agents"}{#if agents}{@render agents(
            context,
          )}{:else}<WorkEmpty
            title="Agent sessions unavailable"
            description="The host has not supplied an agent session view."
          />{/if}
      {:else if view.route.tab === "repositories"}<LinkedRepositories
          homes={view.directory}
          home={selected?.home}
          {project}
          {layout}
          {navigate}
          query={view.route.query}
          bind:open={linkOpen}
          {controller}
          disabled={busy}
          {onOpenRepository}
        />
      {:else if view.route.tab === "activity"}<ActivityDirectory
          {controller}
          {view}
          {repositoryName}
          onOpen={onOpenActivity}
          {copyText}
        />
      {:else if !view.homes.length}<WorkEmpty
          title="No registered repositories"
          description="Open a local repository to start a project."
        />
      {:else if ["projects", "tasks"].includes(view.route.tab) && !view.route.task}<ProjectDirectory
          {controller}
          {view}
          {layout}
          {navigate}
          {repositoryName}
        />
      {:else}{#each view.homes as entry (entry.home.id)}
          <ProjectHomeContent
            {controller}
            {entry}
            route={view.route}
            {layout}
            {busy}
            {navigate}
            {openEditor}
            {repositoryName}
            homes={view.directory}
            {onOpenRepository}
            {onChat}
            {onError}
          />
        {/each}{/if}
      {#if view.remaining}<Button
          variant="outline"
          onclick={() => void controller.moreHomes()}
          >Load more repositories ({view.remaining})</Button
        >{/if}
    </section>
  </RepositoryPageFrame>
  {#if editor && owner}{#key `${owner.id}:${editor}:${editing}`}<WorkEditor
        {controller}
        home={owner.id}
        homes={view.directory}
        project={editor === "task" || editing ? project : undefined}
        task={editing ? task : undefined}
        {initialParent}
        disabled={busy}
        allowHomeChange={!project && !editing}
        onHomeChange={(home) => (createHome = home)}
        mode={editor}
        onClose={() => (editor = undefined)}
        {onError}
      />{/key}{/if}
</div>

<!-- Adapted from JJ Store ProjectsActions and surface header, Apache-2.0. -->
<script lang="ts">
  import { Button } from "@lapismd/design-core/shadcn/button";
  import * as Tooltip from "@lapismd/design-core/shadcn/tooltip";
  import {
    FolderRoot,
    ListTodo,
    History,
    GitBranch,
    Bot,
    MessageSquare,
    List,
    Grid2x2,
    Plus,
    Link,
    Pencil,
    MessageSquarePlus,
    RefreshCw,
  } from "@lucide/svelte";
  import type {
    ProjectsState,
    WorkProject,
    WorkTask,
    WorkContext,
    WorkHome,
    WorkRoute,
  } from "../logic/types.js";
  let {
    view,
    project,
    title,
    owner,
    busy,
    context,
    onChat,
    openEditor,
    refresh,
    onLink,
    layout = $bindable("list"),
  }: {
    view: ProjectsState;
    project?: WorkProject;
    task?: WorkTask;
    title: string;
    owner?: WorkHome;
    busy: boolean;
    context: WorkContext;
    onChat?(context: WorkContext): void;
    navigate(route: WorkRoute): void;
    openEditor(mode: "project" | "task" | "review", edit?: boolean): void;
    refresh(): void;
    onLink(): void;
    layout?: "list" | "grid";
    createHome?: string;
  } = $props();
  const Icon = $derived(
    {
      tasks: ListTodo,
      projects: FolderRoot,
      activity: History,
      repositories: GitBranch,
      reviews: MessageSquare,
      agents: Bot,
    }[view.route.tab],
  );
  const createLabel = $derived(
    view.route.tab === "reviews"
      ? "New review"
      : view.route.tab === "tasks"
        ? "New task"
        : "New project",
  );
  const layoutLabel = $derived(layout === "list" ? "Show cards" : "Show list");
</script>

<header class="community-projects__surface-header">
  <div>
    <Icon aria-hidden="true" />
    <h1>{title}</h1>
  </div>
  <div class="community-projects__surface-actions">
    {#if onChat && context.home}<Button
        variant="ghost"
        size="icon-sm"
        aria-label="Chat about this view"
        title="New agent session"
        onclick={() => onChat?.(context)}><MessageSquarePlus /></Button
      >{/if}
    {#if !["activity", "agents"].includes(view.route.tab)}<Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger>
            {#snippet child({ props }: { props: Record<string, unknown> })}
              <Button
                {...props}
                variant="ghost"
                size="icon-sm"
                aria-label={layoutLabel}
                onclick={() => (layout = layout === "list" ? "grid" : "list")}
                >{#if layout === "list"}<Grid2x2
                    aria-hidden="true"
                  />{:else}<List aria-hidden="true" />{/if}</Button
              >
            {/snippet}
          </Tooltip.Trigger>
          <Tooltip.Content side="bottom">{layoutLabel}</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>{/if}
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Refresh projects"
      title="Refresh projects"
      disabled={view.loading}
      onclick={refresh}><RefreshCw /></Button
    >
    {#if owner?.writable && owner.available}
      {#if project}<Button
          variant="ghost"
          size="icon-sm"
          aria-label="Edit project"
          title="Edit project"
          disabled={busy}
          onclick={() => openEditor("project", true)}><Pencil /></Button
        >{/if}
      {#if project && view.route.tab === "repositories"}<Button
          variant="ghost"
          size="icon-sm"
          aria-label="Link repository"
          title="Link repository"
          disabled={busy}
          onclick={onLink}><Link /></Button
        >{/if}
      {#if ["projects", "tasks", "reviews"].includes(view.route.tab)}<Button
          variant="ghost"
          size="icon-sm"
          aria-label={createLabel}
          title={createLabel}
          disabled={busy}
          onclick={() =>
            openEditor(
              view.route.tab === "reviews"
                ? "review"
                : view.route.tab === "tasks"
                  ? "task"
                  : "project",
            )}><Plus /></Button
        >{/if}
    {/if}
  </div>
</header>

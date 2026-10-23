<script lang="ts">
  import { onMount, onDestroy, untrack } from "svelte";
  import {
    ProjectsController,
    ProjectsScreen,
    RepositoryBreadcrumbs,
    type WorkRoute,
  } from "../../packages/repository-ui/src/jj/index.js";
  import {
    NotificationToasts,
    type NotificationToastRecord,
  } from "@lapismd/design-core/workspace/plugins/notifications";
  import { projectsFixture } from "./support/projects-fixture.js";
  let { variant = "Basic" }: { variant?: string } = $props();
  const fixture = untrack(() => projectsFixture(variant));
  let records = $state<NotificationToastRecord[]>([]),
    context = $state("");
  const report = (error: unknown) =>
    (records = [
      {
        id: "work",
        severity: "error",
        title: "Projects request failed",
        message: error instanceof Error ? error.message : String(error),
      },
    ]);
  const controller = new ProjectsController(fixture.port, {
    report,
    recovered: () => (records = []),
  });
  let route = $state<WorkRoute>(
    untrack(() => {
      if (["Task", "DetailsRail"].includes(variant))
        return {
          tab: "tasks",
          home: "alpha",
          project: "project-0",
          task: "task-1",
        };
      if (["Project", "Filters", "Subtask"].includes(variant))
        return { tab: "tasks", home: "alpha", project: "project-0" };
      if (variant === "LinkedRepositories")
        return { tab: "repositories", home: "alpha", project: "project-0" };
      if (variant === "Reviews") return { tab: "reviews" };
      if (variant === "Activity") return { tab: "activity" };
      if (variant === "Repositories") return { tab: "repositories" };
      return { tab: "projects" };
    }),
  );
  function navigate(next: WorkRoute) {
    route = next;
    void controller.open(next);
  }
  onMount(() => {
    void controller.open(route);
  });
  onDestroy(() => {
    void controller.close();
  });
</script>

<ProjectsScreen
  {controller}
  showRail={variant === "DetailsRail"}
  onCopyLink={async (value) => {
    context = `Copied route: ${value.home}:${value.project}:${value.task}`;
  }}
  onNavigate={(next) => (route = next)}
  onError={report}
  onOpenActivity={(row) =>
    (context = `Open commit: ${row.repository}:${row.revision.eventId}`)}
  copyText={async (text) => {
    context = `Copied: ${text}`;
  }}
  onOpenRepository={(home) => (context = `Open code: ${home.id}`)}
  onChat={(value) => (context = JSON.stringify(value))}
>
  {#snippet header()}<RepositoryBreadcrumbs
      items={[
        { id: "projects", label: "Projects", href: "#/projects" },
        ...(route.project
          ? [
              {
                id: route.project,
                label: "Repository toolkit",
                href: "#/projects/project-0",
              },
            ]
          : []),
        ...(route.task
          ? [{ id: "tasks", label: "Tasks", href: "#/projects/tasks" }]
          : []),
        {
          id: "current",
          label: route.task
            ? "Preserve repository context"
            : route.tab[0].toUpperCase() + route.tab.slice(1),
        },
      ]}
      onNavigate={(item) =>
        navigate(
          item.id === "projects"
            ? { tab: "projects" }
            : { tab: "tasks", home: route.home, project: route.project },
        )}
    />{/snippet}
</ProjectsScreen>
<output class="sr-only" aria-label="Host navigation">{context}</output>
<NotificationToasts {records} onDismiss={() => (records = [])} />

<script lang="ts">
  import { untrack } from "svelte";
  import {
    RepositoryPageFrame,
    RepositoryBreadcrumbs,
    RepositoryPicker,
  } from "../../packages/repository-ui/src/jj/navigation/index.js";
  import type { RepositoryNavigationContext } from "../../packages/repository-ui/src/jj/navigation/model.js";
  let {
    context = "repository",
    breadcrumbOnly = false,
    global = false,
    narrow = false,
  }: {
    context?: RepositoryNavigationContext;
    breadcrumbOnly?: boolean;
    global?: boolean;
    narrow?: boolean;
  } = $props();
  let repository = $state("lapis"),
    value = $state(
      untrack(() =>
        context === "stacks"
          ? "workspace"
          : context === "project"
            ? "tasks"
            : context === "projects"
              ? "projects"
              : "files",
      ),
    );
  let navigation = $state("");
  const repositories = [
    { id: "lapis", name: "Lapis", description: "~/code/lapis" },
    { id: "docs", name: "Documentation", description: "~/code/docs" },
  ];
</script>

{#snippet picker()}<RepositoryPicker
    {repositories}
    value={repository}
    controlled
    variant="ghost"
    onChange={(next) => (repository = next)}
  />{/snippet}
{#snippet crumbs()}
  {#if global}<div class="global-picker">{@render picker()}</div>{/if}
  <RepositoryBreadcrumbs
    root={global ? undefined : picker}
    items={global
      ? [
          { id: "projects", label: "Projects", href: "#/projects" },
          { id: "project", label: "Desktop", href: "#/projects/desktop" },
          { id: "tasks", label: "Tasks" },
        ]
      : [
          { id: "stacks", label: "Stacks", href: "#/stacks" },
          { id: "workspace", label: "Workspace" },
        ]}
    onNavigate={(item) => (navigation = item.label)}
  />
{/snippet}
<div
  class="navigation-demo"
  style:width={narrow ? "320px" : "100%"}
  style:height={breadcrumbOnly ? "auto" : "420px"}
>
  {#if breadcrumbOnly}{@render crumbs()}
  {:else}<RepositoryPageFrame
      title="Repository"
      {context}
      {value}
      onSelect={(next) => (value = next)}
      header={crumbs}
      onBack={context === "stacks"
        ? () => (navigation = "Repository")
        : undefined}
    >
      <div class="demo-content">
        <h2>{value}</h2>
        <p>Repository: {repositories.find((r) => r.id === repository)?.name}</p>
        <p role="status">{navigation}</p>
      </div>
    </RepositoryPageFrame>{/if}
</div>

<style>
  .navigation-demo {
    max-width: 100%;
    min-width: 0;
  }
  .demo-content {
    padding: 1rem;
  }
  .global-picker {
    max-width: 12rem;
    margin-inline-end: 1rem;
  }
</style>

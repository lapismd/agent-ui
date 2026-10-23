<!-- Adapted from JJ Store ProjectsFilterControls/Filters, Apache-2.0. -->
<script lang="ts">
  import * as Popover from "@lapismd/design-core/shadcn/popover";
  import * as Field from "@lapismd/design-core/shadcn/field";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { ListFilter, X } from "@lucide/svelte";
  import RepositoryPicker from "../../navigation/repository-picker/RepositoryPicker.svelte";
  import WorkField from "./WorkField.svelte";
  import TaskStateFilter from "./TaskStateFilter.svelte";
  import type {
    ProjectsState,
    WorkProject,
    WorkRoute,
  } from "../logic/types.js";
  let {
    view,
    project,
    navigate,
  }: {
    view: ProjectsState;
    project?: WorkProject;
    navigate(route: WorkRoute): void;
  } = $props();
  const fieldId = $props.id();
  const title = $derived(`Filters for ${view.route.tab}`);
</script>

{#if view.route.tab !== "repositories"}<Popover.Root>
    <Popover.Trigger
      >{#snippet child({ props })}<Button
          {...props}
          variant="ghost"
          size="icon-sm"
          aria-label={title}
          {title}><ListFilter /></Button
        >{/snippet}</Popover.Trigger
    >
    <Popover.Content
      align="end"
      role="dialog"
      aria-label={title}
      style="--ui-popover-width: min(24rem, calc(100vw - 2rem)); max-height: min(80vh, 40rem); overflow-y: auto;"
    >
      <Popover.Header
        style="flex-direction: row; align-items: center; justify-content: space-between;"
      >
        <Popover.Title role="heading" aria-level={2}>{title}</Popover.Title>
        <Popover.Close
          >{#snippet child({ props })}<Button
              {...props}
              variant="ghost"
              size="icon-sm"
              aria-label="Close filters"><X /></Button
            >{/snippet}</Popover.Close
        >
      </Popover.Header>
      <Field.Group class="community-settings__option-group">
        {#if !project && view.route.tab !== "reviews"}<WorkField
            label="Home repository"
            compact
            ><RepositoryPicker
              label="Home repository filter"
              repositories={view.directory}
              value={view.route.home ?? ""}
              controlled
              allowEmpty
              emptyLabel="All accessible homes"
              onChange={(home) =>
                navigate({ ...view.route, home: home || undefined })}
            /></WorkField
          >{/if}
        <WorkField label="Repository filter" compact
          ><RepositoryPicker
            label="Repository filter"
            repositories={view.directory
              .filter(
                (h) =>
                  h.repository &&
                  (!project || h.repository in project.repositories),
              )
              .map((h) => ({
                id: h.repository!,
                name: h.name,
                description: h.description,
              }))}
            value={view.route.repository ?? ""}
            controlled
            allowEmpty
            emptyLabel="All repositories"
            onChange={(repository) =>
              navigate({ ...view.route, repository: repository || undefined })}
          /></WorkField
        >
        {#if view.route.tab === "tasks"}<WorkField label="Task state" compact>
            <TaskStateFilter
              id={`${fieldId}-state`}
              value={view.route.state ?? "active"}
              onChange={(state) => navigate({ ...view.route, state })}
            />
          </WorkField>{/if}
      </Field.Group>
    </Popover.Content>
  </Popover.Root>{/if}

<!-- Adapted from JJ Store StoreWorkRepositories link dialog, Apache-2.0. -->
<script lang="ts">
  import * as Dialog from "@lapismd/design-core/shadcn/dialog";
  import { DialogFrame } from "@lapismd/design-core/forms/dialog";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import RepositoryPicker from "../../navigation/repository-picker/RepositoryPicker.svelte";
  import WorkField from "./WorkField.svelte";
  import type { WorkHome, WorkProject } from "../logic/types.js";
  import type { ProjectsController } from "../logic/controller.js";
  let {
    homes,
    home,
    project,
    controller,
    disabled,
    onClose,
  }: {
    homes: WorkHome[];
    home: WorkHome;
    project: WorkProject;
    controller: ProjectsController;
    disabled: boolean;
    onClose(): void;
  } = $props();
  let target = $state("");
  const id = $props.id();
</script>

<Dialog.Root
  open
  onOpenChange={(open) => {
    if (!open) onClose();
  }}
>
  <DialogFrame
    title="Link repository"
    description="The project keeps its metadata home. Linked code requires separate access."
  >
    <form
      {id}
      onsubmit={async (event) => {
        event.preventDefault();
        if (
          !disabled &&
          target &&
          (await controller.submit(home.id, {
            kind: "link-repository",
            project: project.id,
            version: project.version,
            repository: target,
            active: true,
          }))
        )
          onClose();
      }}
    >
      <WorkField label="Repository"
        ><RepositoryPicker
          repositories={homes
            .filter((h) => h.repository && !project.repositories[h.repository])
            .map((h) => ({
              id: h.repository!,
              name: h.name,
              description: h.description,
              disabled: !h.available,
            }))}
          value={target}
          controlled
          onChange={(id) => (target = id)}
          label="Link code repository"
          {disabled}
          allowEmpty
          emptyLabel="Choose repository"
        /></WorkField
      >
    </form>
    {#snippet footer()}<Button variant="outline" onclick={onClose}>Done</Button
      ><Button type="submit" form={id} disabled={disabled || !target}
        >Link repository</Button
      >{/snippet}
  </DialogFrame>
</Dialog.Root>

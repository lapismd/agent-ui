<!-- Adapted from JJ Store StoreWorkDialog, Apache-2.0. -->
<script lang="ts">
  import { untrack } from "svelte";
  import * as Dialog from "@lapismd/design-core/shadcn/dialog";
  import { DialogFrame } from "@lapismd/design-core/forms/dialog";
  import * as Field from "@lapismd/design-core/shadcn/field";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { Database } from "@lucide/svelte";
  import RepositorySettingsCard from "../../settings/settings-card/RepositorySettingsCard.svelte";
  import { provideSettingsPresentation } from "../../settings/settings-card/settings-presentation.js";
  import RepositoryPicker from "../../navigation/repository-picker/RepositoryPicker.svelte";
  import WorkField from "./WorkField.svelte";
  import WorkEditorForm from "./WorkEditorForm.svelte";
  import type { ProjectsController } from "../logic/controller.js";
  import type { WorkProject, WorkTask, WorkHome } from "../logic/types.js";
  import "./creation-forms.css";
  let {
    controller,
    home,
    project,
    task,
    mode,
    homes,
    initialParent = "",
    disabled = false,
    allowHomeChange = false,
    onHomeChange,
    onClose,
    onError,
  }: {
    controller: ProjectsController;
    home: string;
    project?: WorkProject;
    task?: WorkTask;
    mode: "project" | "task" | "review";
    homes: WorkHome[];
    initialParent?: string;
    disabled?: boolean;
    allowHomeChange?: boolean;
    onHomeChange?(home: string): void;
    onClose(): void;
    onError(error: unknown): void;
  } = $props();
  provideSettingsPresentation({ value: "global" });
  const formId = $props.id();
  const editing = $derived(mode === "project" ? !!project : !!task);
  const title = $derived(`${editing ? "Edit" : "Create"} ${mode}`);
  let submitDisabled = $state(true),
    selectedId = $state(untrack(() => project?.id ?? "")),
    choices = $state<WorkProject[]>([]),
    loading = $state(false),
    cursor = $state<string>(),
    snapshot = $state("");
  const selectedProject = $derived(
    project ?? choices.find((p) => p.id === selectedId),
  );
  $effect(() => {
    const owner = home;
    if (mode !== "task" || project) return;
    const abort = new AbortController();
    choices = [];
    selectedId = "";
    loading = true;
    void controller.port
      .read({ home: owner, tab: "projects", limit: 25 }, abort.signal)
      .then((page) => {
        if (!abort.signal.aborted && page.home === owner) {
          choices = page.projects;
          cursor = page.next;
          snapshot = page.snapshot;
        }
      })
      .catch((error) => {
        if (!abort.signal.aborted) onError(error);
      })
      .finally(() => {
        if (!abort.signal.aborted) loading = false;
      });
    return () => abort.abort();
  });
  async function more() {
    const owner = home,
      next = cursor;
    loading = true;
    try {
      const page = await controller.port.read(
        { home: owner, tab: "projects", limit: 25, cursor: next },
        new AbortController().signal,
      );
      if (owner !== home) return;
      if (
        page.home !== owner ||
        page.snapshot !== snapshot ||
        (page.next && page.next === next)
      )
        throw Error("Project list changed. Reopen the picker.");
      choices = [...choices, ...page.projects];
      cursor = choices.length < 1000 ? page.next : undefined;
    } catch (error) {
      onError(error);
    } finally {
      if (owner === home) loading = false;
    }
  }
</script>

<Dialog.Root
  open
  onOpenChange={(open) => {
    if (!open) onClose();
  }}
>
  <DialogFrame
    size="wide"
    {title}
    description="Save native metadata in the selected home repository."
  >
    {#snippet footer()}<Button variant="outline" onclick={onClose}>Done</Button
      ><Button
        type="submit"
        form={formId}
        disabled={submitDisabled ||
          disabled ||
          (mode === "task" && !selectedProject)}
        >{editing ? `Save ${mode}` : title}</Button
      >{/snippet}
    <div class="store-creation-form store-settings--global">
      {#if allowHomeChange}<RepositorySettingsCard
          id={`${formId}-metadata`}
          title="Metadata home"
          Icon={Database}
        >
          <Field.Group class="store-settings__editable-rows"
            ><WorkField
              label="Home repository"
              description="This repository owns the project metadata and discussion."
              class="store-settings__option-row"
              Icon={Database}
            >
              <RepositoryPicker
                label="Home repository"
                repositories={homes
                  .filter((h) => h.writable)
                  .map((h) => ({ ...h, disabled: !h.available }))}
                value={home}
                controlled
                onChange={(home) => onHomeChange?.(home)}
                {disabled}
              />
            </WorkField></Field.Group
          >
        </RepositorySettingsCard>{/if}
      {#if mode === "task" && !project}<WorkField label="Task project"
          ><RepositoryPicker
            label="Task project"
            repositories={choices.map((p) => ({
              id: p.id,
              name: p.title,
              description: p.body,
            }))}
            value={selectedId}
            controlled
            onChange={(value) => (selectedId = value)}
            disabled={loading || disabled}
            allowEmpty
            emptyLabel="Choose a project"
          /></WorkField
        >{#if cursor}<Button variant="outline" disabled={loading} onclick={more}
            >More projects</Button
          >{/if}{/if}
      {#if mode !== "task" || selectedProject}{#key `${home}:${selectedProject?.id}`}<WorkEditorForm
            {controller}
            {home}
            project={selectedProject}
            {task}
            {mode}
            {homes}
            {initialParent}
            {disabled}
            {formId}
            bind:submitDisabled
            {onClose}
            {onError}
          />{/key}{/if}
    </div>
  </DialogFrame>
</Dialog.Root>

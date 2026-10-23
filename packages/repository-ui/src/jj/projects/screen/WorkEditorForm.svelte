<!-- Adapted from JJ Store StoreWorkDialog/ProjectForm/TaskForm, Apache-2.0. -->
<script lang="ts">
  import { onMount, untrack } from "svelte";
  import { MarkdownComposer } from "@lapismd/design-core/chat";
  import RepositorySettingsCard from "../../settings/settings-card/RepositorySettingsCard.svelte";
  import { provideSettingsPresentation } from "../../settings/settings-card/settings-presentation.js";
  import WorkField from "./WorkField.svelte";
  import { FolderKanban, Tag, FileText } from "@lucide/svelte";
  import "./creation-forms.css";
  import * as Field from "@lapismd/design-core/shadcn/field";
  import { Input } from "@lapismd/design-core/shadcn/input";

  import { Button } from "@lapismd/design-core/shadcn/button";
  import RepositoryPicker from "../../navigation/repository-picker/RepositoryPicker.svelte";
  import type { ProjectsController } from "../logic/controller.js";
  import type {
    WorkProject,
    WorkTask,
    WorkHome,
    WorkCommand,
    WorkTaskState,
  } from "../logic/types.js";
  let {
    controller,
    home,
    project,
    task,
    mode,
    homes,
    onClose,
    onError,
    initialParent = "",
    disabled = false,
    formId,
    submitDisabled = $bindable(true),
  }: {
    controller: ProjectsController;
    home: string;
    project?: WorkProject;
    task?: WorkTask;
    mode: "project" | "task" | "review";
    homes: WorkHome[];
    onClose(): void;
    onError(error: unknown): void;
    initialParent?: string;
    disabled?: boolean;
    formId: string;
    submitDisabled?: boolean;
  } = $props();
  provideSettingsPresentation({ value: "global" });
  const id = $props.id();
  const editing = untrack(() => (mode === "project" ? !!project : !!task));
  const key = untrack(
    () =>
      `${mode}:${mode === "project" ? (project?.id ?? "new") : (task?.id ?? `${project?.id ?? "new"}:${initialParent}`)}`,
  );
  let draft = $state(
    untrack(() => ({
      title: (mode === "project" ? project?.title : task?.title) ?? "",
      body: (mode === "project" ? project?.body : task?.body) ?? "",
      repository: task?.repository ?? "",
      parent: task?.parent ?? initialParent,
      state: task?.state ?? "open",
    })),
  );
  let ready = $state(false),
    saving = $state(false),
    failed = $state(false);
  let persisted = Promise.resolve();
  $effect(() => {
    submitDisabled =
      !ready ||
      saving ||
      failed ||
      disabled ||
      (mode === "review" ? !draft.body.trim() : !draft.title.trim());
  });
  const title = $derived(`${editing ? "Edit" : "Create"} ${mode}`);
  onMount(() => {
    let active = true;
    void controller.port
      .draft(home, key)
      .then((saved) => {
        if (active) {
          if (saved) draft = { ...draft, ...saved };
          ready = true;
        }
      })
      .catch((error) => {
        failed = true;
        onError(error);
      });
    return () => {
      active = false;
    };
  });
  function update(field: string, value: string) {
    draft = { ...draft, [field]: value };
    const snapshot = { ...draft };
    persisted = persisted
      .catch(() => {})
      .then(async () => {
        await controller.port.draft(home, key, snapshot);
        failed = false;
      });
    void persisted.catch((error) => {
      failed = true;
      onError(error);
    });
  }
  async function save(event: SubmitEvent) {
    event.preventDefault();
    if (!ready || saving || failed || disabled) return;
    saving = true;
    try {
      await persisted;
      const freshId = crypto.randomUUID().replaceAll("-", "");
      let command: WorkCommand;
      if (mode === "review")
        command = { kind: "create-review", body: draft.body };
      else if (mode === "project")
        command = project
          ? {
              kind: "edit-project",
              project: project.id,
              version: project.version,
              title: draft.title,
              body: draft.body,
            }
          : {
              kind: "create-project",
              id: freshId,
              title: draft.title,
              body: draft.body,
            };
      else if (project)
        command = task
          ? {
              kind: "edit-task",
              task: task.id,
              project: project.id,
              version: task.version,
              projectVersion: project.version,
              title: draft.title,
              body: draft.body,
              state: draft.state as WorkTaskState,
              repository: draft.repository || null,
              parent: draft.parent || null,
            }
          : {
              kind: "create-task",
              id: freshId,
              project: project.id,
              version: project.version,
              title: draft.title,
              body: draft.body,
              repository: draft.repository || null,
              parent: draft.parent || null,
            };
      else throw Error("Select a project before creating a task");
      if (await controller.submit(home, command)) {
        await controller.port.draft(home, key, {});
        onClose();
      }
    } catch (error) {
      onError(error);
    } finally {
      saving = false;
    }
  }
</script>

<form
  id={formId}
  onsubmit={save}
  aria-label={title}
  class="store-work__form store-creation-form store-settings--global"
>
  <RepositorySettingsCard
    id={`${id}-details`}
    title={`${mode === "project" ? "Project" : mode === "task" ? "Task" : "Review"} details`}
    Icon={FolderKanban}
  >
    <Field.Group class="store-settings__editable-rows">
      {#if mode !== "review"}<WorkField
          class="store-settings__option-row"
          Icon={Tag}
          label={mode === "project" ? "Project title" : "Task title"}
          id={`${id}-title`}
          description={`A short name for this ${mode}.`}
          disabled={!ready || saving || disabled}
        >
          <Input
            id={`${id}-title`}
            value={draft.title}
            oninput={(e) => update("title", e.currentTarget.value)}
            required
            maxlength={512}
            disabled={!ready || saving || disabled}
          />
        </WorkField>{/if}
      <WorkField
        class="store-settings__option-row store-creation-form__description"
        Icon={FileText}
        label={`${mode[0].toUpperCase() + mode.slice(1)} description`}
        compact
        description={`Explain the ${mode} with Markdown.`}
        disabled={!ready || saving || disabled}
      >
        <MarkdownComposer
          value={draft.body}
          onChange={(value) => update("body", value)}
          onSubmit={() => {}}
          showSendButton={false}
          showHint={false}
          submitOnEnter={false}
          label={`${mode} description`}
          inputLabel={`${mode} description`}
          placeholder={`Describe the ${mode}`}
          disabled={!ready || saving || disabled}
        />
      </WorkField>
      {#if mode === "task"}<WorkField label="Code repository"
          ><RepositoryPicker
            label="Code repository"
            repositories={homes
              .filter(
                (h) => h.repository && project?.repositories[h.repository],
              )
              .map((h) => ({
                id: h.repository!,
                name: h.name,
                disabled: !h.available,
              }))}
            value={draft.repository}
            onChange={(v) => update("repository", v)}
            controlled
            allowEmpty
            emptyLabel="Project only"
            disabled={!ready || saving || disabled}
          /></WorkField
        >
        {#if editing}<WorkField label="Status"
            ><RepositoryPicker
              label="Task status"
              repositories={["open", "in_progress", "blocked", "done"].map(
                (id) => ({ id, name: id.replaceAll("_", " ") }),
              )}
              value={draft.state}
              onChange={(v) => update("state", v)}
              controlled
              disabled={!ready || saving || disabled}
            /></WorkField
          >{/if}{/if}
    </Field.Group>
  </RepositorySettingsCard>
  {#if failed}<p role="alert">
      The draft could not be saved. Your text is retained.
    </p>
    <Button
      type="button"
      variant="outline"
      onclick={() => update("body", draft.body)}>Retry saving draft</Button
    >{/if}
</form>

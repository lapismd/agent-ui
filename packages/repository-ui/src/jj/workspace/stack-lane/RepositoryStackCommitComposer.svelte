<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store StoreStackCommitComposer. -->
<script lang="ts">
  // Changeyard StackStartCommitPanel: owned inline draft and staged-file composition.
  import * as Card from "@lapismd/design-core/shadcn/card";
  import * as Field from "@lapismd/design-core/shadcn/field";
  import { Input } from "@lapismd/design-core/shadcn/input";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import RepositoryWorkspaceDropGuide from "./RepositoryWorkspaceDropGuide.svelte";
  import { MarkdownComposer } from "@lapismd/design-core/chat";
  import RepositoryStackStagedFiles from "./RepositoryStackStagedFiles.svelte";
  import type { StackWorkspaceController } from "../../../stacks/controller.svelte.js";
  import type { WorkspaceStack } from "../../../stacks/types.js";
  let {
    controller,
    stack,
    onOtherDrop,
    onCommand,
    disabled = false,
    context,
  }: {
    disabled?: boolean;
    controller: StackWorkspaceController;
    stack: WorkspaceStack;
    context?: string;
    onOtherDrop: (event: DragEvent) => void;
    onCommand(
      command: import("../../../stacks/index.js").WorkspaceCommand,
    ): void;
  } = $props();
  const id = $props.id();
  const workspace = $derived(controller.snapshot!.active);
  const draft = $derived(
    workspace ? controller.commitDrafts.get(workspace, stack.id) : undefined,
  );
  function drop(event: DragEvent) {
    onOtherDrop(event);
  }
  function preview() {
    if (!draft || controller.locked) return;
    onCommand({
      ...(draft.commit
        ? { kind: "edit_commit" as const, commit: draft.commit }
        : { kind: "create_commit" as const, stack: stack.id }),
      message:
        draft.title.trim() +
        (draft.body.trim() ? `\n\n${draft.body.trim()}` : ""),
      ...(draft.selections.length ? { selections: draft.selections } : {}),
    });
  }
</script>

<Card.Root
  class="workspace-stage-card workspace-drop-target"
  data-drop-target-state={controller.drag.state({
    kind: "stage",
    id: stack.id,
  })}
  ondragover={(event) =>
    controller.drag.over(
      event,
      { kind: "stage", id: stack.id },
      controller.snapshot,
      controller.locked,
    )}
  ondragleave={(event) =>
    controller.drag.leave(event, { kind: "stage", id: stack.id })}
  ondrop={drop}
  role="group"
  aria-label={`Commit composer for ${stack.name}${context ? ` in stack ${context}` : ""}`}
>
  <RepositoryWorkspaceDropGuide
    feedback={controller.drag.for({ kind: "stage", id: stack.id })}
  />
  {#if draft}
    <form
      aria-label={`${draft.commit ? "Edit" : "Create"} commit in ${stack.name}${context ? ` in stack ${context}` : ""}`}
      onsubmit={(event) => {
        event.preventDefault();
        preview();
      }}
    >
      <RepositoryStackStagedFiles
        name={stack.name}
        selections={draft.selections}
        onSelect={(selection) =>
          controller.selectFile(
            selection.source,
            selection.path,
            selection.hunks,
          )}
      />
      <Card.Content class="workspace-stage-content workspace-stage-form">
        <Field.Group class="workspace-commit-fields">
          <Field.Field class="workspace-commit-title-row">
            <Field.Label for={`${id}-title`} class="sr-only"
              >Commit title</Field.Label
            >
            <Input
              id={`${id}-title`}
              bind:value={draft.title}
              placeholder="Commit title (required)"
              disabled={controller.locked || disabled}
            />
          </Field.Field>
          <Field.Field class="workspace-commit-description-row">
            <Field.Title class="sr-only">Commit description</Field.Title>
            <MarkdownComposer
              presentation="document"
              label="Commit description"
              inputLabel="Commit description"
              onSubmit={() => preview()}
              showSendButton={false}
              showHint={false}
              bind:value={draft.body}
              placeholder="Commit message"
              disabled={controller.locked || disabled}
            />
          </Field.Field>
        </Field.Group>
        <Card.Footer class="workspace-commit-actions">
          <Button
            type="button"
            variant="outline"
            disabled={controller.locked || disabled}
            onclick={() =>
              workspace && controller.commitDrafts.clear(workspace, stack.id)}
            >Cancel</Button
          >
          <Button
            type="submit"
            disabled={disabled ||
              !controller.can(draft.commit ? "edit_commit" : "create_commit") ||
              !draft.title.trim()}
            >{draft.commit ? "Save commit" : "Create commit"}</Button
          >
        </Card.Footer>
      </Card.Content>
    </form>
  {:else}
    <Card.Content class="workspace-stage-content workspace-stage-drop">
      <Button
        variant="outline"
        class="workspace-drop"
        disabled={disabled || !controller.can("create_commit")}
        aria-label="Stage changes in this stack"
        onclick={() =>
          onCommand({
            kind: "create_commit",
            stack: stack.id,
            message: "",
            ...(controller.selection
              ? { selection: controller.selection }
              : {}),
          })}>Stage changes in this stack</Button
      >
    </Card.Content>
    <Card.Content class="workspace-stage-content workspace-stage-start">
      <Button
        variant="outline"
        disabled={disabled || !controller.can("create_commit")}
        aria-label="Start a commit…"
        onclick={() =>
          onCommand({ kind: "create_commit", stack: stack.id, message: "" })}
        >Start a commit…</Button
      >
    </Card.Content>
  {/if}
</Card.Root>

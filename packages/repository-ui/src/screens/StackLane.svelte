<script lang="ts">
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { Input } from "@lapismd/design-core/shadcn/input";
  import type { StackWorkspaceController } from "../stacks/controller.svelte.js";
  import type { WorkspaceStack, WorkspaceCommand } from "../stacks/types.js";
  import { stackGroups } from "../stacks/presentation.js";
  import { toggleStackSource } from "../stacks/selection-actions.js";
  import { workspaceBranchSource } from "../stacks/files.js";
  import StackDropZone from "./StackDropZone.svelte";
  import StackSourceFiles from "./StackSourceFiles.svelte";
  let {
    controller,
    stack,
    onCommand,
  }: {
    controller: StackWorkspaceController;
    stack: WorkspaceStack;
    onCommand: (command: WorkspaceCommand) => void;
  } = $props();
  const draft = $derived(
    controller.snapshot?.active
      ? controller.commitDrafts.get(controller.snapshot.active, stack.id)
      : undefined,
  );
</script>

<StackDropZone
  {controller}
  target={{ kind: "stack", id: stack.id }}
  label={`Drop changes into ${stack.name}`}
  {onCommand}
>
  {#each stackGroups(stack) as group}<header class="rui-stack-header">
      <StackDropZone
        {controller}
        target={{ kind: "stack", id: stack.id, branch: group.head.name }}
        label={`Move commit to ${group.head.name}`}
        {onCommand}
        ><div class="rui-toolbar">
          <Button
            variant="ghost"
            onclick={() =>
              toggleStackSource(controller, stack.id, {
                branch: group.head.name,
              })}>{group.head.name}</Button
          ><Button
            size="sm"
            variant="ghost"
            disabled={!controller.can("create_commit")}
            onclick={() =>
              controller.commitDrafts.open(controller.snapshot!, stack.id)}
            >New commit</Button
          ><Button
            size="sm"
            variant="ghost"
            disabled={!controller.can("rename_branch")}
            onclick={() =>
              onCommand({
                kind: "rename_branch",
                stack: stack.id,
                branch: group.head.name,
                name: group.head.name,
              })}>Rename branch</Button
          >
        </div></StackDropZone
      >
    </header>
    {#if controller.stackSelections[stack.id] === workspaceBranchSource(stack.id, group.head.name)}<StackSourceFiles
        {controller}
        source={workspaceBranchSource(stack.id, group.head.name)}
        stack={stack.id}
      />{/if}
    {#each group.commits as commit}<article
        class="rui-stack-commit"
        data-selected={controller.stackSelections[stack.id] === commit.id}
      >
        <StackDropZone
          {controller}
          target={{ kind: "commit", id: commit.id }}
          label={`Amend or squash into ${commit.message}`}
          {onCommand}
        >
          <div class="rui-toolbar">
            <button
              class="rui-commit-select"
              draggable={!commit.immutable && !controller.locked}
              ondragstart={(event) =>
                controller.drag.start(event, {
                  kind: "commit",
                  commit: commit.id,
                })}
              ondragend={() => controller.drag.clear()}
              onclick={() =>
                toggleStackSource(controller, stack.id, { commit: commit.id })}
              ><strong>{commit.message}</strong><span class="rui-muted"
                >{commit.author} · {commit.id.slice(0, 8)}{commit.immutable
                  ? " · Immutable"
                  : ""}</span
              ></button
            >
          </div>
          <div class="rui-actions">
            <Button
              size="sm"
              variant="ghost"
              disabled={commit.immutable || !controller.can("reword")}
              onclick={() =>
                onCommand({
                  kind: "reword",
                  commit: commit.id,
                  message: commit.message,
                })}>Reword</Button
            ><Button
              size="sm"
              variant="ghost"
              disabled={commit.immutable || !controller.can("edit_commit")}
              onclick={() =>
                controller.commitDrafts.edit(controller.snapshot!, commit.id)}
              >Edit</Button
            ><Button
              size="sm"
              variant="ghost"
              aria-label={`Move ${commit.message} up`}
              disabled={commit.immutable || !controller.can("reorder_commit")}
              onclick={() =>
                onCommand({
                  kind: "reorder_commit",
                  commit: commit.id,
                  direction: "up",
                })}>↑</Button
            ><Button
              size="sm"
              variant="ghost"
              aria-label={`Move ${commit.message} down`}
              disabled={commit.immutable || !controller.can("reorder_commit")}
              onclick={() =>
                onCommand({
                  kind: "reorder_commit",
                  commit: commit.id,
                  direction: "down",
                })}>↓</Button
            ><Button
              size="sm"
              variant="ghost"
              disabled={commit.immutable || !controller.can("delete_commit")}
              onclick={() =>
                onCommand({ kind: "delete_commit", commit: commit.id })}
              >Delete</Button
            >
          </div>
          {#if controller.stackSelections[stack.id] === commit.id}<StackSourceFiles
              {controller}
              source={commit.id}
              stack={stack.id}
            />{/if}
        </StackDropZone>
      </article>{/each}{/each}
  {#if draft}<section
      class="rui-card"
      aria-label={`Commit draft for ${stack.name}`}
    >
      <h3>{draft.commit ? "Edit commit" : "New commit"}</h3>
      <label class="rui-field"
        >Commit title<Input bind:value={draft.title} /></label
      ><label class="rui-field"
        >Description<textarea rows="3" bind:value={draft.body}
        ></textarea></label
      >
      <ul>
        {#each draft.selections as selection}<li>
            {selection.path}{selection.hunks
              ? ` · ${selection.hunks.length} hunks`
              : " · Whole file"}
          </li>{/each}
      </ul>
      <div class="rui-actions">
        <Button
          variant="outline"
          onclick={() =>
            controller.commitDrafts.clear(
              controller.snapshot!.active!,
              stack.id,
            )}>Cancel draft</Button
        ><Button
          disabled={!draft.title.trim() || controller.locked}
          onclick={() =>
            onCommand(
              draft.commit
                ? {
                    kind: "edit_commit",
                    commit: draft.commit,
                    message: [draft.title, draft.body]
                      .filter(Boolean)
                      .join("\n\n"),
                    selections: draft.selections,
                  }
                : {
                    kind: "create_commit",
                    stack: stack.id,
                    message: [draft.title, draft.body]
                      .filter(Boolean)
                      .join("\n\n"),
                    selections: draft.selections,
                  },
            )}>Preview commit</Button
        >
      </div>
    </section>{/if}
</StackDropZone>

<style>
  .rui-stack-header {
    background: var(--muted);
  }
  .rui-stack-commit {
    border-bottom: 1px solid var(--border);
    padding: 0.4rem;
  }
  .rui-stack-commit[data-selected="true"] {
    background: var(--accent);
    border-left: 3px solid var(--primary);
  }
  .rui-commit-select {
    display: grid;
    gap: 0.3rem;
    text-align: left;
    background: transparent;
    border: 0;
    color: inherit;
    cursor: pointer;
    font: inherit;
    width: 100%;
    padding: 0.5rem;
  }
</style>

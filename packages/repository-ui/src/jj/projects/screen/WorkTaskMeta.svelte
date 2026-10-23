<!-- Copied/adapted from JJ Store StoreWorkTaskDetail metadata, Apache-2.0. -->
<script lang="ts">
  import { Button } from "@lapismd/design-core/shadcn/button";
  import {
    GitBranch,
    FolderGit2,
    ListTodo,
    Pencil,
    ListPlus,
  } from "@lucide/svelte";
  import TaskStateIcon from "./TaskStateIcon.svelte";
  import type { WorkPage, WorkHome } from "../logic/types.js";
  let {
    page,
    home,
    homes,
    disabled,
    edit,
    createTask,
    select,
    onOpenRepository,
  }: {
    page: WorkPage;
    home: WorkHome;
    homes: WorkHome[];
    disabled: boolean;
    edit(): void;
    createTask(): void;
    select(id: string): void;
    onOpenRepository?(home: WorkHome): void;
  } = $props();
  const task = $derived(page.task!);
  const target = $derived(homes.find((h) => h.repository === task.repository));
  const parent = $derived(page.tasks.find((t) => t.id === task.parent));
  const labels = {
    open: "Open",
    in_progress: "In progress",
    blocked: "Blocked",
    done: "Done",
  };
</script>

<dl class="community-projects__task-meta">
  <div>
    <dt><TaskStateIcon state={task.state} />Status</dt>
    <dd>{labels[task.state]}</dd>
  </div>
  <div>
    <dt><GitBranch aria-hidden="true" />Repository</dt>
    <dd>
      {#if target?.available && onOpenRepository}<Button
          variant="secondary"
          size="sm"
          class="community-projects__task-target"
          onclick={() => onOpenRepository?.(target!)}
          ><FolderGit2 data-icon="inline-start" />Open target repository</Button
        ><span>{target.name}</span>
      {:else if task.repository}<span title={task.repository}
          >Separate access required for the target repository.</span
        >{:else}Project only{/if}
    </dd>
  </div>
  {#if task.parent}<div>
      <dt><ListTodo />Parent</dt>
      <dd>
        <Button
          variant="secondary"
          size="sm"
          onclick={() => select(task.parent!)}
          >{#if parent}<TaskStateIcon
              state={parent.state}
            />{/if}{parent?.title ?? task.parent.slice(0, 8)}</Button
        >
      </dd>
    </div>{/if}
  {#if home.writable}<div>
      <dt><ListTodo />Actions</dt>
      <dd class="community-projects__task-assignees">
        <Button variant="secondary" size="sm" {disabled} onclick={edit}
          ><Pencil data-icon="inline-start" />Edit task</Button
        ><Button variant="secondary" size="sm" {disabled} onclick={createTask}
          ><ListPlus data-icon="inline-start" />Add subtask</Button
        >
      </dd>
    </div>{/if}
</dl>

<script lang="ts">
  // CommunityProjects.svelte taskListRow (Apache-2.0), native fields/actions.
  import type { WorkTask } from "../logic/types.js";
  import RepositoryAuthorAvatar from "../../foundations/author-avatar/RepositoryAuthorAvatar.svelte";
  import WorkTime from "./WorkTime.svelte";
  import { workHierarchy } from "./work-hierarchy.js";
  import TaskStateIcon from "./TaskStateIcon.svelte";
  import MessageSquareIcon from "@lucide/svelte/icons/message-square";
  type TaskRow = WorkTask;
  let {
    tasks,
    repositoryName,
    select,
    hierarchy = false,
    layout = "list",
  }: {
    tasks: readonly TaskRow[];
    repositoryName: (id: string) => string;
    select: (task: TaskRow) => void;
    hierarchy?: boolean;
    layout?: "grid" | "list";
  } = $props();
  const rows = $derived(
    hierarchy
      ? workHierarchy(tasks, (t) => t.parent)
      : tasks.map((row) => ({ row, depth: 0 })),
  );
</script>

<div
  class="community-projects__task-list"
  data-layout={layout}
  role="list"
  aria-label="Project tasks"
>
  {#each rows as { row: task } (task.id)}
    {@const parent =
      task.parent_title ??
      tasks.find((t) => t.id === task.parent)?.title ??
      task.parent?.slice(0, 8)}
    <div role="listitem">
      <article class="community-projects__task-row">
        <button
          type="button"
          class="community-projects__task-row-target"
          aria-label={`Open task ${task.title}`}
          onclick={() => select(task)}
        ></button>
        <TaskStateIcon state={task.state} />
        <strong
          title={[
            task.title,
            task.project_title,
            task.parent ? `Subtask of ${parent}` : "",
          ]
            .filter(Boolean)
            .join(" · ")}
          >{task.title}
          <span class="sr-only"
            >{task.project_title ?? ""}{task.parent
              ? ` · Subtask of ${parent}`
              : ""}</span
          >
        </strong>
        <span class="community-projects__task-repository"
          >{task.repository
            ? repositoryName(task.repository)
            : "Project only"}</span
        >
        <span class="community-projects__task-row-assignees"
          ><RepositoryAuthorAvatar
            name={task.actor.name ?? task.actor.created_by}
            avatarUrl={task.actor.avatarUrl}
            size="xs"
          /></span
        >
        <span
          class="community-projects__task-comments"
          aria-label={`${task.comment_count ?? 0} comments`}
          ><MessageSquareIcon aria-hidden="true" />{task.comment_count ??
            0}</span
        >
        <WorkTime timestamp={Number(task.actor.updated_at_millis) / 1000} />
      </article>
    </div>
  {/each}
</div>

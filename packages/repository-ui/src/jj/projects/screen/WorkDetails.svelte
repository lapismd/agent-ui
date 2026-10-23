<!-- Copied/adapted from JJ Store StoreWorkTaskDetail, Apache-2.0. -->
<script lang="ts">
  import { MarkdownContent } from "@lapismd/design-core/chat";
  import * as Collapsible from "@lapismd/design-core/shadcn/collapsible";
  import { ScrollArea } from "@lapismd/design-core/shadcn/scroll-area";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import {
    ArrowLeft,
    ChevronDown,
    ChevronRight,
    RefreshCw,
    MessageSquarePlus,
  } from "@lucide/svelte";
  import WorkDiscussion from "./WorkDiscussion.svelte";
  import WorkTaskMeta from "./WorkTaskMeta.svelte";
  import WorkTime from "./WorkTime.svelte";
  import TaskRows from "./TaskRows.svelte";
  import type { ProjectsController } from "../logic/controller.js";
  import type {
    WorkPage,
    WorkHome,
    WorkRoute,
    WorkContext,
  } from "../logic/types.js";
  import "./task-detail-layout.css";
  let {
    controller,
    page,
    home,
    homes,
    disabled,
    navigate,
    edit,
    createTask,
    onError,
    onOpenRepository,
    onChat,
  }: {
    controller: ProjectsController;
    page: WorkPage;
    home: WorkHome;
    homes: WorkHome[];
    disabled: boolean;
    navigate(route: WorkRoute): void;
    edit(): void;
    createTask(): void;
    onError(error: unknown): void;
    onOpenRepository?(home: WorkHome): void;
    onChat?(context: WorkContext): void;
  } = $props();
  let expanded = $state(true),
    subtasks = $state(false);
  const selected = $derived(page.task ?? page.review);
  const select = (task: string) =>
    navigate({ tab: "tasks", home: home.id, project: page.project?.id, task });
</script>

{#if selected}<article
    class="community-projects__task-detail"
    aria-label={page.task ? "Task details" : "Review details"}
  >
    <header class="community-projects__task-detail-header">
      <Button
        variant="ghost"
        size="icon-sm"
        class="community-projects__detail-back"
        aria-label="Back to list"
        title="Back to list"
        onclick={() =>
          navigate({
            tab: page.task ? "tasks" : "reviews",
            home: home.id,
            project: page.project?.id,
          })}><ArrowLeft /></Button
      >
      <div>
        <h2>
          {selected.title}
          <span title={selected.id}>#{selected.id.slice(0, 8)}</span>
        </h2>
        {#if page.task}<p>
            Task created <WorkTime
              timestamp={page.task.actor.created_at_millis / 1000}
            />
          </p>{/if}
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Refresh projects"
        title="Refresh projects"
        onclick={() => void controller.read(home.id)}><RefreshCw /></Button
      >
      {#if onChat}<Button
          variant="ghost"
          size="icon-sm"
          aria-label="Chat about this view"
          title="New agent session"
          onclick={() =>
            onChat?.({
              home: home.id,
              repository: page.task?.repository ?? home.repository,
              project: page.project?.id,
              task: page.task?.id,
              review: page.review?.id,
            })}><MessageSquarePlus /></Button
        >{/if}
    </header>
    {#key selected.id}<WorkDiscussion
        {controller}
        home={home.id}
        task={page.task}
        review={page.review}
        comments={page.comments}
        writable={home.writable}
        principal={home.principal}
        {disabled}
        {onError}
      >
        {#snippet children(activity, composer)}
          <ScrollArea
            class="community-projects__task-scroll"
            type="hover"
            role="region"
            aria-label="Task content"
          >
            <div class="community-projects__task-body">
              {#if page.task}<WorkTaskMeta
                  {page}
                  {home}
                  {homes}
                  {disabled}
                  {edit}
                  {createTask}
                  {select}
                  {onOpenRepository}
                />{/if}
              {#if page.review && home.writable}<Button
                  variant="outline"
                  {disabled}
                  onclick={() =>
                    void controller.submit(home.id, {
                      kind: "review-state",
                      review: page.review!.id,
                      version: page.review!.version,
                      resolved: page.review!.status !== "resolved",
                    })}
                  >{page.review.status === "resolved"
                    ? "Reopen review"
                    : "Resolve review"}</Button
                >{/if}
              {#if selected.body}<Collapsible.Root
                  bind:open={expanded}
                  class="community-projects__task-description"
                >
                  <Collapsible.Trigger
                    class="community-projects__task-section-trigger"
                    ><span>Description</span>{#if expanded}<ChevronDown
                        class="community-projects__task-section-chevron"
                      />{:else}<ChevronRight
                        class="community-projects__task-section-chevron"
                      />{/if}</Collapsible.Trigger
                  >
                  <Collapsible.Content
                    class="community-projects__task-description-content"
                    ><MarkdownContent
                      content={selected.body}
                      fullWidth
                    /></Collapsible.Content
                  >
                </Collapsible.Root>{/if}
              {#if page.task}<Collapsible.Root
                  bind:open={subtasks}
                  class="community-projects__task-subtasks"
                >
                  <Collapsible.Trigger
                    class="community-projects__task-section-trigger"
                    ><span>Subtasks</span>{#if subtasks}<ChevronDown
                        class="community-projects__task-section-chevron"
                      />{:else}<ChevronRight
                        class="community-projects__task-section-chevron"
                      />{/if}</Collapsible.Trigger
                  >
                  <Collapsible.Content
                    ><TaskRows
                      tasks={page.tasks.filter(
                        (t) => t.parent === page.task!.id,
                      )}
                      repositoryName={(id) =>
                        homes.find((h) => h.repository === id)?.name ?? id}
                      select={(task) => select(task.id)}
                    />{#if !page.tasks.some((t) => t.parent === page.task!.id)}<p
                        class="community-projects__task-empty-activity"
                      >
                        No subtasks yet
                      </p>{/if}</Collapsible.Content
                  >
                </Collapsible.Root>{/if}
              {@render activity()}
            </div>
          </ScrollArea>
          <footer
            class="community-projects__task-footer"
            aria-label="Task comment composer"
          >
            {@render composer()}
          </footer>
        {/snippet}
      </WorkDiscussion>{/key}
  </article>{/if}

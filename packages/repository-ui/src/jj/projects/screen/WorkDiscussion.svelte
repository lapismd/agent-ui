<!-- Adapted from JJ Store Work comments/review discussion, Apache-2.0. -->
<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import {
    MarkdownContent,
    MarkdownComposer,
    Message,
    MessageActions,
  } from "@lapismd/design-core/chat";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import * as Collapsible from "@lapismd/design-core/shadcn/collapsible";
  import { ChevronDown, ChevronRight, Reply, Pencil } from "@lucide/svelte";
  import RepositoryAuthorAvatar from "../../foundations/author-avatar/RepositoryAuthorAvatar.svelte";
  import WorkTime from "./WorkTime.svelte";
  import type { ProjectsController } from "../logic/controller.js";
  import type {
    WorkComment,
    WorkTask,
    WorkReview,
    WorkCommand,
  } from "../logic/types.js";
  let {
    controller,
    home,
    task,
    review,
    comments,
    writable,
    disabled = false,
    onError,
    principal,
    children,
    beforeDiscussion,
  }: {
    controller: ProjectsController;
    home: string;
    task?: WorkTask;
    review?: WorkReview;
    comments: WorkComment[];
    writable: boolean;
    disabled?: boolean;
    onError(error: unknown): void;
    principal?: string;
    children: Snippet<[Snippet, Snippet, boolean]>;
    beforeDiscussion?: Snippet;
  } = $props();
  let body = $state(""),
    reply = $state<string | null>(null),
    edit = $state<WorkComment>(),
    ready = $state(false),
    saving = $state(false),
    expanded = $state(true),
    failed = $state(false);
  const id = $props.id(),
    key = $derived(`comment:${task?.id ?? review?.id}`);
  const label = $derived(review ? "Review" : "Task");
  const sectionClass = $derived(
    review
      ? "community-projects__review-section"
      : "community-projects__task-activity",
  );
  const showComposer = $derived(
    writable &&
      (!review || review.status === "open" || !!body || !!reply || !!edit),
  );
  let persisted = Promise.resolve();
  onMount(() => {
    let active = true;
    void controller.port
      .draft(home, key)
      .then((saved) => {
        if (active) {
          body = saved?.body ?? "";
          reply = saved?.reply || null;
          edit = comments.find(
            (c) => c.id === saved?.edit && c.actor.created_by === principal,
          );
          ready = true;
        }
      })
      .catch(onError);
    return () => {
      active = false;
    };
  });
  function update(value: string) {
    body = value;
    const snapshot = { body, reply: reply ?? "", edit: edit?.id ?? "" };
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
  async function send() {
    if (!ready || saving || disabled || failed || !body.trim()) return;
    saving = true;
    try {
      await persisted;
      const command: WorkCommand = edit
        ? { kind: "edit-comment", id: edit.id, version: edit.version, body }
        : task
          ? {
              kind: "comment",
              task: task.id,
              version: task.version,
              id: crypto.randomUUID().replaceAll("-", ""),
              body,
              replyTo: reply,
            }
          : {
              kind: "review-reply",
              review: review!.id,
              version: review!.version,
              body,
              parent: reply,
            };
      if (await controller.submit(home, command)) {
        body = "";
        reply = null;
        edit = undefined;
        await controller.port.draft(home, key, {});
      }
    } catch (error) {
      onError(error);
    } finally {
      saving = false;
    }
  }
</script>

{#snippet replyIcon()}<Reply />{/snippet}
{#snippet editIcon()}<Pencil />{/snippet}
{#snippet activity()}
  <section aria-label={`${label} activity`}>
    <Collapsible.Root bind:open={expanded} class={sectionClass}>
      <Collapsible.Trigger
        class={review
          ? "community-projects__review-section-trigger"
          : "community-projects__task-section-trigger"}
        ><span>Activity</span>{#if expanded}<ChevronDown
            class="community-projects__task-section-chevron"
          />{:else}<ChevronRight
            class="community-projects__task-section-chevron"
          />{/if}</Collapsible.Trigger
      >
      <Collapsible.Content
        >{@render beforeDiscussion?.()}
        <div
          class={review
            ? "work-review-comments"
            : "community-projects__task-timeline"}
          role="list"
          aria-label={`${label} comments`}
        >
          {#each review?.comments ?? comments as comment (comment.id)}
            {@const actor = "actor" in comment ? comment.actor : undefined}
            <div
              class:work-review-comment={!!review}
              role="listitem"
              aria-label={`Comment ${comment.id.slice(0, 8)}`}
            >
              <MessageActions
                label={`Actions for ${actor?.name ?? "comment"}`}
                actions={[
                  {
                    id: "reply",
                    label: "Reply",
                    icon: replyIcon,
                    primary: true,
                    hidden: !writable,
                    disabled: disabled || saving,
                    onSelect: () => {
                      reply = comment.id;
                      edit = undefined;
                      update(body);
                    },
                  },
                  {
                    id: "edit",
                    label: "Edit",
                    icon: editIcon,
                    hidden:
                      !task ||
                      !writable ||
                      !principal ||
                      actor?.created_by !== principal,
                    disabled: disabled || saving,
                    onSelect: () => {
                      edit = comment as WorkComment;
                      reply = null;
                      update(comment.body ?? "");
                    },
                  },
                ]}
              >
                <Message
                  sender="assistant"
                  density={review ? "balanced" : "compact"}
                  aria-label={`Message from ${actor?.name ?? actor?.created_by ?? "Unknown author"}`}
                >
                  {#snippet avatar()}<RepositoryAuthorAvatar
                      name={actor?.name ??
                        actor?.created_by ??
                        "Unknown author"}
                      avatarUrl={actor?.avatarUrl}
                      size="sm"
                    />{/snippet}
                  {#snippet name()}{actor?.name ??
                      actor?.created_by ??
                      "Unknown author"}{/snippet}
                  {#if "reply_to" in comment ? comment.reply_to : comment.parent}<small
                      >Reply</small
                    >{/if}
                  <MarkdownContent
                    content={comment.body ?? "Comment removed"}
                    fullWidth
                  />
                  {#snippet metadata()}{#if actor}<WorkTime
                        timestamp={actor.updated_at_millis / 1000}
                      />{/if}{/snippet}
                </Message>
              </MessageActions>
            </div>
          {/each}
          {#if !(review?.comments ?? comments).length}<p
              class="community-projects__task-empty-activity"
            >
              No comments yet. Add a comment to this {label.toLowerCase()}.
            </p>{/if}
        </div></Collapsible.Content
      >
    </Collapsible.Root>
  </section>
{/snippet}
{#snippet composer()}
  {#if showComposer}<MarkdownComposer
      class="community-projects__task-composer"
      value={body}
      onChange={update}
      onSubmit={() => void send()}
      showHint={false}
      submitOnEnter={false}
      label="Comment"
      inputLabel="Add comment"
      placeholder="Add a comment…"
      submitLabel={edit ? "Save comment" : "Send comment"}
      disabled={!ready || saving || disabled}
      busy={saving}
      reply={reply || edit
        ? {
            authorName: edit ? "Editing comment" : "Reply",
            content:
              (
                edit ??
                (review?.comments ?? comments).find((c) => c.id === reply)
              )?.body ?? "Earlier comment",
          }
        : undefined}
      onCancelReply={() => {
        reply = null;
        edit = undefined;
        update("");
      }}
    />{/if}
  {#if failed}<p role="alert">
      Comment draft could not be saved. Your text is retained.
    </p>
    <Button variant="outline" onclick={() => update(body)}
      >Retry saving draft</Button
    >{/if}
{/snippet}
{@render children(activity, composer, showComposer)}

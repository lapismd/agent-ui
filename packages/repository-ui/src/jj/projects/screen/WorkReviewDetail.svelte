<!-- Copied/adapted from JJ Store StoreReviewDetail, Apache-2.0. -->
<script lang="ts">
  import { MarkdownContent } from "@lapismd/design-core/chat";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { ScrollArea } from "@lapismd/design-core/shadcn/scroll-area";
  import { Skeleton } from "@lapismd/design-core/shadcn/skeleton";
  import * as Collapsible from "@lapismd/design-core/shadcn/collapsible";
  import {
    ChevronDown,
    ChevronRight,
    RefreshCw,
    MessageSquarePlus,
  } from "@lucide/svelte";
  import type { ProjectsController } from "../logic/controller.js";
  import type {
    WorkPage,
    WorkHome,
    WorkRoute,
    WorkContext,
    WorkActivity,
  } from "../logic/types.js";
  import WorkReviewMeta from "./WorkReviewMeta.svelte";
  import WorkReviewFiles from "./WorkReviewFiles.svelte";
  import WorkReviewCommits from "./WorkReviewCommits.svelte";
  import ProjectActivity from "./ProjectActivity.svelte";
  import WorkDiscussion from "./WorkDiscussion.svelte";
  import WorkEmpty from "./WorkEmpty.svelte";
  import WorkDetailHeader from "./WorkDetailHeader.svelte";
  import WorkTime from "./WorkTime.svelte";
  import "./community-native-review.css";
  let {
    controller,
    page,
    home,
    disabled,
    navigate,
    onError,
    onChat,
    onOpenActivity,
    copyText,
    repositoryName,
  }: {
    controller: ProjectsController;
    page: WorkPage;
    home: WorkHome;
    disabled: boolean;
    navigate(route: WorkRoute): void;
    onError(error: unknown): void;
    onChat?(context: WorkContext): void;
    onOpenActivity?(row: WorkActivity): void;
    copyText?(text: string): Promise<void>;
    repositoryName(id: string): string;
  } = $props();
  const review = $derived(page.review!);
  const context = $derived(review.context);
  let description = $state(true),
    files = $state(false),
    commits = $state(false);
  function setResolved() {
    void controller
      .submit(home.id, {
        kind: "review-state",
        review: review.id,
        version: review.version,
        resolved: review.status === "open",
      })
      .catch(onError);
  }
</script>

{#snippet chevron(open: boolean)}
  {#if open}<ChevronDown aria-hidden="true" />{:else}<ChevronRight
      aria-hidden="true"
    />{/if}
{/snippet}
{#snippet unavailable()}
  {#if context?.state === "loading"}<div
      role="status"
      class="community-projects__review-section-content"
    >
      Loading review context<Skeleton class="h-12" />
    </div>
  {:else}<WorkEmpty
      title="Review context unavailable"
      description={context?.state === "unavailable"
        ? (context.message ?? "The recorded code comparison could not be read.")
        : "No recorded code context was supplied for this review."}
      retry={() => void controller.read(home.id)}
    />{/if}
{/snippet}
{#snippet recordedActivity()}
  {#if context?.state === "ready" && context.commits.length}<ProjectActivity
      rows={context.commits}
      {repositoryName}
      onOpen={onOpenActivity}
      {copyText}
    />{/if}
{/snippet}
<article class="community-projects__review-detail" aria-label="Review details">
  <WorkDetailHeader
    label="Review detail header"
    title={review.title}
    identifier={review.id}
    backLabel="Back to reviews"
    onBack={() =>
      navigate({ tab: "reviews", home: home.id, project: page.project?.id })}
  >
    {#snippet subtitle()}
      {#if review.actor}Review opened <WorkTime
          timestamp={review.actor.created_at_millis / 1000}
        />{/if}
    {/snippet}
    {#snippet actions()}
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Refresh review"
        title="Refresh review"
        onclick={() => void controller.read(home.id)}><RefreshCw /></Button
      >
      {#if onChat}<Button
          variant="ghost"
          size="icon-sm"
          aria-label="Chat about this review"
          title="Chat about this review"
          onclick={() =>
            onChat?.({
              home: home.id,
              repository:
                context?.state === "ready"
                  ? context.repository
                  : home.repository,
              project: page.project?.id,
              review: review.id,
            })}><MessageSquarePlus /></Button
        >{/if}
    {/snippet}
  </WorkDetailHeader>
  <WorkDiscussion
    {controller}
    home={home.id}
    {review}
    comments={[]}
    writable={home.writable}
    principal={home.principal}
    {disabled}
    {onError}
    beforeDiscussion={recordedActivity}
  >
    {#snippet children(activity, composer, showComposer)}
      <ScrollArea
        class="community-projects__review-scroll"
        type="hover"
        role="region"
        aria-label="Review content"
      >
        <div class="community-projects__review-body">
          <WorkReviewMeta
            {review}
            writable={home.writable}
            {disabled}
            {setResolved}
            {copyText}
          />
          <Collapsible.Root
            class="community-projects__review-section"
            bind:open={description}
          >
            <Collapsible.Trigger
              class="community-projects__review-section-trigger"
              ><span>Description</span>{@render chevron(
                description,
              )}</Collapsible.Trigger
            >
            <Collapsible.Content
              class="community-projects__review-section-content"
            >
              {#if review.body}<MarkdownContent
                  content={review.body}
                  fullWidth
                />{:else}<p class="community-projects__muted">
                  The original description is unavailable.
                </p>{/if}
            </Collapsible.Content>
          </Collapsible.Root>
          <Collapsible.Root
            class="community-projects__review-section community-projects__review-section--files"
            bind:open={files}
          >
            <Collapsible.Trigger
              class="community-projects__review-section-trigger community-projects__review-section-trigger--files"
              ><span>Files changed</span>{@render chevron(
                files,
              )}{#if files && context?.state === "ready"}<span
                  class="community-projects__review-section-count"
                  >{context.files.length}</span
                >{/if}</Collapsible.Trigger
            >
            <Collapsible.Content
              class="community-projects__review-files-content"
              role="region"
              aria-label="Review file comparison"
            >
              {#if context?.state === "ready"}<WorkReviewFiles
                  {context}
                />{#if context.bounded}<p class="community-projects__muted">
                    Showing the loaded portion of this recorded comparison.
                  </p>{/if}{:else}{@render unavailable()}{/if}
            </Collapsible.Content>
          </Collapsible.Root>
          <Collapsible.Root
            class="community-projects__review-section"
            bind:open={commits}
          >
            <Collapsible.Trigger
              class="community-projects__review-section-trigger"
              ><span>Commits</span>{@render chevron(
                commits,
              )}</Collapsible.Trigger
            >
            <Collapsible.Content
              >{#if context?.state === "ready"}<WorkReviewCommits
                  commits={context.commits}
                  onOpen={onOpenActivity}
                />{:else}{@render unavailable()}{/if}</Collapsible.Content
            >
          </Collapsible.Root>
          {@render activity()}
        </div>
      </ScrollArea>
      {#if showComposer}<footer
          class="community-projects__review-footer"
          aria-label="Review comment composer"
        >
          {@render composer()}
        </footer>{/if}
    {/snippet}
  </WorkDiscussion>
</article>

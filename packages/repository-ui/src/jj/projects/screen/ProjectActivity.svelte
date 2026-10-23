<!-- Copied/adapted from JJ Store StoreRepositoryActivity timeline, Apache-2.0. -->
<script lang="ts">
  import { MarkdownContent } from "@lapismd/design-core/chat";
  import { GitCommitHorizontal } from "@lucide/svelte";
  import RepositoryAuthorAvatar from "../../foundations/author-avatar/RepositoryAuthorAvatar.svelte";
  import RepositoryIdentifiers from "../../foundations/identifiers/RepositoryIdentifiers.svelte";
  import WorkTime from "./WorkTime.svelte";
  import WorkEmpty from "./WorkEmpty.svelte";
  import type { WorkActivity } from "../logic/types.js";
  import "./community-native-activity.css";
  let {
    rows,
    repositoryName,
    onOpen,
    copyText,
  }: {
    rows: WorkActivity[];
    repositoryName(id: string): string;
    onOpen?(row: WorkActivity): void;
    copyText?(text: string): Promise<void>;
  } = $props();
</script>

{#if rows.length}<div
    class="community-projects__activity"
    role="list"
    aria-label="Repository activity"
  >
    {#each rows as row, index (JSON.stringify( [row.repository, row.operation, row.revision.eventId] ))}{@const revision =
        row.revision}
      <div
        class="community-projects__activity-item community-projects__activity-item--commit"
        role="listitem"
      >
        <span
          class="community-projects-git-author-avatar"
          style="--ui-repository-author-avatar-size: 2rem"
          ><RepositoryAuthorAvatar
            name={revision.author}
            email={revision.authorEmail}
            size="sm"
          /></span
        >
        <span
          class="community-projects__activity-line"
          data-last={index === rows.length - 1}
          aria-hidden="true"
        ></span>
        <div class="community-projects__activity-copy">
          <div class="community-projects__activity-meta">
            <div class="community-projects__activity-byline">
              <div>
                <strong>{revision.author}</strong><span>committed in</span><span
                  >{repositoryName(row.repository)}</span
                >
              </div>
              <WorkTime timestamp={revision.createdAt} />
            </div>
            {#if copyText}<span class="community-revision-graph-ids"
                ><RepositoryIdentifiers
                  commitId={revision.eventId}
                  changeId={revision.changeId}
                  placement="inline"
                  {copyText}
                /></span
              >{/if}
          </div>
          <button
            type="button"
            class="community-projects__activity-card"
            aria-label={`Open commit ${revision.message.split("\n")[0]}`}
            disabled={!onOpen}
            onclick={() => onOpen?.(row)}
          >
            <span
              class="community-projects__activity-title"
              data-activity-kind="commit"
              ><GitCommitHorizontal /><strong
                >{revision.message.split("\n")[0]}</strong
              ></span
            >
          </button>
          {#if revision.message.includes("\n")}<div
              class="community-projects__activity-body"
            >
              <MarkdownContent
                content={revision.message.slice(
                  revision.message.indexOf("\n") + 1,
                )}
                compact
                fullWidth
              />
            </div>{/if}
        </div>
      </div>
    {/each}
  </div>{:else}<WorkEmpty
    title="No repository activity yet"
    description="Commits from accessible linked repositories will appear here."
  />{/if}

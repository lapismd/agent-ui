<!-- SPDX-License-Identifier: Apache-2.0; composes the existing repository author, ID and time primitives. -->
<script lang="ts">
  import { RelativeTime } from "@lapismd/design-core/shadcn/relative-time";
  import RepositoryAuthorAvatar from "../../foundations/author-avatar/RepositoryAuthorAvatar.svelte";
  import RepositoryIdentifiers from "../../foundations/identifiers/RepositoryIdentifiers.svelte";
  import type { RepositoryBrowserCommit } from "../logic/types.js";
  let {
    commit,
    now,
    copyText,
  }: {
    commit: RepositoryBrowserCommit;
    now: number;
    copyText(value: string): Promise<void>;
  } = $props();
</script>

<span class="repository-change-card" role="group" aria-label="Recorded change">
  <RepositoryAuthorAvatar
    name={commit.author}
    email={commit.authorEmail}
    size="sm"
  />
  <span class="repository-change-card__content">
    <span class="repository-change-card__description"
      >{commit.message || "(no description)"}</span
    >
    <span class="repository-change-card__metadata">
      <span>{commit.author.trim() || "Unknown author"}</span>
      <span
        role="presentation"
        onclick={(event) => event.stopPropagation()}
        onkeydown={(event) => {
          if (event.key === "Enter" || event.key === " ")
            event.stopPropagation();
        }}
        ><RelativeTime
          timestamp={commit.createdAt * 1000}
          now={now * 1000}
        /></span
      >
    </span>
    <RepositoryIdentifiers
      commitId={commit.eventId}
      changeId={commit.changeId}
      placement="inline"
      {copyText}
    />
  </span>
</span>

<style>
  .repository-change-card {
    display: inline-flex;
    align-items: flex-start;
    gap: var(--ui-repository-change-card-gap, 0.5rem);
    width: 100%;
    min-width: 0;
    text-align: start;
  }
  .repository-change-card__content {
    display: flex;
    flex: 1;
    min-width: 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3rem;
  }
  .repository-change-card__description {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--ui-repository-change-card-description-lines, 2);
    line-clamp: var(--ui-repository-change-card-description-lines, 2);
    overflow: hidden;
    overflow-wrap: anywhere;
    color: var(--foreground);
    font-size: var(--ui-repository-change-card-font-size, 0.75rem);
    font-weight: 550;
    white-space: normal;
  }
  .repository-change-card__metadata {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    color: var(--muted-foreground);
    font-size: var(--ui-repository-change-card-font-size, 0.75rem);
  }
</style>

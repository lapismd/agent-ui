<!-- SPDX-License-Identifier: Apache-2.0; copied/adapted from JJ Store. -->
<script lang="ts">
  import GitCommitIcon from "@lucide/svelte/icons/git-commit-horizontal";
  import { Badge } from "@lapismd/design-core/shadcn/badge";
  import RepositoryAuthorAvatar from "../../foundations/author-avatar/RepositoryAuthorAvatar.svelte";
  import { RelativeTime } from "@lapismd/design-core/shadcn/relative-time";
  import type { RepositoryWorkingCopy } from "../logic/types.js";
  let {
    copy,
    selectedCommit,
    selectedWorkspace,
    now,
    onSelect,
  }: {
    copy: RepositoryWorkingCopy;
    selectedCommit: string | null;
    selectedWorkspace: string | null;
    now?: number;
    onSelect: (commit: string, workspace?: string) => void;
  } = $props();
</script>

<div
  class="repository-working-copy-card"
  data-current={(selectedWorkspace
    ? selectedWorkspace === copy.workspace
    : copy.commitId === selectedCommit) || undefined}
>
  <button
    type="button"
    class="repository-working-copy-card__select"
    onclick={() => onSelect(copy.commitId, copy.workspace)}
  >
    <span class="repository-bookmark-card__heading">
      <GitCommitIcon aria-hidden="true" />
      <strong>Working copy</strong>
      <Badge variant="secondary">{copy.workspace}</Badge>
    </span>
    <span class="repository-working-copy-card__description">{copy.message}</span
    >
  </button>
  <span class="repository-bookmark-card__footer">
    <RepositoryAuthorAvatar
      name={copy.author}
      email={copy.authorEmail}
      size="xs"
    />
    <span>workspace</span><span class="repository-bookmark-card__author"
      ><span class="repository-bookmark-card__time"
        ><RelativeTime
          timestamp={copy.createdAt * 1000}
          now={now === undefined ? undefined : now * 1000}
        />{" by "}</span
      >{copy.author}</span
    >
  </span>
</div>

<style>
  .repository-working-copy-card {
    position: relative;
    container: repository-branch-row / inline-size;
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.9rem;
    border: 0;
    border-bottom: 1px solid var(--border);
    border-radius: 0;
    color: var(--foreground);
    background: var(--ui-repository-branch-background, var(--background));
    font: inherit;
    text-align: start;
    cursor: pointer;
  }
  .repository-working-copy-card__description {
    color: var(--muted-foreground);
    font-size: var(--ui-repository-branch-body-font-size, 0.875rem);
  }
  .repository-working-copy-card .repository-bookmark-card__heading > strong {
    font-size: var(--ui-repository-branch-body-font-size, 0.875rem);
    font-weight: 650;
  }
  .repository-bookmark-card__heading {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
  }
  .repository-bookmark-card__heading :global(svg) {
    width: 1rem;
    height: 1rem;
    flex: none;
    color: var(--muted-foreground);
  }
  .repository-bookmark-card__footer {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 0.4rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--border);
    color: var(--muted-foreground);
    font-size: var(--ui-repository-branch-secondary-font-size, 0.75rem);
  }
  .repository-bookmark-card__author {
    margin-inline-start: auto;
  }
  .repository-working-copy-card__select {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
    padding: 0;
    border: 0;
    color: inherit;
    background: transparent;
    font: inherit;
    text-align: start;
    cursor: pointer;
  }
</style>

<!-- SPDX-License-Identifier: Apache-2.0; grouped file-history timeline from the supplied review reference. -->
<script lang="ts">
  import type { LocalGraphCommit } from "@lapismd/jj-history";
  import GitCommitIcon from "@lucide/svelte/icons/git-commit-horizontal";
  import RepositoryFileHistoryEntry from "./RepositoryFileHistoryEntry.svelte";
  let {
    commits,
    copyText,
    onOpen,
    onBrowse,
  }: {
    commits: LocalGraphCommit[];
    copyText(value: string): Promise<void>;
    onOpen(revision: string): void;
    onBrowse?: (revision: string) => void;
  } = $props();
  const groups = $derived.by(() => {
    const values: {
      day: string;
      label: string;
      commits: LocalGraphCommit[];
    }[] = [];
    for (const commit of commits) {
      const date = new Date(Number(commit.committer.timestamp.millis));
      const day = date.toISOString().slice(0, 10);
      let group = values.at(-1);
      if (group?.day !== day) {
        group = {
          day,
          label: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            timeZone: "UTC",
          }),
          commits: [],
        };
        values.push(group);
      }
      group!.commits.push(commit);
    }
    return values;
  });
</script>

<ol class="file-history-timeline" aria-label="File revision history">
  {#each groups as group (group.commits[0].id)}<li>
      <h3><GitCommitIcon aria-hidden="true" />Commits on {group.label}</h3>
      <div class="file-history-timeline__entries">
        {#each group.commits as commit (commit.id)}<RepositoryFileHistoryEntry
            {commit}
            {copyText}
            {onOpen}
            {onBrowse}
          />{/each}
      </div>
    </li>{/each}
</ol>

<style>
  .file-history-timeline {
    list-style: none;
    margin: 0;
    padding: var(--ui-repository-file-history-timeline-padding, 0.75rem);
  }
  li {
    position: relative;
    padding-left: 1.75rem;
    padding-bottom: 1rem;
  }
  li::before {
    content: "";
    position: absolute;
    left: 0.45rem;
    top: 1.75rem;
    bottom: 0;
    border-left: 2px solid var(--border);
  }
  h3 {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0 0 0.75rem -1.75rem;
    font-size: inherit;
    font-weight: 500;
    color: var(--muted-foreground);
  }
  h3 :global(svg) {
    width: 1rem;
    height: 1rem;
    flex: none;
  }
  .file-history-timeline__entries {
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
  }
</style>

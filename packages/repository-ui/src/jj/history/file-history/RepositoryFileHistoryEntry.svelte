<!-- SPDX-License-Identifier: Apache-2.0; shared repository primitives composed to the supplied file-history reference. -->
<script lang="ts">
  import type { LocalGraphCommit } from "@lapismd/jj-history";
  import FileCodeIcon from "@lucide/svelte/icons/file-code";
  import CodeIcon from "@lucide/svelte/icons/code";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import * as Tooltip from "@lapismd/design-core/shadcn/tooltip";
  import RepositoryAuthorAvatar from "../../foundations/author-avatar/RepositoryAuthorAvatar.svelte";
  import RepositoryIdentifiers from "../../foundations/identifiers/RepositoryIdentifiers.svelte";
  import RepositoryCommitDetails from "../commit-message/RepositoryCommitDetails.svelte";
  let {
    commit,
    copyText,
    onOpen,
    onBrowse,
  }: {
    commit: LocalGraphCommit;
    copyText(value: string): Promise<void>;
    onOpen(revision: string): void;
    onBrowse?: (revision: string) => void;
  } = $props();
  const subject = $derived(
    commit.description.split("\n")[0] || "No description",
  );
  const hasBody = $derived(
    !!commit.description.split("\n").slice(1).join("\n").trim(),
  );
  const date = $derived(
    new Date(Number(commit.committer.timestamp.millis)).toLocaleDateString(
      "en-GB",
      { month: "short", day: "numeric", timeZone: "UTC" },
    ),
  );
</script>

<article class="file-history-entry" aria-label={subject}>
  <div class="file-history-entry__content">
    <RepositoryCommitDetails description={commit.description}>
      {#snippet children(toggle, panel)}
        <div class="file-history-entry__subject">
          <strong>{subject}</strong>{#if hasBody}{@render toggle()}{/if}
        </div>
        {@render panel()}
      {/snippet}
    </RepositoryCommitDetails>
    <div class="file-history-entry__author">
      <RepositoryAuthorAvatar
        name={commit.author.name}
        email={commit.author.email}
        size="xs"
      />
      <span
        >{commit.author.name.trim() || "Unknown author"} committed on {date}</span
      >
    </div>
  </div>
  <div class="file-history-entry__actions">
    <RepositoryIdentifiers
      commitId={commit.id}
      changeId={commit.change_id}
      placement="inline"
      {copyText}
    />
    <Tooltip.Provider>
      <Tooltip.Root
        ><Tooltip.Trigger
          >{#snippet child({ props })}<Button
              {...props}
              variant="ghost"
              size="icon-sm"
              aria-label="View code at this point"
              onclick={() => onOpen(commit.id)}><FileCodeIcon /></Button
            >{/snippet}</Tooltip.Trigger
        ><Tooltip.Content>View code at this point</Tooltip.Content
        ></Tooltip.Root
      >
      {#if onBrowse}<Tooltip.Root
          ><Tooltip.Trigger
            >{#snippet child({ props })}<Button
                {...props}
                variant="ghost"
                size="icon-sm"
                aria-label="Browse repository at this point"
                onclick={() => onBrowse?.(commit.id)}><CodeIcon /></Button
              >{/snippet}</Tooltip.Trigger
          ><Tooltip.Content>Browse repository at this point</Tooltip.Content
          ></Tooltip.Root
        >{/if}
    </Tooltip.Provider>
  </div>
</article>

<style>
  .file-history-entry {
    --ui-repository-revisions-message-background: transparent;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.75rem;
    padding: var(--ui-repository-file-history-row-padding, 0.75rem);
  }
  .file-history-entry:not(:first-child) {
    border-top: 1px solid var(--border);
  }
  .file-history-entry:hover {
    background: color-mix(in srgb, var(--foreground) 4%, var(--background));
  }
  .file-history-entry:is(:hover, :focus-within) {
    --ui-repository-revisions-message-surface: var(
      --ui-repository-file-history-details-hover-background,
      color-mix(in srgb, var(--foreground) 8%, var(--background))
    );
  }
  .file-history-entry__content {
    flex: 1 1 18rem;
    min-width: 0;
  }
  .file-history-entry__subject {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }
  strong {
    font-weight: 600;
    overflow-wrap: anywhere;
  }
  .file-history-entry__author {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-top: 0.5rem;
    color: var(--muted-foreground);
    font-size: 0.75rem;
  }
  .file-history-entry__actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.25rem;
  }
</style>

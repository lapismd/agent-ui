<!-- SPDX-License-Identifier: Apache-2.0; copied/adapted from JJ Store. -->
<script lang="ts">
  import * as Empty from "@lapismd/design-core/shadcn/empty";
  import GitBranchIcon from "@lucide/svelte/icons/git-branch";

  let { filter, query }: { filter: string; query: string } = $props();

  const title = $derived(
    query.trim()
      ? "No matching bookmarks"
      : filter === "workspace"
        ? "No workspace bookmarks"
        : filter === "conflicted"
          ? "No conflicted bookmarks"
          : "No bookmarks",
  );
  const description = $derived(
    query.trim()
      ? "Try another search or bookmark filter."
      : filter === "workspace"
        ? "No bookmarks are associated with a workspace."
        : filter === "conflicted"
          ? "No bookmarks have multiple targets."
          : "This repository has no bookmarks.",
  );
</script>

<Empty.Root class="repository-bookmark-cards__empty" role="status">
  <Empty.Header>
    <Empty.Media variant="icon">
      <GitBranchIcon aria-hidden="true" />
    </Empty.Media>
    <Empty.Title>{title}</Empty.Title>
    <Empty.Description>{description}</Empty.Description>
  </Empty.Header>
</Empty.Root>

<style>
  :global(.repository-bookmark-cards__empty) {
    min-height: 12rem;
    padding: 1.5rem;
  }
  :global(.repository-bookmark-cards__empty [data-ui-part="empty-title"]) {
    font-size: var(--ui-repository-branch-body-font-size, 0.875rem);
  }
  :global(
    .repository-bookmark-cards__empty [data-ui-part="empty-description"]
  ) {
    font-size: var(--ui-repository-branch-secondary-font-size, 0.75rem);
  }
</style>

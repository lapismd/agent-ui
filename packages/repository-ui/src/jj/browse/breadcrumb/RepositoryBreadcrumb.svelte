<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store's repository breadcrumb. -->
<script lang="ts">
  import * as Breadcrumb from "@lapismd/design-core/shadcn/breadcrumb";
  import { repositoryBreadcrumbSegments } from "../logic/paths.js";
  let {
    repositoryName,
    path = "",
    onOpenDirectory,
    onOpenRepository,
  }: {
    repositoryName: string;
    path?: string;
    onOpenDirectory(path: string): void;
    onOpenRepository?(): void;
  } = $props();
  const segments = $derived(repositoryBreadcrumbSegments(path));
</script>

<nav class="repository-breadcrumb" aria-label="Repository path">
  <Breadcrumb.Root>
    <Breadcrumb.List aria-label="Repository breadcrumb">
      <Breadcrumb.Item>
        {#if onOpenRepository}<Breadcrumb.Link
            href="#"
            onclick={(event) => {
              event.preventDefault();
              onOpenRepository?.();
            }}><span>{repositoryName}</span></Breadcrumb.Link
          >
        {:else}<span>{repositoryName}</span>{/if}
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        {#if segments.length > 0}<Breadcrumb.Link
            href="#"
            onclick={(event) => {
              event.preventDefault();
              onOpenDirectory("");
            }}><span>Files</span></Breadcrumb.Link
          >
        {:else}<Breadcrumb.Page><span>Files</span></Breadcrumb.Page>{/if}
      </Breadcrumb.Item>
      {#each segments as segment, index (segment.path)}
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          {#if index === segments.length - 1}<Breadcrumb.Page
              ><span>{segment.name}</span></Breadcrumb.Page
            >
          {:else}<Breadcrumb.Link
              href="#"
              onclick={(event) => {
                event.preventDefault();
                onOpenDirectory(segment.path);
              }}><span>{segment.name}</span></Breadcrumb.Link
            >{/if}
        </Breadcrumb.Item>
      {/each}
    </Breadcrumb.List>
  </Breadcrumb.Root>
</nav>

<style>
  .repository-breadcrumb {
    display: flex;
    min-height: 2.5rem;
    box-sizing: border-box;
    flex: none;
    align-items: center;
    padding: var(--ui-repository-breadcrumb-padding, 0.4rem 1rem);
    background: var(--background);
  }
  .repository-breadcrumb :global([data-slot="breadcrumb-list"]) {
    min-width: 0;
    flex-wrap: nowrap;
    overflow: hidden;
  }
  .repository-breadcrumb :global([data-slot="breadcrumb-separator"]) {
    flex: none;
  }
  .repository-breadcrumb
    :global(:is([data-slot="breadcrumb-link"], [data-slot="breadcrumb-page"])) {
    max-width: 18rem;
    overflow: hidden;
    color: var(--foreground);
    font-size: var(--ui-repository-breadcrumb-font-size, 0.75rem);
    font-weight: 550;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .repository-breadcrumb :global([data-slot="breadcrumb-link"]:hover) {
    color: var(--foreground);
    text-decoration: underline;
    text-underline-offset: 0.15em;
  }
</style>

<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store Projects/Threads breadcrumbs. -->
<script lang="ts">
  import type { Snippet } from "svelte";
  import * as Breadcrumb from "@lapismd/design-core/shadcn/breadcrumb";
  import type { RepositoryBreadcrumbItem } from "../model.js";
  import "./breadcrumbs.css";
  let {
    items,
    root,
    onNavigate,
  }: {
    items: readonly RepositoryBreadcrumbItem[];
    /** Optional repository picker; omit for global page ancestry. */
    root?: Snippet;
    onNavigate?: (item: RepositoryBreadcrumbItem) => void;
  } = $props();
</script>

<div class="repository-breadcrumbs">
  <Breadcrumb.Root>
    <Breadcrumb.List>
      {#if root}<Breadcrumb.Item>{@render root()}</Breadcrumb.Item>{/if}
      {#each items as item, index (item.id)}
        {#if root || index > 0}<Breadcrumb.Separator />{/if}
        <Breadcrumb.Item>
          {#if item.href && index < items.length - 1}
            <Breadcrumb.Link
              href={item.href}
              onclick={(event) => {
                if (
                  onNavigate &&
                  !event.metaKey &&
                  !event.ctrlKey &&
                  !event.shiftKey &&
                  !event.altKey &&
                  event.button === 0
                ) {
                  event.preventDefault();
                  onNavigate(item);
                }
              }}
            >
              {#if item.Icon}<item.Icon aria-hidden="true" />{/if}<span
                title={item.label}>{item.label}</span
              >
            </Breadcrumb.Link>
          {:else}
            <Breadcrumb.Page
              >{#if item.Icon}<item.Icon aria-hidden="true" />{/if}<span
                title={item.label}>{item.label}</span
              ></Breadcrumb.Page
            >
          {/if}
        </Breadcrumb.Item>
      {/each}
    </Breadcrumb.List>
  </Breadcrumb.Root>
</div>

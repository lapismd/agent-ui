<!-- SPDX-License-Identifier: Apache-2.0; retained Lapis AI Catalog, see ../../../lib/ai/NOTICE.md. -->
<script lang="ts">
  import { untrack } from "svelte";
  import * as Empty from "@lapismd/design-core/shadcn/empty";
  import { Skeleton } from "@lapismd/design-core/shadcn/skeleton";
  import { PackageSearch } from "@lucide/svelte";
  import * as Tooltip from "@lapismd/design-core/shadcn/tooltip";
  import * as Sidebar from "@lapismd/design-core/shadcn/sidebar";
  import { ScrollArea } from "@lapismd/design-core/shadcn/scroll-area";
  import type { CatalogState } from "../controller.svelte.js";
  import CatalogOwner from "../catalog-owner/CatalogOwner.svelte";
  import CatalogToolbar from "../catalog-toolbar/CatalogToolbar.svelte";
  import "../panel.css";
  let { catalog }: { catalog: CatalogState } = $props();
  $effect(() => {
    catalog.groups;
    untrack(() => catalog.applyDefaults?.());
  });
</script>

<Tooltip.Provider delayDuration={0}>
  <div
    class="ai-catalog"
    data-ui-component="ai-catalog"
    data-testid="ai-catalog"
  >
    <CatalogToolbar {catalog} />
    <ScrollArea class="ai-catalog__scroll">
      <div class="ai-catalog__body">
        {#if catalog.loading}<div
            role="status"
            aria-label="Loading catalog"
            aria-busy="true"
          >
            {#each [0, 1, 2, 3] as row (row)}<Skeleton
                style="height:2.5rem;margin-block:0.375rem"
              />{/each}
          </div>
        {:else if !catalog.visibleGroups.length || catalog.error}
          <Empty.Root
            ><Empty.Header
              ><Empty.Media variant="icon"
                ><PackageSearch aria-hidden="true" /></Empty.Media
              ><Empty.Title
                >{catalog.error
                  ? "Catalog unavailable"
                  : catalog.filtering
                    ? "No matching catalog items"
                    : "No catalog items yet"}</Empty.Title
              ><Empty.Description
                >{catalog.error ||
                  "Try another search or enable catalog sources in the host."}</Empty.Description
              ></Empty.Header
            ></Empty.Root
          >
        {/if}
        {#if catalog.visibleGroups.length > 0}
          <Sidebar.Menu
            class="ai-catalog__tree"
            role="tree"
            aria-label="AI catalog"
          >
            {#each catalog.visibleGroups as group (group.id)}
              <CatalogOwner {group} {catalog} />
            {/each}
          </Sidebar.Menu>
        {/if}
      </div>
    </ScrollArea>
  </div>
</Tooltip.Provider>

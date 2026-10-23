<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store application tabs and Projects viewport. -->
<script lang="ts">
  import type { Snippet } from "svelte";
  import { AppShell } from "@lapismd/design-core/shell";
  import { ResponsiveTabs } from "@lapismd/design-core/shadcn/responsive-tabs";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import ArrowLeft from "@lucide/svelte/icons/arrow-left";
  import RepositoryShell from "../../foundations/shell/RepositoryShell.svelte";
  import {
    navigationSections,
    type RepositoryNavigationContext,
    type RepositoryNavigationSection,
  } from "../model.js";
  let {
    title,
    context = "repository",
    sections,
    value,
    onSelect,
    onBack,
    disabled = false,
    header,
    details,
    headerActions,
    search,
    actions,
    children,
    scrollable = true,
    showNavigation = true,
    hideTabs = false,
  }: {
    title: string;
    context?: RepositoryNavigationContext;
    sections?: readonly RepositoryNavigationSection[];
    value: string;
    onSelect: (value: string) => void;
    onBack?: () => void;
    disabled?: boolean;
    header?: Snippet;
    /** Contextual far-right rail; omitted on general directories and settings. */
    details?: Snippet;
    headerActions?: Snippet;
    search?: Snippet;
    actions?: Snippet;
    children: Snippet;
    /** Complete canvases own their scrolling; ordinary directory pages use the body viewport. */
    scrollable?: boolean;
    showNavigation?: boolean;
    hideTabs?: boolean;
  } = $props();
  const items = $derived(sections ?? navigationSections(context));
</script>

<section class="repository-page-frame" aria-label={title}>
  {#if header || headerActions}<AppShell.Topbar
      center={header}
      trailing={headerActions}
      aria-label={`${title} header`}
    />{/if}
  <div class="repository-page-frame__surface">
    <RepositoryShell>
      {#snippet surface()}
        {#if details}<AppShell.Sidebar
            side="right"
            variant="rail"
            label={`${title} details`}
            constraintPriority={0}
          >
            <AppShell.Sidebar.Body>{@render details()}</AppShell.Sidebar.Body>
          </AppShell.Sidebar>{/if}
      {/snippet}
      {#if showNavigation}<AppShell.Toolbar
          label={`${title} navigation`}
          style="border-bottom: 0; min-height: 3rem;"
        >
          <div class="repository-page-frame__navigation">
            <ResponsiveTabs
              {value}
              items={hideTabs ? [] : items}
              {disabled}
              onValueChange={onSelect}
              label={`${title} views`}
            >
              {#snippet leading()}
                {#if onBack}<Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Back to repository"
                    title="Back to repository"
                    {disabled}
                    onclick={onBack}><ArrowLeft aria-hidden="true" /></Button
                  >{/if}
                {#if search}<div
                    class="repository-page-frame__search"
                    class:expanded={hideTabs}
                  >
                    {@render search()}
                  </div>{/if}
              {/snippet}
              {#snippet trailing()}{@render actions?.()}{/snippet}
            </ResponsiveTabs>
          </div>
        </AppShell.Toolbar>{/if}
      {#if scrollable}
        <AppShell.Body.Content
          label={`${title} content`}
          scrollbarVisibility="hover"
          >{@render children()}</AppShell.Body.Content
        >
      {:else}<div class="repository-page-frame__canvas">
          {@render children()}
        </div>{/if}
    </RepositoryShell>
  </div>
</section>

<style>
  .repository-page-frame {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-width: 0;
    min-height: 0;
    background: var(--ui-repository-page-background, var(--background));
  }
  .repository-page-frame__surface {
    flex: 1;
    min-height: 0;
    min-width: 0;
  }
  .repository-page-frame__navigation {
    width: 100%;
    min-width: 0;
  }
  .repository-page-frame__search {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    min-width: 0;
    max-width: min(22rem, 45%);
  }
  .repository-page-frame__search.expanded {
    flex: 1 1 100%;
    max-width: none;
  }
  .repository-page-frame__canvas {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
  }
</style>

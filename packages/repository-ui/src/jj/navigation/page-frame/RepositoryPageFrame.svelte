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
    search,
    actions,
    children,
    scrollable = true,
  }: {
    title: string;
    context?: RepositoryNavigationContext;
    sections?: readonly RepositoryNavigationSection[];
    value: string;
    onSelect: (value: string) => void;
    onBack?: () => void;
    disabled?: boolean;
    header?: Snippet;
    search?: Snippet;
    actions?: Snippet;
    children: Snippet;
    /** Complete canvases own their scrolling; ordinary directory pages use the body viewport. */
    scrollable?: boolean;
  } = $props();
  const items = $derived(sections ?? navigationSections(context));
</script>

<section class="repository-page-frame" aria-label={title}>
  <RepositoryShell>
    {#if header}<AppShell.Toolbar label={`${title} header`}
        >{@render header()}</AppShell.Toolbar
      >{/if}
    <AppShell.Toolbar label={`${title} navigation`}>
      <div class="repository-page-frame__navigation">
        <ResponsiveTabs
          {value}
          {items}
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
            {@render search?.()}
          {/snippet}
          {#snippet trailing()}{@render actions?.()}{/snippet}
        </ResponsiveTabs>
      </div>
    </AppShell.Toolbar>
    {#if scrollable}
      <AppShell.Body.Content
        label={`${title} content`}
        scrollbarVisibility="hover">{@render children()}</AppShell.Body.Content
      >
    {:else}<div class="repository-page-frame__canvas">
        {@render children()}
      </div>{/if}
  </RepositoryShell>
</section>

<style>
  .repository-page-frame {
    height: 100%;
    min-width: 0;
    min-height: 0;
    background: var(--ui-repository-page-background, var(--background));
  }
  .repository-page-frame__navigation {
    width: 100%;
    min-width: 0;
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

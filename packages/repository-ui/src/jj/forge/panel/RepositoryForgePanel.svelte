<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store StoreForgeDetails. -->
<script lang="ts">
  import type { Snippet } from "svelte";
  import * as Collapsible from "@lapismd/design-core/shadcn/collapsible";
  import * as Tooltip from "@lapismd/design-core/shadcn/tooltip";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import PictureInPicture2 from "@lucide/svelte/icons/picture-in-picture-2";
  import X from "@lucide/svelte/icons/x";
  import Detachable from "./RepositoryDetachablePanel.svelte";
  import "./panel.css";
  let {
    title,
    windowTitle,
    label = "Item",
    ariaLabel = title,
    expanded = $bindable(true),
    onExpandedChange,
    onClose,
    leading,
    context,
    beforeActions,
    actions,
    children: content,
    class: className = "",
  }: {
    title: string;
    windowTitle?: string;
    label?: string;
    ariaLabel?: string;
    expanded?: boolean;
    onExpandedChange?: (open: boolean) => void;
    onClose?: () => void;
    leading?: Snippet;
    context?: Snippet;
    beforeActions?: Snippet;
    actions?: Snippet;
    children: Snippet;
    class?: string;
  } = $props();
  function expand(open: boolean) {
    if (onExpandedChange) onExpandedChange(open);
    else expanded = open;
  }
</script>

<Detachable title={windowTitle ?? title}>
  {#snippet children({ floating, toggle })}
    <section
      class={`repository-forge-panel ${className}`}
      class:repository-forge-panel--floating={floating}
      aria-label={ariaLabel}
    >
      <Collapsible.Root
        open={expanded}
        onOpenChange={expand}
        disabled={floating}
      >
        <header class="repository-forge-panel__summary">
          {@render leading?.()}
          <h2 class="repository-forge-panel__title">
            <Collapsible.Trigger
              >{#snippet child({ props })}<Button
                  {...props}
                  variant="ghost"
                  size="sm"
                  tabindex={floating ? -1 : undefined}
                  aria-label={`${title} · ${expanded ? "Collapse" : "Expand"} ${label.toLowerCase()} details`}
                >
                  {#if expanded}<ChevronDown
                      aria-hidden="true"
                    />{:else}<ChevronRight aria-hidden="true" />{/if}<span
                    >{title}</span
                  >
                </Button>{/snippet}</Collapsible.Trigger
            >
          </h2>
          {@render context?.()}
          <div class="repository-forge-panel__actions">
            {@render beforeActions?.()}
            <Tooltip.Provider
              ><Tooltip.Root
                ><Tooltip.Trigger
                  >{#snippet child({ props })}<Button
                      {...props}
                      variant="ghost"
                      size="icon-sm"
                      aria-label={floating
                        ? `Dock ${label} details`
                        : `Float ${label} details`}
                      onclick={() => {
                        expand(true);
                        toggle();
                      }}><PictureInPicture2 aria-hidden="true" /></Button
                    >{/snippet}</Tooltip.Trigger
                ><Tooltip.Content
                  >{floating
                    ? "Dock details"
                    : "Float details"}</Tooltip.Content
                ></Tooltip.Root
              ></Tooltip.Provider
            >
            {@render actions?.()}
            {#if onClose}<Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Close ${label} details`}
                onclick={onClose}><X aria-hidden="true" /></Button
              >{/if}
          </div>
        </header>
        <Collapsible.Content
          >{#if expanded}{@render content()}{/if}</Collapsible.Content
        >
      </Collapsible.Root>
    </section>
  {/snippet}
</Detachable>

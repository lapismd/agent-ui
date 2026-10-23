<script lang="ts">
  import type { Snippet } from "svelte";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { PanelToggle } from "@lapismd/design-core/shadcn/panel-toggle";
  import * as Tooltip from "@lapismd/design-core/shadcn/tooltip";
  let {
    label,
    text,
    selected,
    disabled = false,
    panelExpanded,
    class: className,
    onclick,
    children,
  }: {
    label: string;
    text?: string;
    selected?: boolean;
    disabled?: boolean;
    panelExpanded?: boolean;
    class?: string;
    onclick(): void;
    children?: Snippet;
  } = $props();
  const hoverStyle =
    "--accent:var(--ui-repository-file-action-hover-background, color-mix(in srgb, var(--foreground) 8%, var(--background)))";
</script>

<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger>
      {#snippet child({ props }: { props: Record<string, unknown> })}
        {#if panelExpanded !== undefined}
          <PanelToggle
            {...props}
            side="left"
            expanded={panelExpanded}
            iconVariant="standard"
            size="icon-sm"
            class={className}
            style={hoverStyle}
            aria-label={label}
            {onclick}
          />
        {:else}
          <Button
            {...props}
            {disabled}
            variant={text ? "outline" : "ghost"}
            size={text ? "sm" : "icon-sm"}
            class={className}
            style={hoverStyle}
            aria-label={text ?? label}
            aria-pressed={selected}
            data-selected={selected}
            {onclick}
          >
            {@render children?.()}{text ?? ""}
          </Button>
        {/if}
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content side="bottom">{label}</Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>

<!-- SPDX-License-Identifier: Apache-2.0; copied from Lapis Desktop with explicit host boundaries. -->
<script lang="ts">
  import TerminalIcon from "@lucide/svelte/icons/terminal";
  import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { operationCommandLabel } from "../../logic/operation-command.js";
  let { attributes }: { attributes: Readonly<Record<string, string>> } =
    $props();
  const command = $derived(
    attributes.args ? operationCommandLabel(attributes.args) : undefined,
  );
  const id = $props.id();
  let expanded = $state(false),
    overflowing = $state(false);
  $effect(() => {
    void command;
    expanded = false;
  });
  function measure(node: HTMLPreElement) {
    const update = () => {
      const rem = parseFloat(
        getComputedStyle(node.ownerDocument.documentElement).fontSize,
      );
      overflowing = node.getBoundingClientRect().height > 9 * rem + 1;
    };
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return { destroy: () => observer.disconnect() };
  }
</script>

{#if command?.trim()}
  <section
    class="repository-review-operation-command"
    aria-label="Recorded operation command"
  >
    <div class="repository-review-command-label">
      <TerminalIcon aria-hidden="true" />Command
    </div>
    <div
      {id}
      class="command-viewport"
      data-clamped={(overflowing && !expanded) || undefined}
    >
      <pre use:measure><code>{command}</code></pre>
    </div>
    {#if overflowing}<Button
        variant="ghost"
        size="xs"
        aria-controls={id}
        aria-expanded={expanded}
        aria-label={expanded
          ? "View less of operation command"
          : "View more of operation command"}
        onclick={() => (expanded = !expanded)}
      >
        {expanded ? "View less" : "View more"}<ChevronDownIcon
          data-icon="inline-end"
          data-expanded={expanded}
          aria-hidden="true"
        />
      </Button>{/if}
  </section>
{/if}

<style>
  .repository-review-operation-command {
    min-width: 0;
    padding: 0.75rem 1rem;
    font-size: 0.75rem;
  }
  .repository-review-command-label {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    color: var(--muted-foreground);
  }
  .repository-review-command-label :global(svg) {
    width: 0.875rem;
    height: 0.875rem;
  }
  pre {
    margin: 0.375rem 0 0;
    padding: 0.5rem 0.625rem;
    border-radius: calc(var(--radius) * 0.8);
    background: color-mix(in srgb, var(--foreground) 5%, var(--background));
    color: var(--foreground);
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
  code {
    font-family: var(--font-mono, monospace);
    font-size: inherit;
  }
  .command-viewport[data-clamped] {
    max-height: 9rem;
    overflow: hidden;
    mask-image: linear-gradient(to bottom, #000 calc(100% - 3rem), transparent);
  }
  .repository-review-operation-command :global([data-expanded="true"]) {
    transform: rotate(180deg);
  }
</style>

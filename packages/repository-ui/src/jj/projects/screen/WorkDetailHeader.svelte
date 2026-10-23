<!-- Adapted from JJ Store task/review headers, Apache-2.0. -->
<script lang="ts">
  import type { Snippet } from "svelte";
  import { AppShell } from "@lapismd/design-core/shell";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { ArrowLeft } from "@lucide/svelte";
  let {
    label,
    title,
    identifier,
    backLabel,
    onBack,
    subtitle,
    actions,
  }: {
    label: string;
    title: string;
    identifier: string;
    backLabel: string;
    onBack(): void;
    subtitle?: Snippet;
    actions?: Snippet;
  } = $props();
</script>

<AppShell.Toolbar
  {label}
  style="display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 0.5rem; padding: 0.375rem 0.5rem; border-bottom: 0; background: var(--background);"
>
  <Button
    variant="ghost"
    size="icon-sm"
    aria-label={backLabel}
    title={backLabel}
    onclick={onBack}><ArrowLeft aria-hidden="true" /></Button
  >
  <div class="work-detail-heading">
    <h2>{title} <span title={identifier}>#{identifier.slice(0, 8)}</span></h2>
    {#if subtitle}<p>{@render subtitle()}</p>{/if}
  </div>
  <div class="work-detail-actions">{@render actions?.()}</div>
</AppShell.Toolbar>

<style>
  .work-detail-heading {
    min-width: 0;
    overflow-wrap: anywhere;
  }
  h2 {
    margin: 0;
    font-size: var(--community-text-section);
    font-weight: 600;
    line-height: 1.4;
  }
  h2 span {
    color: var(--muted-foreground);
    font-weight: 400;
    white-space: nowrap;
  }
  p {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.25rem;
    margin: 0;
    color: var(--muted-foreground);
    font-size: var(--community-text-secondary);
  }
  .work-detail-actions {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
</style>

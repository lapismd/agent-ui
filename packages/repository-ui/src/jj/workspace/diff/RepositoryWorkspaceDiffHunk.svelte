<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store StoreStackDiffHunk. -->
<script lang="ts">
  import * as Card from "@lapismd/design-core/shadcn/card";
  import { Checkbox } from "@lapismd/design-core/shadcn/checkbox";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { FileDiff } from "@lapismd/design-core/diff";
  import ArrowLeftRight from "@lucide/svelte/icons/arrow-left-right";
  import type { WorkspaceHunk } from "../../../stacks/index.js";
  let {
    hunk,
    displayPatch,
    path,
    origin,
    checked,
    selectable,
    disabled,
    viewMode,
    wrap,
    onChecked,
    onAssign,
  }: {
    hunk: WorkspaceHunk;
    displayPatch?: string;
    path: string;
    origin: string;
    checked: boolean;
    selectable: boolean;
    disabled: boolean;
    viewMode: "unified" | "split";
    wrap: boolean;
    onChecked(checked: boolean): void;
    onAssign?(): void;
  } = $props();
  const id = $props.id();
  const header = $derived(
    hunk.patch.split(/\r?\n/).find((line) => line.startsWith("@@ ")) ??
      hunk.label,
  );
</script>

<Card.Root
  class="workspace-hunk-card"
  role="group"
  aria-label={`Hunk ${hunk.label}`}
>
  <Card.Header class="workspace-hunk-header">
    {#if selectable}<Checkbox
        {id}
        {checked}
        {disabled}
        aria-label={`Select ${hunk.label}`}
        onCheckedChange={(next) => onChecked(next === true)}
      />
      <label for={id} title={hunk.label}><code>{header}</code></label>
    {:else}<Card.Title title={hunk.label}><code>{header}</code></Card.Title
      >{/if}
    {#if onAssign}<Button
        variant="ghost"
        size="icon-sm"
        {disabled}
        aria-label={`Assign hunk ${hunk.label}`}
        title="Assign hunk"
        onclick={onAssign}><ArrowLeftRight aria-hidden="true" /></Button
      >{/if}
  </Card.Header>
  <Card.Content class="workspace-hunk-content"
    ><FileDiff
      {path}
      patch={displayPatch ?? hunk.patch}
      {viewMode}
      {wrap}
      sizing="content"
      label={`${origin} · ${path} · ${hunk.label}`}
    /></Card.Content
  >
</Card.Root>

<style>
  :global(.workspace-hunk-card) {
    padding: 0;
    gap: 0;
    overflow: hidden;
  }
  :global(.workspace-hunk-header) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.5rem;
    background: var(--muted);
    color: var(--muted-foreground);
    border-bottom: 1px solid var(--border);
  }
  code {
    font-family: var(--font-mono);
    font-size: var(--ui-repository-workspace-hunk-font-size, 0.6875rem);
    font-weight: 400;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
  label,
  :global(.workspace-hunk-header [data-slot="card-title"]) {
    flex: 1;
  }
  :global(.workspace-hunk-content) {
    padding: 0;
    min-width: 0;
  }
</style>

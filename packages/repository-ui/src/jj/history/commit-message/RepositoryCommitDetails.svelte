<!-- SPDX-License-Identifier: Apache-2.0; shared disclosure of recorded commit text. -->
<script lang="ts">
  import type { Snippet } from "svelte";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
  import RepositoryCommitMessage from "./RepositoryCommitMessage.svelte";
  let {
    description,
    children,
    compact = false,
    attached = false,
  }: {
    description: string;
    compact?: boolean;
    attached?: boolean;
    children: Snippet<[Snippet, Snippet]>;
  } = $props();
  const id = $props.id();
  let expanded = $state(false);
  const message = $derived(
    description.split("\n").slice(1).join("\n").trim()
      ? description
      : `\n${description}`,
  );
  $effect(() => {
    void description;
    expanded = false;
  });
</script>

{#snippet toggle()}
  <Button
    variant="ghost"
    size="icon-xs"
    style={`--accent:var(--ui-repository-file-history-action-hover-background, color-mix(in srgb, var(--foreground) 10%, var(--background)));${expanded ? "background:var(--ui-repository-commit-details-expanded-background, color-mix(in srgb, var(--foreground) 12%, var(--background)))" : ""}`}
    aria-label={expanded
      ? "Hide commit description"
      : "Show commit description"}
    aria-expanded={expanded}
    aria-controls={id}
    onclick={() => (expanded = !expanded)}><EllipsisIcon /></Button
  >
{/snippet}
{#snippet panel()}
  {#if expanded}<div
      {id}
      class="repository-commit-details"
      data-compact={compact}
      data-attached={attached}
    >
      <RepositoryCommitMessage description={message} />
    </div>{/if}
{/snippet}
{@render children(toggle, panel)}

<style>
  .repository-commit-details {
    min-width: 0;
    --ui-repository-revisions-message-background: transparent;
  }
  .repository-commit-details[data-compact="true"] {
    --ui-repository-revisions-message-margin: 0;
    --ui-repository-revisions-message-padding: var(
      --ui-repository-metadata-details-padding,
      0.5rem 0.5rem 0
    );
  }
  .repository-commit-details[data-attached="true"] {
    border-block-start: 1px solid var(--border);
    background: var(
      --ui-repository-file-metadata-details-background,
      var(--muted)
    );
    --ui-repository-revisions-message-surface: transparent;
  }
</style>

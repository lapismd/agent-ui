<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store's Markdown preview. -->
<script lang="ts">
  import { MarkdownContent } from "@lapismd/design-core/chat";
  import RepositoryBrowserEmpty from "./RepositoryBrowserEmpty.svelte";
  let {
    content,
    label = "Markdown preview",
  }: { content: string; label?: string } = $props();
</script>

<section class="repository-browser__markdown-preview" aria-label={label}>
  {#if content.trim()}<MarkdownContent {content} fullWidth />
  {:else}<RepositoryBrowserEmpty
      title="Empty file"
      description="This recorded file contains no text."
    />{/if}
</section>

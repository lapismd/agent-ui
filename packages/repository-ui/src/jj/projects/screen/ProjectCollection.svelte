<!-- Adapted from JJ Store StoreWorkCollection, Apache-2.0. -->
<script lang="ts">
  import type { Snippet, Component } from "svelte";
  import * as Collapsible from "@lapismd/design-core/shadcn/collapsible";
  import { ChevronDown, ChevronRight, FolderGit2 } from "@lucide/svelte";
  import "./community-work-collections.css";
  let {
    title,
    children,
    Icon = FolderGit2,
  }: { title: string; children: Snippet; Icon?: Component } = $props();
  let open = $state(true);
</script>

<Collapsible.Root class="community-projects__collection-group" bind:open
  ><Collapsible.Trigger class="community-projects__list-group-heading"
    ><Icon aria-hidden="true" /><strong>{title}</strong>{#if open}<ChevronDown
        class="community-projects__list-group-chevron"
        aria-hidden="true"
      />{:else}<ChevronRight
        class="community-projects__list-group-chevron"
        aria-hidden="true"
      />{/if}</Collapsible.Trigger
  ><Collapsible.Content>{@render children()}</Collapsible.Content
  ></Collapsible.Root
>

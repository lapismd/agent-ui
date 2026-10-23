<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store settings page. -->
<script lang="ts">
  import type { Component, Snippet } from "svelte";
  import { ScrollArea } from "@lapismd/design-core/shadcn/scroll-area";
  import { provideSettingsPresentation } from "../settings-card/settings-presentation.js";
  import "./settings.css";
  let {
    title,
    Icon,
    children,
  }: { title: string; Icon?: Component; children: Snippet } = $props();
  provideSettingsPresentation({ value: "global" });
</script>

<section class="repository-settings-page" aria-label={`${title} settings page`}>
  <header class="store-settings__global-header">
    <h1>
      {#if Icon}<Icon aria-hidden="true" />{/if}{title}
    </h1>
  </header>
  <ScrollArea
    class="repository-settings-scroll"
    aria-label={`${title} settings content`}
  >
    <div class="store-settings store-settings--global">
      {@render children()}
    </div>
  </ScrollArea>
</section>

<style>
  .repository-settings-page {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    height: 100%;
    background: var(--ui-repository-settings-background, var(--background));
  }
  :global(.repository-settings-scroll) {
    flex: 1;
    min-height: 0;
  }
</style>

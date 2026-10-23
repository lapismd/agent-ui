<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store settings page. -->
<script lang="ts">
  import type { Component, Snippet } from "svelte";
  import { AppShell } from "@lapismd/design-core/shell";
  import RepositoryShell from "../../foundations/shell/RepositoryShell.svelte";
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
  <RepositoryShell>
    <AppShell.Toolbar label={`${title} settings header`}>
      <h1 class="settings-title">
        {#if Icon}<Icon aria-hidden="true" />{/if}{title}
      </h1>
    </AppShell.Toolbar>
    <AppShell.Body.Content
      label={`${title} settings content`}
      scrollbarVisibility="hover"
    >
      <div class="store-settings store-settings--global">
        {@render children()}
      </div>
    </AppShell.Body.Content>
  </RepositoryShell>
</section>

<style>
  .repository-settings-page {
    min-width: 0;
    min-height: 0;
    height: 100%;
    background: var(--ui-repository-settings-background, var(--background));
  }
  .store-settings--global {
    padding: var(--ui-repository-settings-padding, 1rem);
  }
  .store-settings--global :global(.store-settings__section:first-child) {
    margin-block-start: 0;
  }
  .settings-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    font-size: var(--community-text-body, 0.875rem);
    font-weight: 600;
  }
  .settings-title :global(svg) {
    width: 1rem;
    height: 1rem;
    flex: none;
  }
</style>

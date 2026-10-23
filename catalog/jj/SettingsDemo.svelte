<script lang="ts">
  import "../../packages/repository-ui/src/jj/settings/styles.css";
  import { untrack } from "svelte";
  import { Palette, Folder } from "@lucide/svelte";
  import {
    RepositoryAppearance,
    RepositorySettingsPage,
    RepositorySettingsCard,
    createAppearanceStore,
    ownAppearance,
  } from "../../packages/repository-ui/src/jj/settings/index.js";
  let { variant = "appearance" }: { variant?: string } = $props();
  const store = untrack(() =>
    createAppearanceStore(
      undefined,
      document.documentElement.classList.contains("dark"),
      "catalog.appearance",
    ),
  );
  ownAppearance(store);
</script>

<div class="settings-demo">
  <RepositorySettingsPage
    title={variant === "appearance" ? "Appearance" : "Repository"}
    Icon={variant === "appearance" ? Palette : Folder}
  >
    {#if variant === "appearance"}<RepositoryAppearance />{:else}
      <RepositorySettingsCard
        id="folder"
        title="Selected folder"
        Icon={Folder}
        description="The host owns the admitted folder and repository settings."
      >
        <dl class="store-settings__rows">
          <div>
            <dt>Repository</dt>
            <dd>Example repository</dd>
          </div>
          <div>
            <dt>Storage</dt>
            <dd>Local Git-backed JJ</dd>
          </div>
        </dl>
      </RepositorySettingsCard>{/if}
  </RepositorySettingsPage>
</div>

<style>
  .settings-demo {
    height: 40rem;
    width: 100%;
    min-width: 0;
  }
</style>

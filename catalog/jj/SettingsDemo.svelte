<script lang="ts">
  import "../../packages/repository-ui/src/jj/settings/styles.css";
  import { untrack } from "svelte";
  import { Palette, Folder, FolderGit2, Database } from "@lucide/svelte";
  import {
    RepositoryAppearance,
    RepositorySettingsPage,
    RepositorySettingsCard,
    RepositoryReadOnlyRow,
    createAppearanceStore,
    ownAppearance,
  } from "../../packages/repository-ui/src/jj/settings/index.js";
  let {
    variant = "appearance",
    folderPath = "/Users/example/code/example-repository",
    openDisabled = false,
    onOpenRepository = () => {},
  }: {
    variant?: string;
    folderPath?: string | null;
    openDisabled?: boolean;
    onOpenRepository?: () => void;
  } = $props();
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
      <RepositorySettingsCard id="folder" title="Selected folder" Icon={Folder}>
        <dl class="store-settings__rows">
          <RepositoryReadOnlyRow
            label="Repository"
            value="Example repository"
            Icon={FolderGit2}
          />
          <RepositoryReadOnlyRow
            label="Folder path"
            value={folderPath}
            Icon={Folder}
            copyable
            onOpen={onOpenRepository}
            openLabel="Open repository folder"
            {openDisabled}
          />
        </dl>
      </RepositorySettingsCard>
      <RepositorySettingsCard
        id="storage"
        title="Collaboration storage"
        description="Work, reviews and conversations stay with this repository."
      >
        <dl class="store-settings__rows">
          <RepositoryReadOnlyRow
            label="Storage"
            value="refs/lapis/state/v1"
            Icon={Database}
            copyable
          />
          <RepositoryReadOnlyRow
            label="Backup"
            value="Local only"
            description="Off-device backup and metadata synchronization are not configured."
          />
        </dl>
      </RepositorySettingsCard>
    {/if}
  </RepositorySettingsPage>
</div>

<style>
  .settings-demo {
    height: var(--ui-repository-story-height, 100dvh);
    width: 100%;
    min-width: 0;
  }
</style>

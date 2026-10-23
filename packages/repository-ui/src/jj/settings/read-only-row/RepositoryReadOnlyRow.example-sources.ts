export const Basic = `<script lang="ts">
  import { Folder } from "@lucide/svelte";
  import { RepositorySettingsPage, RepositorySettingsCard, RepositoryReadOnlyRow } from "@lapismd/repository-ui/settings";
  import "@lapismd/repository-ui/settings/styles.css";
  let { path, openFolder }: { path:string; openFolder():void } = $props();
</script>
<RepositorySettingsPage title="Repository">
  <RepositorySettingsCard id="folder" title="Selected folder">
    <dl class="store-settings__rows">
      <RepositoryReadOnlyRow label="Folder path" value={path} Icon={Folder}
        copyable onOpen={openFolder} openLabel="Open repository folder" />
    </dl>
  </RepositorySettingsCard>
</RepositorySettingsPage>`;
export const Styling = `<script lang="ts">
  import { Folder } from "@lucide/svelte";
  import { RepositorySettingsPage, RepositorySettingsCard, RepositoryReadOnlyRow } from "@lapismd/repository-ui/settings";
  import "@lapismd/repository-ui/settings/styles.css";
  let { path, openFolder }: { path:string; openFolder():void } = $props();
</script>
<div style="--ui-repository-settings-row-compact-padding:0.8rem 1rem"><RepositorySettingsPage title="Repository">
  <RepositorySettingsCard id="folder" title="Selected folder">
    <dl class="store-settings__rows">
      <RepositoryReadOnlyRow label="Folder path" value={path} Icon={Folder}
        copyable onOpen={openFolder} openLabel="Open repository folder" />
    </dl>
  </RepositorySettingsCard>
</RepositorySettingsPage></div>`;

<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store StoreProfileSettings avatar row. -->
<script lang="ts">
  import { AvatarPicker } from "@lapismd/design-core/forms/avatar-picker";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import ImageIcon from "@lucide/svelte/icons/image";
  import XIcon from "@lucide/svelte/icons/x";
  import RepositorySettingsField from "../settings-card/RepositorySettingsField.svelte";
  import type { RepositoryProfileController } from "./controller.js";
  let {
    controller,
    avatar,
    name,
    disabled,
  }: {
    controller: RepositoryProfileController;
    avatar: string;
    name: string;
    disabled: boolean;
  } = $props();
</script>

<RepositorySettingsField
  label="Profile photo"
  Icon={ImageIcon}
  description="PNG, JPEG, GIF or WebP, up to 20 MB. Large photos are resized; resized animations use their first frame."
>
  <div class="store-directory-settings__avatar">
    <AvatarPicker
      value={avatar}
      {name}
      label="Edit profile photo"
      shape="circle"
      {disabled}
      onValueChange={(value) => controller.avatar(value)}
      onUploadImage={(file, signal) => controller.upload(file, signal)}
    />
    {#if avatar}<Button
        size="icon-xs"
        variant="outline"
        type="button"
        aria-label="Clear avatar"
        {disabled}
        onclick={() => controller.avatar("")}
        ><XIcon aria-hidden="true" /></Button
      >{/if}
  </div>
</RepositorySettingsField>

<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store StoreStackCopyMenu. -->
<script lang="ts">
  // Owned StoreRecordMenu copy composition, adapted to Changeyard stack values.
  import * as Menu from "@lapismd/design-core/shadcn/dropdown-menu";
  import Copy from "@lucide/svelte/icons/copy";
  let {
    items,
    submenu = true,
    copyText,
    onCopyError,
  }: {
    items: { label: string; value: string }[];
    submenu?: boolean;
    copyText(value: string): Promise<void>;
    onCopyError?(cause: unknown): void;
  } = $props();
  async function copy(item: { label: string; value: string }) {
    try {
      await copyText(item.value);
    } catch (cause) {
      onCopyError?.(cause);
    }
  }
</script>

{#snippet options()}
  <Menu.Group
    >{#each items as item (item.label)}
      <Menu.Item aria-label={item.label} onSelect={() => void copy(item)}
        ><Copy aria-hidden="true" />{item.label}</Menu.Item
      >
    {/each}</Menu.Group
  >
{/snippet}
{#if submenu}<Menu.Sub
    ><Menu.SubTrigger><Copy aria-hidden="true" />Copy</Menu.SubTrigger>
    <Menu.SubContent class="workspace-action-menu"
      >{@render options()}</Menu.SubContent
    >
  </Menu.Sub>{:else}{@render options()}{/if}

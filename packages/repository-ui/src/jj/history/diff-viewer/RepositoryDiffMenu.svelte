<script lang="ts">
  import * as DropdownMenu from "@lapismd/design-core/shadcn/dropdown-menu";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import EllipsisIcon from "@lucide/svelte/icons/ellipsis-vertical";
  import type {
    RepositoryDiffActionContext,
    RepositoryDiffMenuItem,
    RepositoryDiffMenuProvider,
  } from "./types.js";
  let {
    context,
    getItems,
  }: {
    context?: RepositoryDiffActionContext;
    getItems?: RepositoryDiffMenuProvider;
  } = $props();
  let pending = $state(false),
    failure = $state("");
  const items = $derived(context ? (getItems?.(context) ?? []) : []);
  async function activate(item: RepositoryDiffMenuItem) {
    if (!context || "separator" in item || !item.onSelect || pending) return;
    const target = context;
    pending = true;
    failure = "";
    try {
      await item.onSelect(target);
    } catch (error) {
      failure = error instanceof Error ? error.message : String(error);
    } finally {
      pending = false;
    }
  }
</script>

{#snippet renderItems(entries: readonly RepositoryDiffMenuItem[])}
  <DropdownMenu.Group>
    {#each entries as item (item.id)}
      {#if "separator" in item}<DropdownMenu.Separator />
      {:else}
        {@const Icon = item.icon}
        {#if item.children}
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger disabled={item.disabled || pending}
              ><Icon aria-hidden="true" />{item.label}</DropdownMenu.SubTrigger
            >
            <DropdownMenu.SubContent
              style="width:max-content;min-width:var(--ui-repository-diff-menu-min-width,14rem);max-width:calc(100vw - 2rem);white-space:nowrap"
              >{@render renderItems(item.children)}</DropdownMenu.SubContent
            >
          </DropdownMenu.Sub>
        {:else}
          <DropdownMenu.Item
            disabled={item.disabled || pending}
            onSelect={() => void activate(item)}
            ><Icon aria-hidden="true" />{item.label}</DropdownMenu.Item
          >
        {/if}
      {/if}
    {/each}
  </DropdownMenu.Group>
{/snippet}

{#if items.some((item) => !("separator" in item))}
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      {#snippet child({ props })}
        <Button
          {...props}
          variant="ghost"
          size="icon-sm"
          disabled={pending}
          aria-label={`File actions for ${context?.path}`}
          title="File actions"
        >
          <EllipsisIcon aria-hidden="true" />
        </Button>
      {/snippet}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content
      align="end"
      style="width:max-content;min-width:var(--ui-repository-diff-menu-min-width,14rem);max-width:calc(100vw - 2rem);white-space:nowrap"
      >{@render renderItems(items)}</DropdownMenu.Content
    >
  </DropdownMenu.Root>
{/if}
{#if failure}<span role="alert">{failure}</span>{/if}

<!-- SPDX-License-Identifier: Apache-2.0; retained Lapis AI presentation. -->
<script lang="ts">
  import * as Empty from "@lapismd/design-core/shadcn/empty";
  import ListFilterIcon from "@lucide/svelte/icons/list-filter";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import SquareArrowOutUpRightIcon from "@lucide/svelte/icons/square-arrow-out-up-right";
  import type { AgentInventory } from "../../chat/transcript-options.js";
  import "./inventory.css";
  let {
    output: inventory,
    onOpenPath,
  }: {
    output?: AgentInventory;
    onOpenPath?: (path: string) => void | Promise<void>;
  } = $props();
  async function openItem(item: AgentInventory["items"][number]) {
    if (item.path) await onOpenPath?.(item.path);
  }
</script>

<div data-ui-component="ai-inventory-result" data-kind={inventory?.kind}>
  {#if !inventory || inventory.items.length === 0}
    <Empty.Root
      ><Empty.Header>
        <Empty.Media variant="icon"
          ><ListFilterIcon aria-hidden="true" /></Empty.Media
        >
        <Empty.Description
          >{inventory?.kind === "tools"
            ? "No application tools are available."
            : "No skills are available."}</Empty.Description
        >
      </Empty.Header></Empty.Root
    >
  {:else}
    {#each inventory.items as item (`${item.kind}:${item.name}:${item.path ?? ""}`)}
      <div data-ui-part="item">
        <div data-ui-part="body">
          <span data-ui-part="name">{item.name}</span>
          {#if item.description}
            <span data-ui-part="description">{item.description}</span>
          {/if}
        </div>
        {#if item.path && onOpenPath}
          <Button
            type="button"
            size="icon-xs"
            variant="ghost"
            data-ui-part="open"
            aria-label={`Open ${item.name}`}
            onclick={() => void openItem(item)}
          >
            <SquareArrowOutUpRightIcon aria-hidden="true" />
          </Button>
        {/if}
      </div>
    {/each}
  {/if}
</div>

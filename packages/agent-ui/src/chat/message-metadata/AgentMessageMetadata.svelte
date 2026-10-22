<!-- SPDX-License-Identifier: Apache-2.0; adapted from Desktop AiTranscriptMessageMeta/AiRetryTurn. -->
<script lang="ts">
  import type { TranscriptItem } from "@lapismd/design-core/chat";
  import type { AgentTranscriptOptions } from "../transcript-options.js";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import * as Tooltip from "@lapismd/design-core/shadcn/tooltip";
  import RotateCcwIcon from "@lucide/svelte/icons/rotate-ccw";
  import CopyIcon from "@lucide/svelte/icons/copy";
  import ChatRecipients from "./ChatRecipients.svelte";
  let {
    item,
    options = {},
    busy = false,
  }: {
    item: TranscriptItem;
    options?: AgentTranscriptOptions;
    busy?: boolean;
  } = $props();
  const meta = $derived(options.messages?.[item.id]);
</script>

{#if meta?.retry && options.onRetry}
  <Tooltip.Provider delayDuration={0}
    ><Tooltip.Root
      ><Tooltip.Trigger
        >{#snippet child({ props })}<Button
            {...props}
            size="icon-xs"
            variant="ghost"
            aria-label="Retry message"
            disabled={busy}
            onclick={() => void options.onRetry?.(item.id)}
            ><RotateCcwIcon aria-hidden="true" /></Button
          >{/snippet}</Tooltip.Trigger
      ><Tooltip.Content role="tooltip" side="top">Retry message</Tooltip.Content
      ></Tooltip.Root
    ></Tooltip.Provider
  >
{/if}
{#if meta?.recipients?.length}<ChatRecipients
    recipients={meta.recipients}
    deliveries={meta.deliveries}
    label="Sent to"
  />{/if}
{#if item.kind === "message" && item.role === "assistant" && options.onCopyResponse}<Button
    size="icon-xs"
    variant="ghost"
    aria-label="Copy response"
    onclick={() =>
      void options.onCopyResponse?.(
        item.blocks.map((block) => block.text).join("\n\n"),
      )}><CopyIcon aria-hidden="true" /></Button
  >{/if}

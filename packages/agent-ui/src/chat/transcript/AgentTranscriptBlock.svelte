<!-- SPDX-License-Identifier: Apache-2.0; adapted from Desktop AiTranscriptBlock/AiHistoryBlock. -->
<script lang="ts">
  import AgentToolResult from "../../tools/tool-result/AgentToolResult.svelte";
  import * as Chat from "@lapismd/design-core/chat";
  import type { TranscriptBlock } from "@lapismd/design-core/chat";
  import type { AgentTranscriptOptions } from "../transcript-options.js";
  import AiCommandReport from "../../tools/command-report/AiCommandReport.svelte";
  import AiInventoryResult from "../../tools/inventory-result/AiInventoryResult.svelte";
  import AiTurnChanges from "../turn-changes/AiTurnChanges.svelte";
  let {
    block,
    options,
    busy = false,
  }: {
    block: TranscriptBlock;
    options: AgentTranscriptOptions;
    busy?: boolean;
  } = $props();
  const presentation = $derived(options.blocks?.[block.id]);
  const record = $derived(
    options.changes?.history.records.find(
      (record) => block.id === `history/${record.context.turn}`,
    ),
  );
</script>

{#if record && options.changes}<AiTurnChanges
    {record}
    inspection={options.changes}
    {busy}
    copyText={options.changes.port.copyText}
  />
{:else if presentation?.kind === "tool"}<AgentToolResult
    result={presentation}
    view={presentation.view}
  />
{:else if presentation?.kind === "inventory"}<AiInventoryResult
    output={presentation.inventory}
    onOpenPath={options.onOpenPath}
  />
{:else if presentation?.kind === "command"}<AiCommandReport text={block.text} />
{:else if presentation?.kind === "system"}<Chat.SystemMessage
    >{block.text}</Chat.SystemMessage
  >
{:else if options.customBlock}{@render options.customBlock(block)}
{:else}<Chat.MarkdownContent
    {...options.markdown}
    content={block.text}
    fullWidth
  />{/if}

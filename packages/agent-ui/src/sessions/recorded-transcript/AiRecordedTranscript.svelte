<script lang="ts">
  import type { Snippet } from "svelte";
  import {
    Transcript,
    TranscriptController,
    type TranscriptBlock,
    type TranscriptTool,
    type TranscriptItem,
  } from "@lapismd/design-core/chat";
  import TranscriptViewToggle from "../transcript-view-toggle/TranscriptViewToggle.svelte";
  import AiTranscriptToolInspector from "../../chat/transcript-tool-inspector/AiTranscriptToolInspector.svelte";
  import AiCommandReport from "../../chat/command-report/AiCommandReport.svelte";
  let {
    entries = [],
    projectedItems,
    view = $bindable<"document" | "classic">("document"),
    showViewToolbar = true,
    assistant,
    inspectTools = false,
    toolInspector = $bindable<Snippet | undefined>(),
    capturedUser = true,
    label = "Imported transcript preview",
    composer,
    busy = false,
  }: {
    entries?: readonly TranscriptItem[];
    projectedItems?: readonly TranscriptItem[];
    view?: "document" | "classic";
    showViewToolbar?: boolean;
    assistant?: { name: string; image?: string };
    inspectTools?: boolean;
    toolInspector?: Snippet;
    capturedUser?: boolean;
    label?: string;
    composer?: Snippet<["document" | "classic"]>;
    busy?: boolean;
  } = $props();
  const block = (b: TranscriptBlock): TranscriptBlock => ({
    ...b,
    commentable: false,
  });
  const items = $derived(
    (projectedItems ?? entries).map((item) => ({
      ...item,
      label:
        capturedUser && item.role === "user"
          ? "Captured user message"
          : item.label,
      author:
        capturedUser && item.role === "user"
          ? { id: "captured-user", name: "Captured user", initials: "CU" }
          : item.role === "assistant" && item.author && assistant
            ? { ...item.author, name: assistant.name, image: assistant.image }
            : item.author,
      blocks: item.blocks.map(block),
      tools: item.tools?.map((tool) => ({
        ...tool,
        commentable: false,
        blocks: tool.blocks.map(block),
        inlineBlocks: tool.inlineBlocks?.map(block),
      })),
    })),
  );
  let selected = $state<{ id: string; opener: HTMLElement }>();
  function inspect(tool: TranscriptTool, opener: HTMLElement) {
    selected = { id: tool.id, opener };
  }
  const commentState = new TranscriptController(() => ({
    items,
    canComment: false,
    onInspectTool: inspectTools ? inspect : undefined,
  }));
  const selectedTool = $derived(
    items
      .flatMap((item) => item.tools ?? [])
      .find((tool) => tool.id === selected?.id),
  );
  $effect(() => {
    if (!inspectTools) return;
    toolInspector = inspector;
    return () => {
      toolInspector = undefined;
    };
  });
</script>

<section class="import-transcript" aria-label={label}>
  {#if showViewToolbar}<div class="import-transcript__toolbar">
      <span>Read-only snapshot</span>
      <TranscriptViewToggle bind:view />
    </div>{/if}
  <Transcript
    {items}
    scrollButton
    {commentState}
    onInspectTool={inspectTools ? inspect : undefined}
    {view}
    {composer}
    {busy}
    classicComposerPlacement={composer ? "fixed" : "inline"}
    label="Captured conversation"
    logLabel="Captured messages"
    canComment={false}
    reactionsDisabled
    authorPopover={{ interaction: "hover" }}
    {customBlock}
  />
</section>

{#snippet customBlock(b: TranscriptBlock)}
  <AiCommandReport text={b.text} />
{/snippet}

{#snippet inspector()}
  {#if inspectTools && selectedTool && selected}
    {@const selection = selected}
    {@const tool = selectedTool}
    <AiTranscriptToolInspector
      {tool}
      state={commentState}
      opener={selection.opener}
      onClose={() => (selected = undefined)}
      customBlock={undefined}
    />
  {/if}
{/snippet}

<style>
  .import-transcript {
    display: flex;
    flex-direction: column;
    min-height: 0;
    flex: 1;
  }
  .import-transcript__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid var(--border);
    font-size: 0.8125rem;
    color: var(--muted-foreground);
    flex-wrap: wrap;
  }
</style>

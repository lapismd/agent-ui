<script lang="ts">
  import {
    Transcript,
    MarkdownComposer,
    TranscriptFooter,
  } from "@lapismd/design-core/chat";
  import Original from "../../../lapis-desktop/src/components/ai/sessions/AiSessionShell.svelte";
  import Extracted from "../../packages/agent-ui/src/sessions/session-shell/AiSessionShell.svelte";
  import OriginalInspector from "../../../lapis-desktop/src/components/ai/chat/AiTranscriptToolInspector.svelte";
  import ExtractedInspector from "../../packages/agent-ui/src/chat/transcript-tool-inspector/AiTranscriptToolInspector.svelte";
  import { TranscriptController } from "@lapismd/design-core/chat";
  const params = new URLSearchParams(location.search);
  const Shell = params.get("source") === "desktop" ? Original : Extracted;
  const Inspector =
    params.get("source") === "desktop" ? OriginalInspector : ExtractedInspector;
  let inspecting = $state(false);
  let opener = $state<HTMLButtonElement>();
  let value = $state("");
  const transcriptState = new TranscriptController(() => ({ items: [] }));
  const items = [
    {
      id: "review",
      title: "Review workspace changes",
      profile: "Local chat",
      group: "Vault root",
      updatedAt: "2026-10-21T12:00:00Z",
      harness: "codex",
    },
    {
      id: "planning",
      title: "Plan the extraction",
      profile: "OpenCode",
      group: "Projects",
      updatedAt: "2026-10-20T10:00:00Z",
      harness: "opencode",
    },
  ];
  const tool = {
    id: "read",
    revision: "1",
    title: "Read src/settings.ts",
    raw: '{"captured":true}',
    blocks: [
      {
        id: "read/body",
        revision: "1",
        kind: "markdown" as const,
        label: "Captured output",
        text: "## Workspace settings\n\nThe original source output.",
      },
    ],
  };
</script>

<div class="reference-frame" data-ui-component="ai-chat-panel">
  <Shell
    {items}
    activeId="review"
    title="Review workspace changes"
    status="Codex · GPT-6 · Vault root"
    label="Conversations"
    harness="codex"
    emptyTitle="No conversations yet"
    emptyDescription="Start a conversation to save a local chat."
    onSelect={() => {}}
    initialListOpen={params.has("list")}
    showMainOnCompact
  >
    {#snippet actions()}<button
        bind:this={opener}
        type="button"
        onclick={() => (inspecting = true)}>Tool output</button
      >{/snippet}
    {#snippet listFooter()}<footer class="ai-session-list-footer">
        <span class="ai-session-status-item">2 conversations</span>
      </footer>{/snippet}
    {#snippet footer()}<footer class="ai-session-footer">
        <div class="chat-footer-controls">
          <TranscriptFooter
            state={transcriptState}
            hasContent={false}
            canSend={false}
          />
        </div>
      </footer>{/snippet}
    {#snippet toolInspector()}{#if inspecting && opener}<Inspector
          {tool}
          state={transcriptState}
          {opener}
          onClose={() => {}}
          customBlock={undefined}
        />{/if}{/snippet}
    <div class="boundary-body">
      Ask a question or attach a note to explore it together.
    </div>
  </Shell>
</div>

<style>
  .reference-frame {
    height: 100dvh;
    min-width: 0;
    min-height: 0;
  }
  .chat-footer-controls {
    width: 100%;
    min-width: 0;
    --spacing: 0.21875rem;
    --ui-transcript-footer-padding: 0;
    --ui-transcript-footer-gap: 0.25rem;
  }
  .hint {
    min-height: 1.5rem;
    padding: 0.25rem 0.5rem;
    color: var(--muted-foreground);
    font-size: 0.6875rem;
    line-height: 1rem;
  }
</style>

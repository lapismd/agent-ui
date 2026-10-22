<script lang="ts">
  import { onDestroy, untrack } from "svelte";
  import Mira from "@lapismd/mira";
  import { inlineLinksExtension } from "@lapismd/mira/extensions";
  import {
    MarkdownContent,
    spoilerExtension,
    type MessageAction,
  } from "@lapismd/design-core/chat";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import RepositoryIcon from "@lucide/svelte/icons/folder-git-2";
  import { AgentWorkbench } from "../../../packages/agent-ui/src/screens/index.js";
  import ChatMessageComposer from "../../../packages/agent-ui/src/chat/message-composer/ChatMessageComposer.svelte";
  import type { AgentTranscriptOptions } from "../../../packages/agent-ui/src/chat/transcript-options.js";
  import type { AgentPort } from "../../../packages/agent-ui/src/core/models.js";
  import { createDemo } from "../support/create-demo.svelte.js";
  import { referenceData, lapisEmoji, agentId } from "./reference-data.js";
  import ReferenceProfile from "./ReferenceProfile.svelte";
  let {
    part = "paired",
    legacy = false,
    dispatch = false,
    classic = false,
    disabledActions = false,
  }: {
    part?: "paired" | "screen";
    legacy?: boolean;
    dispatch?: boolean;
    classic?: boolean;
    disabledActions?: boolean;
  } = $props();
  const effects = $state({ opened: "", action: "", reaction: "" });
  const data = untrack(() =>
    referenceData(legacy, (reference) => {
      effects.opened = `${reference.kind}:${reference.id}`;
    }),
  );
  data.options.getPopover = (reference) =>
    reference.avatar && reference.presentation !== "emoji"
      ? profile
      : undefined;
  const demo = untrack(() =>
    createDemo("default", { canComment: () => !disabledActions }),
  );
  const { controller, port } = demo;
  controller.view = untrack(() => (classic ? "classic" : "document"));
  controller.transcript.message = data.text;
  const agentPort: AgentPort = port;
  if (untrack(() => dispatch))
    agentPort.resolveRecipients = ({ submission, selected }) => [
      ...selected,
      ...(submission.text.includes(`jj-store-agent:${agentId};`)
        ? [agentId]
        : []),
    ];
  controller.snapshot!.sessions[0].title = "Portable references and review";
  const referenceItems: import("@lapismd/design-core/chat").TranscriptItem[] = [
    {
      id: "reference-answer",
      kind: "message",
      role: "assistant",
      label: "Review summary",
      author: { id: "reviewer", name: "Reviewer", initials: "RE" },
      blocks: [
        {
          id: "reference-answer/body",
          revision: "1",
          kind: "markdown",
          label: "Review summary",
          text: data.text,
        },
      ],
    },
    {
      id: "reference-tool",
      kind: "message",
      role: "assistant",
      label: "Tool result",
      blocks: [
        {
          id: "reference-tool/body",
          revision: "1",
          kind: "custom",
          surface: "plain",
          label: "Captured tool output",
          text: "Captured result",
        },
      ],
    },
  ];
  controller.snapshot!.sessions[0].items = referenceItems;
  port.snapshot.sessions[0].title = "Portable references and review";
  port.snapshot.sessions[0].items = structuredClone(referenceItems);
  const recipients = $derived.by(() => {
    void controller.snapshot;
    void controller.pending;
    return port.calls.at(-1)?.recipients?.join(",") ?? "";
  });
  const copyActions = (id: string): MessageAction[] => [
    {
      id: "copy",
      label: "Copy message",
      onSelect: () => {
        effects.action = `copy:${id}`;
      },
    },
    {
      id: "link",
      label: "Copy message link",
      onSelect: () => {
        effects.action = `link:${id}`;
      },
    },
    {
      id: "message-id",
      label: "Copy message ID",
      onSelect: () => {
        effects.action = `message-id:${id}`;
      },
    },
    {
      id: "session-id",
      label: "Copy session ID",
      onSelect: () => {
        effects.action = `session-id:${controller.sessionId}`;
      },
    },
    {
      id: "edit",
      label: "Edit message",
      disabledReason: "Captured agent output is read-only",
      onSelect: () => {},
    },
  ];
  const options: AgentTranscriptOptions = {
    composer: {
      references: data.options,
      referenceSources: data.sources,
      extensions: [spoilerExtension, inlineLinksExtension()],
      customEmojis: [lapisEmoji],
      emojiText: (_emoji, custom) =>
        custom ? `:${custom.shortcode}:` : _emoji,
      placeholder: "Mention a person or agent, or link repository context…",
      triggers: [
        {
          character: "/",
          menuLabel: "Commands",
          searchSource: (query, signal) =>
            signal.aborted
              ? []
              : [
                  {
                    id: "summary",
                    label: "Summarize",
                    description: "App · Insert a summary request",
                  },
                  {
                    id: "review",
                    label: "Review",
                    description: "Current agent · Insert a review request",
                  },
                  {
                    id: "skill",
                    label: "Component review",
                    description: "Skills · Insert a review instruction",
                  },
                ].filter((item) =>
                  item.label.toLowerCase().includes(query.toLowerCase()),
                ),
          onSelect: (item) => `/${item.id} `,
        },
      ],
    },
    markdown: {
      references: data.options,
      extensions: [spoilerExtension, inlineLinksExtension()],
    },
    customEmojis: [lapisEmoji],
    reactionOptions: ["👍", "👀", "✅"],
    reactionsDisabled: untrack(() => disabledActions),
    onReact: (id, emoji) => {
      effects.reaction = `${id}:${emoji}`;
    },
    getMessageActions: (id) =>
      disabledActions
        ? copyActions(id).map((action) => ({ ...action, disabled: true }))
        : copyActions(id),
    blocks: {
      "reference-tool/body": {
        kind: "tool",
        name: "repository.diff",
        input: '{"path":"src/chat.ts"}',
        output: '{"status":"captured","files":4}',
        view: undefined,
      },
    },
  };
  onDestroy(() => void demo.close());
</script>

{#snippet profile(reference: import("@lapismd/design-core/chat").ChatReference)}
  <ReferenceProfile {reference} />
{/snippet}

{#snippet headerActions()}<Button
    variant="ghost"
    size="icon-sm"
    aria-label="Open linked repository"
    title="Open linked repository"
    onclick={() => {
      effects.opened = "repository:desktop";
    }}><RepositoryIcon aria-hidden="true" /></Button
  >{/snippet}

<div class:screen={part === "screen"} class:paired={part === "paired"}>
  {#if part === "screen"}<AgentWorkbench
      {controller}
      transcriptOptions={options}
      extraActions={headerActions}
    />
  {:else}
    <section class="editor-reference" aria-label="Reference composer">
      <ChatMessageComposer
        {...options.composer}
        bind:value={controller.transcript.message}
        view={controller.view}
        onSend={() => void controller.transcript.send()}
      />
    </section>
    <section aria-label="Reference preview">
      <MarkdownContent
        {...options.markdown}
        content={controller.transcript.message}
        fullWidth
      />
    </section>
    <section class="editor-reference" aria-label="Plain Mira reference">
      <h2>Plain Mira live editor</h2>
      <Mira
        value={controller.transcript.message}
        onChange={(value) => {
          controller.transcript.message = value;
        }}
        mode="live-preview"
        toolbar={false}
      />
    </section>
  {/if}
  <output class="sr-only" data-testid="reference-source"
    >{controller.transcript.message}</output
  >
  <output class="sr-only" data-testid="reference-comments"
    >{controller.transcript.pending
      .map(({ comment }) => comment.text)
      .join("\n")}</output
  >
  <output class="sr-only" data-testid="reference-opened"
    >{effects.opened}</output
  >
  <output class="sr-only" data-testid="reference-action"
    >{effects.action}</output
  >
  <output class="sr-only" data-testid="reference-reaction"
    >{effects.reaction}</output
  >
  <output class="sr-only" data-testid="reference-recipients"
    >{recipients}</output
  >
</div>

<style>
  .paired {
    height: var(--ui-agent-story-height, 100dvh);
    max-height: var(--ui-agent-story-height, none);
    overflow: auto;
    display: grid;
    gap: 1.5rem;
    padding: 1.5rem;
    max-width: 64rem;
    margin: auto;
  }
  .paired section {
    min-width: 0;
    padding: 1rem;
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }
  .paired .editor-reference {
    padding: 0;
    border: 0;
  }
  .screen {
    height: var(--ui-agent-story-height, 100dvh);
    min-height: 0;
  }
</style>

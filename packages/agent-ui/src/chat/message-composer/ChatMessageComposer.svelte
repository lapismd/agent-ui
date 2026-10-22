<!-- SPDX-License-Identifier: Apache-2.0; shared production message input. -->
<script lang="ts">
  import type { Snippet, ComponentProps } from "svelte";
  import {
    MarkdownComposer,
    MessageMetadata,
    createChatReferenceExtension,
    chatReferenceTriggers,
    type MarkdownComposerHandle,
  } from "@lapismd/design-core/chat";
  import { Avatar } from "@lapismd/design-core/shadcn/avatar";
  import type { AgentRecipientOption } from "../presentation.js";
  let {
    value = $bindable(""),
    documentActions = $bindable(),
    view,
    disabled = false,
    framedDrawer = false,
    showHint = true,
    triggers = [],
    agentOptions = [],
    people = [],
    extensions = [],
    references,
    referenceSources = [],
    customEmojis = [],
    emojis,
    emojiText,
    placeholder = "Ask about your notes…",
    additionalActions,
    handle = $bindable(null),
    status,
    statusPosition = "bottom",
    sendError,
    before,
    drawer,
    onSend,
  }: {
    value?: string;
    documentActions?: Snippet;
    view: "document" | "classic";
    disabled?: boolean;
    framedDrawer?: boolean;
    showHint?: boolean;
    triggers?: ComponentProps<typeof MarkdownComposer>["triggers"];
    agentOptions?: readonly AgentRecipientOption[];
    people?: readonly import("../presentation.js").ComposerPersonOption[];
    extensions?: ComponentProps<typeof MarkdownComposer>["extensions"];
    references?: import("@lapismd/design-core/chat").ChatReferenceOptions;
    referenceSources?: readonly import("@lapismd/design-core/chat").ChatReferenceSource[];
    customEmojis?: ComponentProps<typeof MarkdownComposer>["customEmojis"];
    emojis?: ComponentProps<typeof MarkdownComposer>["emojis"];
    emojiText?: ComponentProps<typeof MarkdownComposer>["emojiText"];
    placeholder?: string;
    additionalActions?: ComponentProps<
      typeof MarkdownComposer
    >["additionalActions"];
    handle?: MarkdownComposerHandle | null;
    status?: ComponentProps<typeof MarkdownComposer>["status"];
    statusPosition?: "top" | "bottom";
    /** Refused send for this exact retained draft; unknown outcomes use recovery feedback. */
    sendError?: string;
    before?: Snippet;
    drawer?: Snippet;
    onSend(): void;
  } = $props();
  const referenceExtension = $derived(
    references ? createChatReferenceExtension(references) : undefined,
  );
  const suggestions = $derived([
    ...(references ? chatReferenceTriggers(referenceSources, references) : []),
    ...triggers,
    ...(!references && (people.length || agentOptions.length)
      ? [
          {
            character: "@",
            menuLabel: "People and agents",
            searchSource: (query: string, signal: AbortSignal) =>
              signal.aborted
                ? []
                : [
                    ...people.map((person) => ({
                      id: person.id,
                      label: person.label,
                      value: person.value,
                    })),
                    ...agentOptions.map((agent) => ({
                      id: agent.id,
                      label: agent.label,
                      value: `@${agent.label}`,
                    })),
                  ].filter((person) =>
                    person.label.toLowerCase().includes(query.toLowerCase()),
                  ),
            onSelect: (item: { id: string; label: string }) =>
              `${people.find((person) => person.id === item.id)?.value ?? `@${item.label}`} `,
          },
        ]
      : []),
  ]);
</script>

<div class="transcript-composer">
  {@render before?.()}
  <MarkdownComposer
    bind:handle
    {...framedDrawer ? { drawer } : {}}
    interactiveDrawerWhenDisabled
    bind:value
    bind:documentActions
    presentation={view === "document" ? "document" : "framed"}
    dockActions={view === "document"}
    showSendButton={false}
    {showHint}
    submitOnEnter={false}
    label="Message composer"
    inputLabel="Message"
    {placeholder}
    {disabled}
    {status}
    {statusPosition}
    triggers={suggestions}
    extensions={[
      ...(referenceExtension ? [referenceExtension] : []),
      ...extensions,
    ]}
    {customEmojis}
    {emojis}
    {emojiText}
    {additionalActions}
    onSubmit={() => {
      if (!disabled) onSend();
    }}
  >
    {#snippet avatar()}<Avatar
        name="You"
        initials="YO"
        size="sm"
        decorative
      />{/snippet}
  </MarkdownComposer>
  {#if view === "document" && sendError}<div class="draft-metadata">
      <MessageMetadata
        sender="assistant"
        status="error"
        statusLabel={sendError}
        role="group"
        aria-label="Draft metadata"
      />
    </div>{/if}
</div>

<style>
  .transcript-composer {
    --ui-markdown-composer-min-height: var(
      --ui-agent-composer-min-height,
      calc(2 * 1.4rem + 1rem)
    );
    --ui-markdown-composer-document-min-height: var(
      --ui-agent-composer-document-min-height,
      calc(2 * 0.875rem * 1.65)
    );
    display: grid;
    gap: 0.5rem;
    min-width: 0;
  }
  .draft-metadata {
    padding-inline-start: 2rem;
    min-width: 0;
  }
</style>

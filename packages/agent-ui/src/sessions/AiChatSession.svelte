<!-- SPDX-License-Identifier: Apache-2.0; extracted from Lapis Desktop AiChatSession. -->
<script lang="ts">
  import type { Snippet } from "svelte";
  import {
    AvatarGroup,
    type AvatarIdentity,
  } from "@lapismd/design-core/shadcn/avatar";
  import { AuthorCard } from "@lapismd/design-core/shadcn/author-card";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import MessagesIcon from "@lucide/svelte/icons/messages-square";
  import DriveIcon from "@lucide/svelte/icons/hard-drive";
  import PlusIcon from "@lucide/svelte/icons/plus";
  import AiSessionShell from "./AiSessionShell.svelte";
  import TranscriptViewToggle from "./TranscriptViewToggle.svelte";
  import type { SessionItem } from "./model.js";
  let {
    items,
    activeId,
    title,
    status,
    harness,
    avatars,
    busy = false,
    loading = false,
    view = $bindable<"document" | "classic">("document"),
    onViewChange,
    onSelect,
    onCreate,
    children,
    footer: composerFooter,
    toolInspector,
    headerActions,
    bodySidebar,
    bodySidebarOpen,
    mainInspector,
    menu,
  }: {
    items: SessionItem[];
    activeId?: string;
    title: string;
    status?: string;
    harness?: string;
    avatars: AvatarIdentity[];
    busy?: boolean;
    loading?: boolean;
    view?: "document" | "classic";
    onViewChange?(next: "document" | "classic"): void;
    onSelect(id: string): void;
    onCreate(): void;
    children: Snippet;
    footer: Snippet;
    toolInspector?: Snippet;
    headerActions?: Snippet;
    bodySidebar?: Snippet<[number, boolean]>;
    bodySidebarOpen?: boolean;
    mainInspector?: Snippet;
    menu?: Snippet;
  } = $props();
</script>

<AiSessionShell
  {items}
  {activeId}
  {title}
  {status}
  label="Conversations"
  {busy}
  {loading}
  emptyTitle="No conversations yet"
  emptyDescription="Start a conversation to save a local chat."
  {onSelect}
  {harness}
  showMainOnCompact
  initialListOpen={false}
  {toolInspector}
  {bodySidebar}
  {bodySidebarOpen}
  {mainInspector}
>
  {#snippet identity()}
    <AvatarGroup items={avatars} label="Chat agents" size="sm" max={4}>
      {#snippet avatar(person, size)}<AuthorCard
          author={person}
          trigger="avatar"
          interaction="hover"
          {size}
          role="Agent"
          label={`About ${person.name}`}
        />{/snippet}
    </AvatarGroup>
  {/snippet}
  {#snippet listActions()}<Button
      variant="ghost"
      size="icon-sm"
      aria-label="New conversation"
      disabled={loading || busy}
      onclick={onCreate}><PlusIcon aria-hidden="true" /></Button
    >{/snippet}
  {#snippet actions()}<TranscriptViewToggle
      bind:view
      onChange={onViewChange}
    />{@render headerActions?.()}{@render menu?.()}{/snippet}
  {#snippet listFooter()}<footer class="ai-session-list-footer">
      <div class="ai-session-status-items">
        <span class="ai-session-status-item"
          ><MessagesIcon aria-hidden="true" />{items.length} conversations</span
        >
        <span class="ai-session-status-item ai-session-status-item--end"
          ><DriveIcon aria-hidden="true" />Local</span
        >
      </div>
    </footer>{/snippet}
  {#snippet footer()}<footer class="ai-session-footer">
      <div class="chat-footer-controls">{@render composerFooter()}</div>
    </footer>{/snippet}
  {@render children()}
</AiSessionShell>

<style>
  .chat-footer-controls {
    width: 100%;
    min-width: 0;
    --spacing: 0.21875rem;
    --ui-transcript-footer-padding: 0;
    --ui-transcript-footer-gap: 0.25rem;
  }
</style>

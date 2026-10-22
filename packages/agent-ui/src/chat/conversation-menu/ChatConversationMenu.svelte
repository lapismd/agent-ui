<!-- SPDX-License-Identifier: Apache-2.0; Lapis Desktop ChatConversationMenu trigger; host supplies menu actions. -->
<script lang="ts">
  import type { Snippet } from "svelte";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import * as DropdownMenu from "@lapismd/design-core/shadcn/dropdown-menu";
  import MoreVerticalIcon from "@lucide/svelte/icons/ellipsis-vertical";
  import type {
    AiChatPanelProps,
    AiChatController,
    ChatPanelActions,
    ComposerState,
  } from "../presentation.js";
  let {
    children,
  }: {
    children?: Snippet;
    panelProps?: AiChatPanelProps;
    controller?: AiChatController;
    actions?: ChatPanelActions;
    composerState?: ComposerState;
  } = $props();
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props }: { props: Record<string, unknown> })}
      <Button
        {...props}
        size="icon-sm"
        variant="ghost"
        aria-label="Conversation actions"
        data-testid="ai-chat-conversation-menu"
      >
        <MoreVerticalIcon aria-hidden="true" />
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content data-ai-part="conversation-menu" align="end">
    {@render children?.()}
  </DropdownMenu.Content>
</DropdownMenu.Root>

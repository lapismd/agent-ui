<script lang="ts">
  import SearchXIcon from "@lucide/svelte/icons/search-x";
  import * as Empty from "@lapismd/design-core/shadcn/empty";
  import type { ChatPanelActions } from "../presentation.js";
  // SPDX-License-Identifier: Apache-2.0
  // Retained Lapis chat presentation; see src/lib/ai/NOTICE.md.
  import { Button } from "@lapismd/design-core/shadcn/button";
  import * as CommandView from "@lapismd/design-core/shadcn/command-view";
  import * as Popover from "@lapismd/design-core/shadcn/popover";
  import FolderIcon from "@lucide/svelte/icons/folder";
  import { formatDirectoryContextLabel } from "../presentation.js";
  import type { ConversationsState } from "../presentation.js";
  import type { AiChatController } from "../presentation.js";
  import type { AiChatPanelProps } from "../presentation.js";

  let {
    panelProps,
    controller,
    actions,
    conversationsState,
    inline = false,
  }: {
    inline?: boolean;
    panelProps: AiChatPanelProps;
    controller: AiChatController;
    actions: ChatPanelActions;
    conversationsState: ConversationsState;
  } = $props();
  const initializing = $derived(panelProps.initializing ?? false);
  const repository = $derived(panelProps.repository);
</script>

<div class="ai-chat-panel__scope-path" data-inline={inline || undefined}>
  <Popover.Root
    bind:open={conversationsState.scopePickerOpen}
    onOpenChange={conversationsState.onScopePickerOpenChange}
  >
    <Popover.Trigger>
      {#snippet child({ props }: { props: Record<string, unknown> })}
        <Button
          {...props}
          class="ai-chat-panel__scope-button"
          size="sm"
          variant="ghost"
          data-testid="ai-chat-scope-path"
          aria-label={`Change chat folder: ${conversationsState.scopePathLabel}`}
          disabled={initializing || controller.busy || !repository}
        >
          <FolderIcon data-icon="inline-start" aria-hidden="true" />
          <span>{conversationsState.scopePathLabel}</span>
        </Button>
      {/snippet}
    </Popover.Trigger>
    <Popover.Content
      data-ai-part="scope-picker-popover"
      side="top"
      align="center"
      sideOffset={8}
    >
      <CommandView.Root>
        <CommandView.Input placeholder="Search chat folders" />
        <CommandView.List aria-label="Chat folders">
          <CommandView.Empty
            ><Empty.Root
              ><Empty.Header
                ><Empty.Media variant="icon"
                  ><SearchXIcon aria-hidden="true" /></Empty.Media
                ><Empty.Title>No folders</Empty.Title><Empty.Description
                  >Try another search or selection.</Empty.Description
                ></Empty.Header
              ></Empty.Root
            ></CommandView.Empty
          >
          <CommandView.Group>
            {#each conversationsState.scopeFolders as folder (folder || "vault-root")}
              <CommandView.Item
                value={`${formatDirectoryContextLabel(folder)} ${folder}`}
                onSelect={() =>
                  void actions.perform(() =>
                    conversationsState.changeConversationScope(folder),
                  )}
              >
                <CommandView.ItemIcon>
                  <FolderIcon aria-hidden="true" />
                </CommandView.ItemIcon>
                <CommandView.ItemLabel>
                  {formatDirectoryContextLabel(folder)}
                </CommandView.ItemLabel>
              </CommandView.Item>
            {/each}
          </CommandView.Group>
        </CommandView.List>
      </CommandView.Root>
    </Popover.Content>
  </Popover.Root>
</div>

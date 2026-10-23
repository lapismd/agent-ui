<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store StoreStackWorkspaceDiff header actions. -->
<script lang="ts">
  import { Button } from "@lapismd/design-core/shadcn/button";
  import * as Tooltip from "@lapismd/design-core/shadcn/tooltip";
  import Trash from "@lucide/svelte/icons/trash-2";
  import Columns from "@lucide/svelte/icons/columns-2";
  import {
    workspaceFileSelection,
    workspaceHunkSelection,
  } from "../../../stacks/files.js";
  import { TARGET_HISTORY_ORIGIN } from "../../../stacks/target-history.svelte.js";
  import type {
    StackWorkspaceController,
    WorkspaceOpenDiff,
    WorkspaceCommand,
  } from "../../../stacks/index.js";
  import type { RepositoryStackHost } from "../stack-lane/types.js";
  let {
    controller,
    diff,
    host,
  }: {
    controller: StackWorkspaceController;
    diff: WorkspaceOpenDiff;
    host: RepositoryStackHost;
  } = $props();
  const selection = $derived.by(() => {
    const snapshot = controller.snapshot;
    if (!snapshot || diff.origin === TARGET_HISTORY_ORIGIN) return null;
    const file = controller
      .filesFor(diff.source)
      .find((file) => file.path === diff.path);
    const source = file?.selectionSource ?? diff.source;
    const selected = workspaceFileSelection(snapshot, source, diff.path);
    if (!selected) return null;
    if (!diff.hunks) return selected;
    if (
      !diff.hunks.length ||
      diff.hunks.some(
        (hunk) => !workspaceHunkSelection(snapshot, source, diff.path, hunk),
      )
    )
      return null;
    return { ...selected, hunks: diff.hunks };
  });
  function request(command: WorkspaceCommand) {
    if (controller.snapshot && controller.can(command.kind))
      host.onCommand?.(command, controller.snapshot);
  }
</script>

{#if selection}
  <Tooltip.Provider>
    {#if selection.source === "unassigned" && controller.snapshot?.capabilities.includes("discard")}<Tooltip.Root
        ><Tooltip.Trigger
          >{#snippet child({ props })}<Button
              {...props}
              variant="ghost"
              size="icon-sm"
              aria-label="Discard selected changes"
              disabled={!host.onCommand || !controller.can("discard")}
              onclick={() =>
                selection &&
                request({ kind: "discard", selections: [selection] })}
              ><Trash aria-hidden="true" /></Button
            >{/snippet}</Tooltip.Trigger
        ><Tooltip.Content>Discard selected changes</Tooltip.Content
        ></Tooltip.Root
      >
    {:else if selection.source !== "unassigned"}<Tooltip.Root
        ><Tooltip.Trigger
          >{#snippet child({ props })}<Button
              {...props}
              variant="ghost"
              size="icon-sm"
              aria-label="Split selected changes"
              disabled={!host.onCommand || !controller.can("split")}
              onclick={() =>
                selection &&
                request({
                  kind: "split",
                  commit: selection.source,
                  message: "",
                  selection,
                })}><Columns aria-hidden="true" /></Button
            >{/snippet}</Tooltip.Trigger
        ><Tooltip.Content>Split selected changes</Tooltip.Content></Tooltip.Root
      >{/if}
  </Tooltip.Provider>
{/if}

<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store StoreStackWorkspaceActions. -->
<script lang="ts">
  import * as Menu from "@lapismd/design-core/shadcn/dropdown-menu";
  import * as Tooltip from "@lapismd/design-core/shadcn/tooltip";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import Settings from "@lucide/svelte/icons/settings";
  import Plus from "@lucide/svelte/icons/plus";
  import Trash from "@lucide/svelte/icons/trash-2";
  import Ellipsis from "@lucide/svelte/icons/ellipsis-vertical";
  import GitBranchPlus from "@lucide/svelte/icons/git-branch-plus";
  import Redo from "@lucide/svelte/icons/redo-2";
  import Undo from "@lucide/svelte/icons/undo-2";
  import Refresh from "@lucide/svelte/icons/refresh-cw";
  import type {
    StackWorkspaceController,
    WorkspaceCommand,
  } from "../../../stacks/index.js";
  import type { RepositoryStackHost } from "../../workspace/stack-lane/types.js";
  let {
    controller,
    host,
  }: { controller: StackWorkspaceController; host: RepositoryStackHost } =
    $props();
  const snapshot = $derived(controller.snapshot);
  function command(value: WorkspaceCommand) {
    if (snapshot && controller.can(value.kind))
      host.onCommand?.(value, snapshot);
  }
  const controls = $derived([
    {
      label: "Create stack",
      icon: GitBranchPlus,
      disabled: !host.onCommand || !controller.can("create_stack"),
      run: () => command({ kind: "create_stack", name: "" }),
    },
    {
      label: "Undo",
      icon: Undo,
      disabled:
        !host.onCommand || !controller.can("undo") || !snapshot?.canUndo,
      run: () => command({ kind: "undo" }),
    },
    ...(snapshot?.capabilities.includes("redo")
      ? [
          {
            label: "Redo",
            icon: Redo,
            disabled:
              !host.onCommand || !controller.can("redo") || !snapshot.canRedo,
            run: () => command({ kind: "redo" }),
          },
        ]
      : []),
    {
      label: "Refresh workspace",
      icon: Refresh,
      disabled: controller.locked,
      run: () => void controller.refresh(),
    },
  ]);
</script>

<div
  role="group"
  aria-label="Stack workspace controls"
  class="workspace-controls"
>
  {#if snapshot}<Menu.Root
      ><Menu.Trigger
        >{#snippet child({ props })}<Button
            {...props}
            variant="ghost"
            size="icon-sm"
            aria-label="Workspace actions"
            disabled={controller.locked || snapshot.availability !== "ready"}
            ><Ellipsis aria-hidden="true" /></Button
          >{/snippet}</Menu.Trigger
      ><Menu.Content align="end" style="min-width:14rem;white-space:nowrap"
        ><Menu.Group>
          {@render host.menuItems?.(controller)}
          <Menu.Item
            disabled={!host.onWorkspaceSettings || !snapshot.active}
            onSelect={() => host.onWorkspaceSettings?.(snapshot)}
            ><Settings aria-hidden="true" />Workspace settings</Menu.Item
          >
          {#if snapshot.membershipChanged}<Menu.Item
              disabled={!host.onCommand ||
                !controller.can("reconcile_workspace")}
              onSelect={() => command({ kind: "reconcile_workspace" })}
              ><Refresh aria-hidden="true" />Reapply saved branches</Menu.Item
            >{/if}
          <Menu.Item
            disabled={!host.onCommand || !controller.can("create_workspace")}
            onSelect={() => command({ kind: "create_workspace", name: "" })}
            ><Plus aria-hidden="true" />Create workspace</Menu.Item
          >
          {#each snapshot.workspaces.filter((item) => item.id !== snapshot.active) as item (item.id)}<Menu.Item
              disabled={!host.onCommand || !controller.can("delete_workspace")}
              onSelect={() =>
                command({ kind: "delete_workspace", workspace: item.id })}
              ><Trash aria-hidden="true" />Delete {item.name}</Menu.Item
            >{/each}
        </Menu.Group><Menu.Group>
          {#each controls.slice(1) as control (control.label)}<Menu.Item
              disabled={control.disabled}
              onSelect={control.run}
            >
              <control.icon aria-hidden="true" />{control.label}
            </Menu.Item>{/each}
        </Menu.Group></Menu.Content
      ></Menu.Root
    >{/if}
  <Tooltip.Provider
    >{#each controls.slice(0, 1) as control (control.label)}<Tooltip.Root
        ><Tooltip.Trigger
          >{#snippet child({ props })}<Button
              {...props}
              variant="ghost"
              size="icon-sm"
              aria-label={control.label}
              disabled={control.disabled}
              onclick={control.run}><control.icon aria-hidden="true" /></Button
            >{/snippet}</Tooltip.Trigger
        ><Tooltip.Content>{control.label}</Tooltip.Content></Tooltip.Root
      >{/each}</Tooltip.Provider
  >
</div>

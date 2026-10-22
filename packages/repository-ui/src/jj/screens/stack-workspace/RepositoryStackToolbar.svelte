<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store StoreStacksNavigation and picker. -->
<script lang="ts">
  import { AppShell } from "@lapismd/design-core/shell";
  import * as Tabs from "@lapismd/design-core/shadcn/tabs";
  import * as Select from "@lapismd/design-core/shadcn/select";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import Refresh from "@lucide/svelte/icons/refresh-cw";
  import type { StackWorkspaceController } from "../../../stacks/index.js";
  import type { RepositoryStackHost } from "../../workspace/stack-lane/types.js";
  let {
    controller,
    host,
    onSelectView,
  }: {
    controller: StackWorkspaceController;
    host: RepositoryStackHost;
    onSelectView?: (view: "branches" | "workspace") => void;
  } = $props();
  const workspace = $derived(
    controller.snapshot?.workspaces.find(
      (item) => item.id === controller.snapshot?.active,
    ),
  );
</script>

<AppShell.Toolbar aria-label="Stack workspace navigation">
  <Tabs.Root
    value={controller.page}
    onValueChange={(value) => {
      if (value !== "branches" && value !== "workspace") return;
      if (onSelectView) onSelectView(value);
      else controller.page = value;
    }}
    ><Tabs.List aria-label="Stack workspace views"
      ><Tabs.Trigger value="branches" disabled={controller.locked}
        >Stacks</Tabs.Trigger
      ><Tabs.Trigger value="workspace" disabled={controller.locked}
        >Workspace</Tabs.Trigger
      ></Tabs.List
    ></Tabs.Root
  >
  <div class="workspace-controls">
    {#if controller.snapshot}<Select.Root
        type="single"
        value={workspace?.id ?? ""}
        disabled={controller.locked || !host.onSelectWorkspace}
        onValueChange={(id) => {
          const choice = controller.snapshot?.workspaces.find(
            (item) => item.id === id,
          );
          if (choice) host.onSelectWorkspace?.(choice);
        }}
        ><Select.Trigger aria-label="Active stack workspace"
          >{workspace?.name ?? "No workspace"}</Select.Trigger
        ><Select.Content
          ><Select.Group
            >{#each controller.snapshot.workspaces as item (item.id)}<Select.Item
                value={item.id}
                label={item.name}
                disabled={Boolean(item.unavailableReason)}
                >{item.name}</Select.Item
              >{/each}</Select.Group
          ></Select.Content
        ></Select.Root
      >{/if}
    {@render host.headerActions?.(controller)}
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Refresh workspace"
      title="Refresh workspace"
      disabled={controller.locked}
      onclick={() => void controller.refresh()}
      ><Refresh aria-hidden="true" /></Button
    >
  </div>
</AppShell.Toolbar>

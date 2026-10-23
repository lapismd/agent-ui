<!-- SPDX-License-Identifier: Apache-2.0; adapted from JJ Store StoreStacksNavigation and picker. -->
<script lang="ts">
  import { AppShell } from "@lapismd/design-core/shell";
  import * as Tabs from "@lapismd/design-core/shadcn/tabs";
  import WorkspacePicker from "../../history/workspace-picker/RepositoryWorkspacePicker.svelte";
  import "./stack-navigation.css";
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

<AppShell.Toolbar
  label="Stack workspace navigation"
  class="workspace-navigation"
>
  <Tabs.Root
    class="workspace-view-tabs"
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
    {#if controller.snapshot}<WorkspacePicker
        label="Active stack workspace"
        variant="ghost"
        includeOverview={false}
        selected={workspace?.id ?? null}
        entries={controller.snapshot.workspaces.map((item) => ({
          id: item.id,
          name: item.name,
          description:
            item.unavailableReason ?? `${item.applied.length} applied stacks`,
          disabled: Boolean(item.unavailableReason),
        }))}
        disabled={controller.locked || !host.onSelectWorkspace}
        onSelect={(id) => {
          const choice = controller.snapshot?.workspaces.find(
            (item) => item.id === id,
          );
          if (choice && !choice.unavailableReason)
            host.onSelectWorkspace?.(choice);
        }}
      />{/if}
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

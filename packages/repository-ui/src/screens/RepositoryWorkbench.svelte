<script lang="ts">
  import Status from "../jj/workspace/source-files/RepositoryWorkspaceStatus.svelte";
  import RepositorySkeleton from "../jj/foundations/skeleton/RepositorySkeleton.svelte";
  import { onDestroy, type Snippet } from "svelte";
  import { AppShell, AppShellController } from "@lapismd/design-core/shell";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import type { RepositoryController } from "../core/controller.svelte.js";
  import type { RepositoryView } from "../core/models.js";
  import type { StackWorkspaceController } from "../stacks/controller.svelte.js";
  import RepositoryFiles from "./RepositoryFiles.svelte";
  import RepositoryHistory from "./RepositoryHistory.svelte";
  import RepositoryBlame from "./RepositoryBlame.svelte";
  import RepositoryConflicts from "./RepositoryConflicts.svelte";
  import RepositorySettings from "./RepositorySettings.svelte";
  import ForgeScreen from "./ForgeScreen.svelte";
  import StackWorkspaceScreen from "./StackWorkspaceScreen.svelte";
  import RepositoryActionDialog from "./RepositoryActionDialog.svelte";
  import "../styles.css";
  let {
    controller,
    workspace,
    extraActions,
  }: {
    controller: RepositoryController;
    workspace?: StackWorkspaceController;
    extraActions?: Snippet;
  } = $props();
  const shell = new AppShellController({ leftWidth: 210 });
  onDestroy(() => void shell.dispose());
  const views: { id: RepositoryView; label: string }[] = [
    { id: "files", label: "Files" },
    { id: "history", label: "Commits" },
    { id: "operations", label: "Op Log" },
    { id: "evolution", label: "Evolution" },
    { id: "blame", label: "Blame" },
    { id: "conflicts", label: "Conflicts" },
    { id: "branches", label: "Branches" },
    { id: "workspace", label: "Workspace" },
    { id: "forge", label: "Pull requests" },
    { id: "settings", label: "Repository settings" },
  ];
</script>

<div data-ui-component="repository-workbench">
  <AppShell.Root controller={shell}>
    <AppShell.Sidebar side="left"
      ><AppShell.Sidebar.Header
        ><strong>{controller.snapshot?.name ?? "Repository"}</strong
        ></AppShell.Sidebar.Header
      ><AppShell.Sidebar.Body
        ><nav class="rui-nav" aria-label="Repository screens">
          {#each views as view}<Button
              variant={controller.view === view.id ? "secondary" : "ghost"}
              aria-current={controller.view === view.id ? "page" : undefined}
              onclick={() => controller.navigate(view.id)}>{view.label}</Button
            >{/each}
        </nav></AppShell.Sidebar.Body
      ><AppShell.Sidebar.Footer
        ><span class="rui-muted"
          >{controller.snapshot?.pin.repository ?? "No repository"}</span
        ></AppShell.Sidebar.Footer
      ></AppShell.Sidebar
    >
    <AppShell.Main
      ><AppShell.Toolbar
        ><AppShell.Sidebar.Toggle side="left" /><strong
          >{views.find((v) => v.id === controller.view)?.label}</strong
        ><span class="rui-muted">{controller.snapshot?.pin.operation}</span
        ><Button
          size="sm"
          variant="ghost"
          disabled={controller.loading}
          onclick={() => void controller.refresh()}>Refresh</Button
        >{@render extraActions?.()}</AppShell.Toolbar
      ><AppShell.Body>
        {#if controller.loading && !controller.snapshot}<RepositorySkeleton
            label="Loading repository"
          />
        {:else if controller.snapshot?.unavailable}<Status
            unavailable
            title="Repository unavailable"
            description={controller.snapshot.unavailable}
            onRetry={() => void controller.refresh()}
          />
        {:else if !controller.snapshot}<Status
            title="No repository selected"
            description="Select an admitted repository to browse its captured contents."
          />
        {:else if (controller.view === "workspace" || controller.view === "branches") && workspace}<StackWorkspaceScreen
            controller={workspace}
            page={controller.view}
          />
        {:else if controller.view === "history" || controller.view === "operations" || controller.view === "evolution"}<RepositoryHistory
            {controller}
          />
        {:else if controller.view === "blame"}<RepositoryBlame {controller} />
        {:else if controller.view === "conflicts"}<RepositoryConflicts
            {controller}
          />
        {:else if controller.view === "forge"}<ForgeScreen {controller} />
        {:else if controller.view === "settings"}<RepositorySettings
            {controller}
          />
        {:else}<RepositoryFiles {controller} />{/if}
      </AppShell.Body>
      <div class="rui-status" role="status">
        {controller.notice ||
          "Operation-pinned repository view"}{#if controller.pending}<Button
            size="sm"
            disabled={controller.busy}
            onclick={() => void controller.checkStatus()}
            >Check request status</Button
          >{/if}
      </div></AppShell.Main
    >
  </AppShell.Root>
  {#if controller.error}<div role="alert" class="rui-notice">
      <strong>Action needs attention</strong>
      <p>{controller.error}</p>
      <Button size="sm" onclick={() => (controller.error = "")}>Dismiss</Button>
    </div>{/if}
  <RepositoryActionDialog {controller} />
</div>

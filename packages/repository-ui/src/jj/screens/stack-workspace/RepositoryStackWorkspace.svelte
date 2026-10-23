<!-- SPDX-License-Identifier: Apache-2.0; copied/adapted from JJ Store StoreStackWorkspace. -->
<script lang="ts">
  import RepositoryShell from "../../foundations/shell/RepositoryShell.svelte";
  import RepositorySkeleton from "../../foundations/skeleton/RepositorySkeleton.svelte";
  import Status from "../../workspace/source-files/RepositoryWorkspaceStatus.svelte";
  import Canvas from "./RepositoryStackCanvas.svelte";
  import Toolbar from "./RepositoryStackToolbar.svelte";
  import {
    appliedStacks,
    selectedWorkspace,
  } from "../../../stacks/presentation.js";
  import type { StackWorkspaceController } from "../../../stacks/index.js";
  import type { RepositoryStackHost } from "../../workspace/stack-lane/types.js";
  import "./stack-workspace.css";
  let {
    controller,
    now,
    onSelectView,
    showViewTabs = true,
    ...host
  }: {
    controller: StackWorkspaceController;
    now?: number;
    /** Outer repository navigation can own the Stacks/Workspace selection. */
    showViewTabs?: boolean;
    onSelectView?: (view: "branches" | "workspace") => void;
  } & RepositoryStackHost = $props();
  const snapshot = $derived(controller.snapshot);
  const workspace = $derived(
    snapshot ? selectedWorkspace(snapshot) : undefined,
  );
</script>

<RepositoryShell>
  <section
    class="repository-stack-workspace"
    data-page={controller.page}
    aria-label="Stack workspace"
    aria-busy={controller.loading}
  >
    <Toolbar {controller} {host} {onSelectView} {showViewTabs} />
    {#if controller.validation}<Status
        unavailable
        title="Branch unavailable"
        description={controller.validation}
      />{/if}
    {#if controller.loading && !controller.snapshotLoaded}<RepositorySkeleton
        kind="log"
        label="Loading workspace"
      />
    {:else if controller.error}<Status
        unavailable
        title="Workspace unavailable"
        description={controller.error}
        onRetry={() => void controller.refresh()}
      />
    {:else if !snapshot}<Status
        title="No workspace"
        description="Choose a host-provided repository workspace to start reviewing its stacks."
      />
    {:else if snapshot.availability !== "ready" || !snapshot.folder || !workspace}<Status
        unavailable
        title="Workspace unavailable"
        description={workspace?.unavailableReason ??
          snapshot.workspaceWarning ??
          "The selected local workspace is not available."}
        onRetry={() => void controller.refresh()}
      />
    {:else if controller.page === "workspace" && snapshot.topology?.complete === false}<Status
        unavailable
        title="Stack topology unavailable"
        description="Complete the recorded stack topology before displaying applied lanes."
        onRetry={() => void controller.refresh()}
      />
    {:else}<Canvas {controller} {host} {now} />{/if}
    {#if snapshot}<footer class="workspace-footer">
        <span>{workspace?.name ?? "No workspace"}</span><span
          >{snapshot.target?.name ?? "No target"}</span
        ><span>{appliedStacks(snapshot).length} applied stacks</span
        >{#if !controller.details.lazy || controller.details.fileState("unassigned").loaded}<span
            >{controller.filesFor("unassigned")
              .length}{controller.details.fileState("unassigned").nextCursor
              ? "+"
              : ""} unstaged files</span
          >{:else}<span>Unstaged files not loaded</span
          >{/if}{#if snapshot.operation}<code title={snapshot.operation}
            >{snapshot.operation.slice(0, 12)}</code
          >{/if}
      </footer>{/if}
  </section>
</RepositoryShell>

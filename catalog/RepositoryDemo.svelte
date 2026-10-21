<script lang="ts">
  import { onDestroy, untrack } from "svelte";
  import { RepositoryWorkbench } from "../packages/repository-ui/src/screens/index.js";
  import { RepositoryController } from "../packages/repository-ui/src/core/index.js";
  import { StackWorkspaceController } from "../packages/repository-ui/src/stacks/index.js";
  import type { RepositoryView } from "../packages/repository-ui/src/core/models.js";
  import { MemoryRepositoryPort } from "./support/repository-adapter.js";
  import { MockStackWorkspaceAdapter } from "./support/stacks/adapter.js";
  let {
    view = "files",
    fault = "none",
    empty = false,
  }: {
    view?: RepositoryView;
    fault?: "none" | "unknown" | "failed";
    empty?: boolean;
  } = $props();
  const port = new MemoryRepositoryPort();
  port.fault = untrack(() => fault);
  if (untrack(() => empty)) {
    port.snapshot.files = [];
    port.snapshot.revisions = [];
    port.snapshot.operations = [];
    port.snapshot.conflicts = [];
    port.snapshot.pullRequests = [];
  }
  const controller = new RepositoryController(
    port,
    structuredClone(port.snapshot),
  );
  controller.view = untrack(() => view);
  const workspacePort = new MockStackWorkspaceAdapter(
    undefined,
    untrack(() => fault),
  );
  const workspace = new StackWorkspaceController(workspacePort, {
    initial: workspacePort.snapshot,
  });
  onDestroy(() => {
    void controller.close();
    workspace.close();
  });
</script>

<RepositoryWorkbench {controller} {workspace} />

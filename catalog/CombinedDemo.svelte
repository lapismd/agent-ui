<script lang="ts">
  import { onDestroy } from "svelte";
  import { Button } from "@lapismd/design-core/shadcn/button";
  import { AgentWorkbench } from "../packages/agent-ui/src/screens/index.js";
  import { AgentUiController } from "../packages/agent-ui/src/core/index.js";
  import {
    RepositoryWorkbench,
    RepositoryFiles,
  } from "../packages/repository-ui/src/screens/index.js";
  import { RepositoryController } from "../packages/repository-ui/src/core/index.js";
  import { StackWorkspaceController } from "../packages/repository-ui/src/stacks/index.js";
  import { MemoryAgentPort } from "./support/agent-adapter.js";
  import { MemoryRepositoryPort } from "./support/repository-adapter.js";
  import { MockStackWorkspaceAdapter } from "./support/stacks/adapter.js";
  let repository = $state(false);
  const agents = new MemoryAgentPort();
  const files = new MemoryRepositoryPort();
  const stacks = new MockStackWorkspaceAdapter();
  const agent = new AgentUiController(agents, agents.snapshot);
  const repo = new RepositoryController(files, files.snapshot);
  const workspace = new StackWorkspaceController(stacks, {
    initial: stacks.snapshot,
  });
  onDestroy(() => {
    void agent.close();
    void repo.close();
    workspace.close();
  });
</script>

{#if repository}<RepositoryWorkbench controller={repo} {workspace}
    >{#snippet extraActions()}<Button
        size="sm"
        variant="outline"
        onclick={() => (repository = false)}>Back to agent</Button
      >{/snippet}</RepositoryWorkbench
  >{:else}<AgentWorkbench controller={agent}
    >{#snippet extraActions()}<Button
        size="sm"
        variant="outline"
        onclick={() => (repository = true)}>Open repository</Button
      >{/snippet}{#snippet repositoryInspector()}<RepositoryFiles
        controller={repo}
      />{/snippet}</AgentWorkbench
  >{/if}

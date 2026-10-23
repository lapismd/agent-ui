export const Basic = `<script lang="ts">
  import { untrack, onDestroy } from "svelte";
  import { AgentsScreen, AgentDirectoryController, type AgentDirectoryPort } from "@lapismd/agent-ui/screens";
  let { port }: { port: AgentDirectoryPort } = $props();
  const controller = untrack(() => new AgentDirectoryController(port, console.error));
  void controller.open();
  onDestroy(() => { void controller.close(); });
</script>
<AgentsScreen {controller} onError={console.error} />`;
export const Styling = `<script lang="ts">
  import { AgentsScreen, type AgentDirectoryController } from "@lapismd/agent-ui/screens";
  let { controller }: { controller: AgentDirectoryController } = $props();
</script>
<div style="--ui-agent-directory-font-size: 0.8125rem">
  <AgentsScreen {controller} onError={console.error} />
</div>`;

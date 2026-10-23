export const Basic = `<script lang="ts">
  import { onDestroy, untrack, type Snippet } from "svelte";
  import { ThreadsScreen, ThreadsController, type ThreadsPort, type ThreadIdentity } from "@lapismd/agent-ui/screens";
  import { AgentChatScreen } from "@lapismd/agent-ui/chat";
  import type { AgentUiController } from "@lapismd/agent-ui/core";
  let { port, selected, onSelect, chat }: {port:ThreadsPort; selected?:ThreadIdentity; onSelect(value:ThreadIdentity):void; chat(identity:ThreadIdentity):AgentUiController} = $props();
  const controller = untrack(() => new ThreadsController(port, console.error));
  void controller.open();
  onDestroy(() => { void controller.close(); });
</script>
<ThreadsScreen {controller} {selected} {onSelect} conversation={conversation} />
{#snippet conversation(identity:ThreadIdentity, navigation:Snippet)}
  <AgentChatScreen controller={chat(identity)} headerActions={navigation} />
{/snippet}`;
export const Styling = `<script lang="ts">
  import { ThreadsScreen, type ThreadsController } from "@lapismd/agent-ui/screens";
  let { controller }: {controller:ThreadsController} = $props();
</script>
<div style="--ui-agent-threads-font-size:0.875rem">
  <ThreadsScreen {controller} onSelect={() => {}} />
</div>`;

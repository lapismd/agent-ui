<script lang="ts">
  import { onDestroy, untrack } from "svelte";
  import AgentChatScreen from "../chat-screen/AgentChatScreen.svelte";
  import { createDemo } from "../../../../../catalog/agents/support/create-demo.svelte.js";
  let {
    classic = false,
    recipients = false,
  }: { classic?: boolean; recipients?: boolean } = $props();
  const demo = untrack(() => createDemo(recipients ? "all" : "message-status"));
  demo.controller.view = untrack(() => (classic ? "classic" : "document"));
  onDestroy(() => void demo.close());
</script>

<div class="metadata-host">
  <AgentChatScreen
    controller={demo.controller}
    transcriptOptions={demo.options}
  />
</div>

<style>
  .metadata-host {
    height: var(--ui-agent-story-height, 100dvh);
    min-width: 0;
    min-height: 0;
  }
</style>

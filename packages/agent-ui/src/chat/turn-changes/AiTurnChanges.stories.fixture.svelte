<script lang="ts">
  import { onDestroy, onMount, untrack } from "svelte";
  import { memoryChanges } from "../../../../../catalog/agents/support/changes.svelte.js";
  import { createDemo } from "../../../../../catalog/agents/support/create-demo.svelte.js";
  import AgentChatScreen from "../chat-screen/AgentChatScreen.svelte";
  let {
    state = "ready",
    file = false,
    undo = false,
  }: {
    state?: Parameters<typeof memoryChanges>[0];
    file?: boolean;
    undo?: boolean;
  } = $props();
  const demo = untrack(() => createDemo()),
    changes = untrack(() => memoryChanges(state));
  onMount(() => {
    if (file)
      void changes.inspection.show(
        changes.inspection.history.records[0],
        "notes/review.md",
      );
    if (undo)
      changes.inspection.undo = {
        request_id: "preview-1",
        conversation: "demo-session",
        turn: "review-turn",
        checkpoint: "captured-checkpoint",
        paths: ["notes/review.md"],
      };
  });
  onDestroy(() => {
    changes.inspection.dispose();
    void demo.close();
  });
</script>

<div class="changes-host">
  <AgentChatScreen
    controller={demo.controller}
    transcriptOptions={{ ...demo.options, changes: changes.inspection }}
  />
</div>
<output
  hidden
  data-testid="changes-effects"
  data-calls={JSON.stringify(changes.calls)}
></output>

<style>
  .changes-host {
    height: var(--ui-agent-story-height, 100dvh);
    min-width: 0;
    min-height: 0;
  }
</style>

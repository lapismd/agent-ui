<script lang="ts">
  import ChatMessageComposer from "./ChatMessageComposer.svelte";
  let { view = "document" }: { view?: "document" | "classic" } = $props();
  let value = $state("Retain this exact draft.");
</script>

<div style="padding:1rem;max-width:48rem">
  <ChatMessageComposer
    bind:value
    {view}
    status={{ type: "warning", message: "Context window is 90% full." }}
    onSend={() => {}}
  />
</div>

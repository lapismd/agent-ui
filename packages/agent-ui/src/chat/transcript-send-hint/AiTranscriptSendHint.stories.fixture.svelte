<script lang="ts">
  import ChatMessageComposer from "../message-composer/ChatMessageComposer.svelte";
  import Hint from "./AiTranscriptSendHint.svelte";
  let { error = false }: { error?: boolean } = $props();
  let value = $state("Retain this exact draft.");
</script>

<div style="padding:1rem;max-width:48rem">
  {#if error}<ChatMessageComposer
      bind:value
      view="document"
      status={{
        type: "error",
        message: "The host refused this request. Your draft is retained.",
      }}
      onSend={() => {}}
    />{/if}
  <Hint />
</div>

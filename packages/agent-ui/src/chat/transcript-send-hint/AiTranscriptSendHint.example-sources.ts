export const Basic = `<script lang="ts">
  import { AgentSendHint } from "@lapismd/agent-ui/chat";
</script>
<AgentSendHint />`;
export const Styling = `<script lang="ts">
  import { AgentSendHint } from "@lapismd/agent-ui/chat";
</script>
<div style="--ui-agent-send-hint-size:0.75rem"><AgentSendHint /></div>`;

export const WithFeedback = `<script lang="ts">
  import { AgentSendHint, ChatMessageComposer } from "@lapismd/agent-ui/chat";
  let value = $state("Retain this exact draft.");
</script>
<ChatMessageComposer bind:value view="document" status={{ type:"error", message:"The host refused this request." }} onSend={() => {}} />
<AgentSendHint />`;

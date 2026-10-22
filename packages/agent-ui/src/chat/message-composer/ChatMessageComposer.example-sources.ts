export const Basic =
  '<script lang="ts">\n  import { ChatMessageComposer } from "@lapismd/agent-ui/chat";\n  let value = $state("");\n  let { send }: { send: (text: string) => void } = $props();\n</script>\n<ChatMessageComposer bind:value view="document" onSend={() => send(value)} />';
export const Styling =
  '<script lang="ts">\n  import { ChatMessageComposer } from "@lapismd/agent-ui/chat";\n  let value = $state("");\n  let { send }: { send: (text: string) => void } = $props();\n</script>\n<div style="--ui-agent-composer-min-height: 8rem;">\n<ChatMessageComposer bind:value view="document" onSend={() => send(value)} /></div>';

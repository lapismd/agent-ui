export const Basic =
  '<script lang="ts">\n  import { AgentToolResult } from "@lapismd/agent-ui/chat";\n</script>\n<AgentToolResult result={{name:"vault.read",input:\'{"path":"notes/review.md"}\',output:\'{"text":"Captured note"}\',detail:{kind:"file-read",path:"notes/review.md",content:"# Captured note",language:"markdown"}}} />';
export const Styling =
  '<script lang="ts">\n  import { AgentToolResult } from "@lapismd/agent-ui/chat";\n</script>\n<div style="--ui-agent-tool-result-font-size:1rem">\n\n<AgentToolResult result={{name:"vault.read",input:\'{"path":"notes/review.md"}\',output:\'{"text":"Captured note"}\',detail:{kind:"file-read",path:"notes/review.md",content:"# Captured note",language:"markdown"}}} />\n</div>';

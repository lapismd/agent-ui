export const Basic =
  '<script lang="ts">\n  import { AgentInventoryResult } from "@lapismd/agent-ui/chat";\n</script>\n<AgentInventoryResult output={{kind:"skills",items:[{kind:"skill",name:"Component review",description:"Review admitted source.",path:"Skills/review.md"}]}} onOpenPath={async path => { /* Ask the host to open this admitted path. */ }} />';
export const Styling =
  '<script lang="ts">\n  import { AgentInventoryResult } from "@lapismd/agent-ui/chat";\n</script>\n<div style="--ui-agent-inventory-gap:1rem">\n\n<AgentInventoryResult output={{kind:"skills",items:[{kind:"skill",name:"Component review",description:"Review admitted source.",path:"Skills/review.md"}]}} onOpenPath={async path => { /* Ask the host to open this admitted path. */ }} />\n</div>';

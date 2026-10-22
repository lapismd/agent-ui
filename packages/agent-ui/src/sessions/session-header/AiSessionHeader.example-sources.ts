export const Basic =
  '<script lang="ts">\n  import { AgentSessionHeader } from "@lapismd/agent-ui/sessions";\n  let expanded = $state(false);\n</script>\n<AgentSessionHeader title="Review workspace changes" status="Codex \u00b7 GPT-6 \u00b7 Vault root" selected harness="codex" listLabel="Conversations" {expanded} onToggle={() => expanded = !expanded} />';
export const Styling =
  '<script lang="ts">\n  import { AgentSessionHeader } from "@lapismd/agent-ui/sessions";\n  let expanded = $state(false);\n</script>\n<div style="--ui-agent-session-header-height: 4rem;">\n<AgentSessionHeader title="Review workspace changes" status="Codex \u00b7 GPT-6 \u00b7 Vault root" selected harness="codex" listLabel="Conversations" {expanded} onToggle={() => expanded = !expanded} /></div>';

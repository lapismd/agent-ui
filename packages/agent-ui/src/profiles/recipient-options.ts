import type { AgentProfile } from "../core/models.js";
import { normalizeAcpAgent } from "./acp-agents.js";
import { agentAvatar } from "../identity/agent-avatar.js";
/** Project host profiles without granting recipient or runtime authority. */
export function recipientOptions(agents: readonly AgentProfile[]) {
  return agents.map((agent) => ({
    id: agent.id,
    label: agent.name,
    agent: normalizeAcpAgent(agent.provider.toLowerCase()),
    model: agent.model,
    description: agent.description,
    avatar: agentAvatar(agent.provider),
    ...agent.profile,
  }));
}

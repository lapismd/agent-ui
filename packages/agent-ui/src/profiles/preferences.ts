import type { ApprovalPolicy } from "../chat/presentation.js";
import type { AcpAgentId } from "./acp-agents.js";
import type { AgentRecipientOption } from "./recipients.js";
/** Host-owned preferences used by the inline chat profile editor. */
export type ChatProfilePreferences = {
  approvalPolicy: ApprovalPolicy;
  automaticallyMentionAgents?: boolean;
  agentParticipants?: AgentRecipientOption[];
  defaultRuntime: "auto" | "acp" | "codex-native" | "opencode-native" | "fake";
  acpAgent: AcpAgentId;
};

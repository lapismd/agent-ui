import type { AcpAgentId } from "./acp-agents.js";

/** Saved attribution, never a native execution or provider-session capability. */
export type SavedAgentRecipient = { id: string; token: string; label: string };
/** Host-owned person-reference text; mentions do not grant execution or delivery. */
export type ComposerPersonOption = {
  id: string;
  label: string;
  value: string;
  avatar?: string;
  avatarBackground?: string;
};
/** Application-owned setup catalog; routing stays separate from the saved tag. */
export type AgentRecipientOption = {
  providerProfileId?: string;
  approvalPolicy?: import("../chat/presentation.js").ApprovalPolicy;
  id: string;
  label: string;
  agent: AcpAgentId;
  model?: string;
  description?: string;
  instructions?: string;
  executionMode?: string;
  thinking?: import("./models.js").AiThinkingLevel;
  avatar?: string;
  avatarBackground?: string;
};

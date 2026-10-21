import type { ChatProfilePreferences } from "./preferences.js";
import type { AcpAgentId } from "./acp-agents.js";
import type { ModelRef } from "./models.js";
import type {
  AgentRecipientOption,
  ComposerPersonOption,
} from "./recipients.js";
import type { AiProviders } from "./providers.svelte.js";
import type { ExecutionMode } from "./agent-profile.js";
/** Host services are explicit. Reading or mounting these screens cannot start an agent. */
export type AgentProfileEditorContext = {
  agentProviders?(profileId?: string): AiProviders;
  mentionPeople?: readonly ComposerPersonOption[];
  settings?: Partial<ChatProfilePreferences>;
  initializing?: boolean;
  models?: ModelRef[];
  loadExecutionModes?(
    agent: AcpAgentId,
    runtime: ChatProfilePreferences["defaultRuntime"],
    profileId?: string,
  ): Promise<ExecutionMode[]>;
  loadModels?(
    agent: AcpAgentId,
    runtime: ChatProfilePreferences["defaultRuntime"],
    profileId?: string,
  ): Promise<ModelRef[]>;
  onSettingsChange?(
    patch: Partial<ChatProfilePreferences>,
  ): void | Promise<void>;
  onError?(error?: Error): void;
  validateParticipants(value: unknown): AgentRecipientOption[];
  settingsNavigation?: {
    sections: { id: string }[];
    open(target: { sectionId: string; fieldId: string }): void;
  };
};

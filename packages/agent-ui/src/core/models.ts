import type {
  TranscriptItem,
  TranscriptSubmission,
  TranscriptQueuedMessage,
} from "@lapismd/design-core/chat";
export type AgentScreen =
  "chat" | "history" | "catalog" | "imports" | "recorded";
export type AgentProfile = {
  id: string;
  name: string;
  model: string;
  provider: string;
  description: string;
  enabled: boolean;
  profile?: import("../profiles/recipients.js").AgentRecipientOption;
};
export type AgentSession = {
  id: string;
  title: string;
  agent: string;
  updatedAt: string;
  status: "active" | "archived";
  items: TranscriptItem[];
  scope?: string;
  preview?: string;
};
export type AgentRequest = {
  id: string;
  session?: string;
  kind: "approval" | "question";
  title: string;
  details: string;
  options: {
    id: string;
    label: string;
    kind?: import("../chat/requests.js").ApprovalOptionKind;
  }[];
  approval?: import("../chat/requests.js").ApprovalRequest;
  question?: import("../chat/requests.js").UserInputRequest;
};
export type AgentCatalogEntry = {
  id: string;
  kind: "tool" | "skill" | "command";
  name: string;
  description: string;
  enabled: boolean;
};
export type AgentImport = {
  id: string;
  title: string;
  source: string;
  items: TranscriptItem[];
  progress: number;
  status: "ready" | "loading" | "saved";
};
export type AgentSnapshot = {
  sessions: AgentSession[];
  agents: AgentProfile[];
  catalog: AgentCatalogEntry[];
  catalogGroups?: import("../catalog/types.js").CatalogGroup[];
  imports: AgentImport[];
  requests: AgentRequest[];
  /** Captured, read-only request results keyed by exact transcript block ID. */
  requestResults?: Record<
    string,
    import("../chat/request-state.js").AgentRequestResult
  >;
  queued: TranscriptQueuedMessage[];
  busy: boolean;
  capabilities: string[];
  chat?: {
    scope: string;
    scopes: string[];
    files: { id: string; label: string }[];
    usage?: { used: number; limit: number };
    approvalPolicy?: "ask" | "allow-all";
    automaticallyMentionAgents?: boolean;
  };
};
export type AgentAction = {
  id: string;
  kind: string;
  session?: string;
  target?: string;
  values?: Record<string, string | boolean>;
  submission?: TranscriptSubmission;
  attachments?: string[];
  recipients?: string[];
  agentParticipants?: import("../profiles/recipients.js").AgentRecipientOption[];
};
export type AgentOutcome =
  | { status: "acknowledged"; snapshot: AgentSnapshot }
  | { status: "unknown" }
  | { status: "refused"; reason: string };
export interface AgentControllerOptions {
  /** Host admission for inline comments; evaluated without changing retained drafts. */
  canComment?(): boolean;
}
export interface AgentPort {
  /** Explicit host opt-in: derive recipients from the exact authored snapshot. */
  resolveRecipients?(input: {
    session: string;
    submission: TranscriptSubmission;
    selected: readonly string[];
  }): readonly string[];
  read(signal: AbortSignal): Promise<AgentSnapshot>;
  act(action: AgentAction): Promise<AgentOutcome>;
  status(id: string): Promise<AgentOutcome>;
  subscribe?(listener: (snapshot: AgentSnapshot) => void): () => void;
  report?(error: Error): void;
  close?(): void | Promise<void>;
}

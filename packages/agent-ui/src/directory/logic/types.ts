/** Installation-owned configuration. Never a native session or execution capability. */
export type ConfiguredAgent = {
  id: string;
  version: string;
  name: string;
  client: string;
  model: string;
  description: string;
  instructions: string;
  avatar?: string;
};
export type AgentDirectoryScope = {
  home?: string;
  agent?: string;
  query?: string;
};
export type AgentSessionIdentity = { id: string; home: string };
export type DirectorySession = AgentSessionIdentity & {
  title: string;
  agentName: string;
  agent?: string;
  state: string;
  /** Absent when the host has no recorded timestamp; never synthesize one. */
  updatedAt?: number;
};
export type DirectoryCapture = Omit<DirectorySession, "state"> & {
  snapshot: string;
  transcripts: number;
  tools: number;
};
export type AgentDirectoryCapability =
  "save-agent" | "delete-agent" | "stop-session";
export type AgentDirectoryPage = {
  snapshot: string;
  agents: ConfiguredAgent[];
  clients: { id: string; label: string; available: boolean }[];
  sessions: DirectorySession[];
  captures: DirectoryCapture[];
  capabilities: AgentDirectoryCapability[];
  next?: string;
  unavailable?: { home: string; name: string; reason: string }[];
};
export type AgentDirectoryCommand =
  | { kind: "save-agent"; agent: ConfiguredAgent }
  | { kind: "delete-agent"; agent: string; version: string }
  | { kind: "stop-session"; home: string; session: string };
export type AgentDirectoryRequest = {
  id: string;
  command: AgentDirectoryCommand;
};
export type AgentDirectoryOutcome =
  | { state: "committed" }
  | { state: "rejected"; message: string }
  | { state: "unknown" };
/** Hosts persist exact requests before side effects. resolve inspects, never replays. */
export interface AgentDirectoryPort {
  read(
    query: AgentDirectoryScope & { cursor?: string; limit: number },
    signal: AbortSignal,
  ): Promise<AgentDirectoryPage>;
  execute(request: AgentDirectoryRequest): Promise<AgentDirectoryOutcome>;
  resolve(request: AgentDirectoryRequest): Promise<AgentDirectoryOutcome>;
  pending?(): Promise<AgentDirectoryRequest[]>;
  draft(
    key: string,
    value?: ConfiguredAgent | null,
  ): Promise<ConfiguredAgent | null>;
  subscribe?(changed: () => void): () => void;
}
export type AgentDirectoryState = {
  scope: AgentDirectoryScope;
  page?: AgentDirectoryPage;
  loading: boolean;
  error?: string;
  writing: boolean;
  pending: AgentDirectoryRequest[];
};

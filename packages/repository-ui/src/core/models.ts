export type RepositoryView =
  | "files"
  | "history"
  | "operations"
  | "evolution"
  | "blame"
  | "conflicts"
  | "branches"
  | "workspace"
  | "forge"
  | "settings";
export type RepositoryPin = {
  repository: string;
  operation: string;
  revision: string;
};
export type RepositoryFile = {
  path: string;
  kind: "file" | "directory";
  text?: string;
  previous?: string;
  language?: string;
  additions?: number;
  deletions?: number;
  unavailable?: string;
};
export type RepositoryRevision = {
  id: string;
  changeId: string;
  parents: string[];
  description: string;
  author: string;
  timestamp: string;
  bookmarks: string[];
  immutable?: boolean;
  conflicted?: boolean;
  predecessors?: string[];
};
export type RepositoryOperation = {
  id: string;
  parents: string[];
  description: string;
  actor: string;
  timestamp: string;
  snapshot: boolean;
};
export type RepositoryBlameRange = {
  from: number;
  to: number;
  commit: string;
  author: string;
  description: string;
};
export type RepositoryConflict = {
  path: string;
  left: string;
  base: string;
  right: string;
  unavailable?: string;
};
export type ForgeCheck = {
  id: string;
  name: string;
  state: "success" | "failed" | "running" | "skipped";
  log: string;
};
export type ForgePullRequest = {
  id: string;
  number: number;
  title: string;
  body: string;
  branch: string;
  state: string;
  draft: boolean;
  url: string;
  checks: ForgeCheck[];
};
export type RepositorySetting = {
  id: string;
  section: string;
  label: string;
  description: string;
  value: string | boolean;
  options?: string[];
  readonly?: boolean;
};
export type RepositorySnapshot = {
  pin: RepositoryPin;
  name: string;
  files: RepositoryFile[];
  revisions: RepositoryRevision[];
  operations: RepositoryOperation[];
  blame: RepositoryBlameRange[];
  conflicts: RepositoryConflict[];
  pullRequests: ForgePullRequest[];
  settings: RepositorySetting[];
  capabilities: string[];
  nextCursor?: string;
  unavailable?: string;
};
export type RepositoryQuery = {
  pin?: RepositoryPin;
  path?: string;
  cursor?: string;
  query?: string;
  signal: AbortSignal;
};
export type RepositoryAction = {
  id: string;
  pin: RepositoryPin;
  kind: string;
  target?: string;
  values?: Record<string, string | boolean>;
};
export type RepositoryOutcome =
  | { status: "committed"; snapshot: RepositorySnapshot }
  | { status: "unknown" }
  | { status: "refused"; reason: string };
export interface RepositoryPort {
  read(query: RepositoryQuery): Promise<RepositorySnapshot>;
  act(request: RepositoryAction): Promise<RepositoryOutcome>;
  status(id: string): Promise<RepositoryOutcome>;
  copy?(text: string): Promise<void>;
  report?(error: Error): void;
  close?(): void | Promise<void>;
}

import type { WorkspaceCommand } from "./commands.js";
import type {
  FileChangeDetails,
  CommitGraph,
  WorkspaceTopology,
  Bookmark,
} from "./models.js";
/** Frontend-only boundary. An adapter owns repository execution and durability. */
export type WorkspaceHunk = { id: string; label: string; patch: string };
export type WorkspaceFile = {
  path: string;
  /** Complete host-supplied file counts; omitted values remain unknown. */
  additions?: number;
  deletions?: number;
  conflicted?: boolean;
  /** A net comparison resolved to one exact mutable native commit delta. */
  selectionSource?: string;
  /** Complete bounded display patch; never selection authority. */
  patch?: string;
  hunks: WorkspaceHunk[];
  /** Real reads distinguish an unloaded patch from an empty text diff. */
  content?:
    | { status: "unloaded" | "ready" }
    | {
        status: "unavailable";
        reason: string;
      };
  /** Preserve modes, ordered conflict terms and rename/copy provenance. */
  change?: FileChangeDetails;
};
export type StackCommit = {
  id: string;
  changeId: string;
  message: string;
  author: string;
  createdAt: number;
  email: string;
  immutable: boolean;
  immutableReason?: string;
  /** Provider graph metadata; absence is reserved for the linear mock. */
  graph?: CommitGraph & {
    edges: { target: string; kind: "direct" | "indirect" | "missing" }[];
  };
  files: WorkspaceFile[];
};
export type StackHead = {
  name: string;
  commit: string;
  aliases?: string[];
  /** Native topology boundary; null means ambiguous, undefined means legacy provider. */
  baseCommit?: string | null;
  shared?: boolean;
};
export type WorkspaceTargetBranch = StackHead &
  Pick<StackCommit, "message" | "author" | "email" | "createdAt">;
export type WorkspaceHistoryRequest = {
  readKey?: string;
  repository: string;
  revision: number;
  branch: string;
  head: string;
  limit: number;
  cursor?: string;
};
export type WorkspaceHistoryPage = {
  /** Newest first, pinned to the requested branch head. */
  commits: StackCommit[];
  nextCursor?: string;
  total?: number;
};
export type WorkspaceStackHistoryRequest = WorkspaceHistoryRequest & {
  readKey?: string;
  stack: string;
  base: string;
};
export type WorkspaceStack = {
  id: string;
  name: string;
  base: string;
  heads: StackHead[];
  /** Oldest to newest, as in the Changeyard stack model. */
  commits: StackCommit[];
  conflicts: boolean;
  /** Operation-owned lane metadata; inventory and saved membership stay separate. */
  appliedBranches?: string[];
  unapplyBranches?: string[];
  topologyHeads?: StackHead[];
  /** Explicit provider segments; their displayed rows are newest first. */
  segments?: {
    head: StackHead;
    /** Null until the remaining bounded history proves the lower boundary. */
    baseCommit: string | null;
    unloaded?: boolean;
    commits: StackCommit[];
    nextCursor?: string;
  }[];
};
export type NamedWorkspace = {
  id: string;
  name: string;
  applied: string[];
  unassigned: WorkspaceFile[];
  mergeCommit?: string;
  wipCommit?: string;
  unavailableReason?: string;
};
export type WorkspaceConflict = {
  path: string;
  terms?: (string | null)[];
  reason?: string;
  left: string;
  base: string;
  right: string;
};
export type WorkspaceSnapshot = {
  repository: string;
  operation?: string;
  topology?: WorkspaceTopology;
  /** Physical folder on this device; null means no local checkout link. */
  folder: string | null;
  profile: "native" | "git_sha1_jj045";
  availability: "ready" | "unlinked" | "unavailable";
  revision: number;
  /** Opaque read scope; numeric revision remains a UI counter. */
  readKey?: string;
  base: string | null;
  active: string | null;
  target: WorkspaceTargetBranch | null;
  /** Exact, unambiguous heads available within this read scope. */
  targetOptions?: WorkspaceTargetBranch[];
  loadedTargetHistory?: WorkspaceHistoryPage;
  /** Provider reference metadata retains conflicted/deleted choices for browsing. */
  bookmarks?: Bookmark[];
  branchesNextCursor?: string;
  branchUnavailableReasons?: Record<string, string>;
  workspaces: NamedWorkspace[];
  stacks: WorkspaceStack[];
  conflicts: WorkspaceConflict[];
  capabilities: WorkspaceCommand["kind"][];
  capabilityReasons?: Partial<Record<WorkspaceCommand["kind"], string>>;
  canUndo: boolean;
  canRedo?: boolean;
  membershipChanged?: boolean;
  workspaceWarning?: string;
};
/** Stateful catalog execution fixtures always begin with explicit setup. */
export type ConfiguredWorkspaceSnapshot = WorkspaceSnapshot & {
  base: string;
  active: string;
  target: WorkspaceTargetBranch;
};
export type WorkspaceSelection = {
  /** A commit identity, or the active combination's unassigned edits. */
  source: string | "unassigned";
  path: string;
  /** Omitted means the complete file. */
  hunks?: string[];
};
/** One independent file view per originating canvas column. */
export type WorkspaceOpenDiff = WorkspaceSelection & { origin: string };

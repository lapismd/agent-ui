/** Display-only graph facts. Hosts retain authoritative topology and source guards. */
export type Bookmark = {
  name: string;
  remote?: string | null;
  added?: boolean;
  removed?: boolean;
  conflicted?: boolean;
  targets?: string[];
};
export type CommitGraph = {
  parents: string[];
  bookmarks: Bookmark[];
  workspaces: string[];
  conflicted: boolean;
  divergent: boolean;
};
export type FileChangeDetails = {
  before?: unknown;
  after?: unknown;
  sources?: unknown;
};
export type WorkspaceTopology = {
  complete: boolean;
  lanes: {
    heads: { names: string[]; commit: string; base?: string | null }[];
    base?: string | null;
  }[];
  inventory?: { heads: { names: string[]; commit: string }[] }[];
};
export type WorkingTreeObservation = {
  operation: string;
  files: readonly { path: string; status: string }[];
  available?: boolean;
  reason?: string;
  [fact: string]: unknown;
};
export type RepositoryLogRevision = {
  eventId: string;
  changeId: string;
  commitId: string;
  parents: string[];
  message: string;
  reason: string;
  createdAt: number;
  root: string;
  author: string;
  authorEmail: string;
  empty: boolean;
  bookmarks: Bookmark[];
  workspaces: string[];
  conflicted: boolean;
  divergent: boolean;
};

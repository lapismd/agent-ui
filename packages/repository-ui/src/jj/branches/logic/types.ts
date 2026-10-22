import type { HistoryState } from "../../logic/history-state.js";
/** Captured bookmark metadata. Local and remote names remain distinct. */
export interface RepositoryBookmark {
  name: string;
  remote?: string;
  targets: readonly string[];
  default?: boolean;
  workspace?: boolean;
  partiallyApplied?: boolean;
  searchTerms?: readonly string[];
  description?: string;
  author?: string;
  authorEmail?: string;
  updatedAt?: number;
}
export interface RepositoryWorkingCopy {
  workspace: string;
  commitId: string;
  changeId: string;
  message: string;
  createdAt: number;
  author: string;
  authorEmail?: string;
}
export type RepositoryBranchSelection =
  | { kind: "bookmark"; name: string; remote?: string }
  | { kind: "workspace"; workspace: string };
export interface RepositoryBranchesPin {
  repository: string;
  operation: string;
}
export interface RepositoryBranchesRequest extends RepositoryBranchesPin {
  after: string | null;
  limit: number;
}
export interface RepositoryBranchesPage extends RepositoryBranchesPin {
  bookmarks: readonly RepositoryBookmark[];
  workingCopies: readonly RepositoryWorkingCopy[];
  next: string | null;
}
/** Read captured references only; the host owns transport and admission. */
export interface RepositoryBranchesPort {
  read(
    request: RepositoryBranchesRequest,
    signal: AbortSignal,
  ): Promise<RepositoryBranchesPage>;
}
export interface RepositoryBranchesState {
  pin?: RepositoryBranchesPin;
  phase: "idle" | "loading" | "ready" | "unavailable";
  loadingMore: boolean;
  bookmarks: readonly RepositoryBookmark[];
  workingCopies: readonly RepositoryWorkingCopy[];
  selected?: RepositoryBranchSelection;
  targets: readonly string[];
  next: string | null;
  limitReached: boolean;
  history: HistoryState;
}
export const bookmarkKey = (
  item: Pick<RepositoryBookmark, "name" | "remote">,
) => JSON.stringify([item.name, item.remote ?? null]);
export const bookmarkLabel = (
  item: Pick<RepositoryBookmark, "name" | "remote">,
) => (item.remote ? `${item.name}@${item.remote}` : item.name);
/** Exact immutable IDs only; never interpolate a mutable bookmark name. */
export function branchRevset(targets: readonly string[]): string {
  if (!targets.every((id) => /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/u.test(id)))
    throw new Error("Invalid captured branch target");
  return targets.length
    ? targets.map((id) => `ancestors(${id})`).join(" | ")
    : "none()";
}

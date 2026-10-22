import {
  initialOperationFiles,
  type OperationFilesState,
} from "./operation-files.js";
import type {
  LocalGraphCommit,
  LocalCodeSnapshot,
  LocalCodeObjectKey,
  LocalGraphOperationNode,
  LocalOperationDiffData,
  LocalConflictDescriptor,
} from "@lapismd/jj-history";
export interface OperationState {
  phase: "idle" | "loading" | "ready" | "unavailable";
  busy: boolean;
  workspace: string | null;
  workspaceCommits: LocalGraphCommit[];
  commits: LocalGraphCommit[];
  heads: string[];
  headsReady: boolean;
  operation?: string;
  snapshot?: LocalCodeSnapshot;
  nodes: LocalGraphOperationNode[];
  ready: boolean;
  query: string;
  limitReached: boolean;
  displayLimit: number;
  next?: LocalCodeObjectKey | null;
  selected?: LocalGraphOperationNode;
  parentNodes: LocalGraphOperationNode[];
  parent?: string;
  detail?: LocalOperationDiffData;
  files: OperationFilesState;
  conflicts: LocalConflictDescriptor[];
  conflictsReady: boolean;
}
export const initialOperationState = (): OperationState => ({
  files: initialOperationFiles(),
  conflicts: [],
  conflictsReady: false,
  phase: "idle",
  busy: false,
  workspace: null,
  workspaceCommits: [],
  commits: [],
  heads: [],
  headsReady: false,
  nodes: [],
  ready: false,
  query: "",
  limitReached: false,
  displayLimit: 200,
  operation: undefined,
  snapshot: undefined,
  next: undefined,
  selected: undefined,
  parentNodes: [],
  parent: undefined,
  detail: undefined,
});

export const resetOperationSelection = () => ({
  conflicts: [] as LocalConflictDescriptor[],
  conflictsReady: false,
  selected: undefined,
  parent: undefined,
  detail: undefined,
  parentNodes: [],
});

export function operationFilesPatch(
  state: OperationState,
  files: OperationFilesState,
): Partial<OperationState> {
  return {
    files,
    ...(state.files.group?.change !== files.group?.change ||
    state.files.to !== files.to
      ? { conflicts: [], conflictsReady: false }
      : {}),
  };
}

export const resetOperationQuery = (
  query: string,
): Partial<OperationState> => ({
  ...resetOperationSelection(),
  query: query.trim(),
  nodes: [],
  ready: false,
  next: null,
  limitReached: false,
});

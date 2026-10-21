export type * from "./model.js";
export type * from "./commands.js";
import type { WorkingTreeObservation } from "./models.js";
import type {
  WorkspaceSnapshot,
  WorkspaceTargetBranch,
  StackHead,
  WorkspaceConflict,
  WorkspaceFile,
  WorkspaceHistoryRequest,
  WorkspaceHistoryPage,
  WorkspaceStackHistoryRequest,
} from "./model.js";
import type {
  WorkspaceCommand,
  WorkspaceRequest,
  WorkspacePreview,
  WorkspaceOutcome,
  WorkspaceSourceRequest,
  WorkspaceFilePage,
} from "./commands.js";
export interface StackWorkspaceAdapter {
  /** Ordinary JJ commands must not be retried after an unknown response. */
  readonly retryPending?: boolean;
  /** Current checkout evidence; never the historical read pin or complete Unstaged. */
  observeWorkingTree?(signal?: AbortSignal): Promise<WorkingTreeObservation>;
  close?(): void;
  read(): Promise<WorkspaceSnapshot>;
  readBranches?(request: {
    repository: string;
    revision: number;
    readKey?: string;
    cursor: string;
    signal?: AbortSignal;
  }): Promise<WorkspaceSnapshot>;
  chooseTarget?(request: {
    repository: string;
    revision: number;
    readKey?: string;
    target: StackHead;
  }): Promise<WorkspaceSnapshot>;
  readTargetHistory(
    request: WorkspaceHistoryRequest,
    signal?: AbortSignal,
  ): Promise<WorkspaceHistoryPage>;
  readSourceFiles?(request: WorkspaceSourceRequest): Promise<WorkspaceFilePage>;
  readStackHistory?(
    request: WorkspaceStackHistoryRequest,
    signal?: AbortSignal,
  ): Promise<WorkspaceHistoryPage>;
  readFileDiff?(
    request: WorkspaceSourceRequest & { path: string },
  ): Promise<WorkspaceFile>;
  readConflict?(request: {
    repository: string;
    revision: number;
    readKey?: string;
    path: string;
  }): Promise<WorkspaceConflict>;
  preview(request: WorkspaceRequest): Promise<WorkspacePreview>;
  apply(request: WorkspaceRequest): Promise<WorkspaceOutcome>;
  status(requestId: string): Promise<WorkspaceOutcome>;
}
export class WorkspaceCommandError extends Error {
  constructor(
    readonly code: "stale" | "invalid" | "failed",
    message: string,
  ) {
    super(message);
  }
}
export const cloneWorkspace = <T>(value: T): T =>
  JSON.parse(JSON.stringify(value)) as T;
export interface StackWorkspaceControllerOptions {
  onInspectBranch?: (branch: string) => void;
  acceptedOperation?: (repository: string, operation: string) => void;
  initial?: WorkspaceSnapshot;
  /** False when initial data is only a verified local binding seed. */
  initialLoaded?: boolean;
  report?: (cause: unknown) => boolean;
}

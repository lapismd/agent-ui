import type {
  WorkspaceSnapshot,
  WorkspaceTargetBranch,
  WorkspaceSelection,
  StackCommit,
  WorkspaceFile,
} from "./model.js";
export type WorkspaceCommand =
  | {
      kind: "apply_stack" | "unapply_stack" | "delete_stack" | "rebase";
      stack: string;
      /** Individual bookmark action; omitted Unapply acts on the whole column. */
      branch?: string;
    }
  | {
      kind: "create_stack";
      name: string;
      parent?: string;
      /** Retained UI selections to stage after confirmed branch creation. */
      selections?: WorkspaceSelection[];
    }
  | { kind: "create_workspace"; name: string }
  | {
      kind: "create_branch";
      stack: string;
      commit: string;
      placement: "above" | "below";
      name: string;
    }
  | { kind: "rename_branch"; stack: string; branch: string; name: string }
  | { kind: "delete_branch"; stack: string; name: string }
  | { kind: "squash_branch"; stack: string; name: string }
  | {
      kind: "add_empty_commit";
      commit: string;
      placement: "above" | "below";
      message: string;
    }
  | { kind: "delete_commit"; commit: string }
  | {
      kind: "edit_commit";
      commit: string;
      message: string;
      selections?: WorkspaceSelection[];
    }
  | { kind: "rename_stack"; stack: string; name: string }
  | { kind: "switch_workspace" | "delete_workspace"; workspace: string }
  | {
      kind: "update_workspace";
      workspace: string;
      name: string;
      targetBranch: { name: string; commit: string };
    }
  | {
      kind: "create_commit";
      stack: string;
      message: string;
      selection?: WorkspaceSelection;
      selections?: WorkspaceSelection[];
    }
  | { kind: "reword"; commit: string; message: string }
  | { kind: "move_commit"; commit: string; stack: string; branch?: string }
  | { kind: "reorder_commit"; commit: string; direction: "up" | "down" }
  | {
      kind: "reorder_commit";
      commit: string;
      target: string;
      placement: "above" | "below";
    }
  | { kind: "squash"; commit: string; target: string }
  | {
      kind: "split";
      commit: string;
      message: string;
      selection: WorkspaceSelection;
    }
  | {
      kind: "transfer";
      selection: WorkspaceSelection;
      selections?: WorkspaceSelection[];
      target: string;
    }
  | { kind: "uncommit"; commit: string }
  | { kind: "resolve_conflict"; path: string; content: string }
  | { kind: "undo" | "redo" | "reconcile_workspace" }
  | { kind: "discard"; selections: WorkspaceSelection[] };
export type WorkspaceRequest = {
  readKey?: string;
  id: string;
  repository: string;
  revision: number;
  command: WorkspaceCommand;
};
export type WorkspacePreview = {
  request: WorkspaceRequest;
  title: string;
  summary: string;
  conflicts: string[];
};
export type WorkspaceOutcome =
  | { status: "committed"; snapshot: WorkspaceSnapshot }
  | { status: "unknown" }
  | { status: "refreshed"; snapshot: WorkspaceSnapshot };
export type WorkspaceSourceRequest = {
  repository: string;
  revision: number;
  readKey?: string;
  source: string;
  cursor?: string;
  signal?: AbortSignal;
};
export type WorkspaceFilePage = { files: WorkspaceFile[]; nextCursor?: string };

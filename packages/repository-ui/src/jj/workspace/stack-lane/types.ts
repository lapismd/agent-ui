import type { Snippet } from "svelte";
import type { ColumnCanvasLayoutPersistence } from "@lapismd/design-core/shadcn/column-canvas";
import type {
  StackWorkspaceController,
  WorkspaceSnapshot,
  WorkspaceStack,
  StackCommit,
  WorkspaceCommand,
  WorkspaceOpenDiff,
  NamedWorkspace,
} from "../../../stacks/index.js";
/** Rendering extensions receive recorded identities; hosts own effects and routing. */
export type RepositoryStackSlots = {
  headerActions?: Snippet<[StackWorkspaceController]>;
  columnActions?: Snippet<[WorkspaceStack]>;
  branchActions?: Snippet<[WorkspaceStack, string]>;
  commitActions?: Snippet<[StackCommit, WorkspaceStack]>;
  fileActions?: Snippet<[string]>;
  diffActions?: Snippet<[WorkspaceOpenDiff]>;
  composer?: Snippet<[WorkspaceStack]>;
};
export type RepositoryStackHost = RepositoryStackSlots & {
  copyText(value: string): Promise<void>;
  onCommand?(command: WorkspaceCommand, snapshot: WorkspaceSnapshot): void;
  onSelectWorkspace?(workspace: NamedWorkspace): void;
  layoutPersistence?: ColumnCanvasLayoutPersistence;
};

export { encodeJjChangeId } from "../history/repository-log-graph.js";
export { default as RepositoryShell } from "./foundations/shell/RepositoryShell.svelte";
export { default as RepositoryAuthorAvatar } from "./foundations/author-avatar/RepositoryAuthorAvatar.svelte";
export { default as RepositoryIdentifiers } from "./foundations/identifiers/RepositoryIdentifiers.svelte";
export { default as RepositorySkeleton } from "./foundations/skeleton/RepositorySkeleton.svelte";
export { default as RepositoryLogHeader } from "./history/log-header/RepositoryLogHeader.svelte";
export { default as RepositorySourcePicker } from "./history/source-picker/RepositorySourcePicker.svelte";
export { default as RepositoryWorkspacePicker } from "./history/workspace-picker/RepositoryWorkspacePicker.svelte";
export { default as RepositoryCommitPicker } from "./history/commit-picker/RepositoryCommitPicker.svelte";
export { default as RepositoryGraph } from "./history/graph/RepositoryGraph.svelte";
export { default as RepositoryRevisions } from "./history/revisions/RepositoryRevisions.svelte";
export { default as RepositoryChangedFiles } from "./history/changed-files/RepositoryChangedFiles.svelte";
export { default as RepositoryDiff } from "./history/diff/RepositoryDiff.svelte";
export { default as RepositoryFileHistory } from "./history/file-history/RepositoryFileHistory.svelte";
export { default as RepositoryOperationPinPicker } from "./operations/operation-pin-picker/RepositoryOperationPinPicker.svelte";
export { default as RepositoryOperationColumn } from "./operations/operation-column/RepositoryOperationColumn.svelte";
export { default as RepositoryBlamePanel } from "./blame/blame-panel/RepositoryBlamePanel.svelte";
export { default as RepositoryConflictResolution } from "./conflicts/conflict-resolution/RepositoryConflictResolution.svelte";
export { default as RepositoryRestoreDialog } from "./history/restore-dialog/RepositoryRestoreDialog.svelte";
export { default as RepositoryPanel } from "./screens/panel/RepositoryPanel.svelte";
export { default as RepositoryOperations } from "./screens/operations/RepositoryOperations.svelte";
export * from "./logic/history-controller.js";
export * from "./logic/operation-controller.js";
export * from "./logic/file-history-controller.js";
export * from "./logic/blame-controller.js";
export * from "./logic/history-state.js";
export * from "./logic/operation-state.js";
export * from "./logic/history-reader.js";
export * from "./logic/restore.js";
export * from "./logic/history-source.js";
export * from "./logic/workspaces.js";
export * from "./logic/blame-model.js";
export { commitRows, operationRows } from "./logic/graph/model.js";
export { default as RepositoryHistoryQuery } from "./history/query/RepositoryHistoryQuery.svelte";
export type { RepositoryHistoryQueryInfo } from "./history/query/types.js";

export {
  provideRepositoryAuthorAvatars,
  type RepositoryAuthorAvatarResolver,
} from "./logic/author-avatars.js";

export { default as RepositoryDiffViewer } from "./history/diff-viewer/RepositoryDiffViewer.svelte";
export { default as RepositoryDiffMenu } from "./history/diff-viewer/RepositoryDiffMenu.svelte";
export { createRepositoryDiffMenu } from "./history/diff-viewer/actions.js";
export type * from "./history/diff-viewer/types.js";
export type {
  RepositoryDiffEntry,
  RepositoryDiffEntries,
} from "./logic/comparison-diffs.js";

export { RepositoryBrowserController } from "./browse/logic/controller.js";
export type * from "./browse/logic/types.js";
export { default as RepositoryBreadcrumb } from "./browse/breadcrumb/RepositoryBreadcrumb.svelte";
export { default as RepositoryFileTree } from "./browse/file-tree/RepositoryFileTree.svelte";
export { default as RepositoryDirectory } from "./browse/directory/RepositoryDirectory.svelte";
export { default as RepositoryFilePreview } from "./browse/file-preview/RepositoryFilePreview.svelte";
export { default as RepositoryBrowser } from "./screens/browser/RepositoryBrowser.svelte";

export { default as RepositoryReferencePicker } from "./browse/reference-picker/RepositoryReferencePicker.svelte";
export type { RepositoryReferenceChoice } from "./browse/reference-picker/types.js";

export { default as RepositoryChangeCard } from "./browse/change-card/RepositoryChangeCard.svelte";

export { default as RepositoryBranchCommand } from "./branches/branch-command/RepositoryBranchCommand.svelte";
export { default as RepositoryBranches } from "./screens/branches/RepositoryBranches.svelte";
export { RepositoryBranchesController } from "./branches/logic/controller.js";
export { createBranchesCanvas } from "./screens/branches/canvas.js";
export * from "./branches/logic/types.js";

export { default as RepositoryStackWorkspace } from "./screens/stack-workspace/RepositoryStackWorkspace.svelte";
export { default as RepositoryStackLane } from "./workspace/stack-lane/RepositoryStackLane.svelte";
export { default as RepositoryWorkspaceFiles } from "./workspace/source-files/RepositoryWorkspaceFiles.svelte";
export { default as RepositoryWorkspaceDiff } from "./workspace/diff/RepositoryWorkspaceDiff.svelte";
export type {
  RepositoryStackHost,
  RepositoryStackSlots,
} from "./workspace/stack-lane/types.js";
export { createStackWorkspaceCanvas } from "./screens/stack-workspace/canvas.js";

export { default as RepositoryPullRequest } from "./forge/pull-request/RepositoryPullRequest.svelte";
export { RepositoryPullRequestReview } from "./forge/pull-request/review.svelte.js";
export { pullRequestScope } from "./forge/pull-request/scope.js";
export type * from "./forge/pull-request/types.js";

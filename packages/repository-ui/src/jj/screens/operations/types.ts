import type { Snippet } from "svelte";
import type { RepositoryDiffPreferences } from "../../history/diff-viewer/types.js";
import type { RepositoryHistoryQueryInfo } from "../../history/query/types.js";
import type { OperationState } from "../../logic/operation-state.js";
import type { OperationController } from "../../logic/operation-controller.js";
import type { HistorySourcePicker } from "../../logic/history-source.js";

export interface RepositoryOperationsProps extends RepositoryDiffPreferences {
  sources?: HistorySourcePicker;
  controller: OperationController;
  initialOperation?: string;
  copyText(value: string): Promise<void>;
  onHistory?(operation: string): void;
  searchable?: boolean;
  queryInfo?: RepositoryHistoryQueryInfo;
  headerControls?: Snippet<[OperationState]>;
  headerActions?: Snippet<[OperationState]>;
  operationActions?: Snippet<[OperationState]>;
  metadataActions?: Snippet<[OperationState]>;
  fileActions?: Snippet<[OperationState]>;
  diffActions?: Snippet<[OperationState]>;
  onRevert?(snapshot: OperationState): void;
}

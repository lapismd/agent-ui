import { historyBounds } from "./history-options.js";
export interface OperationControllerOptions {
  /** Native operation page size; defaults to 50. */
  pageSize?: number;
  /** Display bound, clamped between 1 and 200; defaults to 200. */
  maxOperations?: number;
}
export const operationBounds = (options: OperationControllerOptions) =>
  historyBounds({
    pageSize: options.pageSize,
    maxCommits: options.maxOperations,
  });

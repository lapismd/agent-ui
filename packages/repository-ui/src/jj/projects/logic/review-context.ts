import type { FileDiffFile, FileListingFile } from "@lapismd/design-core/diff";
import type { WorkActivity } from "./types.js";

/** A bounded comparison captured by the host for this review, never the active checkout. */
export type WorkReviewContext =
  | {
      state: "ready";
      repository: string;
      operation: string;
      files: (FileDiffFile & FileListingFile)[];
      commits: WorkActivity[];
      bounded?: boolean;
    }
  | { state: "loading" | "unavailable"; message?: string };
export interface WorkReviewAnchor {
  label: string;
  commitId?: string;
  changeId?: string;
  operationId?: string;
  sessionId?: string;
}

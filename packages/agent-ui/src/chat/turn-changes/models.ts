import type { FileListingFile } from "@lapismd/design-core/diff";
/** Immutable identities supplied by the host; no repository access is performed here. */
export interface AiTurnRecord {
  /** Exact insertion point for participant-specific or command turns, normalized by the host. */
  afterItemId?: string;
  context: {
    conversation: string;
    turn: string;
    message: string;
    agent: string;
    requested_model?: string;
  };
  phase: "running" | "complete" | "incomplete";
  before: { commit: string; change_id: string };
  after?: { commit: string; change_id: string };
  started_at: number;
}
export interface LocalFileDiffChange {
  path: string;
  content: { oldText: string; newText: string } | { unavailable: string };
}
export const diffText = (file: LocalFileDiffChange) => file.content;
export type TurnComparison = {
  files: (FileListingFile & { diff?: LocalFileDiffChange })[];
  complete: boolean;
  countsComplete: boolean;
};
export interface AiUndoRequest {
  request_id: string;
  conversation: string;
  turn: string;
  paths: string[];
  /** Opaque host checkpoint identity, returned unchanged on explicit confirmation. */
  checkpoint: string;
}
export interface AgentChangesPort {
  compare(record: AiTurnRecord): Promise<TurnComparison>;
  readFile(record: AiTurnRecord, path: string): Promise<LocalFileDiffChange>;
  previewUndo(
    record: AiTurnRecord,
    paths: readonly string[],
  ): Promise<AiUndoRequest>;
  undo(request: AiUndoRequest): Promise<void>;
  report(error: unknown): void;
  copyText(value: string): Promise<void>;
}
export interface AiFileHistory {
  records: readonly AiTurnRecord[];
  pending?: { choose(value: "continue" | "retry"): void };
  cancelPending(): void;
  report(error: unknown): void;
}

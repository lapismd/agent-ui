import type { RepositoryPin } from "../../../core/models.js";
export type RepositoryBrowserPin = Readonly<RepositoryPin>;
/** Native identities are supplied by the host, never inferred from a label. */
export type RepositoryBrowserCommit = {
  eventId: string;
  changeId?: string;
  message: string;
  author: string;
  authorEmail?: string;
  /** Unix seconds, matching the source repository presentation model. */
  createdAt: number;
  attribution?: "path_change" | "snapshot";
};
export type RepositoryBrowserEntry = {
  type: "tree" | "blob";
  name: string;
  path: string;
  size?: number;
  commit?: RepositoryBrowserCommit;
};
export type RepositoryBrowserFile = {
  path: string;
  size?: number;
  commit?: RepositoryBrowserCommit;
} & (
  | { kind: "text"; contents: string }
  | { kind: "binary" }
  | { kind: "unavailable"; reason: string }
);
export type RepositoryPathRequest = {
  pin: RepositoryBrowserPin;
  path: string;
  recursive: boolean;
  limit: number;
  cursor?: string;
  signal: AbortSignal;
};
export type RepositoryPathPage = {
  pin: RepositoryBrowserPin;
  path: string;
  recursive: boolean;
  entries: readonly RepositoryBrowserEntry[];
  nextCursor?: string;
  latestCommit?: RepositoryBrowserCommit;
  /** Optional already-loaded landing documents; no implicit fan-out reads. */
  documents?: readonly RepositoryBrowserFile[];
};
export interface RepositoryBrowserPort {
  paths(request: RepositoryPathRequest): Promise<RepositoryPathPage>;
  file(request: {
    pin: RepositoryBrowserPin;
    path: string;
    signal: AbortSignal;
  }): Promise<{ pin: RepositoryBrowserPin; file: RepositoryBrowserFile }>;
}
export type RepositoryBrowserWindow = RepositoryPathPage & {
  cursors: readonly string[];
  limitReached: boolean;
};
export type RepositoryBrowserPhase =
  "idle" | "loading" | "ready" | "unavailable";
export type RepositoryBrowserState = {
  pin: RepositoryBrowserPin;
  directory: string;
  path?: string;
  file?: RepositoryBrowserFile;
  directoryPhase: RepositoryBrowserPhase;
  filePhase: RepositoryBrowserPhase;
  mode: "tree" | "list" | "package";
  display: "preview" | "source" | "blame";
  pages: Readonly<Record<string, RepositoryBrowserWindow>>;
  loadingPages: ReadonlySet<string>;
  collapsedDirectoryPaths: ReadonlySet<string>;
};
export type RepositoryBrowserSelection = {
  pin: RepositoryBrowserPin;
  path: string;
};
export type RepositoryBrowserOptions = {
  pageSize?: number;
  maxEntries?: number;
  report?(cause: unknown): void;
};

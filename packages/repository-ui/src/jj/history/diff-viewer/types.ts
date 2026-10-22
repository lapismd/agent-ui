import type { Component } from "svelte";
import type { IconProps } from "@lucide/svelte";
import type { LocalFileDiffChange } from "@lapismd/jj-history";

export type RepositoryDiffFileMode = "single" | "all";
export interface RepositoryDiffComparisonContext {
  comparisonKey: string;
  operation?: string;
  from: string;
  to: string;
}
export interface RepositoryDiffStats {
  additions: number;
  deletions: number;
}
export interface RepositoryDiffActionContext extends RepositoryDiffComparisonContext {
  path: string;
  change: LocalFileDiffChange;
}
export type RepositoryDiffMenuItem =
  | {
      id: string;
      label: string;
      icon: Component<Omit<IconProps, "icon" | "iconNode">>;
      disabled?: boolean;
      onSelect(context: RepositoryDiffActionContext): void | Promise<void>;
      children?: never;
    }
  | {
      id: string;
      label: string;
      icon: Component<Omit<IconProps, "icon" | "iconNode">>;
      disabled?: boolean;
      children: readonly RepositoryDiffMenuItem[];
      onSelect?: never;
    }
  | { id: string; separator: true };
export type RepositoryDiffMenuProvider = (
  context: RepositoryDiffActionContext,
) => readonly RepositoryDiffMenuItem[];
export interface RepositoryDiffPreferences {
  diffFileMode?: RepositoryDiffFileMode;
  onDiffFileModeChange?(mode: RepositoryDiffFileMode): void;
  diffPageSize?: number;
  getDiffMenuItems?: RepositoryDiffMenuProvider;
  /** Complete comparison totals from the host cache, including files not paged in.
   * Return undefined while unavailable; this synchronous callback must not do I/O. */
  getDiffStats?(
    context: RepositoryDiffComparisonContext,
  ): RepositoryDiffStats | undefined;
}

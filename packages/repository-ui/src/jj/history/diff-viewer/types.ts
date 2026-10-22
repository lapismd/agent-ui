import type { Component } from "svelte";
import type { IconProps } from "@lucide/svelte";
import type { LocalFileDiffChange } from "@lapismd/jj-history";

export type RepositoryDiffFileMode = "single" | "all";
export interface RepositoryDiffActionContext {
  comparisonKey: string;
  operation?: string;
  from: string;
  to: string;
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
}

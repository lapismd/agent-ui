import type { Component } from "svelte";

export type RepositoryNavigationContext =
  "repository" | "stacks" | "projects" | "project";
export type RepositoryNavigationSection = {
  value: string;
  label: string;
  disabled?: boolean;
  Icon?: Component;
};
export type RepositoryBreadcrumbItem = {
  id: string;
  label: string;
  /** Host-owned URL; no repository access is inferred from navigation. */
  href?: string;
  Icon?: Component;
};
const sections: Record<
  RepositoryNavigationContext,
  readonly [string, string][]
> = {
  repository: [
    ["files", "Overview"],
    ["stacks", "Stacks"],
    ["branches", "Branches"],
    ["log", "JJ Log"],
    ["oplog", "Op Log"],
    ["agents", "Agents"],
    ["reviews", "Reviews"],
    ["projects", "Projects"],
  ],
  stacks: [
    ["branches", "Branches"],
    ["workspace", "Workspace"],
    ["log", "JJ Log"],
    ["oplog", "Op Log"],
  ],
  projects: [
    ["activity", "Activity"],
    ["projects", "Projects"],
    ["tasks", "Tasks"],
    ["reviews", "Reviews"],
    ["agents", "Agents"],
    ["repositories", "Repositories"],
  ],
  project: [
    ["activity", "Activity"],
    ["tasks", "Tasks"],
    ["reviews", "Reviews"],
    ["agents", "Agents"],
    ["repositories", "Repositories"],
  ],
};
/** Source-adapted JJ Store contexts. The host controls selected routes. */
export function navigationSections(
  context: RepositoryNavigationContext,
): RepositoryNavigationSection[] {
  return sections[context].map(([value, label]) => ({ value, label }));
}

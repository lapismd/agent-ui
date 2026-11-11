/** Host-supplied observations. This presentation never reads a provider. */
export type RepositoryCheckState =
  "passed" | "failed" | "running" | "queued" | "unknown";
export interface RepositoryCheck {
  id: string;
  name: string;
  state: RepositoryCheckState;
  description?: string;
}
export interface RepositoryChecksSnapshot {
  sha: string;
  complete: boolean;
  items: readonly RepositoryCheck[];
}
export const checkStateLabels: Record<RepositoryCheckState, string> = {
  failed: "Failed",
  running: "Running",
  queued: "Queued",
  passed: "Passed",
  unknown: "Unknown",
};
export function repositoryCheckGroups(checks: readonly RepositoryCheck[]) {
  return (Object.keys(checkStateLabels) as RepositoryCheckState[])
    .map((id) => ({
      id,
      label: checkStateLabels[id],
      checks: checks.filter((check) => check.state === id),
    }))
    .filter((group) => group.checks.length);
}

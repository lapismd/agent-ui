/** Host-issued PR presentation; no transport, credentials or execution policy. */
export type PullRequestCapability =
  "edit" | "draft" | "merge" | "restack" | "refresh" | "checks";
export type PullRequestMergeMethod = "merge" | "squash" | "rebase";
export type RepositoryPullRequestRecord = {
  id: string;
  number: number;
  provider: "github" | "forgejo";
  head: string;
  base: string;
  sha: string;
  title: string;
  body: string;
  url: string;
  state: "open" | "closed" | "merged";
  draft: boolean;
  mergeable?: boolean;
  capabilities: readonly PullRequestCapability[];
  mergeMethods?: readonly PullRequestMergeMethod[];
  details?: readonly { label: string; value: string }[];
  checks?: {
    sha: string;
    complete: boolean;
    items: readonly {
      id: string;
      name: string;
      state: "passed" | "failed" | "running" | "queued" | "unknown";
      description?: string;
    }[];
  };
};
export type PullRequestScope = {
  repository: string;
  revision: number;
  readKey?: string;
  workspace: string | null;
};
export type PullRequestAction =
  | { kind: "edit"; title: string; body: string }
  | { kind: "draft"; draft: boolean }
  | { kind: "merge"; method: PullRequestMergeMethod }
  | { kind: "refresh" | "checks" | "restack" };
export type PullRequestRequest = {
  scope: PullRequestScope;
  id: string;
  number: number;
  branch: string;
  expectedSha: string;
  action: PullRequestAction;
};

// SPDX-License-Identifier: Apache-2.0; adapts JJ Store ForgeController's retained presentation state.
import type {
  RepositoryPullRequestRecord,
  PullRequestScope,
  PullRequestAction,
  PullRequestRequest,
  PullRequestMergeMethod,
} from "./types.js";
/** Host-owned view state. Construction/sync never read a service or execute actions. */
export class RepositoryPullRequestReview {
  scope = $state<PullRequestScope | null>(null);
  records = $state<RepositoryPullRequestRecord[]>([]);
  selectedBranch = $state<string | null>(null);
  expanded = $state(false);
  busy = $state(false);
  pending = $state(false);
  drafts = $state<
    Record<
      string,
      {
        title: string;
        body: string;
        editing: boolean;
        method: PullRequestMergeMethod;
      }
    >
  >({});
  sync(
    scope: PullRequestScope,
    records: readonly RepositoryPullRequestRecord[],
  ) {
    const changed = !this.matches(scope);
    this.scope = { ...scope };
    this.records = structuredClone($state.snapshot([...records]));
    for (const pr of this.records) this.draft(pr);
    if (changed || !this.pr(this.selectedBranch ?? "")) {
      this.selectedBranch = null;
      this.expanded = false;
    }
  }
  matches(scope: PullRequestScope) {
    return (
      JSON.stringify([
        scope.repository,
        scope.revision,
        scope.readKey,
        scope.workspace,
      ]) ===
      JSON.stringify([
        this.scope?.repository,
        this.scope?.revision,
        this.scope?.readKey,
        this.scope?.workspace,
      ])
    );
  }
  pr(branch: string) {
    return this.records.find((pr) => pr.head === branch);
  }
  key(pr: RepositoryPullRequestRecord) {
    return JSON.stringify([
      this.scope?.repository,
      this.scope?.revision,
      this.scope?.readKey,
      this.scope?.workspace,
      pr.id,
      pr.sha,
    ]);
  }
  draft(pr: RepositoryPullRequestRecord) {
    const key = this.key(pr);
    return (this.drafts[key] ??= {
      title: pr.title,
      body: pr.body,
      editing: false,
      method: pr.mergeMethods?.[0] ?? "merge",
    });
  }
  select(branch: string) {
    if (!this.pr(branch)) return;
    this.selectedBranch = branch;
    this.expanded = true;
  }
  close() {
    this.selectedBranch = null;
    this.expanded = false;
  }
  request(
    pr: RepositoryPullRequestRecord,
    action: PullRequestAction,
  ): PullRequestRequest | null {
    const current = this.pr(pr.head);
    if (
      !this.scope ||
      this.busy ||
      this.pending ||
      current?.id !== pr.id ||
      current.sha !== pr.sha ||
      !current.capabilities.includes(action.kind)
    )
      return null;
    if (action.kind === "edit" && !action.title.trim()) return null;
    if (
      action.kind === "merge" &&
      (current.draft ||
        current.state !== "open" ||
        current.mergeable !== true ||
        !current.mergeMethods?.includes(action.method))
    )
      return null;
    if (action.kind === "draft" && current.state !== "open") return null;
    return {
      scope: { ...this.scope },
      id: pr.id,
      number: pr.number,
      branch: pr.head,
      expectedSha: pr.sha,
      action,
    };
  }
}

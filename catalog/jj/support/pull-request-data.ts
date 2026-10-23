import type { RepositoryPullRequestRecord } from "../../../packages/repository-ui/src/jj/forge/pull-request/types.js";
export const recordedPullRequest = (
  head = "feature/portable-api",
  sha = "recorded-pr-head",
): RepositoryPullRequestRecord => ({
  id: "forgejo:example/repository:42",
  number: 42,
  provider: "forgejo",
  head,
  base: "main",
  sha,
  title: "Keep repository context beside the workspace",
  body: "## Review context\n\nKeep the recorded operation, workspace and file selection together.\n\n- Explain the repository workflow\n- Preserve native hunk identities\n- Review changes before applying them\n\n### Verification\n\nThe host supplies pull request details, checks and permitted actions. This example uses isolated records.",
  url: "https://forgejo.example.test/example/repository/pulls/42",
  state: "open",
  draft: false,
  mergeable: true,
  capabilities: ["edit", "draft", "merge", "restack", "refresh", "checks"],
  mergeMethods: ["merge", "squash", "rebase"],
  details: [
    { label: "Author", value: "Alex Morgan" },
    { label: "Reviewers", value: "Sam Rivera, Taylor Chen" },
    { label: "Labels", value: "workspace, ready for review" },
  ],
  checks: {
    sha,
    complete: true,
    items: [
      { id: "types", name: "Type check", state: "passed" },
      { id: "tests", name: "Workspace interactions", state: "passed" },
      {
        id: "format",
        name: "Formatting",
        state: "failed",
        description: "Two files need formatting",
      },
      {
        id: "visual",
        name: "Visual review",
        state: "running",
        description: "Awaiting review",
      },
    ],
  },
});

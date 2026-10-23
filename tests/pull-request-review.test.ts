import { expect, test } from "vitest";
import { RepositoryPullRequestReview } from "../packages/repository-ui/src/jj/forge/pull-request/review.svelte.js";
import { recordedPullRequest } from "../catalog/jj/support/pull-request-data.js";
const scope = {
  repository: "repo",
  revision: 7,
  readKey: "op:7",
  workspace: "daily",
};
test("PR requests retain exact source identity and never execute an effect", () => {
  const review = new RepositoryPullRequestReview(),
    pr = recordedPullRequest();
  review.sync(scope, [pr]);
  review.select(pr.head);
  expect(
    review.request(pr, { kind: "edit", title: "Updated", body: "Body" }),
  ).toEqual({
    scope,
    id: pr.id,
    number: 42,
    branch: pr.head,
    expectedSha: pr.sha,
    action: { kind: "edit", title: "Updated", body: "Body" },
  });
  expect(review.pr(pr.head)?.title).toBe(pr.title);
  expect(review.matches({ ...scope, readKey: "other" })).toBe(false);
});
test("drafts survive navigation and scope changes without reusing a different head", () => {
  const review = new RepositoryPullRequestReview(),
    pr = recordedPullRequest();
  review.sync(scope, [pr]);
  const draft = review.draft(pr);
  draft.title = "Unsaved";
  draft.editing = true;
  review.close();
  review.select(pr.head);
  expect(review.draft(pr).title).toBe("Unsaved");
  review.sync({ ...scope, readKey: "op:8" }, [{ ...pr, sha: "next" }]);
  expect(review.selectedBranch).toBeNull();
  expect(review.request(pr, { kind: "refresh" })).toBeNull();
  expect(review.draft(review.pr(pr.head)!).title).toBe(pr.title);
  review.sync(scope, [pr]);
  expect(review.draft(pr).title).toBe("Unsaved");
});
test("missing permissions, pending actions and unsafe merge states fail closed", () => {
  const review = new RepositoryPullRequestReview(),
    pr = recordedPullRequest();
  review.sync(scope, [pr]);
  review.pending = true;
  expect(review.request(pr, { kind: "refresh" })).toBeNull();
  review.pending = false;
  for (const record of [
    { ...pr, draft: true },
    { ...pr, mergeable: undefined },
    { ...pr, state: "closed" as const },
    { ...pr, capabilities: [] },
  ]) {
    review.sync(scope, [record]);
    expect(
      review.request(record, { kind: "merge", method: "merge" }),
    ).toBeNull();
  }
  review.sync(scope, [pr]);
  expect(
    review.request(pr, { kind: "merge", method: "squash" }),
  ).not.toBeNull();
  expect(review.request(pr, { kind: "edit", title: " ", body: "" })).toBeNull();
  review.sync(scope, [{ ...pr, mergeMethods: ["merge"] }]);
  expect(review.request(pr, { kind: "merge", method: "rebase" })).toBeNull();
});

import type {
  WorkActor,
  WorkReview,
  WorkCommand,
} from "../../../packages/repository-ui/src/jj/projects/index.js";
export function reviewFixture(variant: string, actor: WorkActor): WorkReview {
  return {
    id: "review-1",
    title: "Review repository context",
    body: "Check the linked code target before execution.",
    status: "open",
    actor,
    version: "1",
    anchorLabel: "src/context.ts a3affd3",
    anchor: {
      label: "src/context.ts",
      commitId: "a3affd3".padEnd(40, "4"),
      changeId: "ryspmnvsxq",
    },
    reviewRoot: "86f2f212".padEnd(64, "a"),
    context:
      variant === "ReviewDetailUnavailable"
        ? {
            state: "unavailable",
            message:
              "The recorded repository is not available on this machine.",
          }
        : {
            state: "ready",
            repository: "portable-beta",
            operation: "a".repeat(128),
            files: [
              {
                path: "src/context.ts",
                additions: 2,
                deletions: 1,
                patch:
                  "--- a/src/context.ts\n+++ b/src/context.ts\n@@ -1,2 +1,3 @@\n-export const target = activeRepository;\n+export const target = capturedRepository;\n+export const operation = capturedOperation;\n export const preserve = true;",
              },
            ],
            commits: [
              {
                id: "recorded-commit",
                repository: "portable-beta",
                operation: "a".repeat(128),
                revision: {
                  eventId: "a3affd3".padEnd(40, "4"),
                  changeId: "ryspmnvsxq",
                  message: "Retain the recorded code target",
                  author: "Alex Morgan",
                  createdAt: actor.created_at_millis / 1000,
                },
              },
            ],
          },
    comments: [
      {
        id: "review-comment-1",
        parent: null,
        body: "Looks ready for a second pass.",
        actor,
      },
    ],
    commentsHasMore: false,
  };
}
export function applyReviewCommand(
  reviews: WorkReview[],
  c: WorkCommand,
  id: string,
  actor: WorkActor,
): string | undefined {
  if (c.kind === "create-review") {
    reviews.push({
      id,
      title: c.body.split("\n")[0],
      body: c.body,
      status: "open",
      version: "1",
      actor,
      comments: [],
      commentsHasMore: false,
    });
  }
  if (c.kind === "review-reply" || c.kind === "review-state") {
    const review = reviews.find((r) => r.id === c.review);
    if (!review || review.version !== c.version)
      return "Review changed. Refresh before trying again.";
    if (c.kind === "review-reply")
      review.comments.push({ id, body: c.body, parent: c.parent, actor });
    else review.status = c.resolved ? "resolved" : "open";
    review.version = String(Number(review.version) + 1);
  }
}

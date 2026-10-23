import type { WorkspaceSnapshot } from "../../../stacks/index.js";
import type { PullRequestScope } from "./types.js";
export const pullRequestScope = (
  snapshot: WorkspaceSnapshot,
): PullRequestScope => ({
  repository: snapshot.repository,
  revision: snapshot.revision,
  readKey: snapshot.readKey,
  workspace: snapshot.active,
});

import type { FileListingFile } from "@lapismd/design-core/diff";
import type { RepositoryLogRevision } from "../../logic/graph/model.js";
import type {
  StackCommit,
  WorkspaceFile,
  WorkspaceStack,
} from "../../../stacks/types.js";
/** Preserve recorded graph edges and tags; no fabricated parents or timestamps. */
export function workspaceRevisionRows(
  stack: WorkspaceStack,
  commits: readonly StackCommit[],
): RepositoryLogRevision[] {
  const parents = new Map(
    stack.commits.map((commit, index) => [
      commit.id,
      index ? [stack.commits[index - 1]!.id] : [],
    ]),
  );
  return commits.map((commit) => ({
    eventId: commit.id,
    changeId: commit.changeId,
    parents: commit.graph?.parents ?? parents.get(commit.id) ?? [],
    message: commit.message.split("\n")[0] || "No description",
    reason:
      commit.graph && commit.graph.parents.length > 1 ? "merge" : "checkpoint",
    author: commit.author,
    authorEmail: commit.email,
    millis: commit.createdAt * 1000,
    conflicted: commit.graph?.conflicted,
    tags: [
      ...(commit.immutable ? ["Immutable"] : []),
      ...(commit.graph?.divergent ? ["Divergent"] : []),
      ...(commit.graph?.bookmarks.map(
        (bookmark) =>
          `${bookmark.name}${bookmark.remote ? `@${bookmark.remote}` : ""}`,
      ) ?? []),
      ...(commit.graph?.workspaces.map(
        (workspace) => `Working copy · ${workspace}`,
      ) ?? []),
    ],
  }));
}
/** Counts describe the supplied file, never its number of hunk records. */
export function workspaceListingFiles(
  files: readonly WorkspaceFile[],
  conflicts: readonly string[] = [],
): FileListingFile[] {
  return files.map((file) => ({
    path: file.path,
    ...(file.additions === undefined ? {} : { additions: file.additions }),
    ...(file.deletions === undefined ? {} : { deletions: file.deletions }),
    conflicted:
      file.conflicted ||
      conflicts.includes(file.path) ||
      (file.content?.status === "unavailable" &&
        file.content.reason === "conflict"),
  }));
}

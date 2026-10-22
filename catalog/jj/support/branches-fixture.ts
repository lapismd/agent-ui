import { historyFixture, operation, repository } from "./reference/fixture.js";
import { attachDenseHistory } from "./dense-history.js";
import {
  RepositoryBranchesController,
  type RepositoryBookmark,
  type RepositoryBranchesPort,
  type RepositoryBranchesRequest,
} from "../../../packages/repository-ui/src/jj/index.js";
export const branchesNow = 1792674000;
export function createBranchesDemo(variant = "Basic") {
  const fixture = historyFixture();
  const dense = attachDenseHistory(fixture.reader);
  const graphRead = fixture.reader.read;
  // The adapter evaluates exact ancestry for this captured fixture, never all().
  fixture.reader.read = async (handle, query) => {
    if (query.kind !== "graph" || query.query[0].graph !== "log")
      return graphRead(handle, query);
    const result = await graphRead(handle, query);
    if (result.kind !== "graph" || result.data.data.graph !== "log")
      throw new Error("Expected log");
    const roots = [
      ...query.query[0].revset.matchAll(/ancestors\(([a-f0-9]+)\)/gu),
    ].map((match) => match[1]);
    const reachable = new Set<string>();
    function visit(id: string) {
      if (reachable.has(id)) return;
      reachable.add(id);
      dense.commits.find((row) => row.id === id)?.parents.forEach(visit);
    }
    roots.forEach(visit);
    const rows = dense.commits.filter((row) => reachable.has(row.id));
    const offset = query.query[1].after
      ? rows.findIndex((row) => row.id === query.query[1].after!.id) + 1
      : 0;
    const page = rows.slice(offset, offset + Number(query.query[1].limit));
    return {
      ...result,
      data: {
        ...result.data,
        data: {
          graph: "log",
          nodes: page.map((commit) => ({ commit, edges: [] })),
        },
        next:
          offset + page.length < rows.length
            ? { kind: "commit", id: page.at(-1)!.id }
            : null,
      },
    };
  };
  const bookmark = (
    name: string,
    indices: number[],
    extras: Partial<RepositoryBookmark> = {},
  ): RepositoryBookmark => ({
    name,
    targets: indices.map((i) => dense.commits[i].id),
    description: dense.commits[indices[0] ?? 0].description.split("\n")[0],
    author: "Alex Morgan",
    authorEmail: "dev@lapis.md",
    updatedAt: branchesNow - 3600,
    ...extras,
  });
  const bookmarks =
    variant === "Empty"
      ? []
      : [
          bookmark("main", [0], { default: true }),
          bookmark("feature/portable-branches", [4], {
            workspace: true,
            author: "Mira Patel",
          }),
          bookmark("release/shared-ui", [6, 8], { author: "Jo Chen" }),
          bookmark("retired/old-preview", []),
          bookmark("main", [12], { remote: "origin", author: "Sam Rivera" }),
          bookmark("review/long-branch-name-with-recorded-context", [15], {
            workspace: true,
            partiallyApplied: true,
          }),
          ...(variant === "Dense"
            ? Array.from({ length: 80 }, (_, i) =>
                bookmark(`topic/branch-${i + 1}`, [i % 60]),
              )
            : []),
        ];
  const workingCopies =
    variant === "Empty"
      ? []
      : [
          {
            workspace: "default",
            commitId: dense.commits[0].id,
            changeId: dense.commits[0].change_id,
            message: "Keep branch targets bound to their captured operation",
            createdAt: branchesNow - 600,
            author: "Alex Morgan",
            authorEmail: "dev@lapis.md",
          },
          {
            workspace: "review",
            commitId: dense.commits[4].id,
            changeId: dense.commits[4].change_id,
            message: "Review the source-adapted branch cards",
            createdAt: branchesNow - 2400,
            author: "Mira Patel",
          },
        ];
  const errors: string[] = [],
    actions: string[] = [],
    requests: RepositoryBranchesRequest[] = [];
  let failures =
    variant === "Unavailable" ? Infinity : variant === "Retry" ? 1 : 0;
  const port: RepositoryBranchesPort = {
    async read(request, signal) {
      requests.push(request);
      if (variant === "Loading")
        await new Promise<void>((resolve) =>
          signal.addEventListener("abort", () => resolve(), { once: true }),
        );
      if (failures-- > 0) throw new Error("Captured references unavailable");
      const offset = Number(request.after ?? 0),
        page = bookmarks.slice(offset, offset + request.limit);
      return {
        repository: request.repository,
        operation: request.operation,
        bookmarks: page,
        workingCopies: offset ? [] : workingCopies,
        next:
          offset + page.length < bookmarks.length
            ? String(offset + page.length)
            : null,
      };
    },
  };
  const controller = new RepositoryBranchesController(
    port,
    fixture.reader,
    {
      report(error) {
        errors.push(String(error));
      },
      recovered() {
        errors.length = 0;
      },
    },
    {
      pageSize: 12,
      maxCommits: variant === "Bounded" ? 6 : 200,
      referencePageSize: variant === "Dense" ? 12 : 40,
      now: () => branchesNow * 1000,
    },
  );
  async function start() {
    await controller.open(
      { repository, operation },
      variant === "Conflicted"
        ? { kind: "bookmark", name: "release/shared-ui" }
        : variant === "Deleted"
          ? { kind: "bookmark", name: "retired/old-preview" }
          : variant === "Remote"
            ? { kind: "bookmark", name: "main", remote: "origin" }
            : variant === "WorkingCopy"
              ? { kind: "workspace", workspace: "review" }
              : undefined,
    );
    if (
      ["Basic", "HostActions", "AllInOne"].includes(variant) &&
      controller.history.state.commits[0]
    ) {
      await controller.history.selectRevision(
        controller.history.state.commits[0],
      );
      const path = controller.history.state.paths[0]?.path;
      if (path) await controller.history.selectPath(path);
    }
  }
  return {
    controller,
    fixture,
    dense,
    bookmarks,
    workingCopies,
    errors,
    actions,
    requests,
    start,
    copyText: async (value: string) => {
      actions.push(`copy:${value}`);
    },
    async close() {
      await controller.close();
      await fixture.close();
    },
  };
}

import type { HistoryReader } from "../../../packages/repository-ui/src/jj/logic/history-reader.js";
import type { LocalGraphOperationNode } from "@lapismd/jj-history";
import { operationNode, operationDifference } from "./reference/operations.js";
import { operation } from "./reference/fixture.js";
import { richCommitMessage } from "./reference/rich-commit.js";
import { collectionVariants, collectionChanges } from "./diff-collection.js";
import { attachDenseHistory } from "./dense-history.js";
import { commitDetail } from "./reference/commit-detail.js";
import { stats } from "./reference/query-stats.js";
import { branchingParents } from "./branching-history.js";

export function attachDenseOperations(reader: HistoryReader, variant: string) {
  const { commits, changes } = attachDenseHistory(
    reader,
    collectionVariants.includes(variant) ? collectionChanges : undefined,
  );
  const nodes: LocalGraphOperationNode[] = Array.from(
    { length: 64 },
    (_, i): LocalGraphOperationNode => ({
      ...operationNode(
        i === 0 ? operation : (i + 1).toString(16).padStart(128, "0"),
      ),
      description: [
        "describe commit",
        "rebase workspace",
        "edit bookmarks",
        "merge operation heads",
      ][i % 4],
      user: ["Alex Morgan", "Mira Patel", "Sam Rivera", "Jo Chen"][i % 4],
      host: ["desktop", "workspace", "build-agent"][i % 3],
      workspace: i % 2 ? "review" : "default",
      start: {
        millis: 1792674000000n - BigInt(i) * 600000n - 200n,
        offset_minutes: 0,
      },
      end: { millis: 1792674000000n - BigInt(i) * 600000n, offset_minutes: 0 },
      is_snapshot: i % 7 === 0,
      attributes:
        i === 0 ? { args: `jj describe -r @ -m '${richCommitMessage}'` } : {},
    }),
  );
  nodes.forEach((node, i) => {
    node.parents = branchingParents(
      nodes.map((node) => node.id),
      i,
    );
  });
  if (variant === "RootOperation") nodes[0].parents = [];
  if (variant === "MergeParents")
    nodes[3].parents = [nodes[4].id, nodes[20].id];
  const read = reader.read;
  let failPaths = variant === "FailedRead";
  reader.read = async (handle, query) => {
    if (query.kind === "diff_paths" && failPaths) {
      failPaths = false;
      throw Error("The captured comparison is temporarily unavailable");
    }
    if (
      query.kind === "graph" &&
      ["operations", "operations_filtered"].includes(query.query[0].graph)
    ) {
      const filter =
        query.query[0].graph === "operations_filtered"
          ? query.query[0].query
          : "";
      if (filter === "invalid")
        throw Error("The host rejected this operation query");
      const matches =
        filter === "none"
          ? []
          : nodes.filter(
              (node) =>
                !filter ||
                node.description.includes(
                  filter.replace(/^description:/, "").replaceAll('"', ""),
                ),
            );
      const offset = query.query[1].after
        ? matches.findIndex((node) => node.id === query.query[1].after!.id) + 1
        : 0;
      const page = matches.slice(offset, offset + Number(query.query[1].limit));
      return {
        kind: "graph",
        data: {
          version: 1,
          operation,
          data: { graph: "operations", nodes: page },
          next:
            offset + page.length < matches.length
              ? { kind: "operation", id: page.at(-1)!.id }
              : null,
          stats: stats(),
        },
      };
    }
    if (query.kind === "operation_diff") {
      const node = nodes.find((row) => row.id === query.query.operation);
      const data =
        node && !node.parents.length
          ? { status: "root" as const, operation: node.id, view: node.view }
          : operationDifference(
              query.query.operation,
              query.query.parent ?? undefined,
            );
      return {
        kind: "operation_diff",
        data: { version: 1, data, stats: stats() },
      };
    }
    if (query.kind === "operation_changes") {
      const indices =
        variant === "Conflicts"
          ? [4]
          : variant === "MultipleChanges"
            ? [0, 4]
            : [0];
      const groups =
        variant === "MetadataOnly"
          ? []
          : indices.map((index) => ({
              change: commits[index].change_id,
              before: [commits[index + 1].id],
              after: [commits[index].id],
              comparison:
                variant === "UnavailableComparison"
                  ? { status: "unavailable" as const }
                  : variant === "Ambiguous"
                    ? {
                        status: "select" as const,
                        before: [commits[index + 1].id, commits[index + 2].id],
                        after: [commits[index].id],
                      }
                    : {
                        status: "exact" as const,
                        from: commits[index + 1].id,
                        to: commits[index].id,
                      },
            }));
      return {
        kind: "operation_changes",
        data: {
          version: 1,
          operation: query.query.operation,
          parent: query.query.parent,
          groups,
          next: null,
          stats: stats(),
        },
      };
    }
    if (query.kind === "commit") {
      const commit = commits.find((row) => row.id === query.query.commit);
      if (commit) return commitDetail(commit);
    }
    return read(handle, query);
  };
  return { nodes, commits, changes };
}

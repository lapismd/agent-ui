import type { HistoryReader } from "../../../packages/repository-ui/src/jj/logic/history-reader.js";
import { commit, revision } from "./reference/fixture.js";
import { stats } from "./reference/query-stats.js";
import { commitDetail } from "./reference/commit-detail.js";
import type { LocalFileDiffChange } from "@lapismd/jj-history";
import { denseChanges } from "./dense-diffs.js";
import { richCommitMessage } from "./reference/rich-commit.js";
import { branchingParents } from "./branching-history.js";
export function attachDenseHistory(
  reader: HistoryReader,
  changes: LocalFileDiffChange[] = denseChanges,
) {
  const hash = (index: number) =>
    (Math.imul(index + 1, 2654435761) >>> 0).toString(16).padStart(8, "0");
  const names = ["Alex Morgan", "Mira Patel", "Sam Rivera", "Jo Chen"];
  const messages = [
    "Keep native query context and pinned comparisons",
    "Render binary files without inventing text",
    "Merge workspace query controls",
    "Preserve selection during background refresh",
    "Resolve conflicting comparison metadata",
    "Document public host action slots",
  ];
  const commits = Array.from({ length: 64 }, (_, i) => ({
    ...commit(i === 0 ? revision : hash(i).repeat(5)),
    change_id: hash(i + 80).repeat(4),
    description: i === 0 ? richCommitMessage : messages[i % messages.length],
    author: {
      name: names[i % names.length],
      email: `reviewer-${i % 4}@example.test`,
      timestamp: { millis: 1792674000000 - i * 1800000, offset_minutes: 0 },
    },
    workspaces:
      i === 0 ? ["default", "review"] : i === 5 ? ["agent-review"] : [],
    divergent: i === 4,
    conflicted: i === 0 || i === 4,
    bookmarks: (i === 0
      ? [
          "main",
          "release/ui",
          "review/portable",
          "agent/alex",
          "ui/history",
          "ui/preview",
          "integration/desktop",
        ]
      : i % 6 === 0
        ? ["topic/history"]
        : []
    ).map((name, index) => ({
      name,
      remote: index % 2 ? "origin" : null,
      added: true,
      removed: false,
      conflicted: i === 4,
    })),
  }));
  commits.forEach((item, i) => {
    item.parents = branchingParents(
      commits.map((commit) => commit.id),
      i,
    );
    if (i === 2) item.parents.push(commits[i + 3].id);
  });
  const read = reader.read;
  reader.read = async (handle, query) => {
    if (query.kind === "conflicts") {
      const response = await read(handle, query);
      const value = commits.find((row) => row.id === query.query.commit);
      if (response.kind === "conflicts" && value)
        return {
          ...response,
          data: {
            ...response.data,
            change: value.change_id,
            conflicts: response.data.conflicts.map((item) => ({
              ...item,
              path: "src/history/query.ts",
            })),
          },
        };
      return response;
    }
    if (query.kind === "graph" && query.query[0].graph === "log") {
      const original = await read(handle, query);
      if (original.kind !== "graph") throw new Error("Expected graph fixture");
      const revset = query.query[0].revset;
      if (revset === "invalid()")
        throw new Error("The host rejected this revision query");
      const matching =
        revset === "none()"
          ? []
          : revset === "conflicts()"
            ? commits.filter((row) => row.conflicted)
            : revset === "merges()"
              ? commits.filter((row) => row.parents.length > 1)
              : commits;
      const workspace = query.query[0].workspace;
      const filtered = workspace
        ? matching.filter((row) => row.workspaces.includes(workspace))
        : matching;
      const offset = query.query[1].after
        ? filtered.findIndex((row) => row.id === query.query[1].after!.id) + 1
        : 0;
      const page = filtered.slice(
        offset,
        offset + Number(query.query[1].limit),
      );
      return {
        ...original,
        data: {
          ...original.data,
          data: {
            graph: "log",
            nodes: page.map((commit) => ({ commit, edges: [] })),
          },
          next:
            offset + page.length < filtered.length
              ? { kind: "commit", id: page.at(-1)!.id }
              : null,
        },
      };
    }
    if (query.kind === "commit") {
      const value = commits.find((row) => row.id === query.query.commit);
      if (value) return commitDetail(value);
    }
    if (query.kind === "diff_paths") {
      const offset = query.query.anchor
        ? changes.findIndex((row) => row.path === query.query.anchor) + 1
        : 0;
      const page = changes.slice(offset, offset + 8);
      return {
        kind: "diff_paths",
        data: {
          version: 1,
          ...query.query,
          changes: page,
          next:
            offset + page.length < changes.length ? page.at(-1)!.path : null,
          stats: stats(),
        },
      };
    }
    if (query.kind === "diff")
      return {
        kind: "diff",
        data: {
          version: 1,
          ...query.query,
          changes: changes.filter((row) => row.path === query.query.path),
          stats: stats(),
        },
      };
    return read(handle, query);
  };
  return { commits, changes: changes };
}

import { expect, test } from "vitest";
import type { LocalFileDiffChange } from "@lapismd/jj-history";
import { listingFiles } from "../packages/repository-ui/src/jj/logic/history-files.js";
import { branchingParents } from "../catalog/jj/support/branching-history.js";
import {
  buildRepositoryLogGraph,
  repositoryLogContentLeft,
  repositoryLogSvgWidth,
} from "../packages/repository-ui/src/history/repository-log-graph.js";
import { operationRows } from "../packages/repository-ui/src/jj/logic/graph/model.js";
import { operationNode } from "../catalog/jj/support/reference/operations.js";

test("file rows retain known line counts, conflict terms and unknown binary counts", () => {
  const text: LocalFileDiffChange = {
    path: "src/query.ts",
    before: [],
    after: [],
    sources: [],
    content: {
      status: "text",
      hunks: [
        {
          kind: "different",
          before_start: 0,
          after_start: 0,
          before: "old\n",
          after: "new\nsecond\n",
        },
      ],
    },
  };
  const conflict: LocalFileDiffChange = {
    ...text,
    path: "conflict.ts",
    after: [null, null, null],
    content: { status: "unavailable", reason: "not_requested" },
  };
  const binary: LocalFileDiffChange = {
    ...text,
    path: "image.png",
    content: { status: "unavailable", reason: "binary" },
  };
  expect(listingFiles([text, conflict, binary])).toEqual([
    { path: "src/query.ts", additions: 2, deletions: 1, conflicted: false },
    { path: "conflict.ts", conflicted: true },
    { path: "image.png", conflicted: false },
  ]);
  expect(
    listingFiles([binary], { ...binary, content: text.content })[0],
  ).toMatchObject({ additions: 2, deletions: 1 });
});

test("dense graphs expose sixteen lanes and row-specific content offsets without cycles", () => {
  const ids = Array.from({ length: 64 }, (_, i) =>
    (i + 1).toString(16).padStart(128, "0"),
  );
  const nodes = ids.map((id, i) => ({
    ...operationNode(id),
    parents: branchingParents(ids, i),
  }));
  for (const [i, node] of nodes.entries())
    for (const parent of node.parents)
      expect(ids.indexOf(parent)).toBeGreaterThan(i);
  const graph = buildRepositoryLogGraph(operationRows(nodes));
  expect(repositoryLogSvgWidth(graph)).toBeGreaterThanOrEqual(200);
  expect(new Set(graph.map(repositoryLogContentLeft)).size).toBeGreaterThan(2);
});

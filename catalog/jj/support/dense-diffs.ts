import type { LocalFileDiffChange } from "@lapismd/jj-history";
const text = (
  path: string,
  before: string,
  after: string,
  context = "\nexport { history };\n",
): LocalFileDiffChange => ({
  path,
  before: [],
  after: [],
  sources: [],
  content: {
    status: "text",
    hunks: [
      {
        kind: "matching",
        before_start: 0,
        after_start: 0,
        before: "// Repository history\n",
        after: "// Repository history\n",
      },
      { kind: "different", before_start: 1, after_start: 1, before, after },
      {
        kind: "matching",
        before_start: 1 + before.split("\n").length - 1,
        after_start: 1 + after.split("\n").length - 1,
        before: context,
        after: context,
      },
      {
        kind: "different",
        before_start:
          before.split("\n").length + context.split("\n").length - 1,
        after_start: after.split("\n").length + context.split("\n").length - 1,
        before: "const pageSize = 50;\n",
        after:
          "const pageSize = Math.min(limit, 50);\nconst queryClock = host.now();\n",
      },
    ],
  },
});
export const denseChanges: LocalFileDiffChange[] = [
  text(
    "src/history/controller.ts",
    "const history = read('all()');\n",
    "const history = read({\n  revset: query.revset,\n  operation: pinned.operation,\n  workspace: pinned.workspace,\n});\n",
    [
      "",
      "const queryPresets = [",
      ...Array.from(
        { length: 64 },
        (_, i) =>
          `  { label: "History preset ${i + 1}", revset: "ancestors(@, ${i + 1})" },`,
      ),
      "];",
      "",
      "export { history };",
      "",
    ].join("\n"),
  ),
  text(
    "src/history/graph.ts",
    "const selected = revisions[0];\n",
    "const selected = revisions.find(row => row.id === selection);\n",
  ),
  {
    ...text(
      "docs/history/query-guide.md",
      "# History\n",
      "# Querying repository history\n\nKeep exact operation and comparison identities.\n",
    ),
    sources: [{ kind: "rename", path: "docs/history.md", terms: [] }],
  },
  text(
    "tests/history/selection.test.ts",
    "expect(selection).toBeTruthy();\n",
    "expect(selection.operation).toBe(pin.operation);\nexpect(selection.commit).toBe(commit.id);\n",
  ),
  {
    path: "src/history/query.ts",
    before: [],
    after: [
      null,
      {
        type: "file",
        id: "aa".repeat(20),
        executable: false,
        copy: { kind: "placeholder" },
      },
      {
        type: "file",
        id: "bb".repeat(20),
        executable: false,
        copy: { kind: "placeholder" },
      },
    ],
    sources: [],
    content: { status: "unavailable", reason: "conflict" },
  },
  {
    path: "assets/repository-graph.png",
    before: [],
    after: [],
    sources: [],
    content: { status: "unavailable", reason: "binary" },
  },
  {
    path: "vendor/archive.dat",
    before: [],
    after: [],
    sources: [],
    content: { status: "unavailable", reason: "too_large" },
  },
  ...Array.from({ length: 9 }, (_, i) =>
    text(
      `src/history/panels/panel-${i + 1}.ts`,
      "export const loaded = false;\n",
      "export const loaded = true;\n",
    ),
  ),
];

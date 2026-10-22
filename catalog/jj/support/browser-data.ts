import type {
  RepositoryBrowserCommit,
  RepositoryBrowserFile,
  RepositoryBrowserEntry,
} from "../../../packages/repository-ui/src/jj/index.js";
import { repository, operation, revision } from "./reference/fixture.js";
import { richCommitMessage } from "./reference/rich-commit.js";
import { blameText } from "./reference/blame.js";
export const browserPin = { repository, operation, revision };
export const browserNow = 1792692000;
export const browserCommit: RepositoryBrowserCommit = {
  eventId: revision,
  changeId: "aa".repeat(16),
  message:
    "Extract reusable repository browsing without losing the recorded context\n" +
    richCommitMessage.slice(richCommitMessage.indexOf("\n")),
  author: "Alex Morgan",
  authorEmail: "dev@lapis.md",
  createdAt: browserNow - 7200,
};
const readme = `# Agent UI

Reusable agent chat and repository screens for **LapisMD**.

> Every view keeps its exact operation and revision while the host owns access.

## Packages

| Package | Includes |
| --- | --- |
| Agent UI | Chat, requests, inline comments and transcript tools |
| Repository UI | History, files, blame and conflict presentation |

- [x] Shared controller flow
- [x] App Shell integration
- [ ] Downstream adoption after review

Read the [contributing guide](./CONTRIBUTING.md) or browse [Design Core](https://github.com/lapismd/design-core).

\`\`\`ts
const pin = { repository, operation, revision };
await browser.openDirectory("src/history");
\`\`\`
`;
const code = `import { HistoryReader } from "./types";

/** Keep explicit history selections independent of live workspace changes. */
export class HistoryController {
  constructor(readonly reader: HistoryReader) {}
  async refresh(operation: string) {
    const snapshot = await this.reader.open(operation);
    return snapshot.commits.filter(commit => commit.visible);
  }
}
`;
const text = (
  path: string,
  contents: string,
  index = 0,
): RepositoryBrowserFile => ({
  path,
  contents,
  kind: "text",
  size: new TextEncoder().encode(contents).length,
  commit: {
    ...browserCommit,
    eventId: index ? index.toString(16).padStart(40, "0") : revision,
    author: index % 2 ? "Mira Patel" : "Alex Morgan",
    createdAt: browserNow - (index + 1) * 7200,
    attribution: index === 3 ? "snapshot" : "path_change",
  },
});
export const browserFiles: RepositoryBrowserFile[] = [
  text("README.md", readme),
  text(
    "CONTRIBUTING.md",
    "# Contributing\n\nRun the targeted stories before asking for screen review.\n",
    1,
  ),
  text("LICENSE.md", "# License\n\nApache License 2.0.\n", 2),
  text("Welcome.md", blameText),
  text(
    "docs/guide.md",
    "# Repository browser\n\nNavigate using the directory table, breadcrumbs or file tree.\n\n## Exact reads\n\nA selected revision remains pinned until the host explicitly replaces it.\n",
    3,
  ),
  text("src/history/controller.ts", code, 4),
  text(
    "src/history/types.ts",
    "export interface HistoryReader { open(operation: string): Promise<Snapshot> }\n",
    5,
  ),
  text(
    "src/main.rs",
    'fn main() {\n    println!("Lapis repository history");\n}\n',
    6,
  ),
  text("empty.txt", ""),
  text(
    "package.json",
    '{\n  "name": "@lapismd/agent-ui",\n  "private": true\n}\n',
  ),
  {
    path: "assets/repository-graph.png",
    kind: "binary",
    size: 244320,
    commit: browserCommit,
  },
  {
    path: "src/generated.ts",
    kind: "unavailable",
    reason:
      "The selected revision records unresolved content. Choose an explicit resolved revision to read this file.",
    commit: browserCommit,
  },
  {
    path: "vendor/submodule",
    kind: "unavailable",
    reason:
      "This entry records a submodule reference. The browser does not follow external repositories.",
    commit: browserCommit,
  },
  ...Array.from({ length: 240 }, (_, index) =>
    text(
      `packages/components/Component${String(index + 1).padStart(3, "0")}.svelte`,
      `<script lang="ts">\n  let { label = "Component ${index + 1}" } = $props();\n</script>\n<button>{label}</button>\n`,
      index + 10,
    ),
  ),
];
export function browserEntries(): RepositoryBrowserEntry[] {
  const rows = new Map<string, RepositoryBrowserEntry>();
  for (const file of browserFiles) {
    const segments = file.path.split("/");
    for (let length = 1; length < segments.length; length++) {
      const path = segments.slice(0, length).join("/");
      rows.set(path, {
        type: "tree",
        name: segments[length - 1],
        path,
        commit: browserCommit,
      });
    }
    rows.set(file.path, {
      type: "blob",
      name: segments.at(-1)!,
      path: file.path,
      size: file.size,
      commit: file.commit,
    });
  }
  rows.set("empty-directory", {
    type: "tree",
    name: "empty-directory",
    path: "empty-directory",
  });
  return [...rows.values()].sort(
    (a, b) =>
      Number(b.type === "tree") - Number(a.type === "tree") ||
      a.path.localeCompare(b.path),
  );
}

export const browserReferences: import("../../../packages/repository-ui/src/jj/index.js").RepositoryReferenceChoice[] =
  [
    {
      value: "bookmark:main",
      label: "main",
      kind: "bookmark",
      targets: [browserPin.revision],
    },
    {
      value: "bookmark:ui",
      label: "feature/shared-ui",
      kind: "bookmark",
      targets: ["22".repeat(20)],
    },
    {
      value: "bookmark:review",
      label: "review/conflicted",
      kind: "bookmark",
      targets: ["33".repeat(20), "44".repeat(20)],
    },
    {
      value: "bookmark:deleted",
      label: "old-release",
      kind: "bookmark",
      targets: [],
    },
    {
      value: "change:aaaa",
      commit: browserCommit,
      label: "aaaa · 11111111 · Extract repository browser",
      kind: "change",
      searchTerms: ["Alex Morgan", browserPin.revision],
      targets: [browserPin.revision],
    },
    {
      value: "change:bbbb",
      commit: {
        ...browserCommit,
        eventId: "22".repeat(20),
        changeId: "bbbb",
        author: "Grace Martin",
        authorEmail: "grace@example.test",
        message: "Keep recorded file history beside source previews",
        createdAt: browserNow - 18_000,
      },
      label: "bbbb · 22222222 · Keep recorded file history",
      kind: "change",
      searchTerms: ["Grace Martin", "22".repeat(20)],
      targets: ["22".repeat(20)],
    },
  ];

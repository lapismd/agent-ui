import { commit, revision, parent } from "./reference/fixture.js";
import type { HistoryReader } from "../../../packages/repository-ui/src/jj/index.js";
import { richCommitMessage } from "./reference/rich-commit.js";
import { browserFiles } from "./browser-data.js";
/** In-memory bridge keeps the existing history/blame UI on the same file data. */
export function attachBrowserHistory(reader: HistoryReader) {
  const read = reader.read.bind(reader),
    blame = reader.blame?.bind(reader);
  const contents = (path: string) => {
    const file = browserFiles.find((file) => file.path === path);
    return file?.kind === "text" ? file.contents : "";
  };
  reader.read = async (handle, query) => {
    const revset =
      query.kind === "graph" && query.query[0].graph === "log"
        ? query.query[0].revset
        : undefined;
    if (
      query.kind === "graph" &&
      query.query[0].graph === "log" &&
      browserFiles.some(
        (file) =>
          revset === `all() & files(root-file:${JSON.stringify(file.path)})`,
      )
    ) {
      const response = await read(handle, query);
      if (response.kind === "graph" && response.data.data.graph === "log")
        return {
          ...response,
          data: {
            ...response.data,
            data: {
              ...response.data.data,
              nodes: [revision, parent, "33".repeat(20), "44".repeat(20)].map(
                (id, index) => {
                  const value = commit(id);
                  return {
                    commit: {
                      ...value,
                      description: [
                        richCommitMessage,
                        "Polish the file preview header",
                        "Add source-aware Markdown preview",
                        "Create portable repository fixtures",
                      ][index]!,
                      committer: {
                        ...value.committer,
                        timestamp: {
                          ...value.committer.timestamp,
                          millis:
                            1792252800000 - Math.max(0, index - 1) * 86400000,
                        },
                      },
                      parents:
                        index === 3
                          ? []
                          : [
                              [parent, "33".repeat(20), "44".repeat(20)][
                                index
                              ]!,
                            ],
                    },
                    edges: [],
                  };
                },
              ),
            },
          },
        };
      return response;
    }
    return query.kind === "file_at"
      ? {
          kind: "file_at",
          data: {
            bytes: new TextEncoder().encode(contents(query.query.path)).length,
            text: contents(query.query.path),
            binary: false,
            too_large: false,
          },
        }
      : read(handle, query);
  };
  if (blame)
    reader.blame = async (handle, query) => {
      const page = await blame(handle, query),
        text = contents(query.path);
      const lineCount = text
        ? text.split("\n").length - Number(text.endsWith("\n"))
        : 0;
      const commits = Object.keys(page.commits),
        middle = Math.max(1, Math.floor(lineCount / 2));
      return {
        ...page,
        line_count: lineCount,
        ranges: !lineCount
          ? []
          : lineCount === 1
            ? [{ start: 1, end: 2, commit_id: commits[0] }]
            : [
                { start: 1, end: middle + 1, commit_id: commits[0] },
                {
                  start: middle + 1,
                  end: lineCount + 1,
                  commit_id: commits[1] ?? commits[0],
                },
              ],
      };
    };
}

/** Native query vocabulary supplied by the host; UI completion never validates or executes JJ. */
export interface RepositoryHistoryQueryInfo {
  aliases: readonly string[];
  operators: readonly string[];
  operation_fields: readonly string[];
  callables: readonly {
    signature: string;
    kind: string;
    description: string;
    insert_text: string;
  }[];
  symbols?: readonly string[];
}
export const defaultHistoryQueryInfo: RepositoryHistoryQueryInfo = {
  aliases: ["mutable()", "immutable()"],
  operators: ["::", "..", "&", "|", "~"],
  operation_fields: ["description", "user", "host", "snapshot", "from"],
  callables: [
    "all()",
    "none()",
    "ancestors(revisions)",
    "descendants(revisions)",
    "description(pattern)",
    "author(pattern)",
    "bookmarks(pattern)",
    "conflicts()",
    "merges()",
  ].map((signature) => ({
    signature,
    kind: "function",
    description: "JJ revision-set function",
    insert_text: signature,
  })),
};

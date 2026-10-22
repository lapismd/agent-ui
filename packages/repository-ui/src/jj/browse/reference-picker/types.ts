/** Host-issued snapshot identity; labels never determine a revision. */
export type RepositoryReferenceChoice = {
  value: string;
  label: string;
  kind: "bookmark" | "change";
  searchTerms?: readonly string[];
  /** Optional recorded metadata renders the shared change card. */
  commit?: import("../logic/types.js").RepositoryBrowserCommit;
  /** Zero/multiple targets remain explicit; the host resolves ambiguity. */
  targets: readonly string[];
};

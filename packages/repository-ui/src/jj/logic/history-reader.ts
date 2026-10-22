import type { HistoryClient } from "@lapismd/jj-history";

/** Transport-independent reader supplied by the host, never by persisted state. */
export type HistoryReader = Pick<
  HistoryClient,
  "heads" | "open" | "status" | "read" | "close"
> &
  Partial<Pick<HistoryClient, "blame">>;

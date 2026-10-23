import type { AgentImport } from "./models.js";
/** Recorded identifiers, dates and versions are host evidence, never inferred from labels. */
export function capturedGroups(rows: readonly AgentImport[]) {
  return rows.flatMap((row) => (row.capture ? [row.capture] : []));
}

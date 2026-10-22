/** Read-only host context; native transports and authorization remain outside UI. */
export interface HistoryControllerOptions {
  userEmail?: string;
  now?: () => number;
  /** Bounded native page size, clamped to the display limit. */
  pageSize?: number;
  /** Maximum displayed revisions, between 1 and 200 (default 200). */
  maxCommits?: number;
}
export function historyBounds(options: HistoryControllerOptions) {
  const bounded = (value: number | undefined, fallback: number) =>
    Number.isFinite(value)
      ? Math.max(1, Math.min(200, Math.floor(value!)))
      : fallback;
  const max = bounded(options.maxCommits, 200);
  return { max, page: Math.min(max, bounded(options.pageSize, 50)) };
}

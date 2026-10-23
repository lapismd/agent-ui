import type { AgentDirectoryPage, AgentDirectoryScope } from "./types.js";

/** The configured, running and captured namespaces deliberately remain separate. */
export function directoryPage(
  page: AgentDirectoryPage,
  previous?: AgentDirectoryPage,
  scope: AgentDirectoryScope = {},
) {
  if (
    !page.snapshot ||
    (previous &&
      (page.snapshot !== previous.snapshot ||
        (page.next && page.next === previous.next)))
  )
    throw Error("Agent snapshot changed; refresh the directory");
  const result = structuredClone(page);
  if (
    [...page.sessions, ...page.captures].some(
      (row) => scope.home && row.home !== scope.home,
    )
  )
    throw Error("Agent page belongs to another metadata home");
  for (const key of ["agents", "sessions", "captures"] as const) {
    const rows = previous ? [...previous[key], ...page[key]] : page[key];
    const ids = rows.map((row) =>
      JSON.stringify(["home" in row ? row.home : "", row.id]),
    );
    if (rows.length > 1000 || new Set(ids).size !== rows.length)
      throw Error("Invalid or oversized agent directory");
    Object.assign(result, { [key]: rows });
  }
  return result;
}

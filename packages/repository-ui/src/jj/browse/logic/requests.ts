import type {
  RepositoryBrowserPin,
  RepositoryPathPage,
  RepositoryPathRequest,
  RepositoryBrowserWindow,
} from "./types.js";

export function canonicalPath(path: string, allowEmpty = false): void {
  if (
    (!path && !allowEmpty) ||
    path.length > 4096 ||
    /[\\\0]/u.test(path) ||
    (path &&
      path.split("/").some((part) => !part || part === "." || part === ".."))
  )
    throw new Error("A canonical repository path is required.");
}
export function samePin(
  expected: RepositoryBrowserPin,
  actual: RepositoryBrowserPin,
): void {
  if (
    !expected.repository ||
    !expected.operation ||
    !expected.revision ||
    expected.repository !== actual.repository ||
    expected.operation !== actual.operation ||
    expected.revision !== actual.revision
  )
    throw new Error("The response does not match the selected repository pin.");
}
export const pathPageKey = (path: string, recursive = false) =>
  JSON.stringify([path, recursive]);
/** Adapted from JJ Store's production file pages; cursor scopes stay opaque. */
export function acceptPage(
  request: RepositoryPathRequest,
  page: RepositoryPathPage,
  previous: RepositoryBrowserWindow | undefined,
  maxEntries: number,
): RepositoryBrowserWindow {
  samePin(request.pin, page.pin);
  if (
    page.path !== request.path ||
    page.recursive !== request.recursive ||
    page.entries.length > request.limit
  )
    throw new Error(
      "The directory response changed its requested scope or bounds.",
    );
  const prior = request.cursor ? previous : undefined;
  const entries = [...(prior?.entries ?? [])];
  const paths = new Set(entries.map((entry) => entry.path));
  const prefix = request.path ? `${request.path}/` : "";
  for (const entry of page.entries) {
    canonicalPath(entry.path);
    if (
      !entry.name ||
      !["tree", "blob"].includes(entry.type) ||
      !entry.path.startsWith(prefix) ||
      entry.path === request.path ||
      (!request.recursive && entry.path.slice(prefix.length).includes("/")) ||
      paths.has(entry.path)
    )
      throw new Error("Duplicate or out-of-scope repository directory entry.");
    if (
      entry.size !== undefined &&
      (!Number.isFinite(entry.size) || entry.size < 0)
    )
      throw new Error("Invalid recorded file size.");
    paths.add(entry.path);
    entries.push(entry);
  }
  const cursors = [
    ...(prior?.cursors ?? []),
    ...(request.cursor ? [request.cursor] : []),
  ];
  if (
    page.nextCursor &&
    (cursors.includes(page.nextCursor) || !page.entries.length)
  )
    throw new Error(
      "The directory returned a repeated or nonadvancing cursor.",
    );
  for (const document of page.documents ?? []) canonicalPath(document.path);
  return {
    ...page,
    pin: request.pin,
    entries,
    cursors,
    limitReached: entries.length >= maxEntries && !!page.nextCursor,
  };
}

export function browserBounds(options: {
  pageSize?: number;
  maxEntries?: number;
}) {
  const pageSize = Math.max(
    1,
    Math.min(200, Math.floor(options.pageSize ?? 100)),
  );
  const maxEntries = Math.max(
    pageSize,
    Math.min(5000, Math.floor(options.maxEntries ?? 1000)),
  );
  if (!Number.isFinite(pageSize) || !Number.isFinite(maxEntries))
    throw new Error("Finite directory bounds are required.");
  return { pageSize, maxEntries };
}

export function acceptFile(
  request: { pin: RepositoryBrowserPin; path: string },
  result: {
    pin: RepositoryBrowserPin;
    file: import("./types.js").RepositoryBrowserFile;
  },
) {
  samePin(request.pin, result.pin);
  const file = result.file;
  if (
    file.path !== request.path ||
    !["text", "binary", "unavailable"].includes(file.kind) ||
    (file.kind === "text" && typeof file.contents !== "string") ||
    (file.kind === "unavailable" && typeof file.reason !== "string")
  )
    throw new Error(
      "The file response changed its requested path or content kind.",
    );
  return file;
}

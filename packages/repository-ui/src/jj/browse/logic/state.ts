import type { RepositoryBrowserPin, RepositoryBrowserState } from "./types.js";
export const initialBrowserState = (
  pin: RepositoryBrowserPin,
): RepositoryBrowserState => ({
  pin: Object.freeze({ ...pin }),
  directory: "",
  directoryPhase: "idle",
  filePhase: "idle",
  mode: "tree",
  display: "source",
  pages: {},
  loadingPages: new Set(),
  collapsedDirectoryPaths: new Set(),
});

export function browserTreeEntries(state: RepositoryBrowserState) {
  return [
    ...new Map(
      Object.values(state.pages)
        .flatMap((page) => page.entries)
        .map((entry) => [entry.path, entry]),
    ).values(),
  ];
}

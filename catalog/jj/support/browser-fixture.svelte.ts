import {
  RepositoryBrowserController,
  type RepositoryBrowserPort,
  type RepositoryReferenceChoice,
} from "../../../packages/repository-ui/src/jj/index.js";
import {
  browserPin,
  browserFiles,
  browserEntries,
  browserCommit,
} from "./browser-data.js";
export function createBrowserDemo(variant: string) {
  const events = $state({
    reads: [] as string[],
    actions: [] as string[],
    errors: [] as string[],
  });
  let pathsAttempt = 0,
    fileAttempt = 0;
  const rows = variant === "Empty" ? [] : browserEntries();
  const port: RepositoryBrowserPort = {
    async paths(request) {
      events.reads.push(
        `paths:${request.pin.operation}:${request.pin.revision}:${request.path}:${request.cursor ?? "first"}`,
      );
      if (variant === "Loading")
        await new Promise<void>((_, reject) =>
          request.signal.addEventListener(
            "abort",
            () => reject(new Error("Closed fixture read")),
            { once: true },
          ),
        );
      if (variant === "Unavailable" && pathsAttempt++ === 0)
        throw new Error("In-memory directory refusal");
      const prefix = request.path ? `${request.path}/` : "";
      const filtered = rows.filter(
        (entry) =>
          entry.path.startsWith(prefix) &&
          entry.path !== request.path &&
          (request.recursive || !entry.path.slice(prefix.length).includes("/")),
      );
      const offset = Number(request.cursor ?? "0");
      return {
        pin: request.pin,
        path: request.path,
        recursive: request.recursive,
        entries: filtered.slice(offset, offset + request.limit),
        nextCursor:
          offset + request.limit < filtered.length
            ? String(offset + request.limit)
            : undefined,
        latestCommit: variant === "Empty" ? undefined : browserCommit,
        documents:
          !request.path && variant !== "Empty"
            ? browserFiles.filter((file) =>
                ["README.md", "CONTRIBUTING.md", "LICENSE.md"].includes(
                  file.path,
                ),
              )
            : [],
      };
    },
    async file(request) {
      events.reads.push(
        `file:${request.pin.operation}:${request.pin.revision}:${request.path}`,
      );
      if (variant === "FileLoading")
        await new Promise<void>((_, reject) =>
          request.signal.addEventListener(
            "abort",
            () => reject(new Error("Closed fixture file")),
            { once: true },
          ),
        );
      if (variant === "Retry" && fileAttempt++ === 0)
        throw new Error("In-memory file refusal");
      const file = browserFiles.find((file) => file.path === request.path);
      if (!file)
        throw new Error("The fixture has no recorded file at this path");
      return { pin: request.pin, file };
    },
  };
  const controller = new RepositoryBrowserController(port, browserPin, {
    pageSize: 40,
    maxEntries: 120,
    report: (cause) => events.errors.push(String(cause)),
  });
  async function start() {
    await controller.refresh();
    if (["Dense", "Paged"].includes(variant))
      await controller.openDirectory("packages/components");
    else if (variant === "Nested")
      await controller.openDirectory("src/history");
    else {
      const path = (
        {
          Markdown: "README.md",
          FileLoading: "README.md",
          Source: "src/history/controller.ts",
          Binary: "assets/repository-graph.png",
          EmptyFile: "empty.txt",
          UnavailableFile: "src/generated.ts",
          Retry: "README.md",
          History: "README.md",
          Blame: "Welcome.md",
        } as Record<string, string>
      )[variant];
      if (path) await controller.openFile(path);
    }
  }
  return {
    controller,
    events,
    start,
    selectReference(choice: RepositoryReferenceChoice) {
      events.actions.push(
        `reference:${choice.value}:${choice.targets.join(",")}`,
      );
      if (choice.targets.length === 1)
        void controller.setPin({
          ...controller.state.pin,
          revision: choice.targets[0]!,
        });
    },
    copyText: async (value: string) => {
      events.actions.push(`copy:${value}`);
    },
  };
}

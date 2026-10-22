import { cloneWorkspace } from "../../../packages/repository-ui/src/stacks/types.js";
import {
  StackWorkspaceController,
  type StackWorkspaceAdapter,
  type WorkspaceSnapshot,
  type StackCommit,
} from "../../../packages/repository-ui/src/stacks/index.js";
import { workspaceSourceFiles } from "../../../packages/repository-ui/src/stacks/files.js";
import {
  hex,
  fileSet,
  stackReviewSnapshot,
  stackNow,
} from "./stack-workspace-data.js";
export { stackNow } from "./stack-workspace-data.js";
const summary = (
  file: import("../../../packages/repository-ui/src/stacks/index.js").WorkspaceFile,
) => ({
  ...file,
  patch: undefined,
  hunks: [],
  content:
    file.content?.status === "unavailable"
      ? file.content
      : { status: "unloaded" as const },
});
export function createStackReview(
  variant = "Basic",
  page: "branches" | "workspace" = "workspace",
) {
  let data = stackReviewSnapshot(variant),
    closed = false,
    reads = 0;
  const requests: { kind: string; request: unknown }[] = [],
    commands: unknown[] = [];
  let release: (() => void) | undefined;
  const targetCommits: StackCommit[] = Array.from(
    { length: 47 },
    (_, index) => ({
      id: hex(500 - index),
      changeId: hex(500 - index, 32),
      author: "Sam Rivera",
      email: "sam@example.test",
      createdAt: stackNow - 86400 - index * 60,
      message: `Target history change ${47 - index}`,
      immutable: true,
      files: fileSet(400 + index),
      graph: {
        parents: [hex(499 - index)],
        edges: [],
        bookmarks: [],
        workspaces: [],
        conflicted: false,
        divergent: false,
      },
    }),
  );
  function files(source: string) {
    return (
      targetCommits.find((commit) => commit.id === source)?.files ??
      workspaceSourceFiles(data, source)
    );
  }
  function guard(request: {
    repository: string;
    revision: number;
    readKey?: string;
  }) {
    if (
      request.repository !== data.repository ||
      request.revision !== data.revision ||
      request.readKey !== data.readKey
    )
      throw Error("Mismatched recorded scope");
  }
  const adapter: StackWorkspaceAdapter = {
    async read() {
      requests.push({ kind: "snapshot", request: data.readKey });
      reads++;
      if (variant === "Loading")
        await new Promise<void>((resolve) => (release = resolve));
      if (variant === "Unavailable" || (variant === "Retry" && reads === 1))
        throw Error("Recorded workspace read is unavailable");
      return cloneWorkspace({
        ...data,
        stacks: data.stacks.map((stack) => ({
          ...stack,
          commits: stack.commits.map((commit) => ({
            ...commit,
            files: commit.files.map(summary),
          })),
        })),
        workspaces: data.workspaces.map((w) => ({
          ...w,
          unassigned: w.unassigned.map(summary),
        })),
      });
    },
    async readStackHistory(request) {
      if (variant === "StackUnavailable")
        throw Error("Recorded stack history unavailable");
      if (variant === "StackLoading")
        await new Promise<void>((resolve) => (release = resolve));
      guard(request);
      requests.push({ kind: "stack-history", request });
      const stack = data.stacks.find((stack) => stack.id === request.stack)!;
      const values = [...stack.commits].reverse();
      const start = Number(request.cursor ?? 0),
        end = Math.min(
          start + (variant === "Paged" ? 4 : request.limit),
          values.length,
        );
      return {
        commits: cloneWorkspace(
          values
            .slice(start, end)
            .map((commit) => ({ ...commit, files: commit.files.map(summary) })),
        ),
        ...(end < values.length ? { nextCursor: String(end) } : {}),
      };
    },
    async readTargetHistory(request) {
      guard(request);
      requests.push({ kind: "target-history", request });
      const start = Number(request.cursor ?? 0),
        end = Math.min(start + request.limit, targetCommits.length);
      return {
        commits: cloneWorkspace(
          targetCommits
            .slice(start, end)
            .map((commit) => ({ ...commit, files: commit.files.map(summary) })),
        ),
        nextCursor: end < targetCommits.length ? String(end) : undefined,
        total: targetCommits.length,
      };
    },
    async readSourceFiles(request) {
      if (variant === "FilesUnavailable")
        throw Error("Recorded source files unavailable");
      guard(request);
      requests.push({
        kind: "files",
        request: { ...request, signal: undefined },
      });
      const values = files(request.source),
        start = Number(request.cursor ?? 0),
        end = Math.min(start + (variant === "Paged" ? 2 : 50), values.length);
      return {
        files: cloneWorkspace(values.slice(start, end).map(summary)),
        ...(end < values.length ? { nextCursor: String(end) } : {}),
      };
    },
    async readFileDiff(request) {
      if (variant === "DiffUnavailable")
        throw Error("Recorded file diff unavailable");
      if (variant === "DiffLoading")
        await new Promise<void>((resolve) => (release = resolve));
      guard(request);
      requests.push({
        kind: "diff",
        request: { ...request, signal: undefined },
      });
      const file = files(request.source).find(
        (file) => file.path === request.path,
      );
      if (!file) throw Error("File not present in the recorded source");
      return cloneWorkspace(file);
    },
    async preview() {
      throw Error("Presentation must request commands through the host");
    },
    async apply() {
      throw Error("Presentation cannot execute commands");
    },
    async status() {
      throw Error("Presentation cannot inspect command receipts");
    },
    close() {
      closed = true;
      release?.();
    },
  };
  const controller = new StackWorkspaceController(adapter);
  controller.page = page;
  return {
    controller,
    requests,
    commands,
    copyText: async (value: string) => {
      commands.push({ copy: value });
    },
    requestCommand: (command: unknown, snapshot: WorkspaceSnapshot) => {
      commands.push({
        command,
        readKey: snapshot.readKey,
        workspace: snapshot.active,
      });
    },
    async selectWorkspace(id: string) {
      data = {
        ...data,
        active: id,
        readKey: `operation:recorded-7:workspace:${id}`,
      };
      await controller.refresh();
    },
    async start() {
      await controller.refresh();
      if (!controller.snapshot || controller.error || closed) return;
      if (page === "branches" && data.stacks.length)
        controller.selectStack(data.stacks[0]!.id, data.stacks[0]!.name);
      if (variant === "TargetHistory") await controller.selectTargetBranch();
      if (
        [
          "SelectedFiles",
          "Binary",
          "Conflicts",
          "DiffUnavailable",
          "DiffLoading",
          "NoText",
        ].includes(variant)
      ) {
        const source =
          page === "workspace"
            ? "unassigned"
            : data.stacks[0]!.commits.at(-1)!.id;
        if (page === "branches")
          controller.selectCommit(source, data.stacks[0]!.id);
        await controller.details.loadFiles(source);
        const path =
          variant === "NoText"
            ? files(source)[4]!.path
            : variant === "Binary"
              ? files(source)[3]!.path
              : variant === "Conflicts" && page === "workspace"
                ? "src/shared/conflict.ts"
                : files(source)[0]!.path;
        controller.selectFile(source, path);
      }
    },
    close() {
      controller.close();
    },
  };
}

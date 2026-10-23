import {
  attachLargeBlame,
  largeBlamePath,
  longLinesBlameContents,
  largeCommitStats,
} from "./large-blame.js";
import { richCommitMessage } from "./reference/rich-commit.js";
import { holdPreparation } from "./hold-preparation.js";
import { collectionVariants, collectionChanges } from "./diff-collection.js";
import { changeStats } from "../../../packages/repository-ui/src/jj/logic/history-files.js";
import { attachDenseHistory } from "./dense-history.js";
import { attachDenseOperations } from "./dense-operations.js";
import {
  HistoryController,
  OperationController,
  FileHistoryController,
  BlameController,
  RestoreController,
} from "../../../packages/repository-ui/src/jj/index.js";
import { operationFixture, operationNode } from "./reference/operations.js";
import {
  operation,
  otherOperation,
  revision,
  commit,
} from "./reference/fixture.js";
import type {
  HistorySourcePicker,
  HistorySource,
} from "../../../packages/repository-ui/src/jj/index.js";
export function createJjDemo(part: string, variant = "Basic") {
  const op =
    part === "RepositoryOperations" || part === "RepositoryOperationColumn";
  const scenario =
    variant === "Loading"
      ? part === "RepositoryBlamePanel"
        ? "blame-preparing"
        : op
          ? "file-preparing"
          : "preparing"
      : variant === "Unavailable"
        ? part === "RepositoryBlamePanel"
          ? "blame-failure"
          : op
            ? "operation-admission-failure"
            : "graph-failure"
        : variant === "Empty"
          ? op
            ? "operation-empty"
            : "empty"
          : variant === "Merge"
            ? "merge"
            : variant === "RichHistory"
              ? "rich-history"
              : variant === "Metadata"
                ? "operation-rich"
                : "ready";
  const scenarioForPart =
    part === "RepositoryFileHistory" && variant === "NoRepositoryHistory"
      ? "empty"
      : part === "RepositoryFileHistory" && variant === "OperationSelection"
        ? "multiple"
        : part === "RepositoryOperationColumn" && variant === "ParentLoading"
          ? "operation-parents-preparing"
          : part === "RepositoryOperationColumn" && variant === "Loading"
            ? "operation-details-preparing"
            : part === "RepositoryOperationColumn" && variant === "Unavailable"
              ? "operation-detail-failure"
              : scenario;
  const fixture = operationFixture(scenarioForPart);
  if (part === "RepositoryFileHistory" && variant === "LongDescription")
    fixture.latest.description = richCommitMessage;
  const denseOperations =
    part === "OperationReview"
      ? attachDenseOperations(fixture.reader, variant)
      : undefined;
  const dense = [
    ...collectionVariants,
    "DenseHistory",
    "PagedHistory",
    "BoundedHistory",
    "HostActions",
    "HostControls",
    "Complex",
    "Binary",
    "Renamed",
  ].includes(variant)
    ? attachDenseHistory(
        fixture.reader,
        collectionVariants.includes(variant) ? collectionChanges : undefined,
      )
    : undefined;
  const largeBlame =
    part === "RepositoryBlamePanel" &&
    ["Comprehensive", "NoWrap", "LongLines"].includes(variant);
  if (largeBlame)
    attachLargeBlame(
      fixture.reader,
      variant === "LongLines" ? longLinesBlameContents : undefined,
    );
  if (scenario === "preparing" || scenario === "file-preparing")
    holdPreparation(fixture.reader);
  const state = $state({
    errors: [] as string[],
    actions: [] as string[],
    source: "backup" as HistorySource,
    closed: false,
  });
  const feedback = {
    report(error: unknown) {
      state.errors.push(error instanceof Error ? error.message : String(error));
    },
    recovered() {
      state.errors = [];
    },
  };
  const history = new HistoryController(
    fixture.reader,
    feedback,
    undefined,
    dense
      ? {
          userEmail: "dev@lapis.md",
          now: () => 1792674000000,
          pageSize: 12,
          maxCommits: variant === "BoundedHistory" ? 6 : 200,
        }
      : undefined,
  );
  const operations = new OperationController(
    fixture.reader,
    feedback,
    undefined,
    denseOperations
      ? { pageSize: 12, maxOperations: variant === "BoundedHistory" ? 6 : 200 }
      : undefined,
  );
  const files = new FileHistoryController(fixture.reader, feedback);
  const blame = new BlameController(fixture.reader, feedback);
  const restore = new RestoreController(
    {
      async preview(checkpoint, path) {
        return {
          checkpoint,
          path,
          expected: "preview-exact",
          bytes: 512,
          deleted: false,
        };
      },
      async previewVault(checkpoint) {
        return {
          checkpoint,
          expected: "preview-vault-exact",
          added: 1,
          modified: 2,
          deleted: 0,
        };
      },
      async apply(request) {
        state.actions.push(`restore:${request.request_id}`);
      },
      async applyVault(request) {
        state.actions.push(`restore-vault:${request.request_id}`);
      },
      async keepCurrent() {
        state.actions.push("keep-current");
      },
    },
    async (_path, action) => action(),
    feedback,
  );
  const source: HistorySourcePicker = {
    get selected() {
      return state.source;
    },
    async load() {
      return { original: variant !== "OriginalUnavailable" };
    },
    select(value) {
      state.source = value;
      state.actions.push(`source:${value}`);
    },
    report: feedback.report,
  };
  const copyText = async (value: string) => {
    state.actions.push(`copy:${value}`);
  };
  const start = async () => {
    if (part === "RepositoryPanel" || part === "RepositoryOperations") return;
    if (part === "RepositoryRestoreDialog") {
      if (variant === "Recovery")
        restore.recover({
          version: 1,
          scope: "file",
          request: {
            request_id: "retained-restore-request",
            checkpoint: revision,
            path: "Welcome.md",
            expected: "preview-exact",
          },
        });
      else if (variant === "Vault") await restore.prepareVault(revision);
      else await restore.prepare(revision, "Welcome.md");
      return;
    }
    if (part === "RepositoryBlamePanel") {
      await blame.open({
        operation,
        commit: revision,
        path: largeBlame ? largeBlamePath : "Welcome.md",
      });
      return;
    }
    if (part === "RepositoryFileHistory") {
      if (variant !== "Empty") await files.follow("Welcome.md");
      return;
    }
    if (part === "RepositoryOperationColumn") {
      await operations.refresh();
      const node = operations.state.nodes[0];
      if (node) await operations.select(node);
      return;
    }
    if (part === "RepositoryRevisions") {
      await history.refresh();
      if (history.state.commits[0])
        await history.selectRevision(history.state.commits[0]);
      return;
    }
  };
  return {
    fixture,
    // Host-computed totals cover the full fixture, including pages not loaded by UI.
    diffStats: (denseOperations?.changes ?? dense?.changes)?.reduce(
      (total, change) => {
        const stats = changeStats(change);
        return {
          additions: total.additions + (stats?.additions ?? 0),
          deletions: total.deletions + (stats?.deletions ?? 0),
        };
      },
      { additions: 0, deletions: 0 },
    ),
    largeCommitStats,
    state,
    history,
    operations,
    files,
    blame,
    restore,
    source,
    copyText,
    start,
    commits: dense?.commits ?? [fixture.latest, commit("22".repeat(20))],
    dense,
    nodes: [operationNode(), operationNode(otherOperation, [])],
    change: {
      path: "Welcome.md",
      before: [],
      after: [],
      sources: [],
      content: {
        status: "text" as const,
        hunks: [
          {
            kind: "different" as const,
            before_start: 1,
            after_start: 1,
            before: "# Notes\nOld text\n",
            after: "# Notes\nRetained history\n",
          },
        ],
      },
    },
    close: async () => {
      state.closed = true;
      restore.close();
      await Promise.all([
        history.close(),
        operations.close(),
        files.close(),
        blame.close(),
      ]);
      await fixture.close();
    },
  };
}
export type JjDemo = ReturnType<typeof createJjDemo>;

import { AiHistoryInspection } from "../../../packages/agent-ui/src/chat/turn-changes/controller.svelte.js";
import type {
  AiTurnRecord,
  AgentChangesPort,
  AiUndoRequest,
  TurnComparison,
} from "../../../packages/agent-ui/src/chat/turn-changes/models.js";
export function memoryChanges(
  state:
    | "ready"
    | "incomplete"
    | "empty"
    | "unavailable"
    | "loading"
    | "bounded"
    | "checkpoint" = "ready",
) {
  const record: AiTurnRecord = {
    context: {
      conversation: "demo-session",
      turn: "review-turn",
      message: "answer",
      agent: "Reviewer",
      requested_model: "gpt-5",
    },
    phase: state === "incomplete" ? "incomplete" : "complete",
    before: { commit: "7d60c8a13fa7", change_id: "zvryxwql" },
    after: { commit: "a190f1e58c2d", change_id: "zvryxwql" },
    started_at: 1,
  };
  const files = [
    "src/agent.ts",
    "notes/review.md",
    "src/status.ts",
    "tests/agent.test.ts",
  ].map((path, index) => ({
    path,
    status: "modified" as const,
    additions: index + 1,
    deletions: 1,
    diff: {
      path,
      content: {
        oldText: path.endsWith(".md")
          ? "# Review\n\nPending review.\n"
          : "export const enabled = false;\n",
        newText: path.endsWith(".md")
          ? "# Review\n\nApproved captured changes.\n"
          : "export const enabled = true;\n",
      },
    },
  }));
  const calls: { kind: string; value: unknown }[] = [];
  let fault = state === "unavailable";
  const port: AgentChangesPort = {
    async compare() {
      calls.push({ kind: "compare", value: record });
      if (state === "loading") await new Promise(() => {});
      if (fault) {
        fault = false;
        throw new Error("Captured comparison temporarily unavailable.");
      }
      return {
        files: state === "empty" ? [] : files,
        complete: state !== "bounded",
        countsComplete: true,
      } satisfies TurnComparison;
    },
    async readFile(_, path) {
      const file = files.find((file) => file.path === path);
      if (!file) throw new Error("Unknown file.");
      return file.diff;
    },
    async previewUndo(selected, paths) {
      const request: AiUndoRequest = {
        request_id: crypto.randomUUID(),
        conversation: selected.context.conversation,
        turn: selected.context.turn,
        checkpoint: "captured-safety-checkpoint",
        paths: paths.length ? [...paths] : files.map((file) => file.path),
      };
      calls.push({ kind: "preview", value: request });
      return request;
    },
    async undo(request) {
      calls.push({ kind: "undo", value: structuredClone(request) });
    },
    report(error) {
      calls.push({ kind: "error", value: String(error) });
    },
    async copyText(value) {
      calls.push({ kind: "copy", value });
    },
  };
  const history = $state({
    records: [record],
    pending:
      state === "checkpoint"
        ? {
            choose(value: "continue" | "retry") {
              calls.push({ kind: "checkpoint", value });
              history.pending = undefined;
            },
          }
        : undefined,
    cancelPending() {
      history.pending = undefined;
    },
    report: port.report,
  });
  return { inspection: new AiHistoryInspection(history, port), calls };
}

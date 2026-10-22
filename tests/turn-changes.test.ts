import { describe, it, expect, vi } from "vitest";
import { AiHistoryInspection } from "../packages/agent-ui/src/chat/turn-changes/controller.svelte.js";
import { historyTranscript } from "../packages/agent-ui/src/chat/turn-changes/transcript.js";
import type {
  AgentChangesPort,
  AiTurnRecord,
  AiUndoRequest,
  TurnComparison,
} from "../packages/agent-ui/src/chat/turn-changes/models.js";
const record: AiTurnRecord = {
  context: {
    conversation: "session",
    turn: "turn-1",
    message: "prompt",
    agent: "Reviewer",
  },
  phase: "complete",
  started_at: 1,
  before: { commit: "before", change_id: "change" },
  after: { commit: "after", change_id: "change" },
};
const comparison: TurnComparison = {
  files: [{ path: "a.ts", status: "modified" }],
  complete: true,
  countsComplete: true,
};
const preview: AiUndoRequest = {
  request_id: "exact-undo",
  conversation: "session",
  turn: "turn-1",
  paths: ["a.ts"],
  checkpoint: "exact-checkpoint",
};
const deferred = <T>() => {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { resolve, promise };
};
function fixture(overrides: Partial<AgentChangesPort> = {}) {
  const port: AgentChangesPort = {
    compare: vi.fn(async () => comparison),
    readFile: vi.fn(async (_, path) => ({
      path,
      content: { oldText: "before", newText: "after" },
    })),
    previewUndo: vi.fn(async () => preview),
    undo: vi.fn(async () => {}),
    copyText: vi.fn(async () => {}),
    report: vi.fn(),
    ...overrides,
  };
  const history = {
    records: [record],
    cancelPending() {},
    report: port.report,
  };
  return { port, controller: new AiHistoryInspection(history, port) };
}
describe("Saved turn presentation controller", () => {
  it("reads once per immutable boundary and never mutates on construction or inspection", async () => {
    const { controller, port } = fixture();
    expect(port.compare).not.toHaveBeenCalled();
    await controller.summary(record);
    await controller.summary(record);
    expect(port.compare).toHaveBeenCalledTimes(1);
    expect(port.undo).not.toHaveBeenCalled();
    await controller.summary({
      ...record,
      after: { commit: "other", change_id: "change" },
    });
    expect(port.compare).toHaveBeenCalledTimes(2);
  });
  it("fences late comparison reads after another selection or disposal", async () => {
    const pending = deferred<TurnComparison>();
    const { controller } = fixture({
      compare: vi
        .fn()
        .mockReturnValueOnce(pending.promise)
        .mockResolvedValue(comparison),
    });
    const first = controller.show(record);
    const next = { ...record, context: { ...record.context, turn: "turn-2" } };
    await controller.show(next);
    pending.resolve({ ...comparison, files: [] });
    await first;
    expect(controller.record).toEqual(next);
    expect(controller.comparison?.files).toHaveLength(1);
    controller.dispose();
    await controller.show(record);
    expect(controller.open).toBe(false);
  });
  it("does not replace the current file with a late read", async () => {
    const pending =
      deferred<Awaited<ReturnType<AgentChangesPort["readFile"]>>>();
    const { controller } = fixture({ readFile: () => pending.promise });
    await controller.show(record);
    const selected = controller.select("a.ts");
    controller.closeFile();
    pending.resolve({ path: "a.ts", content: { oldText: "x", newText: "y" } });
    await selected;
    expect(controller.path).toBeUndefined();
    expect(controller.diff).toBeUndefined();
  });
  it("retains a failed undo request and never replays without another explicit confirmation", async () => {
    const undo = vi
      .fn()
      .mockRejectedValueOnce(new Error("Awaiting host reconciliation"))
      .mockResolvedValue(undefined);
    const { controller, port } = fixture({ undo });
    await controller.previewUndo(record, ["a.ts"]);
    expect(undo).not.toHaveBeenCalled();
    await controller.applyUndo();
    expect(controller.undo).toEqual(preview);
    expect(port.report).toHaveBeenCalledTimes(1);
    await controller.applyUndo();
    expect(undo).toHaveBeenCalledTimes(2);
    expect(undo).toHaveBeenLastCalledWith(preview);
    expect(controller.undo).toBeUndefined();
  });
  it("rejects a preview for another selection and ignores a late preview after disposal", async () => {
    const { controller, port } = fixture({
      previewUndo: async () => ({ ...preview, turn: "wrong" }),
    });
    await controller.previewUndo(record);
    expect(controller.undo).toBeUndefined();
    expect(port.report).toHaveBeenCalledTimes(1);
    const pending = deferred<AiUndoRequest>();
    const other = fixture({ previewUndo: () => pending.promise });
    const work = other.controller.previewUndo(record);
    other.controller.dispose();
    pending.resolve(preview);
    await work;
    expect(other.controller.undo).toBeUndefined();
    expect(other.controller.undoBusy).toBe(false);
  });
  it("inserts participant comparisons at an exact host-provided item, without changing captured rows", () => {
    const items = [
      { id: "prompt", kind: "message" as const, label: "Request", blocks: [] },
      {
        id: "participant-1",
        kind: "message" as const,
        label: "First",
        blocks: [],
      },
      {
        id: "participant-2",
        kind: "message" as const,
        label: "Second",
        blocks: [],
      },
    ];
    const result = historyTranscript(items, [
      { ...record, afterItemId: "participant-1" },
    ]);
    expect(result.map((item) => item.id)).toEqual([
      "prompt",
      "participant-1",
      "history/turn-1",
      "participant-2",
    ]);
    expect(result[0]).toBe(items[0]);
    expect(result[2].blocks[0].commentable).toBe(false);
  });
});

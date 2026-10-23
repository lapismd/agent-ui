import { expect, test } from "vitest";
import { capturedGroups } from "../packages/agent-ui/src/core/captures.js";
import type { AgentImport } from "../packages/agent-ui/src/core/models.js";
test("recorded capture projection preserves exact host metadata and omits missing evidence", () => {
  const row: AgentImport = {
    id: "input",
    title: "Recorded",
    source: "Codex",
    items: [],
    progress: 100,
    status: "ready",
  };
  expect(capturedGroups([row])).toEqual([]);
  const capture = {
    id: "retained",
    title: "Actual capture",
    group: "Notes",
    profile: "cursor-jsonl-v1",
    versions: [
      {
        id: "version-42",
        sequence: 42,
        updatedAt: "2025-01-02T03:04:05Z",
        incomplete: true,
      },
    ],
  };
  expect(capturedGroups([{ ...row, capture }])[0]).toBe(capture);
});

import { expect, test } from "vitest";
import { StackWorkspaceController } from "../packages/repository-ui/src/stacks/controller.svelte.js";
import { WORKSPACE_DRAG_TYPE } from "../packages/repository-ui/src/stacks/drag.js";
import { workspaceFileDrag } from "../packages/repository-ui/src/stacks/file-drag.js";
import {
  selectedWorkspaceChanges,
  workspaceDropHandlers,
} from "../packages/repository-ui/src/jj/workspace/stack-lane/drag-handlers.js";
import { MockStackWorkspaceAdapter } from "../catalog/support/stacks/adapter.js";
import type { WorkspaceCommand } from "../packages/repository-ui/src/stacks/types.js";

async function setup() {
  const adapter = new MockStackWorkspaceAdapter();
  const controller = new StackWorkspaceController(adapter);
  await controller.refresh();
  const calls: WorkspaceCommand[] = [];
  const handlers = workspaceDropHandlers(
    controller,
    { copyText: async () => {}, onCommand: (command) => calls.push(command) },
    () => ({ kind: "stage", id: "api" }),
  );
  return { adapter, controller, calls, handlers };
}
function event(
  payload = JSON.stringify({
    kind: "selection",
    selection: { source: "unassigned", path: "src/settings.ts" },
  }),
  type = WORKSPACE_DRAG_TYPE,
) {
  return {
    dataTransfer: { types: [type], getData: () => payload },
    preventDefault() {},
    stopPropagation() {},
  } as unknown as DragEvent;
}

test("drop requests a typed host command without previewing or applying", async () => {
  const state = await setup();
  try {
    state.handlers.ondrop(event());
    expect(state.calls).toEqual([
      {
        kind: "create_commit",
        stack: "api",
        message: "Selected changes",
        selection: { source: "unassigned", path: "src/settings.ts" },
      },
    ]);
    expect(state.controller.preview).toBeNull();
    expect(state.adapter.calls).toEqual([]);
  } finally {
    state.controller.close();
  }
});

test("stale, foreign and hostless drops request nothing", async () => {
  const state = await setup();
  try {
    state.handlers.ondrop(event("foreign", "text/plain"));
    state.controller.snapshot!.workspaces[0]!.unassigned = [];
    state.handlers.ondrop(event());
    workspaceDropHandlers(
      state.controller,
      { copyText: async () => {} },
      () => ({ kind: "stage", id: "api" }),
    ).ondrop(event());
    expect(state.calls).toEqual([]);
    expect(state.adapter.calls).toEqual([]);
  } finally {
    state.controller.close();
  }
});

test("pending preview disables file sources and blocks drops", async () => {
  const state = await setup();
  try {
    const drag = workspaceFileDrag(state.controller, () => "unassigned");
    const context = { path: "src/settings.ts" } as Parameters<
      NonNullable<typeof drag.fileDraggable>
    >[0];
    expect(drag.fileDraggable!(context)).toBe(true);
    await state.controller.prepare({
      kind: "create_commit",
      stack: "api",
      message: "Preview only",
    });
    expect(drag.fileDraggable!(context)).toBe(false);
    state.handlers.ondrop(event());
    expect(state.calls).toEqual([]);
  } finally {
    state.controller.close();
  }
});

test("keyboard selections preserve hunk tokens and reject an empty selection", async () => {
  const state = await setup();
  try {
    const id = state.controller.filesFor("unassigned")[0]!.hunks[0]!.id;
    state.controller.selectFile("unassigned", "src/settings.ts", [id]);
    expect(selectedWorkspaceChanges(state.controller)).toEqual({
      source: "unassigned",
      path: "src/settings.ts",
      hunks: [id],
    });
    state.controller.selectFile("unassigned", "src/settings.ts", []);
    expect(selectedWorkspaceChanges(state.controller)).toBeNull();
    state.controller.drag.payload = "active";
    state.handlers.ondragend();
    expect(state.controller.drag.payload).toBeNull();
  } finally {
    state.controller.close();
  }
});

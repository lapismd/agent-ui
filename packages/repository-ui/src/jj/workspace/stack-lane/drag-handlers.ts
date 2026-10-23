// SPDX-License-Identifier: Apache-2.0; adapted from JJ Store stack-workspace event wiring.
import {
  commitEventRow,
  commitRowTarget,
} from "../../../stacks/commit-placement.js";
import { workspaceAggregateSource } from "../../../stacks/files.js";
import type { WorkspaceDropTarget } from "../../../stacks/drag.js";
import type {
  StackWorkspaceController,
  StackCommit,
  WorkspaceSelection,
} from "../../../stacks/index.js";
import type { RepositoryStackHost } from "./types.js";

/** Explicit current selection for the keyboard counterpart of a drop. */
export function selectedWorkspaceChanges(
  controller: StackWorkspaceController,
): WorkspaceSelection | null {
  if (!controller.snapshot || !controller.selectedPath || controller.locked)
    return null;
  const file = controller
    .filesFor(controller.source)
    .find((file) => file.path === controller.selectedPath);
  const source = file?.selectionSource ?? controller.source;
  if (
    !file ||
    workspaceAggregateSource(source) ||
    (source !== "unassigned" &&
      !controller.snapshot.stacks.some((stack) =>
        stack.commits.some(
          (commit) => commit.id === source && !commit.immutable,
        ),
      ))
  )
    return null;
  const diff = controller.diffs.find(
    (diff) => diff.source === controller.source && diff.path === file.path,
  );
  if (diff?.hunks && !diff.hunks.length) return null;
  return {
    source,
    path: file.path,
    ...(diff?.hunks ? { hunks: diff.hunks } : {}),
  };
}

/** Every drop revalidates the live scope before requesting its host action. */
export function workspaceDropHandlers(
  controller: StackWorkspaceController,
  host: RepositoryStackHost,
  target: () => WorkspaceDropTarget,
) {
  return {
    ondragover: (event: DragEvent) =>
      controller.drag.over(
        event,
        target(),
        controller.snapshot,
        controller.locked || !host.onCommand,
      ),
    ondragleave: (event: DragEvent) => controller.drag.leave(event, target()),
    ondrop: (event: DragEvent) => {
      const snapshot = controller.snapshot;
      const command = controller.drag.drop(
        event,
        target(),
        snapshot,
        controller.locked || !host.onCommand,
      );
      if (command && snapshot) host.onCommand?.(command, snapshot);
    },
    ondragend: () => controller.drag.clear(),
  };
}

/** Delegation keeps native row geometry and nested file drags independent. */
export function workspaceCommitHandlers(
  controller: StackWorkspaceController,
  host: RepositoryStackHost,
  commits: () => StackCommit[],
) {
  return {
    ondragstart: (event: DragEvent) => {
      const id = commitEventRow(event)?.dataset.revisionId;
      const commit = commits().find((commit) => commit.id === id);
      if (
        !host.onCommand ||
        controller.locked ||
        !id ||
        !commit ||
        commit.immutable ||
        !(controller.can("move_commit") || controller.can("reorder_commit"))
      ) {
        event.preventDefault();
        return;
      }
      controller.drag.start(event, { kind: "commit", commit: id });
    },
    ondragover: (event: DragEvent) => {
      const target = commitRowTarget(event, controller.drag.payload);
      if (target)
        controller.drag.over(
          event,
          target,
          controller.snapshot,
          controller.locked || !host.onCommand,
        );
    },
    ondragleave: (event: DragEvent) => {
      const row = commitEventRow(event);
      if (row?.dataset.revisionId)
        controller.drag.leave(
          event,
          { kind: "commit", id: row.dataset.revisionId },
          row,
        );
    },
    ondrop: (event: DragEvent) => {
      const target = commitRowTarget(event, controller.drag.payload);
      const snapshot = controller.snapshot;
      if (!target || !snapshot) return;
      const command = controller.drag.drop(
        event,
        target,
        snapshot,
        controller.locked || !host.onCommand,
      );
      if (command) host.onCommand?.(command, snapshot);
    },
    ondragend: () => controller.drag.clear(),
  };
}

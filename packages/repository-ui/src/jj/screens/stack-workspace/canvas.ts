// SPDX-License-Identifier: Apache-2.0; dimensions adapted from JJ Store StoreStackWorkspaceCanvas.
import {
  createColumnCanvasController,
  type ColumnCanvasLayoutPersistence,
} from "@lapismd/design-core/shadcn/column-canvas";
import type { WorkspaceSnapshot } from "../../../stacks/index.js";
export const stackColumnConfig = {
  resizable: true,
  defaultWidth: 390,
  minWidth: 310,
  maxWidth: 640,
  pathLevel: 0,
  collapsible: true,
};
export function createStackWorkspaceCanvas(
  snapshot?: WorkspaceSnapshot | null,
  persistence?: ColumnCanvasLayoutPersistence,
) {
  return createColumnCanvasController({
    trailingSpacerWidth: 390,
    ...(persistence ? { persistence } : {}),
    columns: {
      branches: {
        resizable: true,
        defaultWidth: 320,
        minWidth: 260,
        maxWidth: 520,
        pathLevel: 0,
        collapsible: true,
      },
      "target-history": { ...stackColumnConfig },
      working: {
        resizable: true,
        defaultWidth: 330,
        minWidth: 260,
        maxWidth: 520,
        pathLevel: 0,
        collapsible: true,
      },
      ...Object.fromEntries(
        snapshot?.stacks.map((stack) => [
          `stack-${stack.id}`,
          { ...stackColumnConfig },
        ]) ?? [],
      ),
    },
  });
}

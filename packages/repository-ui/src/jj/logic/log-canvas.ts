import { createColumnCanvasController } from "@lapismd/design-core/shadcn/column-canvas";
/** jj-store log/diff geometry with room after the final independent resize edge. */
export function createLogCanvas() {
  return createColumnCanvasController<string>({
    trailingSpacerWidth: 240,
    columns: {
      revisions: {
        defaultWidth: 480,
        minWidth: 360,
        maxWidth: 720,
        collapsible: true,
        resizable: true,
      },
      diff: {
        defaultWidth: 560,
        minWidth: 360,
        maxWidth: 980,
        pathLevel: 1,
        closeable: true,
        closed: true,
        openOnSelect: false,
        resizable: true,
      },
    },
  });
}

import { expect, test } from "vitest";
import {
  HistoryController,
  OperationController,
} from "../packages/repository-ui/src/jj/index.js";
import { operationFixture } from "../catalog/jj/support/reference/operations.js";
import { attachDenseHistory } from "../catalog/jj/support/dense-history.js";
import { attachDenseOperations } from "../catalog/jj/support/dense-operations.js";
import { denseChanges } from "../catalog/jj/support/dense-diffs.js";
for (const kind of ["history", "operation"] as const) {
  test(`${kind}: independent file reads preserve selection and repeat navigation`, async () => {
    const fixture = operationFixture(),
      errors: unknown[] = [];
    const feedback = {
      report: (error: unknown) => errors.push(error),
      recovered() {},
    };
    const history = new HistoryController(fixture.reader, feedback);
    const operations = new OperationController(fixture.reader, feedback);
    if (kind === "history") attachDenseHistory(fixture.reader);
    else attachDenseOperations(fixture.reader, "AllInOne");
    try {
      if (kind === "history") {
        await history.refresh();
        await history.selectRevision(history.state.commits[0]);
      } else {
        await operations.refresh();
        await operations.select(operations.state.nodes[0]);
      }
      const controller = kind === "history" ? history : operations.files;
      const state = () =>
        kind === "history" ? history.state : operations.state.files;
      const first = denseChanges[0].path,
        second = denseChanges[1].path;
      await controller.selectPath(first);
      const request = state().pathRequest;
      await controller.loadDiff(second);
      expect(state().path).toBe(first);
      expect(state().diff?.path).toBe(first);
      expect(state().diffs[second]).toMatchObject({ phase: "ready" });
      const reads = fixture.calls.filter(([, q]) => q?.kind === "diff").length;
      await controller.selectPath(first);
      expect(state().pathRequest).toBe(request + 1);
      expect(fixture.calls.filter(([, q]) => q?.kind === "diff")).toHaveLength(
        reads,
      );
      await controller.morePaths();
      expect(state().diffs[second]).toMatchObject({ phase: "ready" });
      expect(errors).toEqual([]);
    } finally {
      await history.close();
      await operations.close();
      await fixture.close();
    }
  });
}

import type { Handle } from "@lapismd/jj-history";
import type { HistoryReader } from "./history-reader.js";
import type { HistoryLifetime } from "./history-lifetime.js";
import type { OperationState } from "./operation-state.js";
import { check, pause, prepared } from "./history-selection.js";

/** Operation-owned activity tracking; no native transport or lifecycle ownership. */
export class OperationActivity {
  #request = 0;
  constructor(
    readonly lifetime: HistoryLifetime,
    readonly scope: () => { closed: boolean; state: OperationState },
    readonly publish: (patch: Partial<OperationState>) => void,
    readonly feedback: { report(error: unknown): void; recovered(): void },
  ) {}
  run(action: () => Promise<void>): Promise<void> {
    if (this.scope().closed) return Promise.resolve();
    return this.lifetime.run(async () => {
      const request = ++this.#request;
      this.publish({ busy: true });
      try {
        await action();
        if (!this.scope().closed && request === this.#request)
          this.feedback.recovered();
      } catch (error) {
        if (!this.scope().closed && request === this.#request) {
          this.publish({
            phase: this.scope().state.snapshot ? "ready" : "unavailable",
          });
          this.feedback.report(error);
        }
      } finally {
        if (request === this.#request) this.publish({ busy: false });
      }
    });
  }
}

export async function prepareOperation(
  reader: HistoryReader,
  lifetime: HistoryLifetime,
  operation: string,
  prior: Handle | undefined,
  signal: AbortSignal,
  wait: typeof pause,
  current: () => boolean,
) {
  if (prior) await lifetime.closeHandle(prior);
  const handle = await reader.open(operation);
  lifetime.handles.add(handle);
  if (!current()) {
    await lifetime.closeHandle(handle);
    return;
  }
  const snapshot = await prepared(reader, handle, signal, wait);
  check(snapshot.operation === operation);
  if (current()) return { handle, snapshot };
}

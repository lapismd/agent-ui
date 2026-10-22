// SPDX-License-Identifier: Apache-2.0; adapted from Desktop history-inspection.
import type {
  AiFileHistory,
  AiTurnRecord,
  AiUndoRequest,
  LocalFileDiffChange,
  TurnComparison,
  AgentChangesPort,
} from "./models.js";
/** Host-owned lifetime. Construction and mounting never mutate repository state. */
export class AiHistoryInspection {
  open = $state(false);
  scope = $state<"turn" | "conversation">("turn");
  record = $state.raw<AiTurnRecord>();
  comparison = $state.raw<TurnComparison>();
  path = $state<string>();
  diff = $state.raw<LocalFileDiffChange>();
  loading = $state(false);
  unavailable = $state(false);
  fileUnavailable = $state(false);
  selected = $state.raw<string[]>([]);
  undo = $state.raw<AiUndoRequest>();
  undoBusy = $state(false);
  recoveringUndo = $state(false);
  #epoch = 0;
  #file = 0;
  #undo = 0;
  #closed = false;
  #cache = new Map<string, Promise<TurnComparison>>();
  constructor(
    readonly history: AiFileHistory,
    readonly port: AgentChangesPort,
  ) {}
  summary(record: AiTurnRecord) {
    if (this.#closed || record.phase !== "complete")
      return Promise.reject(new Error("Saved comparison unavailable."));
    const key = JSON.stringify([
      record.context.conversation,
      record.context.turn,
      record.before.commit,
      record.after?.commit,
    ]);
    let job = this.#cache.get(key);
    if (!job) {
      job = this.port.compare(record);
      this.#cache.set(key, job);
      void job.catch(() => {
        if (this.#cache.get(key) === job) this.#cache.delete(key);
      });
      if (this.#cache.size > 8)
        this.#cache.delete(this.#cache.keys().next().value!);
    }
    return job;
  }
  async show(record: AiTurnRecord, path?: string) {
    if (this.#closed) return;
    const epoch = ++this.#epoch;
    this.closeFile();
    this.record = record;
    this.comparison = undefined;
    this.selected = [];
    this.open = true;
    this.loading = true;
    this.unavailable = false;
    try {
      const summary = await this.summary(record);
      if (this.#closed || epoch !== this.#epoch) return;
      this.comparison = summary;
      if (path) await this.select(path);
    } catch (error) {
      if (!this.#closed && epoch === this.#epoch) {
        this.unavailable = true;
        this.history.report(error);
      }
    } finally {
      if (!this.#closed && epoch === this.#epoch) this.loading = false;
    }
  }
  async select(path: string) {
    const epoch = this.#epoch,
      file = ++this.#file,
      record = this.record;
    const item = this.comparison?.files.find((f) => f.path === path);
    if (this.#closed || !item || !record) return;
    this.path = path;
    this.diff = undefined;
    this.fileUnavailable = false;
    try {
      const diff = item.diff ?? (await this.port.readFile(record, path));
      if (diff.path !== path)
        throw new Error("File comparison returned a different selection.");
      if (!this.#closed && epoch === this.#epoch && file === this.#file)
        this.diff = diff;
    } catch (error) {
      if (!this.#closed && epoch === this.#epoch && file === this.#file) {
        this.fileUnavailable = true;
        this.history.report(error);
      }
    }
  }
  async previewUndo(record: AiTurnRecord, paths: readonly string[] = []) {
    if (this.#closed || this.undoBusy || record.phase !== "complete") return;
    const epoch = ++this.#undo;
    this.undoBusy = true;
    try {
      const request = await this.port.previewUndo(structuredClone(record), [
        ...paths,
      ]);
      if (
        request.conversation !== record.context.conversation ||
        request.turn !== record.context.turn ||
        (paths.length &&
          JSON.stringify(request.paths) !== JSON.stringify(paths))
      )
        throw new Error("Undo preview returned a different selection.");
      if (!this.#closed && epoch === this.#undo) {
        this.recoveringUndo = false;
        this.undo = structuredClone(request);
      }
    } catch (error) {
      if (!this.#closed && epoch === this.#undo) this.history.report(error);
    } finally {
      if (!this.#closed && epoch === this.#undo) this.undoBusy = false;
    }
  }
  async applyUndo() {
    const request = this.undo;
    if (this.#closed || !request || this.undoBusy) return;
    const epoch = ++this.#undo;
    this.undoBusy = true;
    try {
      await this.port.undo(structuredClone(request));
      if (!this.#closed && epoch === this.#undo && this.undo === request) {
        this.undo = undefined;
        this.#cache.clear();
      }
    } catch (error) {
      if (!this.#closed && epoch === this.#undo) this.history.report(error);
    } finally {
      if (!this.#closed && epoch === this.#undo) this.undoBusy = false;
    }
  }
  closeFile() {
    this.#file++;
    this.path = undefined;
    this.diff = undefined;
    this.fileUnavailable = false;
  }
  reset() {
    this.#epoch++;
    this.#undo++;
    this.closeFile();
    this.open = false;
    this.record = undefined;
    this.comparison = undefined;
    this.undo = undefined;
    this.undoBusy = false;
    this.recoveringUndo = false;
    this.loading = false;
  }
  dispose() {
    this.#closed = true;
    this.reset();
    this.#cache.clear();
  }
}

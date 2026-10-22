import type { LocalFileDiffChange } from "@lapismd/jj-history";

export type RepositoryDiffEntry =
  | { phase: "loading" }
  | { phase: "ready"; change: LocalFileDiffChange }
  | { phase: "failed"; message: string };
export type RepositoryDiffEntries = Readonly<
  Record<string, RepositoryDiffEntry>
>;

/** Comparison-scoped, deduplicated reads. Its owner drains the injected work. */
export class ComparisonDiffs {
  #epoch = 0;
  #entries: RepositoryDiffEntries = {};
  #pending = new Map<string, Promise<LocalFileDiffChange | undefined>>();
  constructor(readonly changed: (entries: RepositoryDiffEntries) => void) {}
  reset() {
    this.#epoch++;
    this.#pending.clear();
    this.#entries = {};
    this.changed(this.#entries);
  }
  #set(path: string, value: RepositoryDiffEntry) {
    this.#entries = { ...this.#entries, [path]: value };
    this.changed(this.#entries);
  }
  load(path: string, read: () => Promise<LocalFileDiffChange>) {
    const entry = this.#entries[path];
    if (entry?.phase === "ready") return Promise.resolve(entry.change);
    const pending = this.#pending.get(path);
    if (pending) return pending;
    const epoch = this.#epoch;
    const work = Promise.resolve()
      .then(read)
      .then(
        (change) => {
          if (epoch !== this.#epoch) return undefined;
          this.#set(path, { phase: "ready", change });
          return change;
        },
        (error: unknown) => {
          if (epoch !== this.#epoch) return undefined;
          this.#set(path, {
            phase: "failed",
            message: error instanceof Error ? error.message : String(error),
          });
          throw error;
        },
      )
      .finally(() => {
        if (epoch === this.#epoch) this.#pending.delete(path);
      });
    this.#pending.set(path, work);
    this.#set(path, { phase: "loading" });
    return work;
  }
}

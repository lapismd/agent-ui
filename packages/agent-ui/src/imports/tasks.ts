/** Host-owned task feedback with cancellation and drained read lifetime. */
export class ImportTasks {
  #closed = false;
  #running = new Set<Promise<unknown>>();
  constructor(readonly report: (error: unknown) => void = () => {}) {}
  run<T>(
    _title: string,
    _id: string,
    signal: AbortSignal,
    task: () => Promise<T>,
  ): Promise<T | undefined> {
    const result = (async () => {
      if (this.#closed || signal.aborted) return;
      try {
        const value = await task();
        if (!this.#closed && !signal.aborted) return value;
      } catch (error) {
        if (!this.#closed && !signal.aborted) this.report(error);
      }
    })();
    this.#running.add(result);
    void result.finally(() => this.#running.delete(result));
    return result;
  }
  fence() {
    this.#closed = true;
  }
  async settle() {
    await Promise.allSettled(this.#running);
  }
}
export function importYield(signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (signal.aborted) {
      resolve();
      return;
    }
    const finish = () => {
      clearTimeout(timer);
      signal.removeEventListener("abort", finish);
      resolve();
    };
    const timer = setTimeout(finish, 16);
    signal.addEventListener("abort", finish, { once: true });
  });
}

import {
  threadKey,
  type ThreadsPort,
  type ThreadsState,
  type ThreadScope,
  type ThreadHome,
} from "./types.js";

/** Host-owned directory lifetime. Reading never selects code or issues a mutation. */
export class ThreadsController {
  state: ThreadsState = { scope: {}, homes: [], loading: false, remaining: 0 };
  private listeners = new Set<(state: ThreadsState) => void>();
  private operations = new Set<Promise<unknown>>();
  private registrations: ThreadHome[] = [];
  private abort = new AbortController();
  private generation = 0;
  private disposed = false;
  private release?: () => void;
  constructor(
    readonly port: ThreadsPort,
    private report: (error: unknown) => void,
  ) {}
  subscribe(listener: (state: ThreadsState) => void) {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }
  private publish(patch: Partial<ThreadsState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((listener) => listener(this.state));
  }
  private track<T>(task: Promise<T>) {
    this.operations.add(task);
    void task.then(
      () => this.operations.delete(task),
      () => this.operations.delete(task),
    );
    return task;
  }
  open(scope: ThreadScope = this.state.scope) {
    if (this.disposed) return Promise.resolve();
    this.abort.abort();
    this.abort = new AbortController();
    const generation = ++this.generation,
      signal = this.abort.signal;
    this.publish({
      scope: { ...scope },
      homes: [],
      loading: true,
      remaining: 0,
      error: undefined,
    });
    return this.track(
      (async () => {
        try {
          const homes = await this.port.homes(signal);
          if (this.disposed || generation !== this.generation) return;
          signal.throwIfAborted();
          if (
            homes.length > 1000 ||
            new Set(homes.map((h) => h.id)).size !== homes.length
          )
            throw Error("Invalid registered repository directory");
          this.registrations = homes.filter(
            (h) => !scope.home || h.id === scope.home,
          );
          if (scope.home && !this.registrations.length)
            throw Error("This metadata home is not registered on this device");
          this.publish({
            loading: false,
            remaining: this.registrations.length,
          });
          this.release ??= this.port.subscribe?.((home) => {
            if (home) void this.read(home);
            else void this.open();
          });
          await this.moreHomes();
        } catch (error) {
          if (
            !this.disposed &&
            generation === this.generation &&
            !signal.aborted
          ) {
            this.publish({ loading: false, error: String(error) });
            this.report(error);
          }
        }
      })(),
    );
  }
  moreHomes() {
    if (this.disposed || this.state.loading || !this.state.remaining)
      return Promise.resolve();
    const entries = this.registrations.slice(
      this.state.homes.length,
      this.state.homes.length + 20,
    );
    this.publish({
      homes: [
        ...this.state.homes,
        ...entries.map((h) => ({ ...h, loading: false })),
      ],
      remaining: this.state.remaining - entries.length,
    });
    const generation = this.generation;
    let index = 0;
    return this.track(
      Promise.all(
        Array.from({ length: Math.min(4, entries.length) }, async () => {
          while (
            !this.disposed &&
            generation === this.generation &&
            index < entries.length
          )
            await this.read(entries[index++].id);
        }),
      ).then(() => {}),
    );
  }
  read(id: string, more = false) {
    const home = this.state.homes.find((h) => h.id === id);
    if (this.disposed || !home || home.loading || (more && !home.page?.next))
      return Promise.resolve();
    const generation = this.generation,
      signal = this.abort.signal;
    const update = (patch: Partial<typeof home>) => {
      if (!this.disposed && generation === this.generation)
        this.publish({
          homes: this.state.homes.map((h) =>
            h.id === id ? { ...h, ...patch } : h,
          ),
        });
    };
    update({ loading: true, error: undefined });
    return this.track(
      (async () => {
        try {
          if (home.available === false)
            throw Error("Repository is unavailable on this device");
          const page = await this.port.read(
            { home: id, cursor: more ? home.page?.next : undefined, limit: 25 },
            signal,
          );
          if (this.disposed || generation !== this.generation) return;
          signal.throwIfAborted();
          if (page.home !== id || page.rows.some((r) => r.home !== id))
            throw Error("Thread page belongs to another home");
          if (!page.snapshot || (more && page.snapshot !== home.page?.snapshot))
            throw Error("Thread snapshot changed; refresh this repository");
          if (more && page.next && page.next === home.page?.next)
            throw Error("Repeated thread continuation");
          const rows = more ? [...home.page!.rows, ...page.rows] : page.rows;
          if (
            page.rows.length > 25 ||
            rows.length > 1000 ||
            new Set(rows.map(threadKey)).size !== rows.length
          )
            throw Error("Invalid or repeated thread identity");
          update({ loading: false, page: { ...page, rows } });
        } catch (error) {
          if (
            !this.disposed &&
            generation === this.generation &&
            !signal.aborted
          ) {
            update({ loading: false, error: String(error) });
            this.report(error);
          }
        }
      })(),
    );
  }
  async drain() {
    await Promise.all([...this.operations]);
  }
  async close() {
    this.disposed = true;
    this.abort.abort();
    this.release?.();
    await Promise.allSettled([...this.operations]);
    this.listeners.clear();
  }
}

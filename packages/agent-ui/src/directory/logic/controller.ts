import { directoryPage } from "./page.js";
import type {
  AgentDirectoryPort,
  AgentDirectoryState,
  AgentDirectoryScope,
  AgentDirectoryCommand,
  AgentDirectoryRequest,
  ConfiguredAgent,
} from "./types.js";

/** Host-owned lifetime; mounting the complete screen subscribes without executing. */
export class AgentDirectoryController {
  state: AgentDirectoryState = {
    scope: {},
    loading: false,
    writing: false,
    pending: [],
  };
  private listeners = new Set<(state: AgentDirectoryState) => void>();
  private operations = new Set<Promise<unknown>>();
  private abort = new AbortController();
  private generation = 0;
  private closed = false;
  private settled = new Set<string>();
  private drafts = new Map<string, ConfiguredAgent>();
  private draftQueue: Promise<unknown> = Promise.resolve();
  private draftFailures = new Map<string, unknown>();
  private release?: () => void;
  constructor(
    readonly port: AgentDirectoryPort,
    private report: (error: unknown) => void,
  ) {}
  draft(key: string, value?: ConfiguredAgent | null) {
    if (this.closed) return Promise.reject(Error("Agent directory is closed"));
    const frozen = value === undefined ? undefined : structuredClone(value);
    if (frozen) this.drafts.set(key, frozen);
    if (value === undefined && this.drafts.has(key))
      return Promise.resolve(structuredClone(this.drafts.get(key)!));
    const task = this.draftQueue.then(async () => {
      let saved;
      try {
        saved = await this.port.draft(key, frozen);
        if (frozen !== undefined) this.draftFailures.delete(key);
      } catch (error) {
        if (frozen !== undefined) this.draftFailures.set(key, error);
        throw error;
      }
      if (frozen === null) this.drafts.delete(key);
      else if (frozen === undefined && saved && !this.drafts.has(key))
        this.drafts.set(key, structuredClone(saved));
      return saved;
    });
    this.draftQueue = task.catch(() => {});
    return this.track(task);
  }
  subscribe(listener: (state: AgentDirectoryState) => void) {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }
  private publish(patch: Partial<AgentDirectoryState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((listener) => listener(this.state));
  }
  private track<T>(task: Promise<T>): Promise<T> {
    this.operations.add(task);
    void task.then(
      () => this.operations.delete(task),
      () => this.operations.delete(task),
    );
    return task;
  }
  open(scope: AgentDirectoryScope = this.state.scope) {
    if (this.closed) return Promise.resolve();
    this.abort.abort();
    this.abort = new AbortController();
    const generation = ++this.generation;
    this.publish({
      scope: { ...scope },
      loading: true,
      page: undefined,
      error: undefined,
    });
    return this.track(this.read(generation, false));
  }
  more() {
    if (this.closed || this.state.loading || !this.state.page?.next)
      return Promise.resolve();
    this.publish({ loading: true, error: undefined });
    return this.track(this.read(this.generation, true));
  }
  private async read(generation: number, more: boolean) {
    const signal = this.abort.signal,
      previous = this.state.page;
    try {
      const [page, pending] = await Promise.all([
        this.port.read(
          {
            ...this.state.scope,
            cursor: more ? previous?.next : undefined,
            limit: 25,
          },
          signal,
        ),
        this.port.pending?.() ?? [],
      ]);
      if (this.closed || generation !== this.generation) return;
      signal.throwIfAborted();
      this.publish({
        page: directoryPage(
          page,
          more ? previous : undefined,
          this.state.scope,
        ),
        loading: false,
        pending: [
          ...new Map(
            [...pending, ...this.state.pending]
              .filter((r) => !this.settled.has(r.id))
              .map((r) => [r.id, r]),
          ).values(),
        ],
      });
      this.release ??= this.port.subscribe?.(() => {
        if (!this.state.writing) void this.open();
      });
    } catch (error) {
      if (!this.closed && generation === this.generation && !signal.aborted) {
        this.publish({ loading: false, error: String(error) });
        this.report(error);
      }
    }
  }
  submit(command: AgentDirectoryCommand) {
    if (
      this.closed ||
      this.state.writing ||
      this.state.pending.length ||
      !this.state.page?.capabilities.includes(command.kind)
    )
      return Promise.resolve(false);
    return this.track(
      this.run(
        { id: crypto.randomUUID(), command: structuredClone(command) },
        false,
      ),
    );
  }
  resolve(id: string) {
    const request = this.state.pending.find((r) => r.id === id);
    return request && !this.closed && !this.state.writing
      ? this.track(this.run(request, true))
      : Promise.resolve(false);
  }
  private async run(request: AgentDirectoryRequest, inspect: boolean) {
    this.publish({
      writing: true,
      pending: inspect ? this.state.pending : [...this.state.pending, request],
    });
    try {
      const outcome = await (inspect
        ? this.port.resolve(request)
        : this.port.execute(request));
      if (outcome.state === "unknown")
        throw Error(
          "Outcome unknown. Inspect the saved request before changing agents.",
        );
      this.settled.add(request.id);
      this.publish({
        pending: this.state.pending.filter((r) => r.id !== request.id),
      });
      if (outcome.state === "rejected") {
        await this.open();
        throw Error(outcome.message);
      }
      await this.open();
      return true;
    } catch (error) {
      this.report(error);
      return false;
    } finally {
      this.publish({ writing: false });
    }
  }
  /** Hosts call this before native close; failed drafts keep the editor available. */
  async drain() {
    await this.draftQueue;
    await Promise.all([...this.operations]);
    if (this.draftFailures.size) throw this.draftFailures.values().next().value;
  }
  async close() {
    this.closed = true;
    this.abort.abort();
    this.release?.();
    await Promise.allSettled([...this.operations]);
    this.listeners.clear();
  }
}

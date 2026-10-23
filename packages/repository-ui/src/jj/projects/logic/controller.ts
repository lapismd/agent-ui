import type {
  ProjectsState,
  WorkPort,
  WorkRoute,
  WorkHome,
  WorkPage,
  WorkRequest,
  WorkCommand,
  WorkOutcome,
} from "./types.js";
const pageIds = (page: WorkPage) => [
  page.projects,
  page.tasks,
  page.comments,
  page.reviews,
  page.activity,
];
/** Host-owned lifetime; mounting a screen only subscribes to this controller. */
export class ProjectsController {
  state: ProjectsState = {
    directory: [],
    route: { tab: "projects" },
    homes: [],
    remaining: 0,
    loading: false,
    pending: [],
    writing: new Set(),
  };
  private listeners = new Set<(state: ProjectsState) => void>();
  private generation = 0;
  private abort = new AbortController();
  private available: WorkHome[] = [];
  private operations = new Set<Promise<unknown>>();
  private closed = false;
  private settled = new Set<string>();
  private release?: () => void;
  constructor(
    readonly port: WorkPort,
    private feedback: { report(error: unknown): void; recovered?(): void },
  ) {}
  subscribe(listener: (state: ProjectsState) => void) {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }
  private publish(patch: Partial<ProjectsState> = {}) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((l) => l(this.state));
  }
  async open(route: WorkRoute = this.state.route) {
    if (this.closed) return;
    this.abort.abort();
    this.abort = new AbortController();
    const generation = ++this.generation;
    this.publish({
      route: { ...route },
      loading: true,
      homes: [],
      remaining: 0,
      error: undefined,
    });
    try {
      const [homes, pending] = await Promise.all([
        this.port.homes(this.abort.signal),
        this.port.pending?.() ?? [],
      ]);
      if (this.closed || generation !== this.generation) return;
      if (
        new Set(homes.map((h) => h.id)).size !== homes.length ||
        homes.length > 4096
      )
        throw Error("Invalid home directory");
      this.available = homes.filter((h) => !route.home || route.home === h.id);
      if (route.home && !this.available.length)
        throw Error("Metadata home is not registered");
      this.publish({
        directory: homes,
        pending: [
          ...new Map(
            [...pending, ...this.state.pending]
              .filter((r) => !this.settled.has(`${r.home}:${r.id}`))
              .map((r) => [`${r.home}:${r.id}`, r]),
          ).values(),
        ],
        remaining: this.available.length,
        loading: false,
      });
      await this.moreHomes();
      this.release ??= this.port.subscribe?.((home) => {
        if (!this.state.writing.has(home)) void this.read(home);
      });
      this.feedback.recovered?.();
    } catch (error) {
      if (!this.closed && generation === this.generation) {
        this.publish({ loading: false, error: String(error) });
        this.feedback.report(error);
      }
    }
  }
  async moreHomes() {
    const batch = this.available.slice(
      this.state.homes.length,
      this.state.homes.length + 20,
    );
    this.publish({
      homes: [
        ...this.state.homes,
        ...batch.map((home) => ({ home, loading: false })),
      ],
      remaining: this.available.length - this.state.homes.length - batch.length,
    });
    let index = 0;
    await Promise.all(
      Array.from({ length: Math.min(4, batch.length) }, async () => {
        while (index < batch.length) await this.read(batch[index++].id);
      }),
    );
  }
  async read(home: string, more = false) {
    const current = this.state.homes.find((h) => h.home.id === home);
    if (
      !current ||
      current.loading ||
      this.closed ||
      (more && !current.page?.next)
    )
      return;
    const generation = this.generation,
      signal = this.abort.signal;
    const update = (patch: Partial<typeof current>) => {
      if (!this.closed && generation === this.generation)
        this.publish({
          homes: this.state.homes.map((h) =>
            h.home.id === home ? { ...h, ...patch } : h,
          ),
        });
    };
    update({ loading: true, error: undefined });
    try {
      if (!current.home.available) throw Error("Metadata home is unavailable");
      const page = await this.port.read(
        {
          ...this.state.route,
          home,
          cursor: more ? current.page!.next : undefined,
          limit: 25,
        },
        signal,
      );
      signal.throwIfAborted();
      if (
        page.home !== home ||
        !page.snapshot ||
        (more &&
          (page.snapshot !== current.page!.snapshot ||
            (page.next && page.next === current.page!.next)))
      )
        throw Error("Metadata snapshot changed; refresh this home");
      if (more)
        for (const key of [
          "projects",
          "tasks",
          "comments",
          "reviews",
          "activity",
        ] as const)
          page[key] = [...current.page![key], ...page[key]] as never;
      for (const rows of pageIds(page))
        if (
          rows.length > 1000 ||
          new Set(rows.map((r) => r.id)).size !== rows.length
        )
          throw Error("Invalid or oversized metadata page");
      update({ page, loading: false });
      this.feedback.recovered?.();
    } catch (error) {
      if (!signal.aborted) {
        update({ error: String(error), loading: false });
        this.feedback.report(error);
      }
    }
  }
  submit(home: string, command: WorkCommand) {
    const owner = this.state.directory.find((h) => h.id === home);
    if (!owner?.available || !owner.writable) return Promise.resolve(false);
    const request = {
      id: crypto.randomUUID(),
      home,
      command: structuredClone(command),
    };
    if (this.state.pending.some((r) => r.home === home))
      return Promise.resolve(false);
    return this.run(request, false);
  }
  resolve(request: WorkRequest) {
    const retained = this.state.pending.find(
      (r) => r.home === request.home && r.id === request.id,
    );
    return retained ? this.run(retained, true) : Promise.resolve(false);
  }
  private run(request: WorkRequest, inspect: boolean) {
    if (this.closed || this.state.writing.has(request.home))
      return Promise.resolve(false);
    const task = this.mutate(request, inspect);
    this.operations.add(task);
    void task.finally(() => this.operations.delete(task));
    return task;
  }
  private async mutate(request: WorkRequest, inspect: boolean) {
    const writing = new Set(this.state.writing).add(request.home);
    this.publish({
      writing,
      pending: this.state.pending.some((r) => r.id === request.id)
        ? this.state.pending
        : [...this.state.pending, request],
    });
    try {
      const outcome: WorkOutcome = await (inspect
        ? this.port.resolve(request)
        : this.port.execute(request));
      if (outcome.state === "unknown")
        throw Error(
          "Outcome unknown. Inspect this request before submitting another change.",
        );
      this.settled.add(`${request.home}:${request.id}`);
      this.publish({
        pending: this.state.pending.filter(
          (r) => r.id !== request.id || r.home !== request.home,
        ),
      });
      if (outcome.state === "rejected") throw Error(outcome.message);
      await this.read(request.home);
      this.feedback.recovered?.();
      return true;
    } catch (error) {
      this.feedback.report(error);
      return false;
    } finally {
      const writing = new Set(this.state.writing);
      writing.delete(request.home);
      this.publish({ writing });
    }
  }
  async close() {
    this.closed = true;
    this.abort.abort();
    this.release?.();
    await Promise.allSettled(this.operations);
    this.listeners.clear();
  }
}

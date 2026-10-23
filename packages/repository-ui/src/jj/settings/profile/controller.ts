import type {
  ProfilePort,
  ProfileState,
  ProfileDetails,
  ProfileRequest,
  ProfileOutcome,
} from "./model.js";
const copy = <T>(value: T): T => structuredClone(value);
export class RepositoryProfileController {
  state: ProfileState = {
    images: {},
    loading: false,
    busy: false,
    error: "",
    conflict: false,
    outcome: "",
  };
  private listeners = new Set<(state: ProfileState) => void>();
  private readAbort?: AbortController;
  private generation = 0;
  private writes: Promise<void> = Promise.resolve();
  private operation?: Promise<void>;
  private uploads = new Set<Promise<string>>();
  private closed = false;
  constructor(
    readonly port: ProfilePort,
    private report: (error: unknown) => void = () => {},
  ) {}
  subscribe(listener: (state: ProfileState) => void) {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }
  private emit() {
    this.state = { ...this.state };
    for (const listener of this.listeners) listener(this.state);
  }
  get dirty() {
    return (
      !!this.state.profile &&
      JSON.stringify(this.state.draft) !==
        JSON.stringify(this.state.profile.details)
    );
  }
  async open() {
    this.readAbort?.abort();
    const request = new AbortController(),
      ticket = ++this.generation;
    this.readAbort = request;
    this.state.loading = true;
    this.state.error = "";
    this.emit();
    try {
      const read = await this.port.read(request.signal);
      if (this.closed || request.signal.aborted || ticket !== this.generation)
        return;
      this.state.profile = copy(read.profile);
      this.state.draft = copy(read.draft?.details ?? read.profile.details);
      this.state.pending = copy(read.draft?.pending);
      this.state.images = copy(read.images ?? {});
      this.state.conflict = false;
    } catch (error) {
      if (!request.signal.aborted && !this.closed && ticket === this.generation)
        this.fail(error);
    } finally {
      if (ticket === this.generation) {
        this.state.loading = false;
        this.emit();
      }
    }
  }
  private fail(error: unknown) {
    this.state.error = String(error);
    this.report(error);
    this.emit();
  }
  private persist() {
    const value = this.state.draft
      ? copy({
          details: this.state.draft,
          ...(this.state.pending ? { pending: this.state.pending } : {}),
        })
      : null;
    const next = this.writes.catch(() => {}).then(() => this.port.draft(value));
    this.writes = next;
    return next;
  }
  edit<K extends keyof ProfileDetails>(key: K, value: ProfileDetails[K]) {
    if (
      this.closed ||
      this.state.busy ||
      this.state.pending ||
      !this.state.draft
    )
      return;
    this.state.draft = { ...this.state.draft, [key]: value };
    this.state.outcome = "";
    this.state.error = "";
    this.emit();
    void this.persist().catch((error) => this.fail(error));
  }
  upload(file: File, signal: AbortSignal) {
    const task = (async () => {
      if (this.closed) throw new Error("Profile closed");
      const image = await this.port.upload(file, signal);
      signal.throwIfAborted();
      if (this.closed) throw new Error("Profile closed");
      this.state.images = {
        ...this.state.images,
        [image.reference]: image.url,
      };
      this.emit();
      return image.url;
    })();
    this.uploads.add(task);
    void task.then(
      () => this.uploads.delete(task),
      () => this.uploads.delete(task),
    );
    return task;
  }
  avatar(value: string) {
    const reference = Object.keys(this.state.images).find(
      (key) => this.state.images[key] === value,
    );
    this.edit("avatar", reference ?? (value || null));
  }
  async cancel() {
    if (this.state.pending || this.state.busy || !this.state.profile) return;
    this.state.draft = copy(this.state.profile.details);
    this.state.conflict = false;
    this.state.error = "";
    this.state.outcome = "";
    await this.persist();
    this.emit();
  }
  rebase() {
    if (!this.state.conflict || this.state.pending || this.state.busy) return;
    this.state.conflict = false;
    this.state.error = "";
    this.emit();
  }
  async save() {
    if (
      this.closed ||
      this.state.busy ||
      this.state.pending ||
      this.state.conflict ||
      !this.dirty ||
      !this.state.profile ||
      !this.state.draft
    )
      return;
    const request = {
      id: crypto.randomUUID(),
      revision: this.state.profile.revision,
      details: copy(this.state.draft),
    };
    this.state.pending = request;
    return this.run(request, false);
  }
  inspect() {
    if (!this.state.pending || this.state.busy) return;
    return this.run(copy(this.state.pending), true);
  }
  retry() {
    if (
      !this.state.pending ||
      this.state.busy ||
      this.state.outcome !== "not-known"
    )
      return;
    return this.run(copy(this.state.pending), false);
  }
  private run(request: ProfileRequest, inspect: boolean) {
    this.state.busy = true;
    this.state.error = "";
    this.emit();
    const task = (async () => {
      try {
        await this.persist();
        const outcome = inspect
          ? await this.port.inspect(request)
          : await this.port.save(request);
        this.accept(outcome);
        await this.persist();
      } catch (error) {
        this.fail(error);
      } finally {
        this.state.busy = false;
        this.emit();
      }
    })();
    this.operation = task;
    return task;
  }
  private accept(outcome: ProfileOutcome) {
    if (outcome.state === "rejected") {
      this.state.pending = undefined;
      this.fail(new Error(outcome.message));
    } else if (outcome.state === "saved") {
      this.state.profile = copy(outcome.profile);
      this.state.draft = copy(outcome.profile.details);
      this.state.pending = undefined;
      this.state.conflict = false;
      this.state.outcome = "saved";
    } else if (outcome.state === "conflict") {
      this.state.profile = copy(outcome.profile);
      this.state.pending = undefined;
      this.state.conflict = true;
    } else
      this.state.outcome = outcome.state === "not-known" ? "not-known" : "";
  }
  async drain() {
    await this.operation;
    await Promise.allSettled(this.uploads);
    await this.writes;
  }
  async close() {
    await this.drain();
    this.closed = true;
    this.generation++;
    this.readAbort?.abort();
    this.listeners.clear();
  }
}

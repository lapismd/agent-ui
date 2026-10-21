import type {
  RepositoryAction,
  RepositoryFile,
  RepositoryOutcome,
  RepositoryPort,
  RepositorySnapshot,
  RepositoryView,
} from "./models.js";
/** Host-retained UI owner. Pins and command effects are always supplied by the host. */
export class RepositoryController {
  snapshot = $state<RepositorySnapshot>();
  view = $state<RepositoryView>("files");
  selectedRevision = $state("");
  selectedOperation = $state("");
  selectedPath = $state("");
  selectedParent = $state("");
  query = $state("");
  mode = $state<"list" | "tree" | "package">("tree");
  wrap = $state(true);
  diffMode = $state<"unified" | "split">("unified");
  loading = $state(false);
  busy = $state(false);
  error = $state("");
  notice = $state("");
  pending = $state<RepositoryAction>();
  preview = $state<RepositoryAction>();
  drafts = $state<Record<string, string | boolean>>({});
  conflictDrafts = $state<Record<string, string>>({});
  selectedPr = $state("");
  selectedCheck = $state("");
  floating = $state(false);
  settingsSection = $state("General");
  checksOpen = $state(true);
  #epoch = 0;
  #closed = false;
  #abort?: AbortController;
  #action?: Promise<void>;
  constructor(
    readonly port: RepositoryPort,
    initial?: RepositorySnapshot,
  ) {
    this.snapshot = initial;
  }
  get file(): RepositoryFile | undefined {
    return this.snapshot?.files.find((f) => f.path === this.selectedPath);
  }
  get revision() {
    return this.snapshot?.revisions.find((r) => r.id === this.selectedRevision);
  }
  get pullRequest() {
    return this.snapshot?.pullRequests.find((p) => p.id === this.selectedPr);
  }
  get filteredFiles() {
    return (
      this.snapshot?.files.filter(
        (f) =>
          !this.query ||
          f.path.toLowerCase().includes(this.query.toLowerCase()),
      ) ?? []
    );
  }
  can(kind: string) {
    return (
      !this.#closed &&
      !this.busy &&
      !this.pending &&
      !!this.snapshot?.capabilities.includes(kind)
    );
  }
  navigate(view: RepositoryView) {
    if (!this.#closed) this.view = view;
  }
  selectRevision(id: string) {
    this.selectedRevision = id;
    this.selectedParent = "";
    this.selectedPath = "";
  }
  async refresh(
    options: { latest?: boolean; cursor?: string; path?: string } = {},
  ) {
    if (this.#closed) return;
    const epoch = ++this.#epoch;
    this.#abort?.abort();
    const abort = (this.#abort = new AbortController());
    this.loading = true;
    const pin = options.latest ? undefined : this.snapshot?.pin;
    try {
      const next = await this.port.read({
        pin,
        signal: abort.signal,
        path: options.path,
        cursor: options.cursor,
        query: this.query,
      });
      if (this.#closed || epoch !== this.#epoch || abort.signal.aborted) return;
      if (pin && JSON.stringify(pin) !== JSON.stringify(next.pin))
        throw new Error(
          "The response does not match the selected repository pin.",
        );
      const old = this.snapshot;
      this.snapshot =
        options.cursor && old
          ? {
              ...next,
              revisions: [
                ...new Map(
                  [...old.revisions, ...next.revisions].map((x) => [x.id, x]),
                ).values(),
              ],
            }
          : next;
      this.error = "";
    } catch (cause) {
      if (!this.#closed && epoch === this.#epoch && !abort.signal.aborted)
        this.fail(cause);
    } finally {
      if (epoch === this.#epoch && !this.#closed) this.loading = false;
    }
  }
  prepare(
    kind: string,
    target?: string,
    values?: Record<string, string | boolean>,
  ) {
    if (!this.can(kind) || !this.snapshot) return false;
    this.preview = {
      id: crypto.randomUUID(),
      pin: structuredClone($state.snapshot(this.snapshot.pin)),
      kind,
      target,
      values: values ? structuredClone(values) : undefined,
    };
    return true;
  }
  cancelPreview() {
    if (!this.busy && !this.pending) this.preview = undefined;
  }
  apply() {
    const request = this.preview;
    if (!request || this.busy || this.pending || this.#closed)
      return Promise.resolve();
    return this.run(() => this.port.act(structuredClone(request)), request);
  }
  checkStatus() {
    const request = this.pending;
    if (!request || this.busy || this.#closed) return Promise.resolve();
    return this.run(() => this.port.status(request.id), request);
  }
  private run(
    action: () => Promise<RepositoryOutcome>,
    request: RepositoryAction,
  ) {
    this.busy = true;
    this.error = "";
    return (this.#action = (async () => {
      try {
        const outcome = await action();
        if (this.#closed) return;
        if (outcome.status === "unknown") {
          this.pending = request;
          this.notice =
            "Outcome unknown. Check the original request before continuing.";
        } else if (outcome.status === "refused") {
          this.pending = undefined;
          this.preview = undefined;
          this.fail(new Error(outcome.reason));
        } else {
          this.snapshot = outcome.snapshot;
          this.pending = undefined;
          this.preview = undefined;
          this.notice = "Action completed";
          if (request.kind === "save_settings") this.drafts = {};
        }
      } catch (cause) {
        if (!this.#closed) {
          this.pending = request;
          this.fail(cause);
        }
      } finally {
        if (!this.#closed) this.busy = false;
      }
    })());
  }
  async copy(text: string) {
    try {
      if (!this.port.copy)
        throw new Error("Clipboard is unavailable in this host.");
      await this.port.copy(text);
      this.notice = "Copied";
    } catch (cause) {
      this.fail(cause);
    }
  }
  private fail(cause: unknown) {
    const error = cause instanceof Error ? cause : new Error(String(cause));
    this.error = error.message;
    this.port.report?.(error);
  }
  async close() {
    if (this.#closed) return;
    this.#closed = true;
    this.#epoch++;
    this.#abort?.abort();
    this.loading = false;
    await this.#action;
    await this.port.close?.();
  }
}

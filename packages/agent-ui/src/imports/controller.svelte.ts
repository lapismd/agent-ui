import type { TranscriptItem } from "@lapismd/design-core/chat";
import { createImportBrowser } from "./browser.svelte.js";
import { ImportTasks } from "./tasks.js";
import type { AiImportSources, BrowserSession } from "./source-port.js";
import { validatePreview } from "./source-validation.js";
export type ImportPresentationPort = {
  sources?: AiImportSources;
  save(
    selector: string,
    items: readonly TranscriptItem[],
  ): Promise<{ id: string; duplicate: boolean }>;
  open?(id: string): Promise<void>;
  report?(error: unknown): void;
};
type Reader = {
  abort: AbortController;
  epoch: number;
  selector: string;
  id?: string;
  work?: Promise<void>;
  release?: Promise<void>;
};
/** Source browsing and provisional reads retain a host-owned lifetime. Saving is explicit. */
export class ImportController {
  readonly tasks: ImportTasks;
  readonly browser: ReturnType<typeof createImportBrowser>;
  selectedRow = $state<BrowserSession>();
  phase = $state<"idle" | "reading" | "ready" | "failed">("idle");
  entries = $state.raw<TranscriptItem[]>([]);
  paused = $state(false);
  progress = $state(0);
  busy = $state(false);
  cachedPreview = $state(false);
  saved = $state<{ id: string; duplicate: boolean }>();
  #epoch = 0;
  #closed = false;
  #current?: Reader;
  #readers = new Set<Reader>();
  #saving?: Promise<void>;
  #closing?: Promise<void>;
  constructor(readonly port: ImportPresentationPort) {
    this.tasks = new ImportTasks(port.report);
    this.browser = createImportBrowser(port.sources, this.tasks);
  }
  get available() {
    return Boolean(this.port.sources);
  }
  get canOpen() {
    return Boolean(this.port.open);
  }
  get plan() {
    return this.phase === "ready" ? this.selectedRow : undefined;
  }
  async load() {
    if (!this.#closed) await this.browser.loadHarness("codex", true);
  }
  select(selector: string) {
    const row = this.browser.rows.find((row) => row.selector === selector);
    if (this.#closed || this.busy || !row || !this.port.sources)
      return Promise.resolve();
    const previous = this.#current;
    previous?.abort.abort();
    if (previous && !previous.work) void this.release(previous);
    const reader: Reader = {
      abort: new AbortController(),
      epoch: ++this.#epoch,
      selector,
    };
    this.#current = reader;
    this.#readers.add(reader);
    this.selectedRow = row;
    this.entries = [];
    this.saved = undefined;
    this.phase = "reading";
    this.progress = 0;
    this.paused = false;
    return this.read(reader);
  }
  private active(reader: Reader) {
    return (
      !this.#closed &&
      !reader.abort.signal.aborted &&
      reader.epoch === this.#epoch
    );
  }
  private read(reader: Reader): Promise<void> {
    if (reader.work) return reader.work;
    const sources = this.port.sources!;
    return (reader.work = (async () => {
      try {
        do {
          const raw = await (reader.id
            ? sources.nextPreview(reader.id, reader.abort.signal)
            : sources.startPreview(reader.selector, reader.abort.signal));
          // Retain an acquired identity even if validation or selection fencing rejects its data.
          if (
            !reader.id &&
            typeof raw?.reader === "string" &&
            /^[A-Za-z0-9._:-]{1,128}$/u.test(raw.reader)
          )
            reader.id = raw.reader;
          const page = validatePreview(raw);
          if (page.reader !== reader.id)
            throw new Error("Preview reader identity changed");
          if (!this.active(reader)) return;
          if (page.progress < this.progress)
            throw new Error("Preview progress moved backwards");
          const entries = new Map(
            [...this.entries, ...page.entries].map((item) => [item.id, item]),
          );
          this.entries = page.order
            ? page.order.map((id) => entries.get(id)!).filter(Boolean)
            : [...entries.values()];
          this.progress = page.progress;
          if (page.progress === 100) this.phase = "ready";
        } while (
          this.active(reader) &&
          !this.paused &&
          this.phase === "reading"
        );
      } catch (error) {
        if (this.active(reader)) {
          this.phase = "failed";
          this.port.report?.(error);
        }
      } finally {
        reader.work = undefined;
        if (!this.active(reader) || this.phase !== "reading")
          await this.release(reader);
      }
    })());
  }
  private release(reader: Reader): Promise<void> {
    return (reader.release ??= (async () => {
      try {
        if (reader.id)
          await this.port.sources!.releasePreview(
            reader.id,
            new AbortController().signal,
          );
      } catch (error) {
        this.port.report?.(error);
      } finally {
        this.#readers.delete(reader);
      }
    })());
  }
  togglePause() {
    if (this.#closed || this.phase !== "reading") return;
    this.paused = !this.paused;
    if (!this.paused && this.#current) void this.read(this.#current);
  }
  reload() {
    return this.selectedRow
      ? this.select(this.selectedRow.selector)
      : Promise.resolve();
  }
  save(): Promise<void> {
    if (
      this.busy ||
      !this.selectedRow ||
      this.phase !== "ready" ||
      this.#closed
    )
      return Promise.resolve();
    this.busy = true;
    const epoch = this.#epoch;
    return (this.#saving = (async () => {
      try {
        const saved = await this.port.save(this.selectedRow!.selector, [
          ...this.entries,
        ]);
        if (!this.#closed && epoch === this.#epoch) this.saved = saved;
      } catch (error) {
        if (!this.#closed) this.port.report?.(error);
      } finally {
        if (!this.#closed) this.busy = false;
      }
    })());
  }
  async open() {
    if (!this.#closed && this.saved) await this.port.open?.(this.saved.id);
  }
  close(): Promise<void> {
    if (this.#closing) return this.#closing;
    this.#closed = true;
    this.#epoch++;
    for (const reader of this.#readers) reader.abort.abort();
    this.browser.close();
    this.tasks.fence();
    return (this.#closing = (async () => {
      const readers = [...this.#readers];
      await Promise.allSettled(readers.map((reader) => reader.work));
      await Promise.all(readers.map((reader) => this.release(reader)));
      await this.#saving;
      await this.tasks.settle();
    })());
  }
}
export type ImportState = ImportController;

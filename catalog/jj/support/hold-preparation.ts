import type { HistoryReader } from "../../../packages/repository-ui/src/jj/index.js";
/** A catalog-owned pending read; closing its owner releases it before drain. */
export function holdPreparation(reader: HistoryReader) {
  const pending = new Map<string, () => void>();
  const status = reader.status,
    close = reader.close;
  reader.status = async (handle) => {
    await new Promise<void>((resolve) => pending.set(handle, resolve));
    return status(handle);
  };
  reader.close = async (handle) => {
    pending.get(handle)?.();
    pending.delete(handle);
    await close(handle);
  };
}

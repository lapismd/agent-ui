import { describe, expect, it, vi } from "vitest";
import {
  createAppearanceStore,
  attachAppearance,
} from "../packages/repository-ui/src/jj/settings/appearance/state/store.svelte.js";
import {
  defaultAppearance,
  parseAppearance,
} from "../packages/repository-ui/src/jj/settings/appearance/state/preferences.js";

function storage() {
  const values = new Map<string, string>();
  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    key: (index: number) => [...values.keys()][index] ?? null,
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
    removeItem: (key: string) => {
      values.delete(key);
    },
  } satisfies Storage;
}

describe("host-owned repository appearance", () => {
  it("isolates hosts and restores their existing preference namespace", () => {
    const local = storage();
    const first = createAppearanceStore(local, false, "first");
    const second = createAppearanceStore(local, false, "second");
    first.update({ fontSize: "larger", theme: "github-light" });
    expect(second.saved.fontSize).toBe("default");
    expect(local.getItem("second")).toBeNull();
    expect(createAppearanceStore(local, true, "first").theme).toBe(
      "github-dark",
    );
    expect(createAppearanceStore(local, false, "first").saved.fontSize).toBe(
      "larger",
    );
  });

  it("previews without persistence and keeps paired modes coherent", () => {
    const local = storage();
    const store = createAppearanceStore(local, false, "preview");
    store.preview({ fontSize: "smaller" });
    expect(store.live.fontSize).toBe("smaller");
    expect(store.saved.fontSize).toBe("default");
    expect(local.length).toBe(0);
    store.resetPreview();
    expect(store.live.fontSize).toBe("default");
    store.mode("dark");
    expect(store.theme).toBe("buzz-dark");
    store.mode("system");
    expect(store.theme).toBe("buzz");
    store.system(true);
    expect(store.theme).toBe("buzz-dark");
  });

  it("validates persisted input and survives unavailable storage", () => {
    expect(parseAppearance("invalid")).toEqual(defaultAppearance);
    expect(
      parseAppearance('{"version":1,"fontSize":"huge","opacity":1000}'),
    ).toMatchObject({ fontSize: "default", opacity: 90 });
    const denied = {
      ...storage(),
      getItem() {
        throw Error("denied");
      },
      setItem() {
        throw Error("denied");
      },
    };
    const store = createAppearanceStore(denied);
    expect(() => store.update({ fontSize: "larger" })).not.toThrow();
    expect(store.saved.fontSize).toBe("larger");
  });

  it("filters storage events and removes its browser listeners", () => {
    const media = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    const target = {
      matchMedia: () => media,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    const root = {
      dataset: {},
      classList: { toggle: vi.fn() },
      style: { setProperty: vi.fn(), colorScheme: "" },
    };
    const store = createAppearanceStore(undefined, false, "owned");
    const dispose = attachAppearance(
      store,
      target as unknown as Window,
      root as unknown as HTMLElement,
    );
    const receive = target.addEventListener.mock.calls[0][1];
    const newValue = JSON.stringify({
      ...defaultAppearance,
      fontSize: "larger",
    });
    receive({ key: "another", newValue });
    expect(store.saved.fontSize).toBe("default");
    receive({ key: "owned", newValue });
    expect(store.saved.fontSize).toBe("larger");
    dispose();
    expect(target.removeEventListener).toHaveBeenCalledWith("storage", receive);
    expect(media.removeEventListener).toHaveBeenCalledWith(
      "change",
      media.addEventListener.mock.calls[0][1],
    );
  });
});

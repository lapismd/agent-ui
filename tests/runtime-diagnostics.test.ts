import { describe, expect, it, vi } from "vitest";
import {
  installSvelteRuntimeDiagnosticGuard,
  isSvelteRuntimeDiagnostic,
} from "../scripts/storybook-runtime-diagnostics.js";

describe("Storybook Svelte runtime diagnostics", () => {
  it.each([
    ["%c[svelte] derived_inert%c", "color: orange", ""],
    ["https://svelte.dev/e/derived_inert"],
    [new Error("https://svelte.dev/e/effect_update_depth_exceeded")],
  ])("recognizes formatted, URL, and Error diagnostics", (...args) => {
    expect(isSvelteRuntimeDiagnostic(args)).toBe(true);
  });

  it("fails warnings and errors while retaining logging and restoring console", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const restore = installSvelteRuntimeDiagnosticGuard();
    try {
      expect(() => console.warn("[Violation] handler took 51ms")).not.toThrow();
      expect(() => console.warn("[svelte] derived_inert")).toThrow(
        /Svelte runtime diagnostic.*derived_inert/,
      );
      expect(() => console.error("https://svelte.dev/e/derived_inert")).toThrow(
        /Svelte runtime diagnostic.*derived_inert/,
      );
      expect(warn).toHaveBeenCalledWith("[svelte] derived_inert");
      expect(error).toHaveBeenCalledWith("https://svelte.dev/e/derived_inert");
      restore();
      expect(console.warn).toBe(warn);
      expect(console.error).toBe(error);
      expect(() => console.warn("[svelte] derived_inert")).not.toThrow();
    } finally {
      restore();
      warn.mockRestore();
      error.mockRestore();
    }
  });

  it("retains fatal origin diagnostics while allowing teardown to complete", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const diagnostics: string[] = [];
    const restore = installSvelteRuntimeDiagnosticGuard((message) =>
      diagnostics.push(message),
    );
    let cleaned = false;
    try {
      expect(() => {
        console.warn("[svelte] state_proxy_equality_mismatch");
        cleaned = true;
      }).not.toThrow();
      expect(cleaned).toBe(true);
      expect(diagnostics).toHaveLength(1);
      expect(diagnostics[0]).toContain("state_proxy_equality_mismatch");
      expect(diagnostics[0]).toContain("runtime-diagnostics.test.ts");
    } finally {
      restore();
      warn.mockRestore();
    }
  });
  it("does not overwrite a later console wrapper during disposal", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const restore = installSvelteRuntimeDiagnosticGuard();
    const later = () => {};
    console.warn = later;
    restore();
    expect(console.warn).toBe(later);
    warn.mockRestore();
  });
});

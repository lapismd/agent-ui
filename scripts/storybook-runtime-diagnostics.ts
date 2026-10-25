const SVELTE_RUNTIME_DIAGNOSTIC = /(?:\[svelte\]|svelte\.dev\/e\/[a-z_]+)/u;

export function isSvelteRuntimeDiagnostic(args: readonly unknown[]): boolean {
  return SVELTE_RUNTIME_DIAGNOSTIC.test(
    args
      .map((value) =>
        typeof value === "string"
          ? value
          : value instanceof Error
            ? (value.stack ?? value.message)
            : "",
      )
      .join(" "),
  );
}

export function installSvelteRuntimeDiagnosticGuard(
  onDiagnostic?: (message: string) => void,
): () => void {
  const originalWarn = console.warn;
  const originalError = console.error;
  const guard =
    (original: typeof console.warn) =>
    (...args: unknown[]): void => {
      original.apply(console, args);
      if (!isSvelteRuntimeDiagnostic(args)) return;
      const message = args
        .map((value) =>
          value instanceof Error ? value.message : String(value),
        )
        .join(" ")
        .replaceAll("%c", "")
        .trim();
      const error = new Error(`Svelte runtime diagnostic: ${message}`);
      if (onDiagnostic) onDiagnostic(error.stack ?? error.message);
      else throw error;
    };
  const warn = guard(originalWarn),
    error = guard(originalError);
  console.warn = warn;
  console.error = error;
  return () => {
    if (console.warn === warn) console.warn = originalWarn;
    if (console.error === error) console.error = originalError;
  };
}

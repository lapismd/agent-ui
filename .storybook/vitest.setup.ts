import { afterAll, afterEach } from "vitest";
import { installSvelteRuntimeDiagnosticGuard } from "../scripts/storybook-runtime-diagnostics.js";
// Addon-vitest owns project annotations and cleanup. Keep diagnostics fatal through teardown.
const diagnostics: string[] = [];
installSvelteRuntimeDiagnosticGuard((message) => diagnostics.push(message));
function assertNoDiagnostics() {
  if (diagnostics.length)
    throw new Error(
      `Svelte runtime diagnostics:\n${diagnostics.splice(0).join("\n")}`,
    );
}
afterEach(assertNoDiagnostics);
afterAll(assertNoDiagnostics);

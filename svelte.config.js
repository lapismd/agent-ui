import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/**
 * Fail Vite / Storybook transforms on any Svelte compiler warning so unused CSS
 * and similar debt cannot accumulate as console noise. `pnpm check` already
 * runs `svelte-check --fail-on-warnings`.
 *
 * @param {{ code?: string, message: string, filename?: string, start?: { line: number, column: number } }} warning
 * @param {(warning: typeof warning) => void} _defaultHandler
 */
function onwarn(warning, defaultHandler) {
  // vite-plugin-svelte may inject a global `*` selector; ignore that noise.
  if (
    warning.code === "css_unused_selector" &&
    warning.message.includes('"*"')
  ) {
    return;
  }

  // Bits-ui / shadcn root wrappers often have no native HTML in the template
  // while still owning intentional `:global { [data-ui-component=…] }` CSS from
  // the generator. That is expected; do not fail the Vite transform over it.
  if (warning.code === "vite-plugin-svelte-css-no-scopable-elements") {
    return;
  }

  // Dependency packages (e.g. @storybook/addon-svelte-csf) can emit Svelte 5
  // warnings we cannot patch; log them but do not fail the transform/build.
  const file = warning.filename ?? "";
  if (file.includes("node_modules") || file.includes(".pnpm")) {
    defaultHandler(warning);
    return;
  }

  const loc = file
    ? `${file}:${warning.start?.line ?? 0}:${warning.start?.column ?? 0}`
    : "svelte";
  throw new Error(`[svelte] ${warning.code} at ${loc}: ${warning.message}`);
}

/** @type {import("@sveltejs/vite-plugin-svelte").SvelteConfig} */
const config = {
  preprocess: vitePreprocess(),
  onwarn,
  compilerOptions: {
    runes: undefined,
  },
};

export default config;

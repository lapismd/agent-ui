// SPDX-License-Identifier: Apache-2.0; adapted from Design Core's cold catalog setup.
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function discoverCatalogIcons(root: string): string[] {
  const icons = new Set<string>();
  const scan = (directory: string) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (
        entry.isDirectory() &&
        !entry.name.startsWith(".") &&
        !["node_modules", "dist"].includes(entry.name)
      )
        scan(file);
      else if (entry.isFile() && /\.(svelte|tsx?|mdx)$/.test(entry.name)) {
        for (const match of readFileSync(file, "utf8").matchAll(
          /["'](@lucide\/svelte(?:\/icons\/[a-z0-9-]+)?)["']/g,
        ))
          icons.add(match[1]);
      }
    }
  };
  scan(root);
  return [...icons].sort();
}
const root = fileURLToPath(new URL("../", import.meta.url));
const designCore = path.resolve(
  fileURLToPath(import.meta.resolve("@lapismd/design-core/chat")),
  "../../..",
);
export const storybookBrowserDependencies = [
  ...new Set([
    ...discoverCatalogIcons(path.join(root, "packages")),
    ...discoverCatalogIcons(path.join(root, "catalog")),
    ...discoverCatalogIcons(designCore),
  ]),
  "@lapismd/design-core/shadcn/file-type-icon",
  "react",
  "react-dom",
  "react-dom/client",
  "@storybook/addon-a11y/preview",
  "@storybook/svelte-vite",
  "svelte/internal/flags/legacy",
  "storybook/test",
];

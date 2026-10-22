import { expect, test } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import config from "../vite.config.js";
import { discoverCatalogIcons } from "../.storybook/dependency-optimization.js";
test("cold Storybook prebundles source, catalog, dependency icons and docs runtime", () => {
  expect(config.optimizeDeps?.include).toEqual(
    expect.arrayContaining([
      "@lucide/svelte/icons/file-question-mark",
      "react-dom/client",
      "storybook/test",
    ]),
  );
  const root = mkdtempSync(path.join(tmpdir(), "agent-ui-icons-"));
  try {
    mkdirSync(path.join(root, "nested"));
    writeFileSync(
      path.join(root, "nested", "Demo.mdx"),
      `import Icon from '@lucide/svelte/icons/info'`,
    );
    writeFileSync(
      path.join(root, "Demo.svelte"),
      `import Icon from '@lucide/svelte/icons/info'`,
    );
    writeFileSync(
      path.join(root, "ignored.svg"),
      `"@lucide/svelte/icons/ignored"`,
    );
    expect(discoverCatalogIcons(root)).toEqual(["@lucide/svelte/icons/info"]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

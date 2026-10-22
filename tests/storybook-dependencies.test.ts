import { expect, test } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import config from "../vite.config.js";
import main from "../.storybook/main.js";
import browser from "./catalog-browser.config.js";
import type { StorybookConfig } from "@storybook/svelte-vite";
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

test("cold browser startup waits for the catalog client compiler", async () => {
  const final = await main.viteFinal!({}, {} as never);
  expect(final.plugins).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ name: "lapis-catalog-client-readiness" }),
    ]),
  );
  expect(browser.webServer).toMatchObject({
    url: "http://127.0.0.1:7498/__lapis_catalog_ready",
  });
});

test("Storybook dev receives the same prebundles as the test runner", async () => {
  const storybook = main as StorybookConfig;
  expect(storybook.viteFinal).toBeTypeOf("function");
  const final = await storybook.viteFinal!(
    { optimizeDeps: { include: ["host-entry"] } },
    {} as never,
  );
  expect(final.optimizeDeps?.include).toEqual(
    expect.arrayContaining([
      "host-entry",
      "@lapismd/design-core/shadcn/file-type-icon",
      "@lucide/svelte/icons/file-question-mark",
      "react-dom/client",
      "storybook/test",
    ]),
  );
});

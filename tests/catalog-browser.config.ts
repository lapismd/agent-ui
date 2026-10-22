import { fileURLToPath } from "node:url";
import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: ".",
  testMatch: [
    "catalog-browser.pw.ts",
    "transcript-review.pw.ts",
    "jj-review.pw.ts",
  ],
  workers: 1,
  outputDir: "../.local/catalog-browser",
  use: {
    browserName: "chromium",
    baseURL: "http://127.0.0.1:7498",
    viewport: { width: 1280, height: 900 },
  },
  webServer: {
    cwd: fileURLToPath(new URL("../", import.meta.url)),
    command: "STORYBOOK_PORT=7498 pnpm storybook --ci",
    url: "http://127.0.0.1:7498",
    reuseExistingServer: false,
    timeout: 60000,
  },
});

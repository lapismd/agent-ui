import { fileURLToPath } from "node:url";
import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: ".",
  testMatch: "source-parity.pw.ts",
  workers: 1,
  outputDir: "../.local/parity-tests",
  use: {
    browserName: "chromium",
    deviceScaleFactor: 1,
    baseURL: "http://127.0.0.1:7497",
  },
  webServer: {
    cwd: fileURLToPath(new URL("../", import.meta.url)),
    command: "pnpm exec vite --config tests/reference/vite.config.ts",
    url: "http://127.0.0.1:7497",
    reuseExistingServer: false,
  },
});

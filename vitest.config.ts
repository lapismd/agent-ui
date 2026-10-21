import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
export default defineConfig({
  test: {
    projects: [
      {
        plugins: [svelte()],
        resolve: { conditions: ["browser"] },
        test: {
          name: "unit",
          include: ["tests/**/*.test.ts"],
          environment: "node",
        },
      },
      {
        extends: "./vite.config.ts",
        plugins: [storybookTest({ configDir: ".storybook" })],
        test: {
          name: "storybook",
          setupFiles: [".storybook/vitest.setup.ts"],
          testTimeout: 45000,
          fileParallelism: false,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            viewport: process.env.CATALOG_NARROW
              ? { width: 420, height: 800 }
              : { width: 1280, height: 900 },
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});

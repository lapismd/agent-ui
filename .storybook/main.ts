import type { StorybookConfig } from "@storybook/svelte-vite";
export default {
  stories: ["../catalog/Agent*.stories.ts", "../catalog/Progress.mdx"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
    "@storybook/addon-vitest",
  ],
  framework: "@storybook/svelte-vite",
  core: { disableTelemetry: true },
} satisfies StorybookConfig;

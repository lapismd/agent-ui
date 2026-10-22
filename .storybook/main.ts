import type { StorybookConfig } from "@storybook/svelte-vite";
import remarkGfm from "remark-gfm";
export default {
  stories: [
    "../packages/agent-ui/src/**/*.stories.ts",
    "../packages/agent-ui/src/**/*.mdx",
    "../packages/repository-ui/src/jj/**/*.stories.ts",
    "../packages/repository-ui/src/jj/**/*.mdx",
    "../catalog/Agent*.stories.ts",
    "../catalog/Progress.mdx",
    "../catalog/specification/*.mdx",
  ],
  addons: [
    {
      name: "@storybook/addon-docs",
      options: {
        mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } },
      },
    },
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
    "@storybook/addon-vitest",
  ],
  framework: "@storybook/svelte-vite",
  core: { disableTelemetry: true },
} satisfies StorybookConfig;

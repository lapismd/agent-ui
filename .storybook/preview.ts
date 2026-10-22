import type { Preview } from "@storybook/svelte-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import "@lapismd/design-core/styles.css";
import "@lapismd/design-core/themes/lapis.css";
import "../catalog/catalog.css";
const preview: Preview = {
  tags: ["autodocs"],
  globalTypes: {
    theme: {
      description: "Brand theme",
      toolbar: {
        icon: "paintbrush",
        items: [
          { value: "default", title: "Default" },
          { value: "lapis", title: "Lapis" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "lapis",
    colorMode: import.meta.env.CATALOG_THEME ?? "light",
  },
  decorators: [
    withThemeByDataAttribute({
      themes: { default: "default", lapis: "lapis" },
      defaultTheme: "lapis",
      attributeName: "data-ui-theme",
    }),
    (story, context) => {
      document.body.toggleAttribute(
        "data-ui-catalog-full-viewport",
        context.viewMode === "story",
      );
      document.documentElement.classList.toggle(
        "dark",
        context.globals.colorMode === "dark",
      );
      return story();
    },
  ],
  parameters: {
    layout: "fullscreen",
    a11y: { test: "error", context: { exclude: [".cm-gutters"] } },
    backgrounds: { disable: true },
    themes: { disable: true },
    docs: { toc: { headingSelector: "h2, h3", title: "On this page" } },
    options: {
      storySort: {
        order: [
          "Specification",
          ["Introduction", "Agent", "Governance", "Repository", "Verification"],
          "Agents",
          ["Foundations", "Chat", "History", "Catalog", "Complete screens"],
          "Review",
        ],
      },
    },
  },
};
export default preview;

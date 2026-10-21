import type { Preview } from "@storybook/svelte-vite";
import "@lapismd/design-core/styles.css";
import "@lapismd/design-core/themes/lapis.css";
import "../catalog/catalog.css";
const preview: Preview = {
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", a11y: { test: "error" } },
  globalTypes: {
    colorMode: {
      description: "Color mode",
      toolbar: { icon: "circlehollow", items: ["light", "dark"] },
    },
  },
  initialGlobals: { colorMode: import.meta.env.CATALOG_THEME ?? "light" },
  decorators: [
    (story, context) => {
      document.documentElement.dataset.uiTheme = "lapis";
      document.documentElement.classList.toggle(
        "dark",
        context.globals.colorMode === "dark",
      );
      return story();
    },
  ],
};
export default preview;

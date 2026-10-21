import { mount } from "svelte";
import "@lapismd/design-core/styles.css";
import "@lapismd/design-core/themes/lapis.css";
import "../../packages/agent-ui/src/chat/panel.css";
import "../../catalog/catalog.css";
import SessionBoundary from "./SessionBoundary.svelte";
document.documentElement.dataset.uiTheme = "lapis";
document.documentElement.classList.toggle(
  "dark",
  new URLSearchParams(location.search).has("dark"),
);
mount(SessionBoundary, { target: document.querySelector("#storybook-root")! });

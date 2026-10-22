import { mount } from "svelte";
import "@lapismd/design-core/styles.css";
import "@lapismd/design-core/themes/lapis.css";
import "../../packages/agent-ui/src/chat/panel.css";
import "../../catalog/catalog.css";
import RepositoryBoundary from "./RepositoryBoundary.svelte";
import SessionBoundary from "./SessionBoundary.svelte";
document.documentElement.dataset.uiTheme = "lapis";
document.documentElement.classList.toggle(
  "dark",
  new URLSearchParams(location.search).has("dark"),
);
mount(
  new URLSearchParams(location.search).has("jj")
    ? RepositoryBoundary
    : SessionBoundary,
  { target: document.querySelector("#storybook-root")! },
);

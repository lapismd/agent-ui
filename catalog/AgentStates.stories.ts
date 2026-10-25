import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, within } from "storybook/test";
import { AgentWorkbench } from "../packages/agent-ui/src/screens/index.js";
import AgentDemo from "./AgentDemo.svelte";
import CatalogStateDemo from "./agents/catalog/CatalogStateDemo.svelte";
import { agentSource } from "./example-sources.js";

export default {
  title: "Agents/Complete screens/Content states",
  component: AgentWorkbench,
  tags: ["visual-pending"],
  parameters: {
    layout: "fullscreen",
    docs: { source: { code: agentSource, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof AgentWorkbench>;
type Story = StoryObj<typeof AgentDemo>;
type CatalogStory = StoryObj<typeof CatalogStateDemo>;
export const Loading: Story = {
  render: () => ({
    Component: AgentDemo,
    props: { screen: "catalog", contentState: "loading" },
  }),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole("alert")).toBeNull();
    await expect(
      await within(canvasElement).findByRole("status", {
        name: "Loading catalog",
      }),
    ).toBeVisible();
    await expect(
      canvasElement.querySelector('[data-slot="skeleton"]'),
    ).toBeVisible();
  },
};
export const Empty: Story = {
  render: () => ({
    Component: AgentDemo,
    props: { screen: "catalog", contentState: "empty" },
  }),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole("alert")).toBeNull();
    await expect(
      await within(canvasElement).findByText("No catalog items yet"),
    ).toBeVisible();
    await expect(
      canvasElement.querySelector('[data-ui-part="empty-media"] svg'),
    ).toBeVisible();
  },
};
export const Unavailable: Story = {
  render: () => ({
    Component: AgentDemo,
    props: { screen: "catalog", contentState: "unavailable" },
  }),
  play: async ({ canvasElement }) => {
    const alert = await within(canvasElement).findByRole("alert");
    await expect(alert).toHaveTextContent(
      "The local folder index could not be read.",
    );
    await expect(
      await within(canvasElement).findByText("Catalog unavailable"),
    ).toBeVisible();
    await expect(
      canvasElement.querySelector('[data-ui-part="empty-media"] svg'),
    ).toBeVisible();
  },
};
export const RetainedCatalogLoading: CatalogStory = {
  name: "Retained Catalog Loading",
  render: () => ({ Component: CatalogStateDemo, props: { state: "loading" } }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("status", { name: "Loading catalog" }),
    ).toBeVisible();
    await expect(
      canvas.getByRole("tree", { name: "AI catalog" }),
    ).toBeVisible();
    await expect(
      await canvas.findByRole("treeitem", { name: /^Research$/ }),
    ).toBeVisible();
    await expect(canvas.queryByRole("alert")).toBeNull();
  },
};
export const RetainedCatalogUnavailable: CatalogStory = {
  name: "Retained Catalog Unavailable",
  render: () => ({
    Component: CatalogStateDemo,
    props: { state: "unavailable" },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const alert = await canvas.findByRole("alert");
    await expect(alert).toHaveTextContent(
      "The configured catalog source could not be read.",
    );
    await expect(
      canvas.getByRole("tree", { name: "AI catalog" }),
    ).toBeVisible();
    await expect(
      await canvas.findByRole("treeitem", { name: /^Research$/ }),
    ).toBeVisible();
    await expect(canvas.queryByRole("status")).toBeNull();
  },
};
export const HistoryLoading: Story = {
  render: () => ({
    Component: AgentDemo,
    props: { screen: "history", contentState: "loading" },
  }),
};
export const HistoryEmpty: Story = {
  render: () => ({
    Component: AgentDemo,
    props: { screen: "history", contentState: "empty" },
  }),
};
export const HistoryUnavailable: Story = {
  render: () => ({
    Component: AgentDemo,
    props: { screen: "history", contentState: "unavailable" },
  }),
};
export const ImportsLoading: Story = {
  render: () => ({
    Component: AgentDemo,
    props: { screen: "imports", contentState: "loading" },
  }),
};
export const ImportsEmpty: Story = {
  render: () => ({
    Component: AgentDemo,
    props: { screen: "imports", contentState: "empty" },
  }),
};
export const ImportsUnavailable: Story = {
  render: () => ({
    Component: AgentDemo,
    props: { screen: "imports", contentState: "unavailable" },
  }),
};

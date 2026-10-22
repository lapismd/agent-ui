import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "./RepositoryFileTree.svelte";
import Demo from "../../../../../../catalog/jj/BrowserDemo.svelte";
import { assertBrowser } from "../../../../../../catalog/jj/support/assert-browser.js";
import { Basic as source } from "./RepositoryFileTree.example-sources.js";
export default {
  title: "JJ/Browsing/File Tree",
  component: Component,
  tags: ["visual-pending"],
  parameters: {
    docs: { source: { code: source, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Component>;
type Story = StoryObj<typeof Demo>;
export const Basic: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryFileTree", variant: "Basic" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryFileTree", "Basic"),
};
export const Nested: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryFileTree", variant: "Nested" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryFileTree", "Nested"),
};
export const Dense: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryFileTree", variant: "Dense" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryFileTree", "Dense"),
};
export const Empty: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryFileTree", variant: "Empty" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryFileTree", "Empty"),
};
export const Loading: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryFileTree", variant: "Loading" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryFileTree", "Loading"),
};

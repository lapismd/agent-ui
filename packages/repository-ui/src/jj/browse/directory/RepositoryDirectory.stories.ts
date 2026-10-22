import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "./RepositoryDirectory.svelte";
import Demo from "../../../../../../catalog/jj/BrowserDemo.svelte";
import { assertBrowser } from "../../../../../../catalog/jj/support/assert-browser.js";
import { Basic as source } from "./RepositoryDirectory.example-sources.js";
export default {
  title: "JJ/Browsing/Directory",
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
    props: { part: "RepositoryDirectory", variant: "Basic" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryDirectory", "Basic"),
};
export const Nested: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryDirectory", variant: "Nested" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryDirectory", "Nested"),
};
export const Dense: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryDirectory", variant: "Dense" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryDirectory", "Dense"),
};
export const Empty: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryDirectory", variant: "Empty" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryDirectory", "Empty"),
};
export const Loading: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryDirectory", variant: "Loading" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryDirectory", "Loading"),
};
export const Unavailable: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryDirectory", variant: "Unavailable" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryDirectory", "Unavailable"),
};

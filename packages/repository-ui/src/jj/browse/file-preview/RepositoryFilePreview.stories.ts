import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "./RepositoryFilePreview.svelte";
import Demo from "../../../../../../catalog/jj/BrowserDemo.svelte";
import { assertBrowser } from "../../../../../../catalog/jj/support/assert-browser.js";
import { Basic as source } from "./RepositoryFilePreview.example-sources.js";
export default {
  title: "JJ/Browsing/File Preview",
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
    props: { part: "RepositoryFilePreview", variant: "Basic" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryFilePreview", "Basic"),
};
export const Source: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryFilePreview", variant: "Source" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryFilePreview", "Source"),
};
export const Binary: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryFilePreview", variant: "Binary" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryFilePreview", "Binary"),
};
export const Empty: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryFilePreview", variant: "Empty" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryFilePreview", "Empty"),
};
export const Loading: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryFilePreview", variant: "Loading" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryFilePreview", "Loading"),
};
export const Unavailable: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryFilePreview", variant: "Unavailable" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryFilePreview", "Unavailable"),
};
export const Retry: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryFilePreview", variant: "Retry" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryFilePreview", "Retry"),
};

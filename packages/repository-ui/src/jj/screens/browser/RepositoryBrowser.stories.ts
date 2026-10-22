import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "./RepositoryBrowser.svelte";
import Demo from "../../../../../../catalog/jj/BrowserDemo.svelte";
import { assertBrowser } from "../../../../../../catalog/jj/support/assert-browser.js";
import { Basic as source } from "./RepositoryBrowser.example-sources.js";
export default {
  title: "JJ/Complete screens/Files",
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
    props: { part: "RepositoryBrowser", variant: "Basic" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryBrowser", "Basic"),
};
export const Nested: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryBrowser", variant: "Nested" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryBrowser", "Nested"),
};
export const Dense: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryBrowser", variant: "Dense" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryBrowser", "Dense"),
};
export const Markdown: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryBrowser", variant: "Markdown" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryBrowser", "Markdown"),
};
export const Source: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryBrowser", variant: "Source" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryBrowser", "Source"),
};
export const Binary: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryBrowser", variant: "Binary" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryBrowser", "Binary"),
};
export const EmptyFile: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryBrowser", variant: "EmptyFile" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryBrowser", "EmptyFile"),
};
export const UnavailableFile: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryBrowser", variant: "UnavailableFile" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryBrowser", "UnavailableFile"),
};
export const Empty: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryBrowser", variant: "Empty" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryBrowser", "Empty"),
};
export const Loading: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryBrowser", variant: "Loading" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryBrowser", "Loading"),
};
export const Unavailable: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryBrowser", variant: "Unavailable" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryBrowser", "Unavailable"),
};
export const Retry: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryBrowser", variant: "Retry" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryBrowser", "Retry"),
};
export const HostActions: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryBrowser", variant: "HostActions" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryBrowser", "HostActions"),
};
export const History: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryBrowser", variant: "History" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryBrowser", "History"),
};
export const Blame: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryBrowser", variant: "Blame" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryBrowser", "Blame"),
};

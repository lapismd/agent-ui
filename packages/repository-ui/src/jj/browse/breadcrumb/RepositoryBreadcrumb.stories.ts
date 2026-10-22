import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "./RepositoryBreadcrumb.svelte";
import Demo from "../../../../../../catalog/jj/BrowserDemo.svelte";
import { assertBrowser } from "../../../../../../catalog/jj/support/assert-browser.js";
import { Basic as source } from "./RepositoryBreadcrumb.example-sources.js";
export default {
  title: "JJ/Browsing/Breadcrumb",
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
    props: { part: "RepositoryBreadcrumb", variant: "Basic" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryBreadcrumb", "Basic"),
};
export const Nested: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryBreadcrumb", variant: "Nested" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryBreadcrumb", "Nested"),
};
export const LongPath: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryBreadcrumb", variant: "LongPath" },
  }),
  play: async ({ canvasElement }) =>
    assertBrowser(canvasElement, "RepositoryBreadcrumb", "LongPath"),
};

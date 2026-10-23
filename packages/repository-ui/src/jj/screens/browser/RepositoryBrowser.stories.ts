import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, userEvent, within } from "storybook/test";
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
export const WorkingFile: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryBrowser", variant: "WorkingFile" },
  }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const edit = await c.findByRole("button", { name: "Edit working file" });
    expect(edit.textContent?.trim()).toBe("");
    expect(edit.querySelector("svg")).not.toBeNull();
    await userEvent.click(edit);
    await expect(c.getByTestId("browser-state")).toHaveAttribute(
      "data-actions",
      expect.stringContaining("edit:README.md:"),
    );
  },
};
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
export const DirectoryRecovery: Story = {
  render: () => ({
    Component: Demo,
    props: { part: "RepositoryBrowser", variant: "Unavailable" },
  }),
  play: async ({ canvasElement }) => {
    await assertBrowser(canvasElement, "RepositoryBrowser", "Unavailable");
    const { within, userEvent, expect } = await import("storybook/test");
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("button", { name: "Retry preview" }));
    await expect(
      await c.findByRole("table", { name: "Repository files" }),
    ).toBeVisible();
  },
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

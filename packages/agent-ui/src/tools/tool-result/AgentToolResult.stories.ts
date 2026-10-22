import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, within, userEvent } from "storybook/test";
import Component from "./AgentToolResult.svelte";
import Fixture from "./AgentToolResult.stories.fixture.svelte";
import { Basic as source } from "./AgentToolResult.example-sources.js";
export default {
  title: "Agents/Tool calls/Tool result",
  component: Component,
  tags: ["visual-pending"],
  parameters: {
    docs: { source: { code: source, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Component>;
type Story = StoryObj<typeof Fixture>;
export const Basic: Story = {
  render: () => ({ Component: Fixture }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const toggle = c.getByRole("button", { name: "Show raw capture" });
    await expect(toggle).toHaveTextContent("");
    await userEvent.click(toggle);
    await expect(
      c.getByRole("button", { name: "Show formatted output" }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(c.getByRole("group", { name: "json" })).toHaveTextContent(
      '"capture":"exact"',
    );
    await userEvent.click(
      c.getByRole("button", { name: "Show formatted output" }),
    );
    await expect(
      c.getByRole("button", { name: "Show raw capture" }),
    ).toHaveAttribute("aria-pressed", "false");
  },
};
export const Shell: Story = {
  render: () => ({ Component: Fixture, props: { kind: "shell" } }),
};
export const FileRead: Story = {
  render: () => ({ Component: Fixture, props: { kind: "file-read" } }),
};
export const FileEdit: Story = {
  render: () => ({ Component: Fixture, props: { kind: "file-edit" } }),
};
export const Search: Story = {
  render: () => ({ Component: Fixture, props: { kind: "search" } }),
};
export const PartialCapture: Story = {
  render: () => ({ Component: Fixture, props: { kind: "partial" } }),
};
export const Error: Story = {
  render: () => ({ Component: Fixture, props: { kind: "error" } }),
};
export const Unavailable: Story = {
  render: () => ({ Component: Fixture, props: { kind: "unavailable" } }),
};
export const RegisteredResult: Story = {
  render: () => ({ Component: Fixture, props: { registered: true } }),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText("Rendered by the host-provided view."),
    ).toBeVisible();
  },
};

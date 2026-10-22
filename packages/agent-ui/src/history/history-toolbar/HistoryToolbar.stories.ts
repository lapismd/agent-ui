import { expect, within, userEvent, waitFor } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "./HistoryToolbar.svelte";
import Fixture from "./HistoryToolbar.stories.fixture.svelte";
import { Basic as source } from "./HistoryToolbar.example-sources.js";
const meta = {
  title: "Agents/History/Toolbar",
  component: Component,
  tags: ["visual-pending"],
  parameters: {
    docs: { source: { code: source, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Component>;
export default meta;
type Story = StoryObj<typeof Fixture>;
export const Basic: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.type(
      c.getByRole("searchbox", { name: "Search conversations" }),
      "review",
    );
    await expect(c.getByRole("status")).toHaveTextContent("Filter: review");
  },
  render: () => ({ Component: Fixture, props: {} }),
};
export const Clearing: Story = {
  render: () => ({ Component: Fixture, props: {} }),
};

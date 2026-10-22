import { expect, within, userEvent, waitFor } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "./AiSessionList.svelte";
import Fixture from "./AiSessionList.stories.fixture.svelte";
import { Basic as source } from "./AiSessionList.example-sources.js";
const meta = {
  title: "Agents/Foundations/Session list",
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
    const row = c.getByRole("button", { name: /Open Plan the extraction/ });
    await userEvent.click(row);
    await expect(row).toHaveAttribute("aria-pressed", "true");
    await expect(c.getByRole("status")).toHaveTextContent("Selected: planning");
  },
  render: () => ({ Component: Fixture, props: {} }),
};
export const Loading: Story = {
  render: () => ({ Component: Fixture, props: { loading: true } }),
};
export const Empty: Story = {
  render: () => ({ Component: Fixture, props: { empty: true } }),
};
export const Busy: Story = {
  render: () => ({ Component: Fixture, props: { busy: true } }),
};

import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, within, userEvent } from "storybook/test";
import Component from "./AgentMessageMetadata.svelte";
import Fixture from "./AgentMessageMetadata.stories.fixture.svelte";
import { Basic as source } from "./AgentMessageMetadata.example-sources.js";
export default {
  title: "Agents/Chat/Message metadata",
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
    await expect(
      c.getByRole("alert", { name: "Failed details" }),
    ).toHaveTextContent("Your message is retained.");
    await userEvent.click(c.getByRole("button", { name: "Retry message" }));
  },
};
export const Classic: Story = {
  render: () => ({ Component: Fixture, props: { classic: true } }),
};
export const Recipients: Story = {
  render: () => ({ Component: Fixture, props: { recipients: true } }),
};

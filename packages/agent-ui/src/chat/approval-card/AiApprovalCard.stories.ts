import { expect, within, userEvent, waitFor } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "./AiApprovalCard.svelte";
import Fixture from "./AiApprovalCard.stories.fixture.svelte";
import { Basic as source } from "./AiApprovalCard.example-sources.js";
const meta = {
  title: "Agents/Chat/Approval card",
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
    await userEvent.click(c.getByRole("button", { name: /A Allow once/ }));
    await expect(await c.findByRole("status")).toHaveTextContent(
      "Acknowledged allow-once for approval-exact-1",
    );
  },
  render: () => ({ Component: Fixture, props: {} }),
};
export const Disabled: Story = {
  render: () => ({ Component: Fixture, props: { disabled: true } }),
};

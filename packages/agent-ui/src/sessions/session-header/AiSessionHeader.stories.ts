import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, userEvent, within } from "storybook/test";
import Header from "./AiSessionHeader.svelte";
import Fixture from "./AiSessionHeader.stories.fixture.svelte";
import { Basic as source } from "./AiSessionHeader.example-sources.js";
const meta = {
  title: "Agents/Foundations/Session header",
  component: Header,
  tags: ["visual-pending"],
  parameters: {
    docs: { source: { code: source, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Header>;
export default meta;
type Story = StoryObj<typeof Fixture>;
export const Basic: Story = {
  render: () => ({ Component: Fixture }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const toggle = c.getByRole("button", { name: "Toggle conversations" });
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
  },
};
export const LongTitle: Story = {
  render: () => ({ Component: Fixture, props: { long: true } }),
};
export const StylingVariables: Story = {
  render: () => ({ Component: Fixture, props: { styled: true } }),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("banner")).toHaveStyle({
      minHeight: "72px",
    });
  },
};

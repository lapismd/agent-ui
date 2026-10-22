import { expect, within, userEvent, waitFor } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "./AiQuestionCard.svelte";
import Fixture from "../approval-card/AiApprovalCard.stories.fixture.svelte";
import { Basic as source } from "./AiQuestionCard.example-sources.js";
const meta = {
  title: "Agents/Chat/Question card",
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
    await expect(
      c.getByRole("button", { name: "Submit answer" }),
    ).toBeDisabled();
    await userEvent.click(c.getByRole("button", { name: /A Allow once/ }));
    await userEvent.click(c.getByRole("button", { name: "Submit answer" }));
    await expect(await c.findByRole("status")).toHaveTextContent(
      'Acknowledged {"question-exact-1":["Allow once"]}',
    );
  },
  render: () => ({ Component: Fixture, props: { question: true } }),
};
export const FreeText: Story = {
  render: () => ({
    Component: Fixture,
    props: { question: true, freeText: true },
  }),
};
export const Disabled: Story = {
  render: () => ({
    Component: Fixture,
    props: { question: true, disabled: true },
  }),
};

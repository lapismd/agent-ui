import { expect, within, userEvent, waitFor } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "./ChatComposerDrawer.svelte";
import Fixture from "../transcript/AgentTranscript.stories.fixture.svelte";
import { Basic as source } from "./ChatComposerDrawer.example-sources.js";
const meta = {
  title: "Agents/Chat/Composer drawer",
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
    await userEvent.click(
      c.getByRole("button", { name: "Collapse Attachments 2" }),
    );
    await waitFor(() =>
      expect(
        c.queryByRole("button", { name: "Remove plan.md" }),
      ).not.toBeInTheDocument(),
    );
    await userEvent.click(
      c.getByRole("button", { name: "Expand Attachments 2" }),
    );
    await userEvent.click(c.getByRole("button", { name: "Remove plan.md" }));
    await expect(
      c.queryByRole("button", { name: "plan.md" }),
    ).not.toBeInTheDocument();
    await expect(c.getByRole("button", { name: "settings.ts" })).toBeVisible();
  },
  render: () => ({
    Component: Fixture,
    props: { part: "drawer", scenario: "attachments" },
  }),
};
export const Framed: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "drawer", scenario: "attachments", view: "classic" },
  }),
};
export const Approval: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "drawer", scenario: "approval" },
  }),
};
export const Question: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "drawer", scenario: "question" },
  }),
};

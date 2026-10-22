import { expect, within, userEvent, waitFor } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "./AiTranscriptToolInspector.svelte";
import Fixture from "../transcript/AgentTranscript.stories.fixture.svelte";
import { Basic as source } from "./AiTranscriptToolInspector.example-sources.js";
const meta = {
  title: "Agents/Chat/Tool inspector",
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
    const opener = c.getByRole("button", { name: "Inspect captured tool" });
    await userEvent.click(opener);
    await expect(
      within(document.body).getByRole("button", { name: "Close tool details" }),
    ).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(opener).toHaveFocus());
  },
  render: () => ({
    Component: Fixture,
    props: { part: "inspector", scenario: "all" },
  }),
};
export const Classic: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "inspector", scenario: "all", view: "classic" },
  }),
};

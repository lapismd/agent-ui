import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, within, userEvent } from "storybook/test";
import Transcript from "./AgentTranscript.svelte";
import Fixture from "./AgentTranscript.stories.fixture.svelte";
import { Basic as source } from "./AgentTranscript.example-sources.js";
const meta = {
  title: "Agents/Chat/Transcript",
  component: Transcript,
  tags: ["visual-pending"],
  parameters: {
    docs: { source: { code: source, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Transcript>;
export default meta;
type Story = StoryObj<typeof Fixture>;
export const Basic: Story = {
  name: "All supported messages",
  render: () => ({ Component: Fixture, props: { scenario: "all" } }),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("region", { name: "AI conversation" }),
    ).toBeVisible();
  },
};
export const Classic: Story = {
  name: "All messages in Classic",
  render: () => ({
    Component: Fixture,
    props: { scenario: "all", view: "classic" },
  }),
};
export const InlineComments: Story = {
  render: () => ({ Component: Fixture, props: { scenario: "comments" } }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const toggle = c.getAllByRole("button", {
      name: "Comment formatting options",
    })[0];
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(
      c.getByRole("group", { name: "Comment formatting" }),
    ).toBeVisible();
    await userEvent.click(toggle);
    await expect(
      c.queryByRole("group", { name: "Comment formatting" }),
    ).not.toBeInTheDocument();
  },
};
export const StaleComments: Story = {
  render: () => ({ Component: Fixture, props: { scenario: "stale" } }),
};
export const Streaming: Story = {
  render: () => ({ Component: Fixture, props: { scenario: "streaming" } }),
};
export const QueuedMessages: Story = {
  render: () => ({ Component: Fixture, props: { scenario: "queue" } }),
};
export const Error: Story = {
  render: () => ({ Component: Fixture, props: { scenario: "error" } }),
};
export const Loading: Story = {
  render: () => ({ Component: Fixture, props: { scenario: "loading" } }),
};
export const Empty: Story = {
  render: () => ({ Component: Fixture, props: { scenario: "empty" } }),
};

export const ClassicError: Story = {
  render: () => ({
    Component: Fixture,
    props: { scenario: "error", view: "classic" },
  }),
};
export const Typography: Story = {
  render: () => ({ Component: Fixture, props: { scenario: "typography" } }),
};

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
    await expect(
      within(document.body).getByRole("button", { name: "Close tool details" }),
    ).toBeVisible();
    const controls = within(document.body);
    await userEvent.click(
      controls.getByRole("button", { name: "Show source" }),
    );
    await expect(
      controls.getByRole("button", { name: "Show preview" }),
    ).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(
      controls.getByRole("button", { name: "Show preview" }),
    );
    await userEvent.click(
      controls.getByRole("button", { name: "Raw capture" }),
    );
    await expect(
      within(document.body).getByRole("group", {
        name: "Raw captured data for Captured application tool content",
      }),
    ).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(
        c.getByRole("button", { name: "Inspect captured tool" }),
      ).toHaveFocus(),
    );
  },
  render: () => ({
    Component: Fixture,
    props: { part: "inspector", scenario: "default" },
  }),
};
export const Classic: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "inspector", scenario: "default", view: "classic" },
  }),
};

export const Code: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "inspector", inspectorVariant: "code" },
  }),
};
export const MultipleFiles: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "inspector", inspectorVariant: "files" },
  }),
};
export const Error: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "inspector", inspectorVariant: "failure" },
  }),
};
export const CustomResult: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "inspector", inspectorVariant: "custom" },
  }),
};

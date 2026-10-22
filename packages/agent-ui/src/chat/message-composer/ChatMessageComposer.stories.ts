import FeedbackFixture from "./ChatMessageComposer.feedback.stories.fixture.svelte";
import ReferenceDemo from "../../../../../catalog/agents/references/ReferenceDemo.svelte";
import { References } from "./ChatMessageComposer.example-sources.js";
import { expect, within, userEvent, waitFor } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "./ChatMessageComposer.svelte";
import Fixture from "../transcript/AgentTranscript.stories.fixture.svelte";
import {
  Basic as source,
  Feedback,
} from "./ChatMessageComposer.example-sources.js";
const meta = {
  title: "Agents/Chat/Message composer",
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
    const editor = within(
      c.getByRole("group", { name: "Message composer" }),
    ).getByRole("textbox", { name: "Message" });
    await userEvent.type(editor, "Retain this exact draft");
    await expect(editor).toHaveTextContent("Retain this exact draft");
  },
  render: () => ({ Component: Fixture, props: { part: "composer" } }),
};
export const Classic: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "composer", view: "classic" },
  }),
};
export const Error: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "footer", scenario: "error" },
  }),
};

export const PairedReferences: StoryObj<typeof ReferenceDemo> = {
  parameters: {
    docs: { source: { code: References, language: "tsx", type: "code" } },
  },
  render: () => ({ Component: ReferenceDemo }),
};
export const JJStoreReferences: StoryObj<typeof ReferenceDemo> = {
  parameters: {
    docs: { source: { code: References, language: "tsx", type: "code" } },
  },
  render: () => ({ Component: ReferenceDemo, props: { legacy: true } }),
};
export const ClassicReferences: StoryObj<typeof ReferenceDemo> = {
  parameters: {
    docs: { source: { code: References, language: "tsx", type: "code" } },
  },
  render: () => ({ Component: ReferenceDemo, props: { classic: true } }),
};

export const Warning: StoryObj<typeof FeedbackFixture> = {
  parameters: {
    docs: { source: { code: Feedback, language: "tsx", type: "code" } },
  },
  render: () => ({ Component: FeedbackFixture }),
};
export const WarningClassic: StoryObj<typeof FeedbackFixture> = {
  parameters: {
    docs: { source: { code: Feedback, language: "tsx", type: "code" } },
  },
  render: () => ({ Component: FeedbackFixture, props: { view: "classic" } }),
};
export const ErrorClassic: Story = {
  parameters: {
    docs: { source: { code: Feedback, language: "tsx", type: "code" } },
  },
  render: () => ({
    Component: Fixture,
    props: { part: "footer", scenario: "error", view: "classic" },
  }),
};

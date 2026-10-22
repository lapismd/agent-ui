import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "./AiTranscriptSendHint.svelte";
import Fixture from "./AiTranscriptSendHint.stories.fixture.svelte";
import {
  Basic as source,
  WithFeedback,
} from "./AiTranscriptSendHint.example-sources.js";
const meta = {
  title: "Agents/Chat/Send feedback",
  component: Component,
  tags: ["visual-pending"],
  parameters: {
    docs: { source: { code: source, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Component>;
export default meta;
type Story = StoryObj<typeof Fixture>;
export const Basic: Story = {
  render: () => ({ Component: Fixture, props: { error: false } }),
};
export const Error: Story = {
  parameters: {
    docs: { source: { code: WithFeedback, language: "tsx", type: "code" } },
  },
  render: () => ({
    Component: Fixture,
    props: { error: true },
  }),
};

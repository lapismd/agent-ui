import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "./AiTranscriptSendHint.svelte";
import Fixture from "../transcript/AgentTranscript.stories.fixture.svelte";
import { Basic as source } from "./AiTranscriptSendHint.example-sources.js";
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
  render: () => ({ Component: Fixture, props: { part: "hint" } }),
};
export const Error: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "hint", scenario: "error" },
  }),
};

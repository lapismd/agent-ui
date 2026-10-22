import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "./AiSessionFrame.svelte";
import Fixture from "../../chat/transcript/AgentTranscript.stories.fixture.svelte";
import { Basic as source } from "./AiSessionFrame.example-sources.js";
const meta = {
  title: "Agents/Foundations/Session frame",
  component: Component,
  tags: ["visual-pending"],
  parameters: {
    docs: { source: { code: source, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Component>;
export default meta;
type Story = StoryObj<typeof Fixture>;
export const Basic: Story = {
  render: () => ({ Component: Fixture, props: {} }),
};
export const Classic: Story = {
  render: () => ({ Component: Fixture, props: { view: "classic" } }),
};

import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "./AiCommandReport.svelte";
import { Basic as source } from "./AiCommandReport.example-sources.js";
export default {
  title: "Agents/Tool calls/Command report",
  component: Component,
  tags: ["visual-pending"],
  parameters: {
    docs: { source: { code: source, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Component>;
type Story = StoryObj<typeof Component>;
export const Basic: Story = {
  args: {
    text: "App\n  /help — Show available application commands\nActions\n  /new — Start a conversation\nSkills\n  /review — Review captured source\nCurrent Agent · Reviewer\n  /model — Choose the host-advertised model",
  },
};
export const CapturedText: Story = {
  args: {
    text: "Captured output remains literal: <script>example</script>\nNo ANSI interpretation or HTML execution occurs.",
  },
};

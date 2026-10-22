import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, within, userEvent, fn } from "storybook/test";
import Component from "./AiInventoryResult.svelte";
import { Basic as source } from "./AiInventoryResult.example-sources.js";
const open = fn();
export default {
  title: "Agents/Tool calls/Inventory result",
  component: Component,
  tags: ["visual-pending"],
  parameters: {
    docs: { source: { code: source, language: "tsx", type: "code" } },
  },
  args: { onOpenPath: open },
} satisfies Meta<typeof Component>;
type Story = StoryObj<typeof Component>;
export const Basic: Story = {
  args: {
    output: {
      kind: "skills",
      items: [
        {
          kind: "skill",
          name: "Component review",
          description: "Compare the admitted UI with its source.",
          path: "Skills/review.md",
        },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", {
        name: "Open Component review",
      }),
    );
    await expect(open).toHaveBeenCalledWith("Skills/review.md");
  },
};
export const Tools: Story = {
  args: {
    output: {
      kind: "tools",
      items: [
        {
          kind: "tool",
          name: "vault.read",
          description: "Read an admitted note.",
        },
        {
          kind: "tool",
          name: "notes_search",
          description: "Search the admitted workspace.",
        },
      ],
    },
  },
};
export const EmptySkills: Story = {
  args: { output: { kind: "skills", items: [] } },
};
export const EmptyTools: Story = {
  args: { output: { kind: "tools", items: [] } },
};

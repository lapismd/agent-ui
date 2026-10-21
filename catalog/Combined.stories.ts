import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, within, userEvent } from "storybook/test";
import CombinedDemo from "./CombinedDemo.svelte";
export default {
  title: "Review/Combined workbench",
  component: CombinedDemo,
  tags: ["visual-pending", "!autodocs"],
} satisfies Meta<typeof CombinedDemo>;
export const Integrated: StoryObj<typeof CombinedDemo> = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("button", { name: "Open repository" }));
    await expect(
      c.getByRole("region", { name: "Repository files" }),
    ).toBeVisible();
    await userEvent.click(c.getByRole("button", { name: "Back to agent" }));
    await expect(
      c.getByRole("region", { name: "Agent conversation" }),
    ).toBeVisible();
  },
};

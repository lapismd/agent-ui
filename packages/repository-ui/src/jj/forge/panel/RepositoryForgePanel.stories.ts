import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, userEvent, within } from "storybook/test";
import Component from "./RepositoryForgePanel.svelte";
import Demo from "../../../../../../catalog/jj/ForgePanelDemo.svelte";
import { Basic } from "./RepositoryForgePanel.example-sources.js";
export default {
  title: "JJ/Forge/Panel",
  component: Component,
  tags: ["visual-pending"],
  parameters: {
    docs: { source: { code: Basic, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Component>;
type Story = StoryObj<typeof Demo>;
export const Workflow: Story = { render: () => ({ Component: Demo }) };
export const Approval: Story = {
  render: () => ({ Component: Demo, props: { variant: "Approval" } }),
};
export const Floating: Story = {
  render: () => ({ Component: Demo }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement),
      page = within(canvasElement.ownerDocument.body);
    await userEvent.click(
      c.getByRole("button", { name: "Float Workflow details" }),
    );
    const dialog = within(
      await page.findByRole("dialog", { name: "Package acceptance" }),
    );
    await expect(
      dialog.getByRole("region", { name: "CI checks" }),
    ).toBeVisible();
    await expect(
      dialog.getByRole("button", { name: /Collapse workflow details/ }),
    ).toBeDisabled();
    await userEvent.click(
      dialog.getByRole("button", { name: "Dock Workflow details" }),
    );
  },
};

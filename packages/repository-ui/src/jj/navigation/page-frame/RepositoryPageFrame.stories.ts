import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import Component from "./RepositoryPageFrame.svelte";
import Demo from "../../../../../../catalog/jj/NavigationDemo.svelte";
import { Basic as source } from "./RepositoryPageFrame.example-sources.js";
export default {
  title: "JJ/Navigation/Page frame",
  component: Component,
  tags: ["visual-pending"],
  parameters: {
    docs: { source: { code: source, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Component>;
type Story = StoryObj<typeof Demo>;
export const Basic: Story = { render: () => ({ Component: Demo, props: {} }) };
export const Stacks: Story = {
  render: () => ({ Component: Demo, props: { context: "stacks" } }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tab = await canvas.findByRole("tab", { name: "Branches" });
    await waitFor(() => expect(tab).toBeVisible());
    await userEvent.click(tab);
    await expect(
      canvas.getByRole("heading", { name: "branches" }),
    ).toBeVisible();
    await userEvent.click(
      canvas.getByRole("button", { name: "Back to repository" }),
    );
    await expect(canvas.getByRole("status")).toHaveTextContent("Repository");
  },
};
export const Projects: Story = {
  render: () => ({
    Component: Demo,
    props: { context: "projects", global: true },
  }),
};
export const Project: Story = {
  render: () => ({
    Component: Demo,
    props: { context: "project", global: true },
  }),
};
export const Overflow: Story = {
  render: () => ({ Component: Demo, props: { narrow: true } }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      await canvas.findByRole("button", { name: "More repository views" }),
    );
    const item = await within(canvasElement.ownerDocument.body).findByRole(
      "menuitem",
      { name: "Reviews" },
    );
    await waitFor(() => expect(item).toBeVisible());
    await userEvent.click(item);
    await expect(
      canvas.getByRole("heading", { name: "reviews" }),
    ).toBeVisible();
  },
};

import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, userEvent, within } from "storybook/test";
import Component from "./RepositoryBreadcrumbs.svelte";
import Demo from "../../../../../../catalog/jj/NavigationDemo.svelte";
import { Basic as source } from "./RepositoryBreadcrumbs.example-sources.js";
export default {
  title: "JJ/Navigation/Breadcrumbs",
  component: Component,
  tags: ["visual-pending"],
  parameters: {
    docs: { source: { code: source, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Component>;
type Story = StoryObj<typeof Demo>;
export const Basic: Story = {
  render: () => ({ Component: Demo, props: { breadcrumbOnly: true } }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("navigation", { name: "breadcrumb" }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("combobox", { name: "Repository" }));
    await userEvent.click(
      within(canvasElement.ownerDocument.body).getByRole("option", {
        name: /Documentation/,
      }),
    );
    await expect(
      canvas.getByRole("combobox", { name: "Repository" }),
    ).toHaveTextContent("Documentation");
    await expect(canvas.getByText("Workspace")).toBeVisible();
  },
};
export const Global: Story = {
  render: () => ({
    Component: Demo,
    props: { breadcrumbOnly: true, global: true },
  }),
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole("navigation", {
      name: "breadcrumb",
    });
    await expect(within(nav).queryByRole("combobox")).toBeNull();
    await expect(
      within(nav).getByRole("link", { name: "Projects" }),
    ).toBeVisible();
  },
};

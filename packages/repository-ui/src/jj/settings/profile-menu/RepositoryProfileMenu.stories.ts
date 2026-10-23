import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, within, userEvent, waitFor } from "storybook/test";
import Component from "./RepositoryProfileMenu.svelte";
import Demo from "../../../../../../catalog/jj/ProfileDemo.svelte";
import { Basic as source } from "./RepositoryProfileMenu.example-sources.js";
export default {
  title: "JJ/Settings/Profile menu",
  component: Component,
  tags: ["visual-pending"],
  parameters: {
    docs: { source: { code: source, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Component>;
type Story = StoryObj<typeof Demo>;
const render = (variant: string) => () => ({
  Component: Demo,
  props: { variant, menu: true },
});
export const Basic: Story = {
  render: render("Basic"),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      await canvas.findByRole("button", { name: /Open profile menu/ }),
    );
    const document = within(canvasElement.ownerDocument.body);
    await userEvent.click(
      await document.findByRole("menuitem", { name: "Profile" }),
    );
    await expect(await canvas.findByRole("status")).toHaveTextContent(
      "Profile selected",
    );
  },
};
export const Compact: Story = {
  render: render("Compact"),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = await canvas.findByRole("button", {
      name: /Open profile menu/,
    });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    const document = within(canvasElement.ownerDocument.body);
    const popup = await document.findByRole("menu", { name: "Profile menu" });
    await waitFor(() => expect(popup).toBeVisible());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};
export const Loading: Story = { render: render("Loading") };
export const Unavailable: Story = { render: render("Unavailable") };
export const Recovery: Story = {
  render: render("Unavailable"),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      await canvas.findByRole("button", { name: "Retry profile" }),
    );
    await expect(
      await canvas.findByRole("button", { name: /Open profile menu/ }),
    ).toBeVisible();
  },
};

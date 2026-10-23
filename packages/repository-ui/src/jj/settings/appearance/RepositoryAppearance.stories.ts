import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, userEvent, within } from "storybook/test";
import Component from "./RepositoryAppearance.svelte";
import Demo from "../../../../../../catalog/jj/SettingsDemo.svelte";
import { Basic as source } from "./RepositoryAppearance.example-sources.js";
export default {
  title: "JJ/Settings/Appearance",
  component: Component,
  tags: ["visual-pending"],
  parameters: {
    docs: { source: { code: source, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Component>;
type Story = StoryObj<typeof Demo>;
export const Basic: Story = {
  render: () => ({ Component: Demo, props: { variant: "appearance" } }),
};
export const Preferences: Story = {
  render: () => ({ Component: Demo, props: { variant: "appearance" } }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("radio", { name: /^Dark$/ }));
    expect(canvasElement.ownerDocument.documentElement).toHaveClass("dark");
    await userEvent.click(canvas.getByRole("radio", { name: /^Larger$/ }));
    expect(canvasElement.ownerDocument.documentElement).toHaveAttribute(
      "data-store-font",
      "larger",
    );
  },
};

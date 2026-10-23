import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, userEvent, within } from "storybook/test";
import Component from "./RepositorySettingsPage.svelte";
import Demo from "../../../../../../catalog/jj/SettingsDemo.svelte";
import { Basic as source } from "./RepositorySettingsPage.example-sources.js";
export default {
  title: "JJ/Settings/Settings page",
  component: Component,
  tags: ["visual-pending"],
  parameters: {
    docs: { source: { code: source, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Component>;
type Story = StoryObj<typeof Demo>;
export const Basic: Story = {
  render: () => ({ Component: Demo, props: { variant: "repository" } }),
};
export const Appearance: Story = {
  render: () => ({ Component: Demo, props: { variant: "appearance" } }),
};

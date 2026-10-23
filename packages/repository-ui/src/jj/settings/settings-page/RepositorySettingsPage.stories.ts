import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, within } from "storybook/test";
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
  play: async ({ canvasElement }) => {
    const body = canvasElement.querySelector('[data-ui-part="body"]');
    expect(body).not.toBeNull();
    const header = body!.querySelector('[data-ui-part="toolbar"]');
    expect(header).not.toBeNull();
    expect(
      within(header as HTMLElement).getByRole("heading", {
        name: "Appearance",
        level: 1,
      }),
    ).toBeVisible();
    const content = body!.querySelector('[data-ui-part="body-content"]');
    expect(content).not.toBeNull();
    expect(
      within(content as HTMLElement).getByRole("radio", { name: /^Light$/ }),
    ).toBeVisible();
  },
  render: () => ({ Component: Demo, props: { variant: "appearance" } }),
};

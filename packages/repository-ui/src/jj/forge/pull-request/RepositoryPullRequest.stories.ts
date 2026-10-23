import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, userEvent, within } from "storybook/test";
import Component from "./RepositoryPullRequest.svelte";
import Demo from "../../../../../../catalog/jj/PullRequestDemo.svelte";
import { Basic as source } from "./RepositoryPullRequest.example-sources.js";
export default {
  title: "JJ/Forge/Pull request",
  component: Component,
  tags: ["visual-pending"],
  parameters: {
    docs: { source: { code: source, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Component>;
type Story = StoryObj<typeof Demo>;
const story = (variant: string): Story => ({
  render: () => ({ Component: Demo, props: { variant } }),
});
export const Basic: Story = story("Basic");
export const Draft: Story = story("Draft");
export const ChecksUnavailable: Story = story("ChecksUnavailable");
export const NoDescription: Story = story("NoDescription");
export const Disabled: Story = story("Disabled");
export const Floating: Story = {
  ...story("Basic"),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: /^Float PR details$/ }),
    );
    expect(
      await within(canvasElement.ownerDocument.body).findByRole("dialog", {
        name: /PR #42/,
      }),
    ).toBeVisible();
  },
};

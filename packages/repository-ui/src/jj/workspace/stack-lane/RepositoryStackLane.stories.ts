import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, waitFor } from "storybook/test";
import Component from "./RepositoryStackLane.svelte";
import Demo from "../../../../../../catalog/jj/StackWorkspaceDemo.svelte";
import { Basic as source } from "./RepositoryStackLane.example-sources.js";
export default {
  title: "JJ/Workspace/Stack lane",
  component: Component,
  tags: ["visual-pending"],
  parameters: {
    docs: { source: { code: source, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Component>;
type Story = StoryObj<typeof Demo>;
const story = (variant: string): Story => ({
  render: () => ({
    Component: Demo,
    props: { variant, kind: "lane", page: "workspace" },
  }),
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-testid="stack-workspace-state"]'),
      ).toHaveAttribute("data-loaded", "true"),
    );
  },
});
export const Basic: Story = story("Basic");
export const Dense: Story = story("Dense");
export const Paged: Story = story("Paged");
export const Conflicts: Story = story("Conflicts");
export const HostActions: Story = story("HostActions");
export const Loading: Story = story("Loading");
export const Unavailable: Story = story("Unavailable");

import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, waitFor } from "storybook/test";
import Component from "./RepositoryWorkspaceDiff.svelte";
import Demo from "../../../../../../catalog/jj/StackWorkspaceDemo.svelte";
import { Basic as source } from "./RepositoryWorkspaceDiff.example-sources.js";
export default {
  title: "JJ/Workspace/File diff",
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
    props: { variant, kind: "diff", page: "workspace" },
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
export const Binary: Story = story("Binary");
export const Empty: Story = story("Empty");
export const Loading: Story = story("Loading");
export const Unavailable: Story = story("Unavailable");

export const HunkActions: Story = story("HunkActions");

import { expect, fn, userEvent, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { assertJjStory } from "../../../../../../catalog/jj/support/assert-story.js";
import Component from "./RepositoryWorkspacePicker.svelte";
import Fixture from "../../../../../../catalog/jj/JjDemo.svelte";
import { Basic as source } from "./RepositoryWorkspacePicker.example-sources.js";
export default {
  title: "JJ/History/Workspace picker",
  component: Component,
  tags: ["visual-pending"],
  parameters: {
    docs: { source: { code: source, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Component>;
type Story = StoryObj<typeof Fixture>;
export const Basic: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryWorkspacePicker", variant: "Basic" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryWorkspacePicker", "Basic");
  },
};
export const Disabled: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryWorkspacePicker", variant: "Disabled" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryWorkspacePicker", "Disabled");
  },
};

export const NamedWorkspaces: StoryObj<typeof Component> = {
  args: {
    entries: [
      { id: "daily", name: "Daily work", description: "3 applied stacks" },
      {
        id: "review",
        name: "Review workspace",
        description: "1 applied stack",
      },
      {
        id: "offline",
        name: "Offline workspace",
        description: "Workspace unavailable",
        disabled: true,
      },
    ],
    selected: "daily",
    includeOverview: false,
    onSelect: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("combobox", { name: "Repository workspace" }),
    );
    const overlay = within(canvasElement.ownerDocument.body);
    const search = overlay.getByPlaceholderText("Search loaded workspaces");
    await userEvent.type(search, "Review");
    await userEvent.click(
      overlay.getByRole("option", { name: /^Review workspace$/ }),
    );
    await expect(args.onSelect).toHaveBeenCalledWith("review");
  },
};

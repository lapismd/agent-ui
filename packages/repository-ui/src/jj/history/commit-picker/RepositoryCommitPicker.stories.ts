import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { assertJjStory } from "../../../../../../catalog/jj/support/assert-story.js";
import Component from "./RepositoryCommitPicker.svelte";
import Fixture from "../../../../../../catalog/jj/JjDemo.svelte";
import { Basic as source } from "./RepositoryCommitPicker.example-sources.js";
export default {
  title: "JJ/History/Comparison picker",
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
    props: { part: "RepositoryCommitPicker", variant: "Basic" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryCommitPicker", "Basic");
  },
};
export const Loading: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryCommitPicker", variant: "Loading" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryCommitPicker", "Loading");
  },
};
export const MissingParent: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryCommitPicker", variant: "MissingParent" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(
      canvasElement,
      "RepositoryCommitPicker",
      "MissingParent",
    );
  },
};

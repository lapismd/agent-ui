import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { assertJjStory } from "../../../../../../catalog/jj/support/assert-story.js";
import Component from "./RepositoryDiff.svelte";
import Fixture from "../../../../../../catalog/jj/JjDemo.svelte";
import { Basic as source } from "./RepositoryDiff.example-sources.js";
export default {
  title: "JJ/History/Diff",
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
    props: { part: "RepositoryDiff", variant: "Basic" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryDiff", "Basic");
  },
};
export const Split: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryDiff", variant: "Split" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryDiff", "Split");
  },
};
export const Unavailable: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryDiff", variant: "Unavailable" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryDiff", "Unavailable");
  },
};

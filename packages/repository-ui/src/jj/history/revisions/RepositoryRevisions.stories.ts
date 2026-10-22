import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { assertJjStory } from "../../../../../../catalog/jj/support/assert-story.js";
import Component from "./RepositoryRevisions.svelte";
import Fixture from "../../../../../../catalog/jj/JjDemo.svelte";
import { Basic as source } from "./RepositoryRevisions.example-sources.js";
export default {
  title: "JJ/History/Revision details",
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
    props: { part: "RepositoryRevisions", variant: "Basic" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryRevisions", "Basic");
  },
};
export const Merge: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryRevisions", variant: "Merge" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryRevisions", "Merge");
  },
};
export const Unavailable: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryRevisions", variant: "Unavailable" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryRevisions", "Unavailable");
  },
};

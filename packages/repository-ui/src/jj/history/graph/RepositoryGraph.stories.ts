import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { assertJjStory } from "../../../../../../catalog/jj/support/assert-story.js";
import Component from "./RepositoryGraph.svelte";
import Fixture from "../../../../../../catalog/jj/JjDemo.svelte";
import { Basic as source } from "./RepositoryGraph.example-sources.js";
export default {
  title: "JJ/History/Revision graph",
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
    props: { part: "RepositoryGraph", variant: "Basic" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryGraph", "Basic");
  },
};
export const Operations: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryGraph", variant: "Operations" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryGraph", "Operations");
  },
};
export const Empty: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryGraph", variant: "Empty" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryGraph", "Empty");
  },
};

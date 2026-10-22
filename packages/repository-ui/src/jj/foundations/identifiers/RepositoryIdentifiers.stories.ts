import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { assertJjStory } from "../../../../../../catalog/jj/support/assert-story.js";
import Component from "./RepositoryIdentifiers.svelte";
import Fixture from "../../../../../../catalog/jj/JjDemo.svelte";
import { Basic as source } from "./RepositoryIdentifiers.example-sources.js";
export default {
  title: "JJ/Foundations/Identifiers",
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
    props: { part: "RepositoryIdentifiers", variant: "Basic" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryIdentifiers", "Basic");
  },
};
export const Inline: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryIdentifiers", variant: "Inline" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryIdentifiers", "Inline");
  },
};
export const CommitOnly: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryIdentifiers", variant: "CommitOnly" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryIdentifiers", "CommitOnly");
  },
};

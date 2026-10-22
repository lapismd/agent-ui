import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { assertJjStory } from "../../../../../../catalog/jj/support/assert-story.js";
import Component from "./RepositoryAuthorAvatar.svelte";
import Fixture from "../../../../../../catalog/jj/JjDemo.svelte";
import { Basic as source } from "./RepositoryAuthorAvatar.example-sources.js";
export default {
  title: "JJ/Foundations/Author avatar",
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
    props: { part: "RepositoryAuthorAvatar", variant: "Basic" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryAuthorAvatar", "Basic");
  },
};
export const Fallback: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryAuthorAvatar", variant: "Fallback" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryAuthorAvatar", "Fallback");
  },
};

export const Sizes: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryAuthorAvatar", variant: "Sizes" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryAuthorAvatar", "Sizes");
  },
};

export const Gravatar: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryAuthorAvatar", variant: "Gravatar" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryAuthorAvatar", "Gravatar");
  },
};

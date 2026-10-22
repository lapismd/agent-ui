import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { assertJjStory } from "../../../../../../catalog/jj/support/assert-story.js";
import Component from "./RepositoryConflictResolution.svelte";
import Fixture from "../../../../../../catalog/jj/JjDemo.svelte";
import { Basic as source } from "./RepositoryConflictResolution.example-sources.js";
export default {
  title: "JJ/History/Conflicts",
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
    props: { part: "RepositoryConflictResolution", variant: "Basic" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryConflictResolution", "Basic");
  },
};
export const Loading: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryConflictResolution", variant: "Loading" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(
      canvasElement,
      "RepositoryConflictResolution",
      "Loading",
    );
  },
};
export const Unavailable: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryConflictResolution", variant: "Unavailable" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(
      canvasElement,
      "RepositoryConflictResolution",
      "Unavailable",
    );
  },
};
export const Empty: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryConflictResolution", variant: "Empty" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryConflictResolution", "Empty");
  },
};

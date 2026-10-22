import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { assertJjStory } from "../../../../../../catalog/jj/support/assert-story.js";
import Component from "./RepositoryOperations.svelte";
import Fixture from "../../../../../../catalog/jj/JjDemo.svelte";
import { Basic as source } from "./RepositoryOperations.example-sources.js";
export default {
  title: "JJ/Complete screens/Op Log",
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
    props: { part: "RepositoryOperations", variant: "Basic" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryOperations", "Basic");
  },
};
export const Empty: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryOperations", variant: "Empty" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryOperations", "Empty");
  },
};
export const Loading: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryOperations", variant: "Loading" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryOperations", "Loading");
  },
};
export const Unavailable: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryOperations", variant: "Unavailable" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryOperations", "Unavailable");
  },
};
export const Metadata: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryOperations", variant: "Metadata" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryOperations", "Metadata");
  },
};

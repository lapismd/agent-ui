import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { assertJjStory } from "../../../../../../catalog/jj/support/assert-story.js";
import Component from "./RepositorySkeleton.svelte";
import Fixture from "../../../../../../catalog/jj/JjDemo.svelte";
import { Basic as source } from "./RepositorySkeleton.example-sources.js";
export default {
  title: "JJ/Foundations/Loading skeleton",
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
    props: { part: "RepositorySkeleton", variant: "Basic" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositorySkeleton", "Basic");
  },
};
export const Files: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositorySkeleton", variant: "Files" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositorySkeleton", "Files");
  },
};
export const Diff: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositorySkeleton", variant: "Diff" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositorySkeleton", "Diff");
  },
};
export const Blame: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositorySkeleton", variant: "Blame" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositorySkeleton", "Blame");
  },
};
export const Conflicts: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositorySkeleton", variant: "Conflicts" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositorySkeleton", "Conflicts");
  },
};

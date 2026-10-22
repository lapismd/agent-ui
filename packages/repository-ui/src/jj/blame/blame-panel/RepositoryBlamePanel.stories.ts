import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { assertJjStory } from "../../../../../../catalog/jj/support/assert-story.js";
import Component from "./RepositoryBlamePanel.svelte";
import Fixture from "../../../../../../catalog/jj/JjDemo.svelte";
import { Basic as source } from "./RepositoryBlamePanel.example-sources.js";
export default {
  title: "JJ/History/Blame",
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
    props: { part: "RepositoryBlamePanel", variant: "Basic" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryBlamePanel", "Basic");
  },
};
export const Loading: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryBlamePanel", variant: "Loading" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryBlamePanel", "Loading");
  },
};
export const Unavailable: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryBlamePanel", variant: "Unavailable" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryBlamePanel", "Unavailable");
  },
};
export const NoWrap: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryBlamePanel", variant: "NoWrap" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryBlamePanel", "NoWrap");
  },
};

export const Comprehensive: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryBlamePanel", variant: "Comprehensive" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryBlamePanel", "Comprehensive");
  },
};

export const LongLines: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryBlamePanel", variant: "LongLines" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryBlamePanel", "LongLines");
  },
};

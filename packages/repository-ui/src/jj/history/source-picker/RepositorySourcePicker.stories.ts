import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { assertJjStory } from "../../../../../../catalog/jj/support/assert-story.js";
import Component from "./RepositorySourcePicker.svelte";
import Fixture from "../../../../../../catalog/jj/JjDemo.svelte";
import { Basic as source } from "./RepositorySourcePicker.example-sources.js";
export default {
  title: "JJ/History/Source picker",
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
    props: { part: "RepositorySourcePicker", variant: "Basic" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositorySourcePicker", "Basic");
  },
};
export const OriginalUnavailable: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositorySourcePicker", variant: "OriginalUnavailable" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(
      canvasElement,
      "RepositorySourcePicker",
      "OriginalUnavailable",
    );
  },
};

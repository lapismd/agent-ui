import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { assertJjStory } from "../../../../../../catalog/jj/support/assert-story.js";
import Component from "./RepositoryOperationPinPicker.svelte";
import Fixture from "../../../../../../catalog/jj/JjDemo.svelte";
import { Basic as source } from "./RepositoryOperationPinPicker.example-sources.js";
export default {
  title: "JJ/Operations/Pin picker",
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
    props: { part: "RepositoryOperationPinPicker", variant: "Basic" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryOperationPinPicker", "Basic");
  },
};
export const Multiple: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryOperationPinPicker", variant: "Multiple" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(
      canvasElement,
      "RepositoryOperationPinPicker",
      "Multiple",
    );
  },
};

import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { assertJjStory } from "../../../../../../catalog/jj/support/assert-story.js";
import Component from "./RepositoryRestoreDialog.svelte";
import Fixture from "../../../../../../catalog/jj/JjDemo.svelte";
import { Basic as source } from "./RepositoryRestoreDialog.example-sources.js";
export default {
  title: "JJ/History/Restore dialog",
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
    props: { part: "RepositoryRestoreDialog", variant: "Basic" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryRestoreDialog", "Basic");
  },
};
export const Vault: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryRestoreDialog", variant: "Vault" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryRestoreDialog", "Vault");
  },
};
export const Recovery: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryRestoreDialog", variant: "Recovery" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryRestoreDialog", "Recovery");
  },
};

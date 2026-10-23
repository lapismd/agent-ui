import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { assertJjStory } from "../../../../../../catalog/jj/support/assert-story.js";
import { expect, within, userEvent, waitFor } from "storybook/test";
import Component from "./RepositoryOperationColumn.svelte";
import Fixture from "../../../../../../catalog/jj/JjDemo.svelte";
import { Basic as source } from "./RepositoryOperationColumn.example-sources.js";
export default {
  title: "JJ/Operations/Operation details",
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
    props: { part: "RepositoryOperationColumn", variant: "Basic" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryOperationColumn", "Basic");
  },
};
export const Loading: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryOperationColumn", variant: "Loading" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryOperationColumn", "Loading");
    await expect(
      await within(canvasElement).findByRole("status", {
        name: "Loading operation details",
      }),
    ).toBeVisible();
  },
};
export const Unavailable: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryOperationColumn", variant: "Unavailable" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(
      canvasElement,
      "RepositoryOperationColumn",
      "Unavailable",
    );
  },
};
export const Metadata: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryOperationColumn", variant: "Metadata" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryOperationColumn", "Metadata");
  },
};

export const ParentLoading: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryOperationColumn", variant: "ParentLoading" },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      await canvas.findByRole("combobox", {
        name: "Compare operation with parent",
      }),
    );
    const document = within(canvasElement.ownerDocument.body);
    const dialog = await document.findByRole("dialog", {
      name: "Choose operation parent",
    });
    await expect(
      within(dialog).getAllByRole("row", { name: /Select operation parent/ }),
    ).toHaveLength(2);
    const loading = await within(dialog).findByRole("status", {
      name: "Loading parent details",
    });
    await waitFor(() =>
      expect(loading.querySelector('[data-slot="skeleton"]')).toBeVisible(),
    );
    await expect(
      canvas.getByRole("region", { name: "Selected operation" }),
    ).toBeVisible();
  },
};

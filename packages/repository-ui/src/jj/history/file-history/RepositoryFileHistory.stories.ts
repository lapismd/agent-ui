import { expect, waitFor, within, userEvent } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { assertJjStory } from "../../../../../../catalog/jj/support/assert-story.js";
import Component from "./RepositoryFileHistory.svelte";
import Fixture from "../../../../../../catalog/jj/JjDemo.svelte";
import { Basic as source } from "./RepositoryFileHistory.example-sources.js";
export default {
  title: "JJ/History/File history",
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
    props: { part: "RepositoryFileHistory", variant: "Basic" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryFileHistory", "Basic");
    await waitFor(() =>
      expect(
        canvasElement.querySelector(
          '.repository-review-file-title [data-file-type-icon="markdown"]',
        ),
      ).toBeVisible(),
    );
    await expect(
      canvasElement.querySelector(
        '.repository-review-file-title [data-ui-component="file-type-icon"]',
      ),
    ).toHaveAttribute("data-size", "s");
  },
};
export const Empty: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryFileHistory", variant: "Empty" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryFileHistory", "Empty");
  },
};
export const Loading: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryFileHistory", variant: "Loading" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryFileHistory", "Loading");
  },
};
export const Unavailable: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryFileHistory", variant: "Unavailable" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryFileHistory", "Unavailable");
  },
};

export const LongDescription: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryFileHistory", variant: "LongDescription" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(
      canvasElement,
      "RepositoryFileHistory",
      "LongDescription",
    );
    const canvas = within(canvasElement);
    await userEvent.click(
      await canvas.findByRole("button", {
        name: "Show commit description",
      }),
    );
    const more = await canvas.findByRole("button", {
      name: "View more of commit message",
    });
    await userEvent.click(more);
    await expect(
      canvas.getByRole("button", {
        name: "View less of commit message",
      }),
    ).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(
      canvas.getByRole("button", {
        name: "View less of commit message",
      }),
    );
  },
};

export const NoRepositoryHistory: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryFileHistory", variant: "NoRepositoryHistory" },
  }),
  play: async ({ canvasElement }) => {
    const title = await within(canvasElement).findByText(
      "No repository history",
    );
    await expect(
      title
        .closest('[data-slot="empty"]')
        ?.querySelector('[data-ui-part="empty-media"] svg'),
    ).toBeVisible();
  },
};

export const OperationSelection: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryFileHistory", variant: "OperationSelection" },
  }),
  play: async ({ canvasElement }) => {
    const title = await within(canvasElement).findByText("Choose an operation");
    await expect(
      title
        .closest('[data-slot="empty"]')
        ?.querySelector('[data-ui-part="empty-media"] svg'),
    ).toBeVisible();
  },
};

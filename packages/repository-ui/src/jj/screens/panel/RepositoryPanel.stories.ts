import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { assertJjStory } from "../../../../../../catalog/jj/support/assert-story.js";
import Component from "./RepositoryPanel.svelte";
import LogReview from "../../../../../../catalog/jj/LogReview.svelte";
import { expect, within } from "storybook/test";
import Fixture from "../../../../../../catalog/jj/JjDemo.svelte";
import {
  Basic as source,
  HostActions as hostSource,
  Bounded as boundedSource,
} from "./RepositoryPanel.example-sources.js";
export default {
  title: "JJ/Complete screens/JJ Log",
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
    props: { part: "RepositoryPanel", variant: "Basic" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryPanel", "Basic");
  },
};
export const Empty: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryPanel", variant: "Empty" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryPanel", "Empty");
  },
};
export const Loading: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryPanel", variant: "Loading" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryPanel", "Loading");
  },
};
export const Unavailable: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryPanel", variant: "Unavailable" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryPanel", "Unavailable");
  },
};
export const Merge: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryPanel", variant: "Merge" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryPanel", "Merge");
  },
};
export const RichHistory: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryPanel", variant: "RichHistory" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryPanel", "RichHistory");
  },
};

export const DenseHistory: StoryObj<typeof LogReview> = {
  parameters: {
    docs: { source: { code: hostSource, language: "tsx", type: "code" } },
  },
  render: () => ({ Component: LogReview, props: { variant: "DenseHistory" } }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByRole("button", { name: "Review selected revision" }),
    ).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: "Open repository" }),
    ).toBeVisible();
    await expect(canvas.getByTestId("log-review-state")).toHaveAttribute(
      "data-errors",
      "[]",
    );
  },
};
export const PagedHistory: StoryObj<typeof LogReview> = {
  parameters: {
    docs: { source: { code: hostSource, language: "tsx", type: "code" } },
  },
  render: () => ({ Component: LogReview, props: { variant: "PagedHistory" } }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByRole("button", { name: "Review selected revision" }),
    ).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: "Open repository" }),
    ).toBeVisible();
    await expect(canvas.getByTestId("log-review-state")).toHaveAttribute(
      "data-errors",
      "[]",
    );
  },
};
export const BoundedHistory: StoryObj<typeof LogReview> = {
  parameters: {
    docs: { source: { code: boundedSource, language: "tsx", type: "code" } },
  },
  render: () => ({
    Component: LogReview,
    props: { variant: "BoundedHistory" },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByRole("button", { name: "Review selected revision" }),
    ).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: "Open repository" }),
    ).toBeVisible();
    await expect(canvas.getByTestId("log-review-state")).toHaveAttribute(
      "data-errors",
      "[]",
    );
  },
};
export const HostActions: StoryObj<typeof LogReview> = {
  parameters: {
    docs: { source: { code: hostSource, language: "tsx", type: "code" } },
  },
  render: () => ({ Component: LogReview, props: { variant: "HostActions" } }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByRole("button", { name: "Review selected revision" }),
    ).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: "Open repository" }),
    ).toBeVisible();
    await expect(canvas.getByTestId("log-review-state")).toHaveAttribute(
      "data-errors",
      "[]",
    );
  },
};
export const HostControls: StoryObj<typeof LogReview> = {
  parameters: {
    docs: { source: { code: hostSource, language: "tsx", type: "code" } },
  },
  render: () => ({ Component: LogReview, props: { variant: "HostControls" } }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByRole("button", { name: "Review selected revision" }),
    ).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: "Open repository" }),
    ).toBeVisible();
    await expect(canvas.getByTestId("log-review-state")).toHaveAttribute(
      "data-errors",
      "[]",
    );
  },
};

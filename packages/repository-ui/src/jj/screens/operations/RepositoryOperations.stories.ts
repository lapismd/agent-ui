import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { assertJjStory } from "../../../../../../catalog/jj/support/assert-story.js";
import Component from "./RepositoryOperations.svelte";
import Fixture from "../../../../../../catalog/jj/JjDemo.svelte";
import OperationReview from "../../../../../../catalog/jj/OperationReview.svelte";
import { expect, within } from "storybook/test";
import {
  HostActions as hostSource,
  Bounded as boundedSource,
  HostControls as controlsSource,
} from "./RepositoryOperations.example-sources.js";
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

const review = (variant: string): StoryObj<typeof OperationReview> => ({
  parameters: {
    docs: {
      source: {
        code:
          variant === "BoundedHistory"
            ? boundedSource
            : variant === "HostControls"
              ? controlsSource
              : hostSource,
        language: "tsx",
        type: "code",
      },
    },
  },
  render: () => ({ Component: OperationReview, props: { variant } }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByRole("button", { name: "Review operation" }),
    ).toBeVisible();
    if (variant !== "FailedRead")
      await expect(
        canvas.getByTestId("operation-review-state"),
      ).toHaveAttribute("data-errors", "[]");
  },
});
export const DenseHistory = review("DenseHistory");
export const PagedHistory = review("PagedHistory");
export const BoundedHistory = review("BoundedHistory");
export const MultipleChanges = review("MultipleChanges");
export const MergeParents = review("MergeParents");
export const Ambiguous = review("Ambiguous");
export const Conflicts = review("Conflicts");
export const MetadataOnly = review("MetadataOnly");
export const RootOperation = review("RootOperation");
export const UnavailableComparison = review("UnavailableComparison");
export const FailedRead = review("FailedRead");
export const HostControls = review("HostControls");

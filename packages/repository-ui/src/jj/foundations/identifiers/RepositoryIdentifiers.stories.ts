import { expect, fn, userEvent, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { assertJjStory } from "../../../../../../catalog/jj/support/assert-story.js";
import Component from "./RepositoryIdentifiers.svelte";
import Fixture from "../../../../../../catalog/jj/JjDemo.svelte";
import {
  Basic as source,
  CustomPair as customSource,
} from "./RepositoryIdentifiers.example-sources.js";
export default {
  title: "JJ/Foundations/Identifiers",
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
    props: { part: "RepositoryIdentifiers", variant: "Basic" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryIdentifiers", "Basic");
  },
};
export const Inline: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryIdentifiers", variant: "Inline" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryIdentifiers", "Inline");
  },
};
export const CommitOnly: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "RepositoryIdentifiers", variant: "CommitOnly" },
  }),
  play: async ({ canvasElement }) => {
    await assertJjStory(canvasElement, "RepositoryIdentifiers", "CommitOnly");
  },
};

const first = "b".repeat(64),
  second = "a".repeat(40);
const copied = fn(async (_value: string) => {});
export const CustomPair: StoryObj<typeof Component> = {
  parameters: {
    docs: { source: { code: customSource, language: "tsx", type: "code" } },
  },
  args: {
    commitId: first,
    changeId: second,
    commitLabel: "Operation ID",
    changeLabel: "Policy revision",
    commitChipLabel: "Operation",
    changeChipLabel: "Policy",
    placement: "inline",
    copyText: copied,
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    copied.mockClear();
    const operation = c.getByRole("button", { name: /Copy Operation ID/ });
    const policy = c.getByRole("button", { name: /Copy Policy revision/ });
    await expect(
      operation.querySelector(".repository-id-chip"),
    ).toHaveTextContent("Operation");
    await expect(policy.querySelector(".repository-id-chip")).toHaveTextContent(
      "Policy",
    );
    await userEvent.click(operation);
    await expect(copied).toHaveBeenLastCalledWith(first);
    await userEvent.click(policy);
    await expect(copied).toHaveBeenLastCalledWith(second);
    await expect(policy).toHaveAttribute("data-copied", "true");
    await expect(operation.getBoundingClientRect().right).toBeCloseTo(
      policy.getBoundingClientRect().left,
      0,
    );
  },
};

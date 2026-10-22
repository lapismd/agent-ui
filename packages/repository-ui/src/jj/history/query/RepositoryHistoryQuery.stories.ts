import { Pending as pendingSource } from "./RepositoryHistoryQuery.example-sources.js";
import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, within } from "storybook/test";
import Component from "./RepositoryHistoryQuery.svelte";
import Fixture from "../../../../../../catalog/jj/QueryDemo.svelte";
import {
  Basic,
  Operations as operationSource,
} from "./RepositoryHistoryQuery.example-sources.js";
export default {
  title: "JJ/History/Query",
  component: Component,
  tags: ["visual-pending"],
  parameters: {
    docs: { source: { code: Basic, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Component>;
type Story = StoryObj<typeof Fixture>;
export const Revset: Story = {
  render: () => ({ Component: Fixture, props: { language: "revset" } }),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).findByRole("searchbox", { name: "Revision query" }),
    ).resolves.toBeVisible();
  },
};
export const Operations: Story = {
  parameters: {
    docs: { source: { code: operationSource, language: "tsx", type: "code" } },
  },
  render: () => ({ Component: Fixture, props: { language: "operations" } }),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).findByRole("searchbox", {
        name: "Operation query",
      }),
    ).resolves.toBeVisible();
  },
};
export const Pending: Story = {
  parameters: {
    docs: { source: { code: pendingSource, language: "tsx", type: "code" } },
  },
  render: () => ({ Component: Fixture, props: { busy: true } }),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("button", { name: "Apply query" }),
    ).toBeDisabled();
  },
};

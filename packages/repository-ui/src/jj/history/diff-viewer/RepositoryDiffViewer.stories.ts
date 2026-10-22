import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, within, userEvent } from "storybook/test";
import Component from "./RepositoryDiffViewer.svelte";
import Demo from "../../../../../../catalog/jj/DiffViewerDemo.svelte";
import { Basic as source } from "./RepositoryDiffViewer.example-sources.js";
export default {
  title: "JJ/History/Diff Viewer",
  component: Component,
  tags: ["visual-pending"],
  parameters: {
    docs: { source: { code: source, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Component>;
type Story = StoryObj<typeof Demo>;
const populated = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  await expect(
    await within(canvasElement).findByRole("button", {
      name: /^Collapse src\/history\/controller\.ts(?:\s|$)/,
    }),
  ).toBeVisible();
};
export const Basic: Story = {
  render: () => ({ Component: Demo, props: { variant: "Basic" } }),
  play: populated,
};
export const Split: Story = {
  render: () => ({ Component: Demo, props: { variant: "Split" } }),
  play: populated,
};
export const Paged: Story = {
  render: () => ({ Component: Demo, props: { variant: "Paged" } }),
  play: populated,
};
export const SingleFile: Story = {
  render: () => ({ Component: Demo, props: { variant: "SingleFile" } }),
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByRole("region", {
        name: "Changes to src/history/controller.ts",
      }),
    ).toBeVisible();
  },
};

export const Empty: Story = {
  render: () => ({ Component: Demo, props: { variant: "Empty" } }),
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText("No file selected"),
    ).toBeVisible();
  },
};
export const Loading: Story = {
  render: () => ({ Component: Demo, props: { variant: "Loading" } }),
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByRole("status", {
        name: "Loading changes to src/history/controller.ts",
      }),
    ).toBeVisible();
  },
};
export const Retry: Story = {
  render: () => ({ Component: Demo, props: { variant: "Retry" } }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      await canvas.findByRole("button", { name: "Retry preview" }),
    );
    await expect(
      await canvas.findByRole("region", {
        name: "Changes to src/history/controller.ts",
      }),
    ).toBeVisible();
  },
};

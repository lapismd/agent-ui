import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, within, userEvent, waitFor } from "storybook/test";
import Component from "./AiTurnChanges.svelte";
import Fixture from "./AiTurnChanges.stories.fixture.svelte";
import { Basic as source } from "./AiTurnChanges.example-sources.js";
export default {
  title: "Agents/Chat/Turn changes",
  component: Component,
  tags: ["visual-pending"],
  parameters: {
    docs: { source: { code: source, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Component>;
type Story = StoryObj<typeof Fixture>;
export const Basic: Story = {
  render: () => ({ Component: Fixture }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(await c.findByText("4 files changed")).toBeVisible();
    await userEvent.click(c.getByRole("button", { name: "Show 1 more files" }));
    await expect(
      c.getByRole("button", { name: "Show fewer files" }),
    ).toBeVisible();
    await userEvent.click(c.getByRole("button", { name: "View changes" }));
    await expect(
      c.getByRole("complementary", { name: "Session changes" }),
    ).toBeVisible();
  },
};
export const FilePreview: Story = {
  render: () => ({ Component: Fixture, props: { file: true } }),
};
export const UndoConfirmation: Story = {
  render: () => ({ Component: Fixture, props: { undo: true } }),
  play: async () => {
    const c = within(document.body);
    await waitFor(() => expect(c.getByRole("alertdialog")).toBeVisible());
    await userEvent.click(c.getByRole("button", { name: "Undo changes" }));
    await waitFor(() =>
      expect(c.queryByRole("alertdialog")).not.toBeInTheDocument(),
    );
  },
};
export const CheckpointUnavailable: Story = {
  render: () => ({ Component: Fixture, props: { state: "checkpoint" } }),
};
export const Loading: Story = {
  render: () => ({ Component: Fixture, props: { state: "loading" } }),
};
export const Empty: Story = {
  render: () => ({ Component: Fixture, props: { state: "empty" } }),
};
export const Incomplete: Story = {
  render: () => ({ Component: Fixture, props: { state: "incomplete" } }),
};
export const Bounded: Story = {
  render: () => ({ Component: Fixture, props: { state: "bounded" } }),
};
export const Recovery: Story = {
  render: () => ({ Component: Fixture, props: { state: "unavailable" } }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(
      await c.findByRole("button", { name: "Retry file changes" }),
    );
    await expect(await c.findByText("4 files changed")).toBeVisible();
  },
};

export const Unavailable: Story = {
  render: () => ({ Component: Fixture, props: { state: "unavailable" } }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(await c.findByText("Saved changes unavailable")).toBeVisible();
    await expect(
      canvasElement.querySelector('[data-ui-part="empty-media"] svg'),
    ).toBeVisible();
  },
};

import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, within, userEvent, waitFor } from "storybook/test";
import Component from "./ThreadsScreen.svelte";
import Fixture from "./ThreadsScreen.stories.fixture.svelte";
import { Basic as source } from "./ThreadsScreen.example-sources.js";
const meta = {
  title: "Agents/Complete screens/Threads",
  component: Component,
  tags: ["visual-pending"],
  parameters: {
    layout: "fullscreen",
    docs: { source: { code: source, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Component>;
export default meta;
type Story = StoryObj<typeof Fixture>;
export const Basic: Story = {
  render: () => ({ Component: Fixture }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const group = await c.findByRole("group", {
      name: "JJ Desktop Threads",
    });
    await userEvent.click(
      within(group).getByRole("button", {
        name: /^Open Thread Review shared screens/,
      }),
    );
    await expect(
      await c.findByText("Saved conversation in JJ Desktop."),
    ).toBeVisible();
  },
};
export const Layout: Story = { render: () => ({ Component: Fixture }) };
export const Conversation: Story = {
  render: () => ({ Component: Fixture, props: { variant: "conversation" } }),
};
export const CreateThread: Story = {
  render: () => ({ Component: Fixture }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(await c.findByRole("button", { name: "New Thread" }));
    await expect(
      await c.findByRole("heading", { name: "New Thread" }),
    ).toBeVisible();
  },
};
export const Search: Story = {
  render: () => ({ Component: Fixture }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(
      await c.findByRole("button", { name: "Search threads" }),
    );
    await userEvent.type(
      c.getByRole("textbox", { name: "Search loaded threads" }),
      "Earlier",
    );
    await expect(
      await c.findByRole("button", {
        name: /^Open Thread Earlier review/,
      }),
    ).toBeVisible();
    await expect(
      c.queryByRole("button", {
        name: /^Open Thread Review shared screens/,
      }),
    ).not.toBeInTheDocument();
  },
};
export const Empty: Story = {
  render: () => ({ Component: Fixture, props: { variant: "empty" } }),
};
export const Loading: Story = {
  render: () => ({ Component: Fixture, props: { variant: "loading" } }),
};
export const Disabled: Story = {
  render: () => ({ Component: Fixture, props: { variant: "disabled" } }),
};
export const Unavailable: Story = {
  render: () => ({ Component: Fixture, props: { variant: "unavailable" } }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(
      await c.findByRole("button", { name: "Retry Agent UI" }),
    );
    await expect(
      await c.findByRole("group", { name: "Agent UI Threads" }),
    ).toBeVisible();
  },
};
export const Partial: Story = {
  render: () => ({ Component: Fixture, props: { variant: "partial" } }),
};
export const Pagination: Story = {
  render: () => ({ Component: Fixture, props: { variant: "pagination" } }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(
      await c.findByRole("button", {
        name: "More Threads · Agent UI",
      }),
    );
    await expect(
      await c.findByRole("button", {
        name: /^Open Thread Review 25/,
      }),
    ).toBeVisible();
  },
};
export const Details: Story = {
  render: () => ({ Component: Fixture, props: { variant: "details" } }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(
      await c.findByRole("button", {
        name: "Thread contributors",
      }),
    );
    await expect(
      await c.findByRole("region", { name: "Conversation contributors" }),
    ).toBeVisible();
    await userEvent.click(
      c.getByRole("button", { name: "Close thread details" }),
    );
    await waitFor(() =>
      expect(
        c.queryByRole("region", { name: "Conversation contributors" }),
      ).not.toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(
        c.getByRole("button", { name: "Thread contributors" }),
      ).toHaveFocus(),
    );
  },
};

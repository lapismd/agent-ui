import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, within, userEvent, waitFor } from "storybook/test";
import Component from "./AgentsScreen.svelte";
import Fixture from "./AgentsScreen.stories.fixture.svelte";
import { Basic as source } from "./AgentsScreen.example-sources.js";
const meta = {
  title: "Agents/Complete screens/Agents",
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
    await expect(
      await c.findByRole("button", { name: "View Builder" }),
    ).toBeVisible();
    await userEvent.click(c.getByRole("button", { name: "View Builder" }));
    await expect(
      await c.findByRole("article", { name: "Builder agent profile" }),
    ).toBeVisible();
    await userEvent.click(
      c.getByRole("button", { name: "Close agent details" }),
    );
    await waitFor(() =>
      expect(
        c.queryByRole("article", { name: "Builder agent profile" }),
      ).not.toBeInTheDocument(),
    );
  },
};
export const Layout: Story = { render: () => ({ Component: Fixture }) };
export const Empty: Story = {
  render: () => ({ Component: Fixture, props: { variant: "empty" } }),
};
export const Loading: Story = {
  render: () => ({ Component: Fixture, props: { variant: "loading" } }),
};
export const Unavailable: Story = {
  render: () => ({ Component: Fixture, props: { variant: "unavailable" } }),
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText("Agents unavailable"),
    ).toBeVisible();
    await expect(
      canvasElement.querySelector('[data-ui-part="empty-media"] svg'),
    ).toBeVisible();
  },
};
export const DirectoryRecovery: Story = {
  render: () => ({ Component: Fixture, props: { variant: "unavailable" } }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(await c.findByRole("button", { name: "Retry" }));
    await expect(
      await c.findByRole("button", { name: "View Builder" }),
    ).toBeVisible();
  },
};
export const Sessions: Story = {
  render: () => ({ Component: Fixture, props: { variant: "sessions" } }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const captures = await c.findByRole("list", {
      name: "Captured agent sessions",
    });
    await expect(within(captures).getAllByRole("listitem")).toHaveLength(2);
    await userEvent.click(
      c.getByRole("button", {
        name: "Open captured Review shared screens in JJ Desktop",
      }),
    );
    await expect(
      await c.findByText("Saved review from JJ Desktop."),
    ).toBeVisible();
  },
};
export const Partial: Story = {
  render: () => ({ Component: Fixture, props: { variant: "partial" } }),
};
export const Configuration: Story = {
  render: () => ({ Component: Fixture }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement),
      body = within(document.body);
    await userEvent.click(await c.findByRole("button", { name: "Add agent" }));
    const dialog = within(
      await body.findByRole("dialog", { name: "Add agent" }),
    );
    await userEvent.type(
      dialog.getByRole("textbox", { name: "Agent name" }),
      "Test agent",
    );
    await userEvent.click(dialog.getByRole("button", { name: "Save agent" }));
    await expect(
      await c.findByRole("button", { name: "View Test agent" }),
    ).toBeVisible();
  },
};
export const Recovery: Story = {
  render: () => ({ Component: Fixture, props: { variant: "recovery" } }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement),
      body = within(document.body);
    await userEvent.click(
      await c.findByRole("button", { name: "Actions for Builder" }),
    );
    await userEvent.click(
      await body.findByRole("menuitem", { name: "Delete agent" }),
    );
    await expect(
      await c.findByRole("region", { name: "Pending agent request" }),
    ).toBeVisible();
    await waitFor(() =>
      expect(
        getComputedStyle(c.getByRole("button", { name: "Check outcome" }))
          .pointerEvents,
      ).toBe("auto"),
    );
    await userEvent.click(c.getByRole("button", { name: "Check outcome" }));
    await waitFor(() =>
      expect(
        c.queryByRole("region", { name: "Pending agent request" }),
      ).not.toBeInTheDocument(),
    );
  },
};

export const ConfigurationConflict: Story = {
  render: () => ({ Component: Fixture, props: { variant: "conflict" } }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement),
      body = within(document.body);
    await userEvent.click(
      await c.findByRole("button", { name: "Actions for Builder" }),
    );
    await userEvent.click(
      await body.findByRole("menuitem", { name: "Edit agent" }),
    );
    const dialog = within(
      await body.findByRole("dialog", { name: "Edit agent" }),
    );
    const name = dialog.getByRole("textbox", { name: "Agent name" });
    await userEvent.clear(name);
    await userEvent.type(name, "Retained Builder");
    await userEvent.click(dialog.getByRole("button", { name: "Save agent" }));
    await userEvent.click(
      await dialog.findByRole("button", {
        name: "Keep draft and use latest version",
      }),
    );
    await expect(name).toHaveValue("Retained Builder");
    await userEvent.click(dialog.getByRole("button", { name: "Save agent" }));
    await expect(
      await c.findByRole("button", { name: "View Retained Builder" }),
    ).toBeVisible();
  },
};

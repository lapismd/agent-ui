import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, waitFor } from "storybook/test";
import Component from "./RepositoryBranchCommand.svelte";
import Demo from "../../../../../../catalog/jj/BranchesDemo.svelte";
import { Basic as source } from "./RepositoryBranchCommand.example-sources.js";
export default {
  title: "JJ/Browsing/Branches",
  component: Component,
  tags: ["visual-pending"],
  parameters: {
    docs: { source: { code: source, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Component>;
type Story = StoryObj<typeof Demo>;
export const Basic: Story = {
  render: () => ({
    Component: Demo,
    props: { variant: "Basic", standalone: true },
  }),
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-testid="branches-state"]'),
      ).toHaveAttribute("data-phase", "ready"),
    );
  },
};
export const Dense: Story = {
  render: () => ({
    Component: Demo,
    props: { variant: "Dense", standalone: true },
  }),
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-testid="branches-state"]'),
      ).toHaveAttribute("data-phase", "ready"),
    );
  },
};
export const Empty: Story = {
  render: () => ({
    Component: Demo,
    props: { variant: "Empty", standalone: true },
  }),
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-testid="branches-state"]'),
      ).toHaveAttribute("data-phase", "ready"),
    );
  },
};
export const HostActions: Story = {
  render: () => ({
    Component: Demo,
    props: { variant: "HostActions", standalone: true },
  }),
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-testid="branches-state"]'),
      ).toHaveAttribute("data-phase", "ready"),
    );
  },
};

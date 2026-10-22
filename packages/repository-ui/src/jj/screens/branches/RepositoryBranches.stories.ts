import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, waitFor } from "storybook/test";
import Component from "./RepositoryBranches.svelte";
import Demo from "../../../../../../catalog/jj/BranchesDemo.svelte";
import { Basic as source } from "./RepositoryBranches.example-sources.js";
export default {
  title: "JJ/Complete screens/Branches",
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
    props: { variant: "Basic", standalone: false },
  }),
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-testid="branches-state"]'),
      ).toHaveAttribute("data-phase", "ready"),
    );
  },
};
export const WorkingCopy: Story = {
  render: () => ({
    Component: Demo,
    props: { variant: "WorkingCopy", standalone: false },
  }),
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-testid="branches-state"]'),
      ).toHaveAttribute("data-phase", "ready"),
    );
  },
};
export const Remote: Story = {
  render: () => ({
    Component: Demo,
    props: { variant: "Remote", standalone: false },
  }),
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-testid="branches-state"]'),
      ).toHaveAttribute("data-phase", "ready"),
    );
  },
};
export const Conflicted: Story = {
  render: () => ({
    Component: Demo,
    props: { variant: "Conflicted", standalone: false },
  }),
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-testid="branches-state"]'),
      ).toHaveAttribute("data-phase", "ready"),
    );
  },
};
export const Deleted: Story = {
  render: () => ({
    Component: Demo,
    props: { variant: "Deleted", standalone: false },
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
    props: { variant: "Dense", standalone: false },
  }),
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-testid="branches-state"]'),
      ).toHaveAttribute("data-phase", "ready"),
    );
  },
};
export const Bounded: Story = {
  render: () => ({
    Component: Demo,
    props: { variant: "Bounded", standalone: false },
  }),
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-testid="branches-state"]'),
      ).toHaveAttribute("data-phase", "ready"),
    );
  },
};
export const AllInOne: Story = {
  render: () => ({
    Component: Demo,
    props: { variant: "AllInOne", standalone: false },
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
    props: { variant: "HostActions", standalone: false },
  }),
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-testid="branches-state"]'),
      ).toHaveAttribute("data-phase", "ready"),
    );
  },
};
export const Loading: Story = {
  render: () => ({
    Component: Demo,
    props: { variant: "Loading", standalone: false },
  }),
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-testid="branches-state"]'),
      ).toHaveAttribute("data-phase", "loading"),
    );
  },
};
export const Unavailable: Story = {
  render: () => ({
    Component: Demo,
    props: { variant: "Unavailable", standalone: false },
  }),
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-testid="branches-state"]'),
      ).toHaveAttribute("data-phase", "unavailable"),
    );
  },
};
export const Retry: Story = {
  render: () => ({
    Component: Demo,
    props: { variant: "Retry", standalone: false },
  }),
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-testid="branches-state"]'),
      ).toHaveAttribute("data-phase", "unavailable"),
    );
  },
};
export const Empty: Story = {
  render: () => ({
    Component: Demo,
    props: { variant: "Empty", standalone: false },
  }),
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-testid="branches-state"]'),
      ).toHaveAttribute("data-phase", "ready"),
    );
  },
};

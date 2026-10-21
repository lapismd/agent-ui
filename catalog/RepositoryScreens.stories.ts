import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, within, userEvent, waitFor } from "storybook/test";
import { RepositoryWorkbench } from "../packages/repository-ui/src/screens/index.js";
import RepositoryDemo from "./RepositoryDemo.svelte";
import { repositorySource } from "./example-sources.js";
const meta = {
  title: "Repository/Complete screens",
  component: RepositoryWorkbench,
  tags: ["visual-pending"],
  parameters: {
    layout: "fullscreen",
    docs: { source: { code: repositorySource, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof RepositoryWorkbench>;
export default meta;
type Story = StoryObj<typeof RepositoryDemo>;
export const Files: Story = {
  render: () => ({ Component: RepositoryDemo, props: { view: "files" } }),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("region", { name: "Repository files" }),
    ).toBeVisible();
  },
};
export const Commits: Story = {
  render: () => ({ Component: RepositoryDemo, props: { view: "history" } }),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("region", { name: "Commit history" }),
    ).toBeVisible();
  },
};
export const Operations: Story = {
  render: () => ({ Component: RepositoryDemo, props: { view: "operations" } }),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("region", { name: "Operation log" }),
    ).toBeVisible();
  },
};
export const Evolution: Story = {
  render: () => ({ Component: RepositoryDemo, props: { view: "evolution" } }),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("region", { name: "Commit history" }),
    ).toBeVisible();
  },
};
export const Blame: Story = {
  render: () => ({ Component: RepositoryDemo, props: { view: "blame" } }),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("region", { name: "File blame" }),
    ).toBeVisible();
  },
};
export const Conflicts: Story = {
  render: () => ({ Component: RepositoryDemo, props: { view: "conflicts" } }),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("region", { name: "Resolve conflicts" }),
    ).toBeVisible();
  },
};
export const Branches: Story = {
  render: () => ({ Component: RepositoryDemo, props: { view: "branches" } }),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("region", { name: "Stack workspace" }),
    ).toBeVisible();
  },
};
export const Workspace: Story = {
  render: () => ({ Component: RepositoryDemo, props: { view: "workspace" } }),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("region", { name: "Stack workspace" }),
    ).toBeVisible();
  },
};
export const PullRequests: Story = {
  render: () => ({ Component: RepositoryDemo, props: { view: "forge" } }),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("region", {
        name: "Pull request browser",
      }),
    ).toBeVisible();
  },
};
export const Settings: Story = {
  render: () => ({ Component: RepositoryDemo, props: { view: "settings" } }),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("region", {
        name: "Repository settings",
      }),
    ).toBeVisible();
  },
};
export const Empty: Story = {
  render: () => ({ Component: RepositoryDemo, props: { empty: true } }),
};
export const FileInspection: Story = {
  render: () => ({ Component: RepositoryDemo }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getAllByRole("button", { name: /^README.md/ })[0]!);
    await userEvent.click(c.getByRole("button", { name: "source" }));
    await expect(
      c.getByText("A reusable **agent and repository workbench**.", {
        exact: false,
      }),
    ).toBeVisible();
  },
};
export const HistorySelection: Story = {
  render: () => ({ Component: RepositoryDemo, props: { view: "history" } }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(
      c.getByRole("button", { name: /Add keyboard shortcuts/ }),
    );
    await expect(
      c.getByRole("heading", { name: "Changed files" }),
    ).toBeVisible();
  },
};
export const ForgeFloat: Story = {
  render: () => ({ Component: RepositoryDemo, props: { view: "forge" } }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(
      c.getByRole("button", { name: "#42 Add agent workspace" }),
    );
    await userEvent.click(c.getByRole("button", { name: "Float panel" }));
    await expect(c.getByRole("button", { name: "Redock" })).toBeVisible();
    await userEvent.click(c.getByRole("button", { name: "Redock" }));
    await expect(c.getByRole("button", { name: "Float panel" })).toBeVisible();
  },
};

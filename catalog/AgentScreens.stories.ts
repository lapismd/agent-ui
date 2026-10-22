import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, within, userEvent, waitFor } from "storybook/test";
import { AgentWorkbench } from "../packages/agent-ui/src/screens/index.js";
import AgentDemo from "./AgentDemo.svelte";
import { agentSource } from "./example-sources.js";
const meta = {
  id: "agent-complete-screens",
  title: "Agents/Complete screens",
  component: AgentWorkbench,
  tags: ["visual-pending"],
  parameters: {
    layout: "fullscreen",
    docs: { source: { code: agentSource, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof AgentWorkbench>;
export default meta;
type Story = StoryObj<typeof AgentDemo>;
export const Chat: Story = {
  render: () => ({ Component: AgentDemo, props: { screen: "chat" } }),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("region", { name: "AI conversation" }),
    ).toBeVisible();
  },
};
export const History: Story = {
  render: () => ({ Component: AgentDemo, props: { screen: "history" } }),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("tree", { name: "Conversation history" }),
    ).toBeVisible();
  },
};
export const Catalog: Story = {
  render: () => ({ Component: AgentDemo, props: { screen: "catalog" } }),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("tree", { name: "AI catalog" }),
    ).toBeVisible();
    const skill = within(canvasElement).getByRole("treeitem", {
      name: /^Research$/,
    });
    const icon = skill.querySelector('[data-ui-component="file-type-icon"]');
    await expect(icon).toBeVisible();
    await expect(icon).toHaveAttribute("data-file-type-icon", "markdown");
    await expect(icon).toHaveAttribute("aria-hidden", "true");
    await expect(icon).toHaveStyle({ width: "16px", height: "16px" });
    await userEvent.click(
      within(skill).getByRole("button", { name: /^Open Research$/ }),
    );
    await expect(skill).toHaveAttribute("aria-selected", "true");
  },
};
export const Imports: Story = {
  render: () => ({ Component: AgentDemo, props: { screen: "imports" } }),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByTestId("ai-import-panel"),
    ).toBeVisible();
  },
};
export const Recorded: Story = {
  render: () => ({ Component: AgentDemo, props: { screen: "recorded" } }),
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByRole("region", {
        name: "Captured conversation",
      }),
    ).toBeVisible();
  },
};
export const Requests: Story = {
  render: () => ({ Component: AgentDemo, props: { requests: true } }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("button", { name: /^A Allow once$/ }));
    await waitFor(() =>
      expect(
        c.queryByText("Allow editing src/settings.ts?"),
      ).not.toBeInTheDocument(),
    );
    await userEvent.click(c.getByRole("button", { name: /^A Keep current$/ }));
    await userEvent.click(c.getByRole("button", { name: "Submit answer" }));
    await waitFor(() =>
      expect(
        c.queryByText("Which behavior should be retained?"),
      ).not.toBeInTheDocument(),
    );
  },
};
export const Empty: Story = {
  render: () => ({ Component: AgentDemo, props: { empty: true } }),
};
export const BusyQueue: Story = {
  render: () => ({ Component: AgentDemo, props: { busy: true } }),
};
export const NavigationRetainsDraft: Story = {
  render: () => ({ Component: AgentDemo }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const editor = () =>
      within(c.getByRole("group", { name: "Message composer" })).getByRole(
        "textbox",
        { name: "Message" },
      );
    await userEvent.click(editor());
    await userEvent.type(editor(), "Retained authored draft");
    await userEvent.click(
      c.getByRole("button", { name: "Switch to Classic view" }),
    );
    await expect(editor()).toHaveTextContent("Retained authored draft");
    await userEvent.click(
      c.getByRole("button", { name: "Switch to Document view" }),
    );
    await expect(editor()).toHaveTextContent("Retained authored draft");
  },
};
export const CatalogToggle: Story = {
  render: () => ({ Component: AgentDemo, props: { screen: "catalog" } }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.type(
      c.getByRole("searchbox", { name: "Filter catalog" }),
      "Read file",
    );
    const checkbox = await c.findByRole("checkbox", {
      name: "Enable Read file for the next chat",
    });
    await expect(checkbox).toBeChecked();
    await userEvent.click(checkbox);
    await expect(checkbox).not.toBeChecked();
  },
};

export const AllMessages: Story = {
  render: () => ({ Component: AgentDemo, props: { scenario: "all" } }),
};
export const InlineComments: Story = {
  render: () => ({ Component: AgentDemo, props: { scenario: "comments" } }),
};
export const ChatError: Story = {
  render: () => ({ Component: AgentDemo, props: { scenario: "error" } }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const draft = within(
      c.getByRole("group", { name: "Message composer" }),
    ).getByRole("textbox", { name: "Message" });
    await expect(draft).toHaveTextContent("Retain my exact authored draft.");
    const metadata = await c.findByRole("group", {
      name: "Draft metadata",
    });
    await expect(metadata).toHaveTextContent(
      "The simulated host refused this action.",
    );
    expect(metadata.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      draft.getBoundingClientRect().bottom,
    );
  },
};
export const RefusedSubmission: Story = {
  render: () => ({ Component: AgentDemo, props: { scenario: "refused" } }),
};
export const UnknownSubmission: Story = {
  render: () => ({ Component: AgentDemo, props: { scenario: "unknown" } }),
};

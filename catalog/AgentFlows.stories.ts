import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, within, userEvent, waitFor } from "storybook/test";
import AgentDemo from "./AgentDemo.svelte";
import { agentSource } from "./example-sources.js";
const meta = {
  title: "Agent/Complete screens",
  component: AgentDemo,
  tags: ["visual-pending"],
  parameters: {
    layout: "fullscreen",
    docs: { source: { code: agentSource, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof AgentDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const HistoryOpensChat: Story = {
  args: { screen: "history" },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(
      await c.findByRole("button", { name: /^Plan the agent UI extraction/ }),
    );
    await expect(
      await c.findByRole("heading", { name: "Plan the agent UI extraction" }),
    ).toBeVisible();
    await expect(
      c.getByRole("region", { name: "AI conversation" }),
    ).toBeVisible();
  },
};
export const CatalogFileNavigation: Story = {
  args: { screen: "catalog" },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.type(
      c.getByRole("searchbox", { name: "Filter catalog" }),
      "Research",
    );
    await userEvent.click(
      await c.findByRole("button", { name: "Open Research" }),
    );
    await expect(c.getByRole("treeitem", { name: "Research" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  },
};
export const ImportPreviewAndSave: Story = {
  args: { screen: "imports" },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(await c.findByRole("button", { name: "agent-ui" }));
    await userEvent.click(
      await c.findByText("Recorded workspace review", { exact: true }),
    );
    await expect(
      await c.findByRole("region", { name: "Captured conversation" }),
    ).toBeVisible();
    await userEvent.click(c.getByRole("button", { name: "Import snapshot" }));
    await expect(await c.findByText("Snapshot saved locally.")).toBeVisible();
    await userEvent.click(
      c.getByRole("button", { name: "Open saved snapshot" }),
    );
    await expect(
      await c.findByRole("region", { name: "AI conversation" }),
    ).toBeVisible();
  },
};

export const InlineAgentEditor: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(
      c.getByRole("combobox", { name: "Tag people or agents" }),
    );
    await userEvent.click(
      await within(document.body).findByRole("option", { name: /Add agent…/ }),
    );
    const element = await within(document.body).findByRole("dialog", {
      name: "Add agent participant",
    });
    const dialog = within(element);
    await userEvent.type(
      dialog.getByRole("textbox", { name: "Participant name" }),
      "Reviewer",
    );
    await userEvent.click(
      dialog.getByRole("button", { name: "Add participant" }),
    );
    await waitFor(() => expect(element).not.toBeInTheDocument());
    await userEvent.click(
      c.getByRole("combobox", { name: "Tag people or agents" }),
    );
    await userEvent.type(
      await within(document.body).findByLabelText("Search people or agents"),
      "Reviewer",
    );
    await waitFor(() =>
      expect(
        within(document.body).getByRole("option", { name: /Reviewer/ }),
      ).toBeVisible(),
    );
    await userEvent.keyboard("{Escape}");
  },
};

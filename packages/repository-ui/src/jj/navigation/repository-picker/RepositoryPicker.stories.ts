import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import Component from "./RepositoryPicker.svelte";
import { Basic as source } from "./RepositoryPicker.example-sources.js";
const repositories = [
  { id: "one", name: "Lapis", description: "~/code/lapis" },
  { id: "two", name: "Documentation", description: "~/code/docs" },
  { id: "three", name: "Unavailable checkout", disabled: true },
];
export default {
  title: "JJ/Navigation/Repository picker",
  component: Component,
  tags: ["visual-pending"],
  args: {
    repositories,
    value: "one",
    controlled: true,
    onChange: fn(),
    onOpenRepository: fn(),
  },
  parameters: {
    docs: { source: { code: source, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Component>;
type Story = StoryObj<typeof Component>;
export const Basic: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(
      within(canvasElement).getByRole("combobox", { name: "Repository" }),
    );
    const overlay = within(canvasElement.ownerDocument.body);
    await userEvent.type(
      overlay.getByPlaceholderText("Search repositories"),
      "Documentation",
    );
    await userEvent.keyboard("{Enter}");
    await expect(args.onChange).toHaveBeenCalledWith("two");
    await expect(
      within(canvasElement).getByRole("combobox", { name: "Repository" }),
    ).toHaveFocus();
  },
};
export const OpenLocal: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(
      within(canvasElement).getByRole("combobox", { name: "Repository" }),
    );
    await userEvent.click(
      within(canvasElement.ownerDocument.body).getByRole("option", {
        name: /Open local repository/,
      }),
    );
    await expect(args.onOpenRepository).toHaveBeenCalledOnce();
  },
};
export const Disabled: Story = { args: { disabled: true } };
export const UnavailableSelection: Story = { args: { value: "missing" } };
export const NoMatches: Story = { args: { inline: true, repositories: [] } };
export const Compact: Story = {
  args: { size: "sm", variant: "ghost" },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("combobox", {
      name: "Repository",
    });
    expect(trigger).toHaveAttribute("data-size", "sm");
    expect(trigger.getBoundingClientRect().height).toBeLessThanOrEqual(32);
    await userEvent.click(trigger);
    await waitFor(() =>
      expect(
        within(canvasElement.ownerDocument.body).getByPlaceholderText(
          "Search repositories",
        ),
      ).toBeVisible(),
    );
    await userEvent.keyboard("{Escape}");
    await expect(trigger).toHaveFocus();
  },
};

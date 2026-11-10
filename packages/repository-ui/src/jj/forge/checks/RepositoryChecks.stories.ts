import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import Component from "./RepositoryChecks.svelte";
import Demo from "../../../../../../catalog/jj/ChecksDemo.svelte";
import { Basic } from "./RepositoryChecks.example-sources.js";
export default {
  title: "JJ/Forge/Checks",
  component: Component,
  tags: ["visual-pending"],
  parameters: {
    docs: { source: { code: Basic, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Component>;
type Story = StoryObj<typeof Demo>;
const story = (variant: string): Story => ({
  render: () => ({ Component: Demo, props: { variant } }),
});
export const Mixed: Story = {
  ...story("Mixed"),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement),
      page = within(canvasElement.ownerDocument.body);
    await expect(
      c.getByRole("status", { name: "Refresh requests" }),
    ).toHaveTextContent("0");
    await userEvent.click(c.getByRole("button", { name: /1 Failed check/ }));
    await waitFor(() => expect(c.getByText("Formatting")).not.toBeVisible());
    await expect(c.getByText("Types and contracts")).toBeVisible();
    await userEvent.click(
      c.getByRole("button", { name: "Check display options" }),
    );
    await userEvent.click(
      await page.findByRole("menuitemradio", { name: "No grouping" }),
    );
    await waitFor(() =>
      expect(
        page.queryByRole("menu", { hidden: true }),
      ).not.toBeInTheDocument(),
    );
    await expect(c.getByText("Formatting")).toBeVisible();
    await expect(
      c.queryByRole("button", { name: /1 Passed check/ }),
    ).not.toBeInTheDocument();
    await userEvent.click(c.getByRole("button", { name: "Collapse checks" }));
    await waitFor(() =>
      expect(c.getByText("Types and contracts")).not.toBeVisible(),
    );
    await userEvent.click(c.getByRole("button", { name: "Expand checks" }));
    await userEvent.click(c.getByRole("button", { name: "Refresh checks" }));
    await expect(
      c.getByRole("status", { name: "Refresh requests" }),
    ).toHaveTextContent("1");
  },
};
export const Passed: Story = story("Passed");
export const Stale: Story = story("Stale");
export const Incomplete: Story = story("Incomplete");
export const Unavailable: Story = story("Unavailable");
export const Empty: Story = story("Empty");
export const Disabled: Story = story("Disabled");

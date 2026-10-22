import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, within, userEvent } from "storybook/test";
import Component from "./RepositoryChangeCard.svelte";
import Demo from "../../../../../../catalog/jj/ChangeCardDemo.svelte";
import { Basic as source } from "./RepositoryChangeCard.example-sources.js";
export default {
  title: "JJ/Browsing/Change Card",
  component: Component,
  tags: ["visual-pending"],
  parameters: {
    docs: { source: { code: source, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Component>;
type Story = StoryObj<typeof Demo>;
async function check(canvasElement: HTMLElement, variant: string) {
  const canvas = within(canvasElement);
  await expect(
    canvas.getByRole("group", { name: "Recorded change" }),
  ).toBeVisible();
  const button = canvas.getByRole("button", {
    name:
      variant === "ChangeOnly" ? /Copy JJ Change ID/ : /Copy Git commit SHA/,
  });
  await userEvent.click(button);
  await expect(canvas.getByTestId("change-card-copy")).toHaveTextContent(
    variant === "ChangeOnly" ? "a".repeat(32) : "11".repeat(20),
  );
}
export const Basic: Story = {
  render: () => ({ Component: Demo, props: { variant: "Basic" } }),
  play: async ({ canvasElement }) => check(canvasElement, "Basic"),
};
export const LongDescription: Story = {
  render: () => ({ Component: Demo, props: { variant: "LongDescription" } }),
  play: async ({ canvasElement }) => check(canvasElement, "LongDescription"),
};
export const UnknownAuthor: Story = {
  render: () => ({ Component: Demo, props: { variant: "UnknownAuthor" } }),
  play: async ({ canvasElement }) => check(canvasElement, "UnknownAuthor"),
};
export const CommitOnly: Story = {
  render: () => ({ Component: Demo, props: { variant: "CommitOnly" } }),
  play: async ({ canvasElement }) => check(canvasElement, "CommitOnly"),
};
export const ChangeOnly: Story = {
  render: () => ({ Component: Demo, props: { variant: "ChangeOnly" } }),
  play: async ({ canvasElement }) => check(canvasElement, "ChangeOnly"),
};

import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, within, userEvent, waitFor } from "storybook/test";
import Component from "./RepositoryReferencePicker.svelte";
import Demo from "../../../../../../catalog/jj/ReferencePickerDemo.svelte";
import { Basic as source } from "./RepositoryReferencePicker.example-sources.js";
export default {
  title: "JJ/Browsing/Reference Picker",
  component: Component,
  tags: ["visual-pending"],
  parameters: {
    docs: { source: { code: source, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Component>;
type Story = StoryObj<typeof Demo>;
async function check(canvasElement: HTMLElement, variant: string) {
  const canvas = within(canvasElement),
    body = within(canvasElement.ownerDocument.body);
  const trigger = canvas.getByRole("combobox", {
    name: "Repository bookmark or change",
  });
  if (variant === "Disabled") {
    await expect(trigger).toBeDisabled();
    return;
  }
  await userEvent.click(trigger);
  if (variant === "Loading")
    await waitFor(() =>
      expect(
        body.getByRole("status", { name: "Loading snapshots" }),
      ).toBeVisible(),
    );
  else if (variant === "Empty")
    await waitFor(() =>
      expect(
        body.getByText("No matching snapshots", { exact: true }),
      ).toBeVisible(),
    );
  else if (variant === "Unavailable") {
    await waitFor(() =>
      expect(
        body.getByText("Snapshots unavailable", { exact: true }),
      ).toBeVisible(),
    );
    await userEvent.click(body.getByRole("button", { name: "Retry preview" }));
    await expect(await body.findByRole("row", { name: "main" })).toBeVisible();
  } else {
    const input = body.getByRole("combobox", { name: "Switch snapshot" });
    await userEvent.type(input, variant === "Changes" ? "22222222" : "main");
    await userEvent.click(
      await body.findByRole("row", {
        name: variant === "Changes" ? /bbbb/ : "main",
      }),
    );
    await expect(canvas.getByTestId("reference-value")).toHaveTextContent(
      variant === "Changes" ? "change:bbbb" : "bookmark:main",
    );
  }
  await userEvent.keyboard("{Escape}");
}
export const Basic: Story = {
  render: () => ({ Component: Demo, props: { variant: "Basic" } }),
  play: async ({ canvasElement }) => check(canvasElement, "Basic"),
};
export const Changes: Story = {
  render: () => ({ Component: Demo, props: { variant: "Changes" } }),
  play: async ({ canvasElement }) => check(canvasElement, "Changes"),
};
export const Dense: Story = {
  render: () => ({ Component: Demo, props: { variant: "Dense" } }),
  play: async ({ canvasElement }) => check(canvasElement, "Dense"),
};
export const Empty: Story = {
  render: () => ({ Component: Demo, props: { variant: "Empty" } }),
  play: async ({ canvasElement }) => check(canvasElement, "Empty"),
};
export const Loading: Story = {
  render: () => ({ Component: Demo, props: { variant: "Loading" } }),
  play: async ({ canvasElement }) => check(canvasElement, "Loading"),
};
export const Unavailable: Story = {
  render: () => ({ Component: Demo, props: { variant: "Unavailable" } }),
  play: async ({ canvasElement }) => check(canvasElement, "Unavailable"),
};
export const Disabled: Story = {
  render: () => ({ Component: Demo, props: { variant: "Disabled" } }),
  play: async ({ canvasElement }) => check(canvasElement, "Disabled"),
};
export const Paged: Story = {
  render: () => ({ Component: Demo, props: { variant: "Paged" } }),
  play: async ({ canvasElement }) => check(canvasElement, "Paged"),
};

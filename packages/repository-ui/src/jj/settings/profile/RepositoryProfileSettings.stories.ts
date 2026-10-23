import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, within, userEvent, waitFor } from "storybook/test";
import Component from "./RepositoryProfileSettings.svelte";
import Demo from "../../../../../../catalog/jj/ProfileDemo.svelte";
import { Basic as source } from "./RepositoryProfileSettings.example-sources.js";
export default {
  title: "JJ/Settings/Profile",
  component: Component,
  tags: ["visual-pending"],
  parameters: {
    docs: { source: { code: source, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Component>;
type Story = StoryObj<typeof Demo>;
const render = (variant: string) => () => ({
  Component: Demo,
  props: { variant },
});
async function edit(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  await userEvent.click(await canvas.findByRole("button", { name: "Edit" }));
  await userEvent.clear(canvas.getByRole("textbox", { name: "Display name" }));
  await userEvent.type(
    canvas.getByRole("textbox", { name: "Display name" }),
    "Retained Alex",
  );
  return canvas;
}
export const Basic: Story = {
  render: render("Basic"),
  play: async ({ canvasElement }) => {
    const canvas = await edit(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Save profile" }));
    await expect(
      await canvas.findByRole("button", { name: "Edit" }),
    ).toBeVisible();
    await expect(
      canvas.getByText("Retained Alex", { exact: true }),
    ).toBeVisible();
  },
};
export const Loading: Story = { render: render("Loading") };
export const Unavailable: Story = { render: render("Unavailable") };
export const Unknown: Story = {
  render: render("Unknown"),
  play: async ({ canvasElement }) => {
    const canvas = await edit(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Save profile" }));
    await expect(
      await canvas.findByRole("button", { name: "Check save status" }),
    ).toBeVisible();
    await expect(
      canvas.queryByRole("button", { name: "Retry original save" }),
    ).toBeNull();
  },
};
export const Conflict: Story = {
  render: render("Conflict"),
  play: async ({ canvasElement }) => {
    const canvas = await edit(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Save profile" }));
    await expect(
      await canvas.findByRole("button", {
        name: "Use my draft with the current version",
      }),
    ).toBeVisible();
    await expect(
      canvas.getByRole("textbox", { name: "Display name" }),
    ).toHaveValue("Retained Alex");
  },
};
export const Avatar: Story = {
  render: render("Basic"),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      await canvas.findByRole("button", { name: /Edit profile photo/ }),
    );

    const document = within(canvasElement.ownerDocument.body);
    const input = await document.findByRole("textbox", {
      name: "Avatar image URL",
    });
    await waitFor(() => expect(input).toBeVisible());
    await userEvent.type(
      document.getByRole("textbox", { name: "Avatar image URL" }),
      "https://example.invalid/alex.png",
    );
    await userEvent.keyboard("{Escape}");
    await expect(
      canvas.getByRole("button", { name: "Save profile" }),
    ).toBeEnabled();
  },
};

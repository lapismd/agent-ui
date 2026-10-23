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
async function expectGravatarDivider(canvasElement: HTMLElement) {
  const group = within(canvasElement)
    .getByRole("switch", { name: "Use Gravatar" })
    .closest('[data-slot="field-group"]')!;
  await expect(getComputedStyle(group).borderTopWidth).toBe("1px");
}
export const Basic: Story = {
  render: render("Basic"),
  play: async ({ canvasElement }) => {
    const card = await within(canvasElement).findByRole("region", {
      name: "Profile info",
    });
    const probe = document.createElement("span");
    probe.style.backgroundColor = "var(--background)";
    card.append(probe);
    const bodySurface = getComputedStyle(probe).backgroundColor;
    probe.remove();
    await expect(getComputedStyle(card).backgroundColor).toBe(bodySurface);
    const heading = card.querySelector(".store-settings-card__header")!;
    await expect(getComputedStyle(heading).backgroundColor).not.toBe(
      bodySurface,
    );
    await expectGravatarDivider(canvasElement);
    const preview = within(canvasElement).getByRole("region", {
      name: "Profile description preview",
    });
    await expect(preview.querySelector("strong")).toHaveTextContent("JJ");
    await expect(
      within(preview).getByRole("link", { name: "Profile guide" }),
    ).toHaveAttribute("href", "https://example.test/profile");
    await expect(within(preview).getAllByRole("listitem")).toHaveLength(2);
    await expect(preview.parentElement?.tagName).toBe("DIV");
    const canvas = await edit(canvasElement);
    await expectGravatarDivider(canvasElement);
    const editor = canvas.getByRole("textbox", { name: "Profile description" });
    const body = editor
      .closest('[data-ui-component="ai-chat-composer"]')!
      .querySelector('[data-ui-part="body"]')!;
    await expect(getComputedStyle(body).borderTopWidth).toBe("1px");
    await userEvent.click(editor);
    await userEvent.keyboard("{End}{Enter}A second line");
    await expect(editor).toBeVisible();
    await expect(editor).toHaveTextContent("A second line");
    await userEvent.click(canvas.getByRole("button", { name: "Save profile" }));
    await expect(
      await canvas.findByRole("button", { name: "Edit" }),
    ).toBeVisible();
    await expect(
      canvas.getByText("Retained Alex", { exact: true }),
    ).toBeVisible();
    await expect(
      canvas
        .getByRole("region", { name: "Profile description preview" })
        .querySelector("strong"),
    ).toHaveTextContent("JJ");
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

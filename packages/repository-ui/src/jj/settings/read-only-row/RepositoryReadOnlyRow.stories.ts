import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import Component from "./RepositoryReadOnlyRow.svelte";
import Demo from "../../../../../../catalog/jj/SettingsDemo.svelte";
import { Basic as source } from "./RepositoryReadOnlyRow.example-sources.js";

export default {
  title: "JJ/Settings/Read only row",
  component: Component,
  tags: ["visual-pending"],
  parameters: {
    docs: { source: { code: source, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Component>;
type Story = StoryObj<typeof Demo>;
const render: NonNullable<Story["render"]> = (args) => ({
  Component: Demo,
  props: { ...args, variant: "repository" },
});
const path = "/Users/example/code/example-repository";

export const Basic: Story = {
  render,
  args: { onOpenRepository: fn() },
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    await userEvent.click(
      c.getByRole("button", { name: "Open repository folder" }),
    );
    await expect(args.onOpenRepository).toHaveBeenCalledOnce();
    await expect(
      c.getByRole("button", {
        name: `Copy full Folder path: ${path}`,
      }),
    ).toBeVisible();
  },
};
export const CopyValue: Story = {
  render,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement),
      previous = Object.getOwnPropertyDescriptor(navigator, "clipboard");
    const writeText = fn(async () => {});
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    try {
      await userEvent.click(
        c.getByRole("button", {
          name: `Copy full Folder path: ${path}`,
        }),
      );
      await expect(writeText).toHaveBeenCalledWith(path);
      await expect(
        c.getByText("Folder path copied", { exact: true }),
      ).toBeVisible();
    } finally {
      if (previous) Object.defineProperty(navigator, "clipboard", previous);
      else Reflect.deleteProperty(navigator, "clipboard");
    }
  },
};
export const CopyFailure: Story = {
  render,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement),
      previous = Object.getOwnPropertyDescriptor(navigator, "clipboard");
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          throw Error("Clipboard unavailable");
        },
      },
    });
    try {
      await userEvent.click(
        c.getByRole("button", {
          name: `Copy full Folder path: ${path}`,
        }),
      );
      await expect(
        c.getByText("Could not copy Folder path. Try again.", { exact: true }),
      ).toBeVisible();
    } finally {
      if (previous) Object.defineProperty(navigator, "clipboard", previous);
      else Reflect.deleteProperty(navigator, "clipboard");
    }
  },
};
export const Unavailable: Story = {
  render,
  args: { folderPath: null },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByText("Unavailable", { exact: true })).toBeVisible();
    await expect(
      c.queryByRole("button", { name: "Open repository folder" }),
    ).toBeNull();
    await expect(
      c.queryByRole("button", { name: /^Copy full Folder path:/ }),
    ).toBeNull();
  },
};
export const DisabledOpen: Story = {
  render,
  args: { openDisabled: true },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(
      c.getByRole("button", { name: "Open repository folder" }),
    ).toBeDisabled();
    await expect(
      c.getByRole("button", {
        name: `Copy full Folder path: ${path}`,
      }),
    ).toBeEnabled();
  },
};
export const LongPath: Story = {
  render,
  args: { folderPath: "/Users/example/" + "long-repository-name/".repeat(25) },
  play: async ({ canvasElement, args }) => {
    const value = canvasElement.querySelector<HTMLElement>(
      ".store-readonly-row__value[title]",
    )!;
    await expect(value.scrollWidth).toBeGreaterThan(value.clientWidth);
    await expect(value).toHaveAttribute("title", args.folderPath!);
    await expect(
      within(canvasElement).getByRole("button", {
        name: `Copy full Folder path: ${args.folderPath}`,
      }),
    ).toBeVisible();
  },
};

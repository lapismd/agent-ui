import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import Component from "./RepositoryPullRequest.svelte";
import Demo from "../../../../../../catalog/jj/PullRequestDemo.svelte";
import { Basic as source } from "./RepositoryPullRequest.example-sources.js";
export default {
  title: "JJ/Forge/Pull request",
  component: Component,
  tags: ["visual-pending"],
  parameters: {
    docs: { source: { code: source, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Component>;
type Story = StoryObj<typeof Demo>;
const story = (variant: string): Story => ({
  render: () => ({ Component: Demo, props: { variant } }),
});
export const Basic: Story = story("Basic");
export const Draft: Story = story("Draft");
export const ChecksUnavailable: Story = story("ChecksUnavailable");
export const NoDescription: Story = story("NoDescription");
export const Disabled: Story = story("Disabled");
export const LongChecks: Story = {
  ...story("LongChecks"),
  play: async ({ canvasElement }) => {
    const checks = canvasElement.querySelector(".repository-checks")!;
    const viewport = checks.querySelector(
      '[data-ui-part="scroll-area-viewport"]',
    ) as HTMLElement;
    const footer = canvasElement.querySelector(".repository-pr__merge")!;
    expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);
    expect(viewport.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      footer.getBoundingClientRect().top,
    );
    viewport.scrollTop = viewport.scrollHeight;
    await waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(0));
    const last = within(checks as HTMLElement).getByText("Check 24");
    expect(last.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      viewport.getBoundingClientRect().bottom,
    );
  },
};
export const WideDescription: Story = {
  ...story("WideDescription"),
  play: async ({ canvasElement }) => {
    const viewport = within(canvasElement).getByRole("region", {
      name: "PR description",
    });
    expect(viewport.closest('[data-ui-part="scroll-area"]')).toHaveAttribute(
      "data-orientation",
      "horizontal",
    );
    expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth);
    viewport.scrollLeft = viewport.scrollWidth;
    await waitFor(() => expect(viewport.scrollLeft).toBeGreaterThan(0));
  },
};
export const Floating: Story = {
  ...story("Basic"),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: /^Float PR details$/ }),
    );
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await page.findByRole("dialog", { name: /PR #42/ });
    await expect(dialog).toBeVisible();
    const title = within(dialog).getByRole("button", {
      name: /Collapse pr details/,
    });
    await expect(title).toBeDisabled();
    await expect(title).toHaveAttribute("tabindex", "-1");
    expect(getComputedStyle(title).pointerEvents).toBe("none");
    expect(getComputedStyle(title).backgroundColor).toBe("rgba(0, 0, 0, 0)");
    expect(dialog.closest("[data-ui-theme]")).toHaveAttribute(
      "data-ui-theme",
      "lapis",
    );
    const content = dialog.querySelector(
      ".repository-detachable-panel__content",
    )!;
    const panel = dialog.querySelector(".repository-pr")!;
    // Both window and tab headers are valid chrome; measure unused space below content.
    expect(
      dialog.getBoundingClientRect().bottom -
        Math.min(
          content.getBoundingClientRect().bottom,
          panel.getBoundingClientRect().bottom,
        ),
    ).toBeLessThan(3);
    await userEvent.click(
      canvas.getByRole("button", { name: "Change host theme" }),
    );
    await waitFor(() =>
      expect(dialog.closest("[data-ui-theme]")).toHaveAttribute(
        "data-ui-theme",
        "default",
      ),
    );
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Dock PR details" }),
    );
    await expect(
      canvas.getByRole("button", { name: /^Float PR details$/ }),
    ).toBeVisible();
  },
};

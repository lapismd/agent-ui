import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import Component from "./RepositoryStackWorkspace.svelte";
import Demo from "../../../../../../catalog/jj/StackWorkspaceDemo.svelte";
import { Basic as source } from "./RepositoryStackWorkspace.example-sources.js";
export default {
  title: "JJ/Complete screens/Stacks",
  component: Component,
  tags: ["visual-pending"],
  parameters: {
    docs: { source: { code: source, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Component>;
type Story = StoryObj<typeof Demo>;
const story = (
  variant: string,
  page: "branches" | "workspace" = "workspace",
): Story => ({
  render: () => ({ Component: Demo, props: { variant, page } }),
  play: async ({ canvasElement }) => {
    if (variant !== "Loading")
      await waitFor(() =>
        expect(
          canvasElement.querySelector('[data-testid="stack-workspace-state"]'),
        ).toHaveAttribute(
          "data-loaded",
          variant === "Unavailable" || variant === "Retry" ? "false" : "true",
        ),
      );
  },
});
export const Basic: Story = story("Basic", "branches");
export const Workspace: Story = story("Basic");
export const Dense: Story = story("Dense");
export const Paged: Story = story("Paged");
export const SelectedFiles: Story = story("SelectedFiles");
export const StackedBranches: Story = {
  ...story("SelectedFiles", "branches"),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByRole("region", {
      name: "Changed files in feature/portable-api",
    });
    expect(
      canvasElement.querySelectorAll(".workspace-bookmark-card"),
    ).toHaveLength(3);
    expect(
      canvasElement.querySelector(".workspace-files.compact"),
    ).not.toBeNull();
    await canvas.findByRole("button", {
      name: /^Close diff from stack-lane-1$/,
    });
  },
};
export const Binary: Story = story("Binary");
export const Conflicts: Story = story("Conflicts");
export const TargetHistory: Story = story("TargetHistory", "branches");
export const Bounded: Story = story("Bounded");
export const RetainedDraft: Story = {
  ...story("RetainedDraft"),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const start = await canvas.findByRole("button", {
      name: "Start host draft in feature/portable-api",
    });
    await userEvent.click(start);
    const input = canvas.getByRole("textbox", {
      name: "Draft for feature/portable-api",
    });
    await userEvent.type(input, "Retained host draft");
    await userEvent.click(
      within(
        canvas.getByRole("tablist", { name: "Stack workspace views" }),
      ).getByRole("tab", { name: /^Stacks$/ }),
    );
    await userEvent.click(
      within(
        canvas.getByRole("tablist", { name: "Stack workspace views" }),
      ).getByRole("tab", { name: /^Workspace$/ }),
    );
    await waitFor(() =>
      expect(
        canvas.getByRole("textbox", { name: "Draft for feature/portable-api" }),
      ).toHaveValue("Retained host draft"),
    );
  },
};
export const HostActions: Story = {
  ...story("HostActions"),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      await canvas.findByRole("button", { name: /^Host action$/ }),
    );
    await waitFor(() =>
      expect(
        canvas.getByTestId("stack-workspace-state").getAttribute("data-events"),
      ).toBe("header"),
    );
  },
};
export const Loading: Story = story("Loading");
export const Empty: Story = story("Empty");
export const Unavailable: Story = story("Unavailable");
export const Unlinked: Story = story("Unlinked");
export const IncompleteTopology: Story = story("IncompleteTopology");
export const Retry: Story = {
  ...story("Retry"),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      await canvas.findByRole("button", { name: /^Retry$/ }),
    );
    await waitFor(() =>
      expect(canvas.getByTestId("stack-workspace-state")).toHaveAttribute(
        "data-loaded",
        "true",
      ),
    );
  },
};

export const HunkActions: Story = {
  ...story("HunkActions"),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      (await canvas.findAllByRole("button", { name: /^Assign hunk/ }))[0]!,
    );
    await waitFor(() =>
      expect(canvas.getByTestId("stack-workspace-state")).toHaveAttribute(
        "data-events",
        "transfer",
      ),
    );
  },
};

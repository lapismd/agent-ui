import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, userEvent, within, waitFor } from "storybook/test";
import Component from "./ProjectsScreen.svelte";
import Demo from "../../../../../../catalog/jj/ProjectsDemo.svelte";
import { Basic as source } from "./ProjectsScreen.example-sources.js";
export default {
  title: "JJ/Complete screens/Projects",
  component: Component,
  tags: ["visual-pending"],
  parameters: {
    docs: { source: { code: source, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Component>;
type Story = StoryObj<typeof Demo>;
export const Basic: Story = {
  render: () => ({ Component: Demo }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const projects = await canvas.findAllByRole("button", {
      name: "Open project Repository toolkit",
    });
    await expect(projects).toHaveLength(2);
    await userEvent.click(projects[0]);
    await userEvent.click(
      await canvas.findByRole("button", {
        name: "Open task Preserve repository context",
      }),
    );
    await expect(
      await canvas.findByRole("article", { name: "Task details" }),
    ).toBeVisible();
  },
};
export const CreateProject: Story = {
  render: () => ({ Component: Demo }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement),
      body = within(canvasElement.ownerDocument.body);
    await userEvent.click(
      await canvas.findByRole("button", { name: "New project" }),
    );
    const dialog = within(await body.findByRole("dialog"));
    await waitFor(() =>
      expect(
        dialog.getByRole("region", { name: "Metadata home" }),
      ).toBeVisible(),
    );
    const title = dialog.getByRole("textbox", { name: "Project title" });
    await waitFor(() => expect(title).toBeEnabled());
    await userEvent.type(title, "A shared project");
    await userEvent.click(
      dialog.getByRole("button", { name: "Create project" }),
    );
    await expect(
      await canvas.findByRole("button", {
        name: "Open project A shared project",
      }),
    ).toBeVisible();
  },
};
export const Project: Story = {
  render: () => ({ Component: Demo, props: { variant: "Project" } }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByRole("button", {
      name: "Open task Preserve repository context",
    });
    await expect(
      canvas.getByRole("heading", { name: "Tasks", level: 1 }),
    ).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: "Search tasks" }),
    ).toBeVisible();
    await expect(canvas.getByRole("tab", { name: "Tasks" })).toBeVisible();
  },
};
export const Task: Story = {
  render: () => ({ Component: Demo, props: { variant: "Task" } }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = await canvas.findByRole("textbox", { name: "Add comment" });
    await waitFor(() => expect(input).toBeEnabled());
    await userEvent.type(input, "Metadata stays at its home.");
    await userEvent.click(canvas.getByRole("button", { name: "Send comment" }));
    await expect(
      await canvas.findByText("Metadata stays at its home."),
    ).toBeVisible();
  },
};
export const Reviews: Story = {
  render: () => ({ Component: Demo, props: { variant: "Reviews" } }),
};
export const Paged: Story = {
  render: () => ({ Component: Demo, props: { variant: "Paged" } }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      (
        await canvas.findAllByRole("button", { name: "More projects in Lapis" })
      )[0],
    );
    await expect(
      await canvas.findByRole("button", { name: "Open project Project 29" }),
    ).toBeInTheDocument();
  },
};
export const PartialFailure: Story = {
  render: () => ({ Component: Demo, props: { variant: "PartialFailure" } }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText("Lapis unavailable")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Retry" }));
    await waitFor(() =>
      expect(
        canvas.getAllByRole("button", {
          name: "Open project Repository toolkit",
        }),
      ).toHaveLength(2),
    );
  },
};
export const Empty: Story = {
  render: () => ({ Component: Demo, props: { variant: "Empty" } }),
};
export const Loading: Story = {
  render: () => ({ Component: Demo, props: { variant: "Loading" } }),
};
export const Disabled: Story = {
  render: () => ({ Component: Demo, props: { variant: "Disabled" } }),
};
export const Recovery: Story = {
  render: () => ({ Component: Demo, props: { variant: "Recovery" } }),
};
export const Directory: Story = {
  render: () => ({ Component: Demo }),
};
export const CreateProjectDialog: Story = {
  render: () => ({ Component: Demo }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement),
      body = within(canvasElement.ownerDocument.body);
    await userEvent.click(
      await canvas.findByRole("button", { name: "New project" }),
    );
    const dialog = within(await body.findByRole("dialog"));
    await waitFor(() =>
      expect(
        dialog.getByRole("region", { name: "Metadata home" }),
      ).toBeVisible(),
    );
    await expect(
      dialog.getByRole("region", { name: "Project details" }),
    ).toBeVisible();
    await expect(
      dialog.getByRole("textbox", { name: "Project title" }),
    ).toBeVisible();
  },
};
export const Activity: Story = {
  render: () => ({ Component: Demo, props: { variant: "Activity" } }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = within(
      await canvas.findByRole("list", { name: "Repository activity" }),
    );
    await waitFor(() => expect(list.getAllByRole("listitem")).toHaveLength(2));
    await expect(
      canvas.getAllByRole("list", { name: "Repository activity" }),
    ).toHaveLength(1);
    await userEvent.click(
      list.getAllByRole("button", {
        name: "Open commit Keep recorded repository context",
      })[0],
    );
    await expect(canvas.getByLabelText("Host navigation")).toHaveTextContent(
      "Open commit: portable-beta:",
    );
  },
};
export const Repositories: Story = {
  render: () => ({ Component: Demo, props: { variant: "Repositories" } }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      (await canvas.findAllByRole("img", { name: "15 commits" })).length,
    ).toBe(2);
    await userEvent.click(
      canvas.getAllByRole("button", { name: "Projects and tasks" })[0],
    );
    await expect(
      await canvas.findByRole("heading", { name: "Projects", level: 1 }),
    ).toBeVisible();
  },
};
export const LinkedRepositories: Story = {
  render: () => ({ Component: Demo, props: { variant: "LinkedRepositories" } }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement),
      body = within(canvasElement.ownerDocument.body);
    await userEvent.click(
      await canvas.findByRole("button", {
        name: "Retire link to unavailable-code",
      }),
    );
    await userEvent.click(
      await canvas.findByRole("button", {
        name: "Restore link to unavailable-code",
      }),
    );
    await expect(
      await canvas.findByRole("button", {
        name: "Retire link to unavailable-code",
      }),
    ).toBeEnabled();
    await userEvent.click(
      canvas.getByRole("button", { name: "Link repository" }),
    );
    const dialog = await body.findByRole("dialog", { name: "Link repository" });
    await waitFor(() => expect(dialog).toBeVisible());
  },
};
export const Filters: Story = {
  render: () => ({ Component: Demo, props: { variant: "Filters" } }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement),
      body = within(canvasElement.ownerDocument.body);
    await userEvent.click(
      await canvas.findByRole("button", { name: "Filters for tasks" }),
    );
    const dialog = within(
      await body.findByRole("dialog", { name: "Filters for tasks" }),
    );
    await userEvent.click(dialog.getByRole("button", { name: "Task state" }));
    const active = await body.findByRole("menuitemradio", {
      name: "Active",
      checked: true,
    });
    await waitFor(() => expect(active).toBeVisible());
    await userEvent.click(body.getByRole("menuitemradio", { name: /^All$/ }));
    await userEvent.click(
      dialog.getByRole("button", { name: "Close filters" }),
    );
    await userEvent.click(canvas.getByRole("button", { name: "Search tasks" }));
    await expect(
      canvas.queryByRole("tab", { name: "Tasks" }),
    ).not.toBeInTheDocument();
    const search = canvas.getByRole("textbox", { name: "Search tasks" });
    await userEvent.type(search, "Preserve{enter}");
    await expect(
      await canvas.findByRole("button", {
        name: "Open task Preserve repository context",
      }),
    ).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await expect(canvas.getByRole("tab", { name: "Tasks" })).toBeVisible();
  },
};
export const DetailsRail: Story = {
  render: () => ({ Component: Demo, props: { variant: "DetailsRail" } }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // A narrow shell may put this rail into an overlay; the toggle restores it.
    const copy = await canvas.findByRole("button", { name: "Copy Link" });
    if (!copy.checkVisibility())
      await userEvent.click(
        canvas.getByRole("button", { name: "Toggle details" }),
      );
    await userEvent.click(copy);
    await expect(canvas.getByLabelText("Host navigation")).toHaveTextContent(
      "Copied route: alpha:project-0:task-1",
    );
    await userEvent.click(canvas.getByRole("link", { name: /^Tasks$/ }));
    await expect(
      await canvas.findByRole("heading", { name: "Tasks", level: 1 }),
    ).toBeVisible();
  },
};

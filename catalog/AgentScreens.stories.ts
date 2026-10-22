import { feedbackReview } from "./agents/support/composer-feedback.js";
import { verifyInlineCommentFormatting } from "./agents/support/comment-formatting.js";
import ReferenceDemo from "./agents/references/ReferenceDemo.svelte";
import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, within, userEvent, waitFor } from "storybook/test";
import { AgentWorkbench } from "../packages/agent-ui/src/screens/index.js";
import AgentDemo from "./AgentDemo.svelte";
import { agentSource } from "./example-sources.js";
import { References as referenceSource } from "../packages/agent-ui/src/chat/transcript/AgentTranscript.example-sources.js";
const meta = {
  id: "agent-complete-screens",
  title: "Agents/Complete screens",
  component: AgentWorkbench,
  tags: ["visual-pending"],
  parameters: {
    layout: "fullscreen",
    docs: { source: { code: agentSource, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof AgentWorkbench>;
export default meta;
type Story = StoryObj<typeof AgentDemo>;
export const Chat: Story = {
  render: () => ({ Component: AgentDemo, props: { screen: "chat" } }),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("region", { name: "AI conversation" }),
    ).toBeVisible();
  },
};
export const History: Story = {
  render: () => ({ Component: AgentDemo, props: { screen: "history" } }),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("tree", { name: "Conversation history" }),
    ).toBeVisible();
  },
};
export const Catalog: Story = {
  render: () => ({ Component: AgentDemo, props: { screen: "catalog" } }),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("tree", { name: "AI catalog" }),
    ).toBeVisible();
    const skill = within(canvasElement).getByRole("treeitem", {
      name: /^Research$/,
    });
    const icon = skill.querySelector('[data-ui-component="file-type-icon"]');
    await expect(icon).toBeVisible();
    await expect(icon).toHaveAttribute("data-file-type-icon", "markdown");
    await expect(icon).toHaveAttribute("aria-hidden", "true");
    await expect(icon).toHaveAttribute("data-size", "md");
    const originalSlot = canvasElement.querySelector("svg.ai-catalog__icon");
    await expect(originalSlot).toBeVisible();
    const size = getComputedStyle(originalSlot!);
    await expect(icon).toHaveStyle({ width: size.width, height: size.height });
    await userEvent.click(
      within(skill).getByRole("button", { name: /^Open Research$/ }),
    );
    await waitFor(() => expect(skill).toHaveAttribute("aria-selected", "true"));
  },
};
export const Imports: Story = {
  render: () => ({ Component: AgentDemo, props: { screen: "imports" } }),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByTestId("ai-import-panel"),
    ).toBeVisible();
  },
};
export const Recorded: Story = {
  render: () => ({ Component: AgentDemo, props: { screen: "recorded" } }),
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByRole("region", {
        name: "Captured conversation",
      }),
    ).toBeVisible();
  },
};
export const Requests: Story = {
  render: () => ({ Component: AgentDemo, props: { requests: true } }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("button", { name: "Allow once" }));
    await waitFor(() =>
      expect(c.getByTestId("ai-question-card")).toBeVisible(),
    );
    await expect(
      c.getByTestId("ai-question-card").getBoundingClientRect().width,
    ).toBeGreaterThan(200);
    const permission = c.getByRole("button", {
      name: "Permission granted: Request to read project files",
    });
    await expect(permission).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(permission);
    await expect(c.getByTestId("ai-approval-card")).toHaveAttribute(
      "data-state",
      "approved",
    );
    await userEvent.click(permission);
    await expect(c.queryByTestId("ai-approval-card")).not.toBeInTheDocument();
    await userEvent.click(c.getByRole("radio", { name: /^Development/ }));
    await userEvent.click(c.getByRole("button", { name: "Submit answer" }));
    await userEvent.click(
      await c.findByRole("button", {
        name: "Response submitted: Your input is needed",
      }),
    );
    await waitFor(() =>
      expect(c.getByTestId("ai-question-card")).toHaveAttribute(
        "data-state",
        "answered",
      ),
    );
  },
};
export const Empty: Story = {
  render: () => ({ Component: AgentDemo, props: { empty: true } }),
};
export const BusyQueue: Story = {
  render: () => ({ Component: AgentDemo, props: { busy: true } }),
};
export const NavigationRetainsDraft: Story = {
  render: () => ({ Component: AgentDemo }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const editor = () =>
      within(c.getByRole("group", { name: "Message composer" })).getByRole(
        "textbox",
        { name: "Message" },
      );
    await userEvent.click(editor());
    await userEvent.type(editor(), "Retained authored draft");
    await userEvent.click(
      c.getByRole("button", { name: "Switch to Classic view" }),
    );
    await expect(editor()).toHaveTextContent("Retained authored draft");
    await userEvent.click(
      c.getByRole("button", { name: "Switch to Document view" }),
    );
    await expect(editor()).toHaveTextContent("Retained authored draft");
  },
};
export const CatalogToggle: Story = {
  render: () => ({ Component: AgentDemo, props: { screen: "catalog" } }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.type(
      c.getByRole("searchbox", { name: "Filter catalog" }),
      "Read file",
    );
    const checkbox = await c.findByRole("checkbox", {
      name: "Enable Read file for the next chat",
    });
    await expect(checkbox).toBeChecked();
    await userEvent.click(checkbox);
    await expect(checkbox).not.toBeChecked();
  },
};

export const AllMessages: Story = {
  render: () => ({ Component: AgentDemo, props: { scenario: "all" } }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const body = () =>
      within(c.getByRole("group", { name: "Message composer" }))
        .getByRole("textbox", { name: "Message" })
        .closest('[data-ui-part="body"]')!;
    await expect(
      parseFloat(getComputedStyle(body()).borderTopWidth),
    ).toBeGreaterThan(0);
    const banner = c
      .getByText("Context window is 90% full.")
      .closest('[data-ui-component="composer-status-banner"]')!;
    await expect(body().getBoundingClientRect().bottom).toBeGreaterThan(
      banner.getBoundingClientRect().top,
    );
    await userEvent.click(
      c.getByRole("button", { name: "Switch to Classic view" }),
    );
    await expect(
      parseFloat(getComputedStyle(body()).borderTopWidth),
    ).toBeGreaterThan(0);
    await userEvent.click(
      c.getByRole("button", { name: "Switch to Document view" }),
    );
    await expect(
      parseFloat(getComputedStyle(body()).borderTopWidth),
    ).toBeGreaterThan(0);
  },
};
export const InlineComments: Story = {
  render: () => ({ Component: AgentDemo, props: { scenario: "comments" } }),
  play: verifyInlineCommentFormatting,
};
export const ChatError: Story = {
  render: () => ({ Component: AgentDemo, props: { scenario: "error" } }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const draft = within(
      c.getByRole("group", { name: "Message composer" }),
    ).getByRole("textbox", { name: "Message" });
    await expect(draft).toHaveTextContent("Retain my exact authored draft.");
    const metadata = await c.findByRole("group", {
      name: "Composer feedback",
    });
    await expect(
      parseFloat(
        getComputedStyle(draft.closest('[data-ui-part="body"]')!)
          .borderTopWidth,
      ),
    ).toBeGreaterThan(0);
    const banner = metadata.closest(
      '[data-ui-component="composer-status-banner"]',
    )!;
    await expect(banner).toHaveAttribute("data-status", "error");
    await expect(getComputedStyle(metadata).fontSize).toBe(
      getComputedStyle(banner).fontSize,
    );
    await expect(getComputedStyle(metadata).lineHeight).toBe(
      getComputedStyle(banner).lineHeight,
    );
    await expect(metadata).toHaveTextContent(
      "The simulated host refused this action.",
    );
    expect(metadata.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      draft.getBoundingClientRect().bottom,
    );
  },
};
export const RefusedSubmission: Story = {
  play: feedbackReview("error"),
  render: () => ({ Component: AgentDemo, props: { scenario: "refused" } }),
};
export const UnknownSubmission: Story = {
  play: feedbackReview("warning"),
  render: () => ({ Component: AgentDemo, props: { scenario: "unknown" } }),
};

export const ChatReferences: StoryObj<typeof ReferenceDemo> = {
  parameters: {
    docs: { source: { code: referenceSource, language: "tsx", type: "code" } },
  },
  render: () => ({ Component: ReferenceDemo, props: { part: "screen" } }),
};
export const ChatJJStoreReferences: StoryObj<typeof ReferenceDemo> = {
  parameters: {
    docs: { source: { code: referenceSource, language: "tsx", type: "code" } },
  },
  render: () => ({
    Component: ReferenceDemo,
    props: { part: "screen", legacy: true },
  }),
};
export const ChatHostRouting: StoryObj<typeof ReferenceDemo> = {
  parameters: {
    docs: { source: { code: referenceSource, language: "tsx", type: "code" } },
  },
  render: () => ({
    Component: ReferenceDemo,
    props: { part: "screen", legacy: true, dispatch: true },
  }),
};
export const ChatReferencesClassic: StoryObj<typeof ReferenceDemo> = {
  parameters: {
    docs: { source: { code: referenceSource, language: "tsx", type: "code" } },
  },
  render: () => ({
    Component: ReferenceDemo,
    props: { part: "screen", classic: true },
  }),
};

export const ChatReadOnlyReferences: StoryObj<typeof ReferenceDemo> = {
  parameters: {
    docs: { source: { code: referenceSource, language: "tsx", type: "code" } },
  },
  render: () => ({
    Component: ReferenceDemo,
    props: { part: "screen", disabledActions: true },
  }),
};

export const PermissionCommand: Story = {
  render: () => ({
    Component: AgentDemo,
    props: { requests: true, requestVariant: "terminal" },
  }),
};
export const PermissionScopes: Story = {
  render: () => ({
    Component: AgentDemo,
    props: { requests: true, requestVariant: "scoped" },
  }),
};
export const RequestsClassic: Story = {
  render: () => ({
    Component: AgentDemo,
    props: { requests: true, questionVariant: "multiple", view: "classic" },
  }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("button", { name: "Allow once" }));
    await userEvent.click(
      await c.findByRole("checkbox", { name: /^Search API/ }),
    );
    await userEvent.click(
      c.getByRole("button", { name: "Switch to Document view" }),
    );
    await expect(
      await c.findByRole("checkbox", { name: /^Search API/ }),
    ).toHaveAttribute("aria-checked", "true");
    await userEvent.click(c.getByRole("checkbox", { name: /^UI components/ }));
    await userEvent.click(c.getByRole("button", { name: "Submit answer" }));
    await userEvent.click(
      await c.findByRole("button", {
        name: "Response submitted: Your input is needed",
      }),
    );
    await waitFor(() =>
      expect(c.getByTestId("ai-question-card")).toHaveAttribute(
        "data-state",
        "answered",
      ),
    );
  },
};
export const RequestsFreeText: Story = {
  render: () => ({
    Component: AgentDemo,
    props: { requests: true, questionVariant: "character-count" },
  }),
};
export const RequestRefused: Story = {
  play: feedbackReview("error", true),
  render: () => ({
    Component: AgentDemo,
    props: { requests: true, fault: "failed" },
  }),
};
export const RequestUnknown: Story = {
  play: feedbackReview("warning", true),
  render: () => ({
    Component: AgentDemo,
    props: { requests: true, fault: "unknown" },
  }),
};

export const PermissionDenied: Story = {
  render: () => ({
    Component: AgentDemo,
    props: { requests: true, view: "classic" },
  }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("button", { name: "Deny" }));
    const row = await c.findByRole("button", {
      name: "Permission denied: Request to read project files",
    });
    await expect(row).toHaveAttribute("aria-expanded", "false");
    await expect(row).toHaveAttribute("data-tone", "destructive");
    await expect(getComputedStyle(row.querySelector("svg")!).color).toBe(
      getComputedStyle(row).color,
    );
    await expect(
      parseFloat(getComputedStyle(row.closest("li")!).marginBottom),
    ).toBeLessThanOrEqual(4);
    await userEvent.click(row);
    const captured = c.getByTestId("ai-approval-card");
    await expect(captured).toHaveAttribute("data-state", "denied");
    await expect(
      within(captured).getByRole("list", { name: "Requested resources" }),
    ).toBeVisible();
    await expect(
      within(captured).queryByRole("button", { name: "Allow once" }),
    ).not.toBeInTheDocument();
    await expect(c.getByRole("radio", { name: /^Other/ })).toBeVisible();
  },
};
export const RequestsOther: Story = {
  render: () => ({
    Component: AgentDemo,
    props: { requests: true, questionVariant: "numbers" },
  }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("button", { name: "Allow once" }));
    await userEvent.click(await c.findByRole("radio", { name: /^Other/ }));
    await userEvent.type(
      c.getByRole("textbox", { name: "Environment answer" }),
      "A completely separate environment",
    );
    await userEvent.click(c.getByRole("button", { name: "Submit answer" }));
    await expect(
      await c.findByRole("button", {
        name: "Response submitted: Your input is needed",
      }),
    ).toHaveAttribute("aria-expanded", "false");
    await expect(
      c.getByRole("button", {
        name: "Permission granted: Request to read project files",
      }),
    ).toHaveAttribute("aria-expanded", "false");
  },
};

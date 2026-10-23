import type { Meta, StoryObj } from "@storybook/svelte-vite";
import { expect, within, userEvent } from "storybook/test";
import Transcript from "./AgentTranscript.svelte";
import Fixture from "./AgentTranscript.stories.fixture.svelte";
import { Basic as source } from "./AgentTranscript.example-sources.js";
import { verifyChatError } from "../../../../../catalog/agents/support/composer-feedback.js";
const meta = {
  title: "Agents/Chat/Transcript",
  component: Transcript,
  tags: ["visual-pending"],
  parameters: {
    docs: { source: { code: source, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Transcript>;
export default meta;
type Story = StoryObj<typeof Fixture>;
export const RejectedHostPermission: Story = {
  render: () => ({
    Component: Fixture,
    props: {
      scenario: "approval",
      part: "screen",
      failHostResponse: true,
      hostedFeedback: true,
    },
  }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("button", { name: "Allow once" }));
    await expect(c.findByText("Host response failed")).resolves.toBeVisible();
    expect(c.getByTestId("ai-approval-card")).toHaveAttribute(
      "data-state",
      "refused",
    );
  },
};
export const RejectedHostQuestion: Story = {
  render: () => ({
    Component: Fixture,
    props: {
      scenario: "question",
      part: "screen",
      failHostResponse: true,
      hostedFeedback: true,
    },
  }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("radio", { name: "Allow once" }));
    await userEvent.click(c.getByRole("button", { name: "Submit answer" }));
    await expect(c.findByText("Host response failed")).resolves.toBeVisible();
    expect(c.getByTestId("ai-question-card")).toHaveAttribute(
      "data-state",
      "refused",
    );
  },
};
export const CapturedRefusalFeedback: Story = {
  render: () => ({
    Component: Fixture,
    props: {
      scenario: "refused",
      part: "screen",
      hostedFeedback: true,
      capturedFeedback: true,
    },
  }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("button", { name: "Send message" }));
    for (const next of ["Classic", "Document"]) {
      await expect(
        c.getByRole("alert", { name: "Turn interrupted" }),
      ).toBeVisible();
      expect(c.getAllByRole("alert")).toHaveLength(1);
      expect(c.queryByRole("group", { name: "Composer feedback" })).toBeNull();
      expect(
        within(c.getByRole("group", { name: "Message composer" })).getByRole(
          "textbox",
          { name: "Message" },
        ),
      ).toHaveTextContent("Retain my exact authored draft.");
      await userEvent.click(
        c.getByRole("button", { name: `Switch to ${next} view` }),
      );
    }
    expect(c.getByTestId("agent-story-state")).toHaveAttribute(
      "data-calls",
      "1",
    );
  },
};
export const HostedRefusalFeedback: Story = {
  render: () => ({
    Component: Fixture,
    props: { scenario: "refused", part: "screen", hostedFeedback: true },
  }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("button", { name: "Send message" }));
    await verifyChatError({ canvasElement });
    await userEvent.click(
      c.getByRole("button", { name: "Switch to Classic view" }),
    );
    await verifyChatError({ canvasElement });
  },
};
export const Basic: Story = {
  name: "All supported messages",
  render: () => ({ Component: Fixture, props: { scenario: "all" } }),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("region", { name: "AI conversation" }),
    ).toBeVisible();
  },
};
export const Classic: Story = {
  name: "All messages in Classic",
  render: () => ({
    Component: Fixture,
    props: { scenario: "all", view: "classic" },
  }),
};
export const InlineComments: Story = {
  render: () => ({ Component: Fixture, props: { scenario: "comments" } }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const toggle = c.getAllByRole("button", {
      name: "Comment formatting options",
    })[0];
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(
      c.getByRole("group", { name: "Comment formatting" }),
    ).toBeVisible();
    await userEvent.click(toggle);
    await expect(
      c.queryByRole("group", { name: "Comment formatting" }),
    ).not.toBeInTheDocument();
  },
};
export const StaleComments: Story = {
  render: () => ({ Component: Fixture, props: { scenario: "stale" } }),
};
export const Streaming: Story = {
  render: () => ({ Component: Fixture, props: { scenario: "streaming" } }),
};
export const QueuedMessages: Story = {
  render: () => ({ Component: Fixture, props: { scenario: "queue" } }),
};
export const Error: Story = {
  render: () => ({ Component: Fixture, props: { scenario: "error" } }),
};
export const Loading: Story = {
  render: () => ({ Component: Fixture, props: { scenario: "loading" } }),
};
export const Empty: Story = {
  render: () => ({ Component: Fixture, props: { scenario: "empty" } }),
};

export const ClassicError: Story = {
  render: () => ({
    Component: Fixture,
    props: { scenario: "error", view: "classic" },
  }),
};
export const Typography: Story = {
  render: () => ({ Component: Fixture, props: { scenario: "typography" } }),
};

async function reviewQueuedPermission(canvasElement: HTMLElement) {
  const c = within(canvasElement);
  const editor = within(
    await c.findByRole("group", { name: "Message composer" }),
  ).getByRole("textbox", { name: "Message" });
  await expect(c.getByRole("button", { name: "Allow once" })).toBeVisible();
  await userEvent.type(editor, "Retain this queued follow-up");
  await expect(c.getByRole("button", { name: "Queue message" })).toBeEnabled();
  await expect(c.getByTestId("agent-story-state")).toHaveAttribute(
    "data-calls",
    "0",
  );
  await expect(c.queryByRole("button", { name: "Stop agent" })).toBeNull();
  await userEvent.click(c.getByRole("button", { name: "Queue message" }));
  await expect(
    c.findByRole("region", { name: "Queued messages" }),
  ).resolves.toHaveTextContent("Retain this queued follow-up");
  await expect(c.getByRole("button", { name: "Allow once" })).toBeVisible();
  await expect(c.getByTestId("agent-story-state")).toHaveAttribute(
    "data-calls",
    "1",
  );
}
export const QueuedPermission: Story = {
  render: () => ({
    Component: Fixture,
    props: { scenario: "approval", queueWhileAwaitingApproval: true },
  }),
  play: ({ canvasElement }) => reviewQueuedPermission(canvasElement),
};
export const ClassicQueuedPermission: Story = {
  render: () => ({
    Component: Fixture,
    props: {
      scenario: "approval",
      view: "classic",
      queueWhileAwaitingApproval: true,
    },
  }),
  play: ({ canvasElement }) => reviewQueuedPermission(canvasElement),
};

export const SendAnchoredComment: Story = {
  render: () => ({
    Component: Fixture,
    props: { scenario: "comments", tableComment: true },
  }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("button", { name: "Send message" }));
    await expect(c.getByTestId("agent-story-state")).toHaveAttribute(
      "data-calls",
      "1",
    );
    await expect(c.getByTestId("agent-story-state")).toHaveAttribute(
      "data-submission",
      expect.stringContaining("Keep this captured wording."),
    );
  },
};

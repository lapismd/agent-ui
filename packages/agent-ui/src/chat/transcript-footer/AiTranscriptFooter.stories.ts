import { expect, within, userEvent, waitFor } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Footer from "./AiTranscriptFooter.svelte";
import Fixture from "../transcript/AgentTranscript.stories.fixture.svelte";
import { Basic as source } from "./AiTranscriptFooter.example-sources.js";
const meta = {
  title: "Agents/Chat/Footer",
  component: Footer,
  tags: ["visual-pending"],
  parameters: {
    docs: { source: { code: source, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Footer>;
export default meta;
type Story = StoryObj<typeof Fixture>;
export const Basic: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const editor = within(
      c.getByRole("group", { name: "Message composer" }),
    ).getByRole("textbox", { name: "Message" });
    await userEvent.type(editor, "Send through the in-memory host");
    await userEvent.click(c.getByRole("button", { name: "Send message" }));
    await waitFor(() =>
      expect(c.getByTestId("agent-story-state")).toHaveAttribute(
        "data-draft",
        "",
      ),
    );
    await expect(editor).not.toHaveTextContent(
      "Send through the in-memory host",
    );
    await expect(
      c.getByRole("button", { name: "Send message" }),
    ).toBeDisabled();
    await expect(c.getByTestId("agent-story-state")).toHaveAttribute(
      "data-calls",
      "1",
    );
  },
  render: () => ({ Component: Fixture, props: { part: "footer" } }),
};
export const BusyStop: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "footer", scenario: "busy" },
  }),
};
export const Attachments: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Attach file" }),
    );
    const c = within(canvasElement.ownerDocument.body);
    const item = await c.findByRole("option", { name: /settings.ts/ });
    await waitFor(() =>
      expect(
        item.querySelector('[data-file-type-icon="typescript"]'),
      ).toBeVisible(),
    );
    await expect(
      item.querySelector('[data-ui-component="file-type-icon"]'),
    ).toHaveAttribute("data-size", "md");
    await userEvent.click(item);
    await waitFor(() =>
      expect(
        c.queryByRole("listbox", { name: "Vault files" }),
      ).not.toBeInTheDocument(),
    );
  },
  render: () => ({
    Component: Fixture,
    props: { part: "footer", scenario: "attachments" },
  }),
};
export const Error: Story = {
  render: () => ({
    Component: Fixture,
    props: { part: "footer", scenario: "error" },
  }),
};

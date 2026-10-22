import { expect, within, userEvent } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "./AiQuestionCard.svelte";
import Fixture from "../approval-card/AiApprovalCard.stories.fixture.svelte";
import { Basic as source } from "./AiQuestionCard.example-sources.js";
const meta = {
  title: "Agents/Requests/Questions",
  component: Component,
  tags: ["visual-pending"],
  parameters: {
    docs: { source: { code: source, language: "tsx", type: "code" } },
  },
} satisfies Meta<typeof Component>;
export default meta;
type Story = StoryObj<typeof Fixture>;
export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Single-choice answers start unselected and require explicit submission.",
      },
    },
  },
  render: () => ({ Component: Fixture, props: { question: true } }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByText("A")).toHaveAttribute("aria-hidden", "true");
    await expect(
      c.getByRole("button", { name: "Submit answer" }),
    ).toBeDisabled();
    await userEvent.click(c.getByRole("radio", { name: /^Development/ }));
    await userEvent.click(c.getByRole("button", { name: "Submit answer" }));
    await expect(await c.findByText("Acknowledged answer")).toBeVisible();
    await expect(c.getByTestId("ai-question-card")).toHaveAttribute(
      "data-state",
      "answered",
    );
    await userEvent.click(c.getByRole("button", { name: "Reset example" }));
  },
};
export const MultipleChoice: Story = {
  parameters: {
    docs: {
      description: {
        story: "Select several components with independent checkbox controls.",
      },
    },
  },
  render: () => ({
    Component: Fixture,
    props: { question: true, variant: "multiple" },
  }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByText("A").getBoundingClientRect().right).toBeLessThan(
      c.getByRole("checkbox", { name: /^Search API/ }).getBoundingClientRect()
        .left,
    );
    await userEvent.click(c.getByRole("checkbox", { name: /^Search API/ }));
    await userEvent.click(c.getByRole("checkbox", { name: /^UI components/ }));
    await expect(c.getAllByRole("checkbox", { checked: true })).toHaveLength(2);
    await userEvent.click(c.getByRole("button", { name: "Submit answer" }));
    await expect(await c.findByText("Acknowledged answer")).toBeVisible();
    await userEvent.click(c.getByRole("button", { name: "Reset example" }));
    await userEvent.click(c.getByRole("checkbox", { name: /^Search API/ }));
    await userEvent.click(c.getByRole("checkbox", { name: /^UI components/ }));
  },
};
export const FreeText: Story = {
  parameters: {
    docs: {
      description: {
        story: "A multiline answer with placeholder and helper text.",
      },
    },
  },
  render: () => ({
    Component: Fixture,
    props: { question: true, variant: "free-text" },
  }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const field = c.getByRole("textbox", { name: "Requirements answer" });
    await expect(field).toHaveStyle({
      backgroundColor: getComputedStyle(canvasElement.ownerDocument.body)
        .backgroundColor,
    });
    await userEvent.type(field, "Search documentation and code.");
    await expect(field).toHaveValue("Search documentation and code.");
    await userEvent.click(c.getByRole("button", { name: "Submit answer" }));
    await expect(await c.findByText("Acknowledged answer")).toBeVisible();
    await userEvent.click(c.getByRole("button", { name: "Reset example" }));
    await userEvent.type(
      c.getByRole("textbox", { name: "Requirements answer" }),
      "Search documentation and code. Include file-type and date filters.",
    );
  },
};
export const CharacterCount: Story = {
  parameters: {
    docs: {
      description: {
        story: "An optional host-advertised 1000-character limit and counter.",
      },
    },
  },
  render: () => ({
    Component: Fixture,
    props: { question: true, variant: "character-count" },
  }),
};
export const Other: Story = {
  parameters: {
    docs: {
      description: {
        story: "A custom answer participates in the same explicit submission.",
      },
    },
  },
  render: () => ({
    Component: Fixture,
    props: { question: true, variant: "other" },
  }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("radio", { name: /^Other/ }));
    await userEvent.type(
      c.getByRole("textbox", { name: "Environment answer" }),
      "A local sandbox",
    );
    await userEvent.click(c.getByRole("button", { name: "Submit answer" }));
    await expect(await c.findByText("Acknowledged answer")).toBeVisible();
    await userEvent.click(c.getByRole("button", { name: "Reset example" }));
    await userEvent.click(c.getByRole("radio", { name: /^Other/ }));
    await userEvent.type(
      c.getByRole("textbox", { name: "Environment answer" }),
      "A local sandbox",
    );
  },
};
export const Secret: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A masked answer remains transient and is omitted from the result.",
      },
    },
  },
  render: () => ({
    Component: Fixture,
    props: { question: true, variant: "secret" },
  }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const field = c.getByLabelText("Requirements answer");
    await expect(field).toHaveStyle({
      backgroundColor: getComputedStyle(canvasElement.ownerDocument.body)
        .backgroundColor,
    });
    await expect(field).toHaveAttribute("type", "password");
    await userEvent.type(field, "transient-private-token");
    await userEvent.click(c.getByRole("button", { name: "Submit answer" }));
    await expect(await c.findByText("Acknowledged answer")).toBeVisible();
    await expect(canvasElement.textContent).not.toContain(
      "transient-private-token",
    );
  },
};
export const SeveralQuestions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Multiple questions with independent drafts and an optional textarea.",
      },
    },
  },
  render: () => ({
    Component: Fixture,
    props: { question: true, variant: "several" },
  }),
};
export const Answered: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Completed questions show acknowledgement without exposing answer values.",
      },
    },
  },
  render: () => ({
    Component: Fixture,
    props: { question: true, status: "answered" },
  }),
};
export const Submitting: Story = {
  parameters: {
    docs: {
      description: { story: "An in-flight response disables all controls." },
    },
  },
  render: () => ({
    Component: Fixture,
    props: { question: true, status: "submitting" },
  }),
};
export const Refused: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Refusal keeps the complete authored answer available for explicit retry.",
      },
    },
  },
  render: () => ({
    Component: Fixture,
    props: { question: true, variant: "free-text", fault: "failed" },
  }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const field = c.getByRole("textbox", { name: "Requirements answer" });
    await userEvent.type(field, "Retain this exact answer.");
    await userEvent.click(c.getByRole("button", { name: "Submit answer" }));
    await expect(c.getByTestId("ai-question-card")).toHaveAttribute(
      "data-state",
      "refused",
    );
    await expect(field).toHaveValue("Retain this exact answer.");
  },
};
export const UnknownOutcome: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "An unresolved response remains read-only pending a host status check.",
      },
    },
  },
  render: () => ({
    Component: Fixture,
    props: { question: true, status: "unknown" },
  }),
};
export const Cancelled: Story = {
  parameters: {
    docs: {
      description: {
        story: "Cancellation is distinct from an answered or denied request.",
      },
    },
  },
  render: () => ({
    Component: Fixture,
    props: { question: true, status: "cancelled" },
  }),
};
export const Unavailable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "An icon-bearing Empty describes unavailable interaction support.",
      },
    },
  },
  render: () => ({
    Component: Fixture,
    props: { question: true, status: "unavailable" },
  }),
};
export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: "Disabled questions retain their labelled options.",
      },
    },
  },
  render: () => ({
    Component: Fixture,
    props: { question: true, disabled: true },
  }),
};

export const NumberedOptions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Numeric option badges with the same accessible radio controls and custom answer.",
      },
    },
  },
  render: () => ({
    Component: Fixture,
    props: { question: true, variant: "numbers" },
  }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByText("1").getBoundingClientRect().right).toBeLessThan(
      c.getByRole("radio", { name: /^Development/ }).getBoundingClientRect()
        .left,
    );
    for (const label of ["1", "2", "3", "4"]) {
      await expect(c.getByText(label)).toHaveAttribute("aria-hidden", "true");
      await expect(
        getComputedStyle(c.getByText(label)).backgroundColor,
      ).not.toBe("rgba(0, 0, 0, 0)");
    }
    await userEvent.click(c.getByRole("radio", { name: /^Development/ }));
    await userEvent.keyboard("{ArrowDown}");
    await expect(c.getByRole("radio", { name: /^Staging/ })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  },
};
export const UnlabelledOptions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Hosts can omit decorative labels without changing option identities.",
      },
    },
  },
  render: () => ({
    Component: Fixture,
    props: { question: true, variant: "no-labels" },
  }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.queryByText("A")).not.toBeInTheDocument();
    await expect(c.getAllByRole("radio")).toHaveLength(4);
  },
};
export const RestrictedChoices: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Only advertised options appear when the host prohibits custom answers.",
      },
    },
  },
  render: () => ({
    Component: Fixture,
    props: { question: true, variant: "restricted" },
  }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(
      c.queryByRole("radio", { name: /^Other/ }),
    ).not.toBeInTheDocument();
    await expect(c.getAllByRole("radio")).toHaveLength(3);
  },
};
export const MultipleChoiceOther: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Choose a completely different answer alone or alongside any advertised choices.",
      },
    },
  },
  render: () => ({
    Component: Fixture,
    props: { question: true, variant: "multiple-other" },
  }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("checkbox", { name: /^Other/ }));
    await expect(
      c.getByRole("button", { name: "Submit answer" }),
    ).toBeDisabled();
    await userEvent.type(
      c.getByRole("textbox", { name: "Components answer" }),
      "An offline indexer",
    );
    await expect(c.getAllByRole("checkbox", { checked: true })).toHaveLength(1);
    await userEvent.click(c.getByRole("button", { name: "Submit answer" }));
    await expect(await c.findByText("Acknowledged answer")).toBeVisible();
    await userEvent.click(c.getByRole("button", { name: "Reset example" }));
    await userEvent.click(c.getByRole("checkbox", { name: /^Search API/ }));
    await userEvent.click(c.getByRole("checkbox", { name: /^Other/ }));
    await userEvent.type(
      c.getByRole("textbox", { name: "Components answer" }),
      "An offline indexer",
    );
  },
};

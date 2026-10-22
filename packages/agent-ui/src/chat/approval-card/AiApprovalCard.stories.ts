import { expect, within, userEvent, waitFor } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/svelte-vite";
import Component from "./AiApprovalCard.svelte";
import Fixture from "./AiApprovalCard.stories.fixture.svelte";
import { Basic as source } from "./AiApprovalCard.example-sources.js";
const meta = {
  title: "Agents/Requests/Permissions",
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
          "Captured files and folders with explicit one-time approval and denial.",
      },
    },
  },
  render: () => ({ Component: Fixture, props: { question: false } }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("button", { name: "Allow once" }));
    await expect(
      await c.findByText("Acknowledged provider/once/7"),
    ).toBeVisible();
    await expect(c.getByTestId("ai-approval-card")).toHaveAttribute(
      "data-state",
      "approved",
    );
    await userEvent.click(c.getByRole("button", { name: "Reset example" }));
  },
};
export const TerminalCommand: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Captured terminal command with the shared code and copy controls.",
      },
    },
  },
  render: () => ({
    Component: Fixture,
    props: { question: false, variant: "terminal" },
  }),
};
export const ScopedChoices: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The in-memory host explicitly advertises project and device scopes.",
      },
    },
  },
  render: () => ({
    Component: Fixture,
    props: { question: false, variant: "scoped" },
  }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement),
      body = within(canvasElement.ownerDocument.body);
    await userEvent.click(
      c.getByRole("button", { name: /^Permission allowance:/ }),
    );
    await userEvent.click(
      await body.findByRole("menuitemradio", {
        name: "Always allow in this project",
      }),
    );
    await expect(c.queryByText(/Acknowledged/)).not.toBeInTheDocument();
    await waitFor(() =>
      expect(body.queryByRole("menu")).not.toBeInTheDocument(),
    );
    await userEvent.click(
      c.getByRole("button", { name: "Always allow in this project" }),
    );
    await expect(
      await c.findByText("Acknowledged provider/project/9"),
    ).toBeVisible();
    await userEvent.click(c.getByRole("button", { name: "Reset example" }));
  },
};
export const Approved: Story = {
  parameters: {
    docs: {
      description: {
        story: "Read-only permission granted; captured resources stay visible.",
      },
    },
  },
  render: () => ({
    Component: Fixture,
    props: { question: false, status: "approved" },
  }),
};
export const Denied: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Read-only permission denied without claiming execution failure.",
      },
    },
  },
  render: () => ({
    Component: Fixture,
    props: { question: false, status: "denied" },
  }),
};
export const Submitting: Story = {
  parameters: {
    docs: {
      description: {
        story: "Response submission disables all competing actions.",
      },
    },
  },
  render: () => ({
    Component: Fixture,
    props: { question: false, status: "submitting" },
  }),
};
export const Refused: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A refused response retains the exact request and selected option.",
      },
    },
  },
  render: () => ({
    Component: Fixture,
    props: { question: false, fault: "failed" },
  }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("button", { name: "Allow once" }));
    await expect(c.getByTestId("ai-approval-card")).toHaveAttribute(
      "data-state",
      "refused",
    );
    await expect(c.getByRole("button", { name: "Allow once" })).toBeEnabled();
  },
};
export const UnknownOutcome: Story = {
  parameters: {
    docs: {
      description: {
        story: "Check the original response outcome without resubmitting.",
      },
    },
  },
  render: () => ({
    Component: Fixture,
    props: { question: false, fault: "unknown" },
  }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole("button", { name: "Allow once" }));
    await expect(c.getByTestId("ai-approval-card")).toHaveAttribute(
      "data-state",
      "unknown",
    );
    await expect(c.getByRole("button", { name: "Allow once" })).toBeDisabled();
    await userEvent.click(c.getByRole("button", { name: "Check response" }));
    await expect(
      await c.findByText("Acknowledged provider/once/7"),
    ).toBeVisible();
  },
};
export const Cancelled: Story = {
  parameters: {
    docs: {
      description: {
        story: "Cancelled requests retain details and offer no response.",
      },
    },
  },
  render: () => ({
    Component: Fixture,
    props: { question: false, status: "cancelled" },
  }),
};
export const Unavailable: Story = {
  parameters: {
    docs: {
      description: {
        story: "An icon-bearing Empty explains unavailable host support.",
      },
    },
  },
  render: () => ({
    Component: Fixture,
    props: { question: false, status: "unavailable" },
  }),
};
export const UnknownOptions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Unfamiliar provider options remain neutral and preserve opaque IDs.",
      },
    },
  },
  render: () => ({
    Component: Fixture,
    props: { question: false, variant: "unknown-options" },
  }),
};
export const LongPaths: Story = {
  parameters: {
    docs: {
      description: {
        story: "Long captured filenames wrap within narrow cards.",
      },
    },
  },
  render: () => ({
    Component: Fixture,
    props: { question: false, variant: "long" },
  }),
};
export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: "Host-disabled controls preserve the request presentation.",
      },
    },
  },
  render: () => ({
    Component: Fixture,
    props: { question: false, disabled: true },
  }),
};

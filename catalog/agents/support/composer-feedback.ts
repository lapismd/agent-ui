import { expect, within, userEvent, waitFor } from "storybook/test";
export function feedbackReview(type: "error" | "warning", request = false) {
  return async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const c = within(canvasElement);
    await userEvent.click(
      c.getByRole("button", { name: request ? "Allow once" : "Send message" }),
    );
    for (const nextView of ["Classic", "Document"]) {
      const composer = c.getByRole("group", { name: "Message composer" });
      await waitFor(() =>
        expect(
          composer.querySelector(
            '[data-ui-component="composer-status-banner"]',
          ),
        ).toHaveAttribute("data-status", type),
      );
      const banner = composer.querySelector(
        '[data-ui-component="composer-status-banner"]',
      )!;
      const editor = within(composer).getByRole("textbox", { name: "Message" });
      expect(banner.getAttribute("data-position")).toBe("bottom");
      expect(
        parseFloat(
          getComputedStyle(editor.closest('[data-ui-part="body"]')!)
            .borderTopWidth,
        ),
      ).toBeGreaterThan(0);
      expect(
        canvasElement.querySelectorAll(
          '.ui-transcript-body-footer [data-ui-component="composer-status-banner"], [data-ui-component="transcript-footer"] [data-ui-component="composer-status-banner"]',
        ),
      ).toHaveLength(0);
      if (!request)
        expect(editor).toHaveTextContent("Retain my exact authored draft.");
      await userEvent.click(
        c.getByRole("button", { name: `Switch to ${nextView} view` }),
      );
    }
  };
}

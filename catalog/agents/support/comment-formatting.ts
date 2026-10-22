import { expect, within, userEvent } from "storybook/test";

export async function verifyInlineCommentFormatting({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) {
  const c = within(canvasElement);
  const toggle = c.getAllByRole("button", {
    name: "Comment formatting options",
  })[0];
  await userEvent.click(toggle);
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(
    c.getByRole("group", { name: "Comment formatting" }),
  ).toBeVisible();
  const composer = toggle.closest('[data-ui-component="comment-composer"]')!;
  const row = composer.querySelector(".ui-comment-composer__card")!;
  const hover = composer.querySelector(".ui-transcript-comment-links")!;
  const toggleBox = toggle.getBoundingClientRect();
  await expect(
    Math.abs(toggleBox.right - row.getBoundingClientRect().right),
  ).toBeLessThanOrEqual(1);
  await expect(
    Math.abs(hover.getBoundingClientRect().top - toggleBox.top),
  ).toBeLessThanOrEqual(1);
  await expect(hover.getBoundingClientRect().right).toBeLessThanOrEqual(
    toggleBox.left,
  );
  await expect(
    within(composer as HTMLElement).getByRole("button", {
      name: "Add emoji to comment",
    }),
  ).toBeVisible();
}

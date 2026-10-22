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
}

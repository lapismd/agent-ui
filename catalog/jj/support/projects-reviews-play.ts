import { expect, userEvent, waitFor, within } from "storybook/test";

/** Preserve the Projects Reviews search and restored-tab acceptance flow. */
export async function exerciseProjectReviews(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  const review = { name: /^Open Review repository context,/ };
  await canvas.findAllByRole("button", review);
  await userEvent.click(canvas.getByRole("button", { name: "Search reviews" }));
  const search = canvas.getByRole("textbox", { name: "Search reviews" });
  await waitFor(() => expect(search).toHaveFocus());
  await expect(canvas.queryByRole("tab", { name: "Reviews" })).toBeNull();
  await userEvent.type(search, "no matching review{enter}");
  await waitFor(() =>
    expect(canvas.queryAllByRole("button", review)).toHaveLength(0),
  );
  await userEvent.clear(search);
  await userEvent.type(search, "linked code{enter}");
  await waitFor(() =>
    expect(canvas.getAllByRole("button", review)).toHaveLength(2),
  );
  await userEvent.keyboard("{Escape}");
  await waitFor(() =>
    expect(canvas.getByRole("tab", { name: "Reviews" })).toBeVisible(),
  );
  await waitFor(() =>
    expect(
      canvas.getByRole("button", { name: "Search reviews" }),
    ).toHaveFocus(),
  );
}

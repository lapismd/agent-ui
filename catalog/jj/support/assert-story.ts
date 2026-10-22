import { expect, waitFor, within, userEvent } from "storybook/test";
export async function assertJjStory(
  canvasElement: HTMLElement,
  part: string,
  variant: string,
) {
  const c = within(canvasElement),
    documentCanvas = within(canvasElement.ownerDocument.body);
  const node = (selector: string) => canvasElement.querySelector(selector);
  await expect(c.getByTestId("jj-story-host")).toBeVisible();
  const selectors: Record<string, string> = {
    RepositoryAuthorAvatar: ".repository-review-author-avatar",
    RepositoryIdentifiers: ".repository-identifiers",
    RepositorySkeleton: ".repository-skeleton",
    RepositoryRevisions: ".repository-revisions",
    RepositoryDiff: ".repository-diff",
  };
  if (selectors[part]) await expect(node(selectors[part])).toBeVisible();
  if (part === "RepositoryPanel" || part === "RepositoryOperations") {
    const region = c.getByRole("region", {
      name:
        part === "RepositoryPanel"
          ? "Repository history"
          : "Repository operation log",
    });
    await expect(region).toBeVisible();
    if (variant === "Loading")
      await expect(region).toHaveAttribute("aria-busy", "true");
    else if (!["Empty", "Unavailable"].includes(variant))
      await waitFor(() =>
        expect(
          region.querySelectorAll(".repository-graph > li").length,
        ).toBeGreaterThan(0),
      );
  }
  if (part === "RepositoryGraph")
    await expect(
      c
        .getByRole("list", { name: "Revision graph" })
        .querySelectorAll(".repository-graph-row").length,
    ).toBe(variant === "Empty" ? 0 : 2);
  if (part === "RepositoryChangedFiles")
    await expect(
      c.getByRole("region", { name: "Changed files" }),
    ).toBeVisible();
  if (part === "RepositoryLogHeader")
    await expect(c.getByRole("group", { name: "JJ Log header" })).toBeVisible();
  if (part === "RepositorySourcePicker")
    await expect(
      c.getByRole("button", { name: /History source:/ }),
    ).toBeVisible();
  if (part === "RepositoryWorkspacePicker")
    await expect(
      c.getByRole("combobox", { name: "Repository workspace" }),
    ).toBeVisible();
  if (part === "RepositoryCommitPicker")
    await expect(
      c.getByRole("combobox", { name: "Compare with parent" }),
    ).toBeVisible();
  if (part === "RepositoryOperationPinPicker")
    await expect(
      c.getByRole("combobox", { name: "Pinned operation" }),
    ).toBeVisible();
  if (part === "RepositoryFileHistory")
    await expect(
      c.getByRole("region", { name: "Active file history" }),
    ).toBeVisible();
  if (part === "RepositoryBlamePanel") {
    await expect(c.getByRole("region", { name: "File blame" })).toBeVisible();
    if (variant === "Basic")
      await waitFor(() =>
        expect(c.getByRole("region", { name: "File blame" })).toHaveTextContent(
          "History is retained",
        ),
      );
  }
  if (part === "RepositoryOperationColumn" && variant === "Basic")
    await expect(
      await c.findByRole("region", { name: "Selected operation" }),
    ).toBeVisible();
  if (part === "RepositoryConflictResolution")
    await expect(
      documentCanvas.getByRole("region", { name: "Resolve native conflicts" }),
    ).toBeVisible();
  if (part === "RepositoryRestoreDialog")
    await waitFor(() =>
      expect(documentCanvas.getByRole("alertdialog")).toBeVisible(),
    );
  if (variant === "OriginalUnavailable")
    await userEvent.click(c.getByRole("button", { name: /History source:/ }));
  if (["Empty", "Unavailable", "OriginalUnavailable"].includes(variant))
    await waitFor(() =>
      expect(
        documentCanvas
          .getAllByRole("status")
          .some((el) => !!el.querySelector('[data-ui-part="empty-media"] svg')),
      ).toBe(true),
    );
  if (variant !== "Unavailable")
    await expect(c.getByTestId("jj-story-state")).toHaveAttribute(
      "data-errors",
      "[]",
    );
}

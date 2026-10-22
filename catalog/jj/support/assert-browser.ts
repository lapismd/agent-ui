import { expect, within, userEvent, waitFor } from "storybook/test";
export async function assertBrowser(
  canvasElement: HTMLElement,
  part: string,
  variant: string,
) {
  const canvas = within(canvasElement);
  if (part === "RepositoryBreadcrumb") {
    await expect(
      canvas.getByRole("navigation", { name: "Repository path" }),
    ).toBeVisible();
    if (variant !== "Basic") {
      await userEvent.click(canvas.getByRole("link", { name: "Files" }));
      await expect(canvas.getByTestId("browser-state")).toHaveAttribute(
        "data-actions",
        "directory:",
      );
    }
    return;
  }
  if (variant === "Loading") {
    await expect(
      await canvas.findByRole("status", {
        name:
          part === "RepositoryFileTree"
            ? "Loading repository file tree"
            : part === "RepositoryFilePreview"
              ? "Loading README.md"
              : "Loading repository directory",
      }),
    ).toBeVisible();
    return;
  }
  if (part === "RepositoryFileTree") {
    if (variant === "Empty")
      await expect(
        await canvas.findByText("No repository files", { exact: true }),
      ).toBeVisible();
    else
      await waitFor(() =>
        expect(
          canvasElement.querySelector('[data-ui-component="file-listing"]'),
        ).toBeVisible(),
      );
    return;
  }
  if (variant === "Empty" && part !== "RepositoryFilePreview") {
    await expect(
      await canvas.findByText("Empty directory", { exact: true }),
    ).toBeVisible();
    return;
  }
  if (variant === "Unavailable" && part !== "RepositoryFilePreview") {
    await expect(
      await canvas.findByText("Directory unavailable", { exact: true }),
    ).toBeVisible();
    await userEvent.click(
      canvas.getByRole("button", { name: "Retry preview" }),
    );
  }
  if (variant === "Retry") {
    await expect(
      await canvas.findByText("File preview unavailable", { exact: true }),
    ).toBeVisible();
    await userEvent.click(
      canvas.getByRole("button", { name: "Retry preview" }),
    );
  }
  if (variant === "Binary")
    await expect(
      await canvas.findByText("Binary file", { exact: true }),
    ).toBeVisible();
  else if (
    variant === "EmptyFile" ||
    (variant === "Empty" && part === "RepositoryFilePreview")
  )
    await expect(
      await canvas.findByText("Empty file", { exact: true }),
    ).toBeVisible();
  else if (
    variant === "UnavailableFile" ||
    (variant === "Unavailable" && part === "RepositoryFilePreview")
  )
    await expect(
      await canvas.findByText("Preview unavailable", { exact: true }),
    ).toBeVisible();
  else if (variant === "History")
    await expect(
      await canvas.findByRole("region", { name: "Active file history" }),
    ).toBeVisible();
  else if (variant === "Blame")
    await expect(
      await canvas.findByRole("region", { name: "File blame" }),
    ).toBeVisible();
  else if (variant === "Source")
    await expect(
      await canvas.findByRole("region", {
        name: "Source preview for src/history/controller.ts",
      }),
    ).toBeVisible();
  else if (
    variant === "Markdown" ||
    variant === "Retry" ||
    part === "RepositoryFilePreview"
  ) {
    await expect(
      await canvas.findByRole("region", {
        name: "Markdown preview for README.md",
      }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Source" }));
    await expect(
      canvas.getByRole("button", {
        name: "Preview",
      }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Preview" }));
    await expect(
      canvas.getByRole("region", { name: "Markdown preview for README.md" }),
    ).toBeVisible();
  } else
    await expect(
      await canvas.findByRole("table", { name: /Repository files|Files in/ }),
    ).toBeVisible();
}

import { expect, test } from "@playwright/test";

test.beforeEach(({ page }) => {
  page.on("pageerror", (error) => {
    throw error;
  });
});

test("changed-file rows and selected diff titles share Design Core file type icons", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=jj-complete-screens-jj-log--dense-history&viewMode=story",
  );
  const files = page.getByRole("region", {
    name: "Changed files",
    exact: true,
  });
  await files.waitFor();
  await files
    .getByRole("radio", { name: "Show files as list", exact: true })
    .click();
  for (const [path, icon] of [
    ["src/history/controller.ts", "typescript"],
    ["docs/history/query-guide.md", "markdown"],
    ["assets/repository-graph.png", "image"],
  ]) {
    const row = files.getByRole("button", { name: path, exact: true });
    await expect(
      row.locator("[data-ui-component='file-type-icon']"),
    ).toHaveAttribute("data-file-type-icon", icon);
    await row.click();
    await expect(
      page.locator(
        ".repository-review-file-title [data-ui-component='file-type-icon']",
      ),
    ).toHaveAttribute("data-file-type-icon", icon);
  }
});

test("attachment search and chips use filename icons without changing removal", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=agent-complete-screens--chat&viewMode=story",
  );
  await page.getByRole("button", { name: "Attach file", exact: true }).click();
  const results = page.getByRole("listbox", {
    name: "Vault files",
    exact: true,
  });
  await expect(
    results.locator("[data-file-type-icon='typescript']"),
  ).toBeVisible();
  await results.getByText("settings.ts", { exact: true }).click();
  const attachment = page.getByRole("button", {
    name: "settings.ts",
    exact: true,
  });
  await expect(
    attachment.locator("[data-file-type-icon='typescript']"),
  ).toHaveCSS("width", "12px");
  await page
    .getByRole("button", { name: "Remove settings.ts", exact: true })
    .click();
  await expect(attachment).toHaveCount(0);
});

test("saved-file preview uses the shared icon in its header", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=agents-chat-turn-changes--file-preview&viewMode=story",
  );
  const preview = page.getByRole("region", {
    name: "Saved changes to notes/review.md",
    exact: true,
  });
  await expect(
    preview.locator("header [data-file-type-icon='markdown']"),
  ).toHaveCSS("width", "16px");
});

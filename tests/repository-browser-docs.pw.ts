import { expect, test } from "@playwright/test";
const screen = (variant: string) =>
  `/iframe.html?id=jj-complete-screens-files--${variant}&viewMode=story`;
test("Files docs: seven families render semantic token tables and bounded examples", async ({
  page,
}) => {
  for (const id of [
    "jj-browsing-breadcrumb",
    "jj-browsing-file-tree",
    "jj-browsing-directory",
    "jj-browsing-file-preview",
    "jj-browsing-reference-picker",
    "jj-browsing-change-card",
    "jj-complete-screens-files",
  ]) {
    await page.goto(`/iframe.html?id=${id}--docs&viewMode=docs`);
    await page
      .locator(".sbdocs-content h1")
      .first()
      .waitFor({ state: "visible" });
    await expect(
      page.getByRole("heading", { name: /Styling variables$/ }),
    ).toBeVisible();
    await expect(
      page.locator("table").filter({ hasText: "--ui-" }).last(),
    ).toContainText("--ui-");
    await expect(page.locator(".sbdocs-content")).toBeVisible();
  }
});

test("Files: safe Markdown shows checked task artwork", async ({ page }) => {
  await page.goto(screen("markdown"));
  const preview = page.getByRole("region", {
    name: "Markdown preview for README.md",
    exact: true,
  });
  const checked = preview.locator("input.task-list-item-checkbox:checked");
  await expect(checked).toHaveCount(2);
  await expect(checked.first()).toHaveAttribute("data-task", "x");
  await expect
    .poll(() =>
      checked
        .first()
        .evaluate((node) => getComputedStyle(node, "::after").backgroundColor),
    )
    .not.toBe("rgba(0, 0, 0, 0)");
});

test("Files: reference changes use shared cards and preserve independent ID actions", async ({
  page,
}) => {
  await page.goto(screen("basic"));
  await page
    .getByRole("combobox", {
      name: "Repository bookmark or change",
      exact: true,
    })
    .click();
  await page.getByRole("tab", { name: "Changes", exact: true }).click();
  const first = page
    .getByRole("row")
    .filter({ hasText: "Extract reusable repository browsing" });
  await expect(
    first.getByRole("group", { name: "Recorded change", exact: true }),
  ).toBeVisible();
  await first.getByRole("button", { name: /Copy Git commit SHA/ }).click();
  await expect(
    page.getByRole("heading", { name: "Switch snapshot", exact: true }),
  ).toBeVisible();
  await expect(page.getByTestId("browser-state")).toHaveAttribute(
    "data-actions",
    /copy:111111/,
  );
  await page
    .getByRole("row")
    .filter({ hasText: "Keep recorded file history beside source previews" })
    .getByText("Keep recorded file history beside source previews", {
      exact: true,
    })
    .click();
  await expect(page.getByTestId("browser-state")).toHaveAttribute(
    "data-pin",
    /"revision":"222222/,
  );
  await expect(
    page.getByRole("heading", { name: "Switch snapshot", exact: true }),
  ).toHaveCount(0);
});

test("Files: public shell headers align across sidebar and body", async ({
  page,
}) => {
  await page.goto(screen("basic"));
  const left = page.locator(
    '[data-ui-part="toolbar"][aria-label="Repository files header"]',
  );
  const main = page.locator(
    '[data-ui-part="toolbar"][aria-label="Repository path header"]',
  );
  await expect(left).toHaveAttribute("data-ui-part", "toolbar");
  await expect(main).toHaveAttribute("data-ui-part", "toolbar");
  const sizes = await Promise.all([left.boundingBox(), main.boundingBox()]);
  expect(Math.abs(sizes[0]!.height - sizes[1]!.height)).toBeLessThanOrEqual(1);
  expect(Math.abs(sizes[0]!.y - sizes[1]!.y)).toBeLessThanOrEqual(1);
});

import { expect, test, type Page } from "@playwright/test";
const errors = new WeakMap<Page, string[]>();
test.beforeEach(({ page }) => {
  const list: string[] = [];
  errors.set(page, list);
  page.on("pageerror", (error) => list.push(error.message));
  page.on("console", (entry) => {
    if (entry.type() === "error") list.push(entry.text());
  });
});
test.afterEach(({ page }) => expect(errors.get(page)).toEqual([]));
const open = async (page: Page, variant = "basic") => {
  await page.goto(
    `/iframe.html?id=jj-complete-screens-branches--${variant}&viewMode=story`,
  );
  await page.getByTestId("branches-state").waitFor({ state: "attached" });
  await expect(page.getByTestId("branches-state")).toHaveAttribute(
    "data-phase",
    variant === "retry" ? "unavailable" : "ready",
  );
};
const state = (page: Page) => page.getByTestId("branches-state");

test("branch, remote, deleted and working-copy selections preserve exact scopes", async ({
  page,
}) => {
  test.setTimeout(60_000); // First cold import can compile the graph/diff/Mira module tree.
  await open(page);
  await expect(
    page.getByRole("region", {
      name: "Changes to src/history/controller.ts",
      exact: true,
    }),
  ).toBeVisible();
  const operation = await state(page).getAttribute("data-operation");
  await page.getByRole("row", { name: /main@origin/ }).click();
  await expect(state(page)).toHaveAttribute(
    "data-selected",
    JSON.stringify({ kind: "bookmark", name: "main", remote: "origin" }),
  );
  await expect(state(page)).toHaveAttribute("data-path", "");
  await page.getByRole("row", { name: /retired\/old-preview/ }).click();
  await expect(state(page)).toHaveAttribute("data-revset", "none()");
  await expect(page.getByText("No revisions", { exact: true })).toBeVisible();
  await page
    .getByRole("button", {
      name: "Working copy review Review the source-adapted branch cards",
      exact: true,
    })
    .click();
  await expect(state(page)).toHaveAttribute(
    "data-selected",
    JSON.stringify({ kind: "workspace", workspace: "review" }),
  );
  await expect(state(page)).toHaveAttribute("data-operation", operation!);
  await expect(
    page.locator('.repository-graph-select[aria-expanded="true"]'),
  ).toHaveCount(1);
  expect(Number(await state(page).getAttribute("data-count"))).toBeGreaterThan(
    1,
  );
});
test("loaded search, filters and nested host actions do not change reference selection", async ({
  page,
}) => {
  await open(page, "host-actions");
  const original = await state(page).getAttribute("data-selected");
  await page
    .getByRole("row", { name: /main default/ })
    .getByRole("button", { name: "Open branch in host" })
    .click();
  await expect(state(page)).toHaveAttribute("data-actions", /branch:/);
  await expect(state(page)).toHaveAttribute("data-selected", original!);
  await page.getByRole("tab", { name: "Conflicted", exact: true }).click();
  await expect(
    page.getByRole("row", { name: /release\/shared-ui/ }),
  ).toBeVisible();
  await expect(page.getByRole("row", { name: /main default/ })).toHaveCount(0);
  await page.getByRole("tab", { name: "All", exact: true }).click();
  await page.getByPlaceholder("Search branches").fill("origin");
  await expect(page.getByRole("row", { name: /main@origin/ })).toBeVisible();
  await page
    .getByPlaceholder("Search branches")
    .fill("not-a-recorded-reference");
  await expect(
    page.getByText("No matching bookmarks", { exact: true }),
  ).toBeVisible();
  await expect(state(page)).toHaveAttribute("data-selected", original!);
});
test("conflicted target union, paging, all-file diff and keyboard resizing use shared components", async ({
  page,
}) => {
  await open(page, "conflicted");
  await expect(state(page)).toHaveAttribute(
    "data-revset",
    /ancestors\([a-f0-9]+\) \| ancestors\([a-f0-9]+\)/,
  );
  const before = Number(await state(page).getAttribute("data-count"));
  await page
    .getByRole("button", { name: "More revisions", exact: true })
    .click();
  await expect
    .poll(async () => Number(await state(page).getAttribute("data-count")))
    .toBeGreaterThan(before);
  await open(page, "all-in-one");
  await expect(page.getByText("All changes", { exact: true })).toBeVisible();
  for (const name of ["Branches", "Revisions", "Diff"]) {
    const resize = page.getByRole("separator", {
      name: `Resize ${name} column`,
      exact: true,
    });
    const width = Number(await resize.getAttribute("aria-valuenow"));
    await resize.focus();
    await resize.press("ArrowRight");
    await expect
      .poll(async () => Number(await resize.getAttribute("aria-valuenow")))
      .toBeGreaterThan(width);
  }
});
test("reference failure retries without changing the captured operation", async ({
  page,
}) => {
  await open(page, "retry");
  await expect(
    page.getByText("Branches unavailable", { exact: true }).first(),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Retry branches", exact: true })
    .click();
  await expect(state(page)).toHaveAttribute("data-phase", "ready");
  await expect(page.getByRole("row", { name: /main default/ })).toBeVisible();
});
test("new family documentation loads the real bounded production preview", async ({
  page,
}) => {
  for (const id of ["jj-browsing-branches", "jj-complete-screens-branches"]) {
    await page.goto(`/iframe.html?id=${id}--docs&viewMode=docs`);
    await page.locator(".sbdocs-content h1").first().waitFor();
    await expect(
      page.getByRole("heading", { name: /Styling variables$/ }),
    ).toBeVisible();
    await expect(
      page.locator("table").filter({ hasText: "--ui-" }).last(),
    ).toContainText("--ui-");
  }
});

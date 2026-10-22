import { expect, test, type Page } from "@playwright/test";
const diagnostics = new WeakMap<Page, string[]>();
test.beforeEach(({ page }) => {
  const errors: string[] = [];
  diagnostics.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (entry) => {
    if (entry.type() === "error") errors.push(entry.text());
  });
});
test.afterEach(({ page }) => expect(diagnostics.get(page)).toEqual([]));
const state = (page: Page) => page.getByTestId("operation-review-state");
async function open(page: Page, variant = "dense-history", selected = true) {
  await page.goto(
    `/iframe.html?id=jj-complete-screens-op-log--${variant}&viewMode=story`,
    { waitUntil: "domcontentloaded" },
  );
  await page
    .getByRole("button", { name: "Review operation", exact: true })
    .waitFor();
  if (selected)
    await expect(state(page)).toHaveAttribute("data-state", /"to":/);
}

test("dense operation history retains exact host callbacks and binary/renamed comparisons", async ({
  page,
}) => {
  await open(page);
  await expect(page.locator(".repository-graph-select")).toHaveCount(12);
  await page
    .getByRole("button", { name: "Review operation", exact: true })
    .click();
  await expect(state(page)).toHaveAttribute("data-actions", /review:ababab/);
  await page.getByRole("button", { name: "Revert", exact: true }).click();
  await expect(state(page)).toHaveAttribute(
    "data-actions",
    /revert-request:ababab/,
  );
  await page
    .getByRole("button", { name: "Copy metadata", exact: true })
    .click();
  await expect(state(page)).toHaveAttribute("data-actions", /metadata:ababab/);
  await page.getByRole("button", { name: "Copy paths", exact: true }).click();
  await expect(state(page)).toHaveAttribute("data-actions", /paths:ababab/);
  const files = page.getByRole("region", {
    name: "Changed files",
    exact: true,
  });
  await files
    .getByRole("radio", { name: "Show files as list", exact: true })
    .click();
  await files
    .getByRole("button", { name: "assets/repository-graph.png", exact: true })
    .click();
  await expect(page.getByText("Binary file", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Open file", exact: true }).click();
  await expect(state(page)).toHaveAttribute(
    "data-actions",
    /file:ababab.*assets\/repository-graph.png/,
  );
  await files
    .getByRole("button", { name: "docs/history/query-guide.md", exact: true })
    .click();
  await expect(
    page.getByText("Renamed from docs/history.md", { exact: true }),
  ).toBeVisible();
  await expect(state(page)).toHaveAttribute("data-errors", "[]");
});

test("native operation filters recover from empty and rejected queries without changing the pin", async ({
  page,
}) => {
  await open(page);
  await page
    .getByRole("button", { name: "Search operations", exact: true })
    .click();
  const input = page.getByRole("textbox", {
    name: "Operation query",
    exact: true,
  });
  await input.fill('description:"rebase"');
  await input.press("Enter");
  await expect(page.locator(".repository-graph-select")).toHaveCount(12);
  await expect
    .poll(
      async () =>
        JSON.parse((await state(page).getAttribute("data-state"))!).query,
    )
    .toBe('description:"rebase"');
  await input.fill("none");
  await input.press("Enter");
  await expect(page.getByText("No operations", { exact: true })).toBeVisible();
  await input.fill("invalid");
  await input.press("Enter");
  await expect(state(page)).toHaveAttribute(
    "data-errors",
    /rejected this operation query/,
  );
  await page
    .getByRole("button", { name: "Clear operation query", exact: true })
    .click();
  await expect(page.locator(".repository-graph-select")).toHaveCount(12);
  await expect(state(page)).toHaveAttribute("data-errors", "[]");
  await expect(state(page)).toHaveAttribute(
    "data-state",
    /"operation":"ababab/,
  );
});

test("operation paging and bounds retain selected comparisons and a fixed footer", async ({
  page,
}) => {
  await open(page, "paged-history");
  const before = JSON.parse((await state(page).getAttribute("data-state"))!);
  await page
    .getByRole("button", { name: "More operations", exact: true })
    .click();
  await expect(page.locator(".repository-graph-select")).toHaveCount(24);
  expect(JSON.parse((await state(page).getAttribute("data-state"))!).to).toBe(
    before.to,
  );
  await page
    .getByRole("button", { name: "More changed files", exact: true })
    .click();
  await expect(
    page.getByRole("region", { name: "Changed files", exact: true }),
  ).toContainText("15");
  await open(page, "bounded-history");
  await expect(page.locator(".repository-graph-select")).toHaveCount(6);
  const notice = page.getByText(
    "Showing the first 6 operations. Refine the query to narrow the results.",
    { exact: true },
  );
  const column = page.locator(
    '[data-column-id="revisions"][data-ui-part="column"]',
  );
  const outer = await column.boundingBox(),
    footer = await notice.boundingBox();
  expect(
    Math.abs(outer!.y + outer!.height - footer!.y - footer!.height),
  ).toBeLessThanOrEqual(2);
});

test("merge parents, changed revision choices and ambiguous pairs remain explicit", async ({
  page,
}) => {
  await open(page, "merge-parents", false);
  await expect(
    page.getByRole("region", { name: "Changed files", exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("combobox", {
      name: "Compare operation with parent",
      exact: true,
    })
    .click();
  await page
    .getByRole("row", { name: /Select operation parent/ })
    .first()
    .click();
  await expect(
    page.getByRole("region", { name: "Changed files", exact: true }),
  ).toBeVisible();
  await open(page, "multiple-changes", false);
  await expect(
    page.getByRole("region", { name: "Changed files", exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Choose changed revisions", exact: true })
    .click();
  await page
    .getByRole("row", { name: /^Choose / })
    .first()
    .click();
  await expect(
    page.getByRole("region", { name: "Changed files", exact: true }),
  ).toBeVisible();
  await open(page, "ambiguous", false);
  await expect(
    page.getByRole("button", { name: "Compare revisions", exact: true }),
  ).toBeDisabled();
  const from = page.getByRole("combobox", {
    name: "Before revision",
    exact: true,
  });
  const to = page.getByRole("combobox", {
    name: "After revision",
    exact: true,
  });
  await from.selectOption({ index: 1 });
  await to.selectOption({ index: 1 });
  await page
    .getByRole("button", { name: "Compare revisions", exact: true })
    .click();
  await expect(
    page.getByRole("region", { name: "Changed files", exact: true }),
  ).toBeVisible();
});

test("conflicts, metadata-only operations and failed reads use their recorded state", async ({
  page,
}) => {
  await open(page, "conflicts");
  await page
    .getByRole("button", { name: "Inspect conflicts", exact: true })
    .click();
  await expect(
    page.getByRole("region", { name: "Resolve native conflicts", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("src/history/query.ts", { exact: true }).first(),
  ).toBeVisible();
  await open(page, "metadata-only", false);
  await expect(
    page.getByText("No revision content changes", { exact: true }),
  ).toBeVisible();
  await open(page, "root-operation", false);
  await expect(
    page
      .locator('[data-slot="empty-title"]')
      .filter({ hasText: /^Root operation$/ }),
  ).toBeVisible();
  await open(page, "unavailable-comparison", false);
  await expect(
    page.getByText("Content comparison unavailable", { exact: true }),
  ).toBeVisible();
  await open(page, "failed-read", false);
  await expect(
    page.getByText("File changes unavailable", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Retry comparison", exact: true })
    .click();
  await expect(
    page.getByRole("region", { name: "Changed files", exact: true }),
  ).toBeVisible();
  await expect(state(page)).toHaveAttribute("data-errors", "[]");
});

test("host header controls replace defaults while retaining shared column controls", async ({
  page,
}) => {
  await open(page, "host-controls");
  await page
    .getByRole("button", { name: "Host source controls", exact: true })
    .click();
  await expect(state(page)).toHaveAttribute("data-actions", /controls:ababab/);
  await expect(
    page.getByRole("combobox", { name: "Repository workspace", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Collapse Op Log column", exact: true }),
  ).toBeVisible();
});

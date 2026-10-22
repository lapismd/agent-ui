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
const open = async (page: Page, story: string) => {
  await page.goto(
    `/iframe.html?id=jj-complete-screens-jj-log--${story}&viewMode=story`,
    { waitUntil: "domcontentloaded" },
  );
  await page
    .getByRole("button", { name: "Review selected revision", exact: true })
    .waitFor();
};
const state = (page: Page) => page.getByTestId("log-review-state");

test("commit Markdown blends into its parent and the long message expands and collapses", async ({
  page,
}) => {
  await open(page, "dense-history");
  const message = page.getByRole("region", {
    name: "Commit message body",
    exact: true,
  });
  await expect(message.locator(".markdown-preview-surface")).toHaveCSS(
    "background-color",
    "rgba(0, 0, 0, 0)",
  );
  const viewport = message.locator(".repository-review-message-viewport");
  await expect(viewport).toHaveAttribute("data-clamped", "true");
  const collapsed = await viewport.evaluate(
    (node) => node.getBoundingClientRect().height,
  );
  await message
    .getByRole("button", { name: "View more of commit message", exact: true })
    .click();
  await expect(viewport).not.toHaveAttribute("data-clamped", "true");
  expect(
    await viewport.evaluate((node) => node.getBoundingClientRect().height),
  ).toBeGreaterThan(collapsed);
  await expect(
    message.getByText(
      /The final paragraph is intentionally below the preview fold/,
    ),
  ).toBeVisible();
  await message
    .getByRole("button", { name: "View less of commit message", exact: true })
    .click();
  await expect(viewport).toHaveAttribute("data-clamped", "true");
  await message
    .getByRole("link", { name: "Read the review notes", exact: true })
    .focus();
  await expect(viewport).not.toHaveAttribute("data-clamped", "true");
});

test("Op Log metadata retains a complete long recorded message", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=jj-complete-screens-op-log--metadata&viewMode=story",
  );
  const row = page.locator(".repository-graph-select").first();
  await row.waitFor();
  await row.click();
  await page
    .getByRole("button", { name: "Inspect operation details", exact: true })
    .click();
  await expect(
    page.getByRole("region", {
      name: "Recorded operation command",
      exact: true,
    }),
  ).toContainText(
    "The final paragraph is intentionally below the preview fold",
  );
  const command = page.getByRole("region", {
    name: "Recorded operation command",
    exact: true,
  });
  const toggle = command.getByRole("button", {
    name: "View more of operation command",
    exact: true,
  });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  const before = await command.locator("pre").innerText();
  await toggle.click();
  await expect(
    command.getByRole("button", {
      name: "View less of operation command",
      exact: true,
    }),
  ).toHaveAttribute("aria-expanded", "true");
  await command
    .getByRole("button", {
      name: "View less of operation command",
      exact: true,
    })
    .click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  expect(await command.locator("pre").innerText()).toBe(before);
});

test("dense log uses shared headers, exact host actions and binary/renamed diffs", async ({
  page,
}) => {
  await open(page, "dense-history");
  await page
    .getByRole("button", { name: "Review selected revision", exact: true })
    .click();
  await expect(state(page)).toHaveAttribute("data-actions", /review:111111/);
  await page
    .getByRole("button", { name: "Open repository", exact: true })
    .click();
  await expect(state(page)).toHaveAttribute(
    "data-actions",
    /repository:ababab/,
  );
  await page
    .getByRole("button", { name: "Copy changed file paths", exact: true })
    .click();
  await expect(state(page)).toHaveAttribute(
    "data-actions",
    /paths:src\/history\/controller.ts/,
  );
  const files = page.getByRole("region", {
    name: "Changed files",
    exact: true,
  });
  await files
    .getByRole("radio", { name: "Show files as list", exact: true })
    .click();
  await files.locator('[data-file-path="assets/repository-graph.png"]').click();
  await expect(page.getByText("Binary file", { exact: true })).toBeVisible();
  await expect(state(page)).toHaveAttribute(
    "data-state",
    /assets\/repository-graph.png/,
  );
  await page
    .getByRole("button", { name: "Open file in workspace", exact: true })
    .click();
  await expect(state(page)).toHaveAttribute(
    "data-actions",
    /file:assets\/repository-graph.png/,
  );
  await files.locator('[data-file-path="docs/history/query-guide.md"]').click();
  await expect(
    page.getByText("Renamed from docs/history.md", { exact: true }),
  ).toBeVisible();
  await expect(state(page)).toHaveAttribute("data-errors", "[]");
});

test("native revset search retains the operation, clears selection and recovers from empty/failed queries", async ({
  page,
}) => {
  await open(page, "dense-history");
  await page
    .getByRole("button", { name: "Search revisions", exact: true })
    .click();
  const query = page.getByRole("searchbox", {
    name: "Revision query",
    exact: true,
  });
  await query.fill("conflicts()");
  await query.press("Enter");
  await expect(page.locator(".repository-graph-select")).toHaveCount(2);
  await expect(state(page)).toHaveAttribute(
    "data-state",
    /"revset":"conflicts\(\)"/,
  );
  await expect(
    page.getByRole("region", { name: "Changed files", exact: true }),
  ).toHaveCount(0);
  await query.fill("none()");
  await query.press("Enter");
  await expect(page.getByText("No revisions", { exact: true })).toBeVisible();
  await query.fill("invalid()");
  await query.press("Enter");
  await expect(
    page.getByText("Revisions unavailable", { exact: true }),
  ).toBeVisible();
  await expect(state(page)).toHaveAttribute(
    "data-errors",
    /rejected this revision query/,
  );
  await page.getByRole("button", { name: "Clear search", exact: true }).click();
  await expect(page.locator(".repository-graph-select")).toHaveCount(12);
  await expect(state(page)).toHaveAttribute(
    "data-state",
    /"operation":"ababab/,
  );
  await expect(state(page)).toHaveAttribute("data-errors", "[]");
});

test("graph and changed-file paging preserve selection and bounded examples explain the limit", async ({
  page,
}) => {
  await open(page, "paged-history");
  await expect(page.locator(".repository-graph-select")).toHaveCount(12);
  await page
    .getByRole("button", { name: "More revisions", exact: true })
    .click();
  await expect(page.locator(".repository-graph-select")).toHaveCount(24);
  await expect(state(page)).toHaveAttribute("data-state", /"revision":"111111/);
  await page
    .getByRole("button", { name: "More changed files", exact: true })
    .click();
  await expect(
    page.getByRole("region", { name: "Changed files", exact: true }),
  ).toContainText("16");
  await open(page, "bounded-history");
  await expect(page.locator(".repository-graph-select")).toHaveCount(6);
  await expect(
    page.getByText(
      "Showing the first 6 revisions. Refine the query to narrow the results.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "More revisions", exact: true }),
  ).toHaveCount(0);
  const notice = page.getByText(
    "Showing the first 6 revisions. Refine the query to narrow the results.",
    { exact: true },
  );
  const column = page.locator(
    '[data-column-id="revisions"][data-ui-part="column"]',
  );
  const bottomGap = async () => {
    const parent = await column.boundingBox(),
      child = await notice.boundingBox();
    return Math.abs(parent!.y + parent!.height - child!.y - child!.height);
  };
  expect(await bottomGap()).toBeLessThanOrEqual(2);
  const viewport = column
    .locator('[data-ui-part="scroll-area-viewport"]')
    .first();
  await viewport.evaluate((node) => {
    node.scrollTop = node.scrollHeight;
  });
  expect(await bottomGap()).toBeLessThanOrEqual(2);
});

test("host header controls replace defaults while shared actions and toggle remain", async ({
  page,
}) => {
  await open(page, "host-controls");
  await page
    .getByRole("button", { name: "Host source controls", exact: true })
    .click();
  await expect(state(page)).toHaveAttribute(
    "data-actions",
    /host-controls:ababab/,
  );
  await expect(
    page.getByRole("combobox", { name: "Repository workspace", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Open repository", exact: true }),
  ).toBeVisible();
});

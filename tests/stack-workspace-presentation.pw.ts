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
const state = (page: Page) => page.getByTestId("stack-workspace-state");
async function open(page: Page, variant = "workspace") {
  await page.goto(
    `/iframe.html?id=jj-complete-screens-stacks--${variant}&viewMode=story`,
  );
  await state(page).waitFor({ state: "attached" });
  await expect(state(page)).toHaveAttribute("data-loaded", "true");
}
const view = (page: Page, name: string) =>
  page
    .getByRole("tablist", { name: "Stack workspace views" })
    .getByRole("tab", { name, exact: true });
const column = (page: Page, id: string) =>
  page.locator(`[data-column-id="${id}"]`);

test("Stacks and Workspace retain independent selections and captured read scope", async ({
  page,
}) => {
  test.setTimeout(60000);
  await open(page);
  await expect(column(page, "working")).toBeVisible();
  await expect(page.locator(".workspace-stack-lane")).toHaveCount(3);
  const pin = await state(page).getAttribute("data-pin");
  await page
    .getByRole("button", {
      name: "Show all changes in feature/portable-api",
      exact: true,
    })
    .click();
  const lane = column(page, "stack-lane-1");
  await lane
    .getByRole("button", { name: /controller.ts/ })
    .first()
    .click();
  await expect(column(page, "diff-stack-lane-1")).toBeAttached();
  await column(page, "working")
    .getByRole("button", { name: /controller.ts/ })
    .first()
    .click();
  await expect(column(page, "diff-working")).toBeAttached();
  const selections = await state(page).getAttribute("data-selections");
  const diffs = await state(page).getAttribute("data-diffs");
  await view(page, "Stacks").click();
  await expect(column(page, "branches")).toBeVisible();
  await view(page, "Workspace").click();
  await page
    .getByRole("button", { name: "Refresh workspace", exact: true })
    .click();
  await expect(state(page)).toHaveAttribute("data-selections", selections!);
  await expect(state(page)).toHaveAttribute("data-diffs", diffs!);
  await expect(state(page)).toHaveAttribute("data-pin", pin!);
  await expect(state(page)).toHaveAttribute("data-commands", "0");
});

test("paged histories and source files expose supplied counts without mutation", async ({
  page,
}) => {
  await open(page, "paged");
  const lane = column(page, "stack-lane-1");
  const rows = lane.locator(".repository-graph > li");
  const count = await rows.count();
  await lane
    .getByRole("button", {
      name: "More commits in feature/portable-api",
      exact: true,
    })
    .click();
  await expect.poll(() => rows.count()).toBeGreaterThan(count);
  const files = column(page, "working");
  await files.getByRole("button", { name: /more/i }).click();
  await expect(
    files.getByRole("button", { name: /stack-80.png/ }),
  ).toBeAttached();
  await expect(files).toContainText("+4");
  await expect(state(page)).toHaveAttribute("data-commands", "0");
});

test("binary, conflict and long text diffs retain distinct states and shared controls", async ({
  page,
}) => {
  await open(page, "binary");
  await expect(column(page, "diff-working")).toContainText("Binary file");
  await open(page, "conflicts");
  await expect(column(page, "diff-working")).toContainText(
    "Preview unavailable",
  );
  await expect(
    column(page, "working").getByRole("button", { name: /conflict.ts/ }),
  ).toHaveAttribute("data-conflicted", "true");
  await open(page, "selected-files");
  const diff = column(page, "diff-working");
  await expect(diff.getByText(/unchanged context line/).first()).toBeAttached();
  await diff.getByRole("radio", { name: "Split", exact: true }).click();
  await expect(diff.locator(".ui-diff-file-diff__split")).toBeAttached();
});

test("target history is read-only and selection uses captured bookmark keys", async ({
  page,
}) => {
  await open(page, "basic");
  await page.getByRole("row", { name: /main/ }).click();
  const target = column(page, "target-history");
  await expect(target).toBeVisible();
  await expect(target).toContainText("Immutable");
  await target.locator(".repository-graph-select").first().click();
  await target
    .getByRole("button", { name: /controller.ts/ })
    .first()
    .click();
  await expect(column(page, "diff-target-history")).toBeAttached();
  await expect(state(page)).toHaveAttribute("data-commands", "0");
});

test("host row actions stay separate from selection; resizing keeps source selection", async ({
  page,
}) => {
  await open(page, "host-actions");
  const lane = column(page, "stack-lane-1");
  const selected = await state(page).getAttribute("data-selections");
  await lane
    .getByRole("button", { name: /Inspect commit/ })
    .first()
    .click();
  await expect(state(page)).toHaveAttribute("data-events", /commit:lane-1:/);
  await expect(state(page)).toHaveAttribute("data-selections", selected!);
  const rail = page.getByRole("separator", {
    name: "Resize feature/portable-api column",
    exact: true,
  });
  const width = Number(await rail.getAttribute("aria-valuenow"));
  await rail.focus();
  await rail.press("ArrowRight");
  await expect
    .poll(async () => Number(await rail.getAttribute("aria-valuenow")))
    .toBeGreaterThan(width);
  const box = await rail.boundingBox();
  if (!box) throw Error("Missing resize rail");
  await page.mouse.move(box.x + box.width / 2, box.y + 60);
  await page.mouse.down();
  await page.mouse.move(box.x + 45, box.y + 60);
  await page.mouse.up();
  await expect(state(page)).toHaveAttribute("data-selections", selected!);
});

test("workspace host switching refreshes the named read scope", async ({
  page,
}) => {
  await open(page);
  await page.getByRole("combobox", { name: "Active stack workspace" }).click();
  await page.getByRole("option", { name: "Review workspace" }).click();
  await expect(state(page)).toHaveAttribute("data-workspace", "review");
  await expect(state(page)).toHaveAttribute(
    "data-pin",
    "operation:recorded-7:workspace:review",
  );
  await expect(page.locator(".workspace-stack-lane")).toHaveCount(1);
});

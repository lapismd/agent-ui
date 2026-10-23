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

test("embedded Stacks places its production controls in the single outer header", async ({
  page,
}) => {
  await open(page, "embedded");
  const header = page.locator(
    '[data-ui-part="toolbar"][aria-label="Repository navigation"]',
  );
  await expect(header).toHaveCount(1);
  await expect(header).toBeVisible();
  await expect(page.locator(".workspace-navigation")).toHaveCount(0);
  const actions = header.getByRole("button", {
    name: "Workspace actions",
    exact: true,
  });
  const box = await actions.boundingBox(),
    frame = await header.boundingBox();
  expect(box!.x).toBeGreaterThan(frame!.x + frame!.width / 2);
  await actions.click();
  await page
    .getByRole("menuitem", { name: "Refresh workspace", exact: true })
    .click();
  await expect(state(page)).toHaveAttribute("data-loaded", "true");
});

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
    .getByRole("button", { name: "Workspace actions", exact: true })
    .click();
  await page
    .getByRole("menuitem", { name: "Refresh workspace", exact: true })
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
  await expect(diff.locator(".ui-diff-file-diff__split")).toHaveCount(3);
});

test("target history is read-only and selection uses captured bookmark keys", async ({
  page,
}) => {
  await open(page, "basic");
  await page.getByRole("row", { name: /main/ }).click();
  const target = column(page, "target-history");
  await expect(target).toBeVisible();
  await expect(
    target.locator('[data-ui-part="column-header"] > svg'),
  ).toHaveCSS("width", "16px");
  await expect(target).toContainText("Immutable");
  await target.locator(".repository-graph-select").first().click();
  await target
    .getByRole("button", { name: /controller.ts/ })
    .first()
    .click();
  await expect(column(page, "diff-target-history")).toBeAttached();
  await expect(state(page)).toHaveAttribute("data-commands", "0");
});

test("selected branch showcases stacked bookmarks and source-spaced commit files", async ({
  page,
}) => {
  await open(page, "basic");
  const lane = column(page, "stack-lane-1");
  await expect(lane.locator(".workspace-bookmark-card")).toHaveCount(3);
  await expect(lane.locator(".workspace-bookmark-link")).toHaveCount(2);
  await lane.locator(".repository-graph-select").first().click();
  const files = lane.locator(".repository-inline-files .workspace-files");
  await expect(files).toHaveCSS("border-radius", "8px");
  await expect(files.locator("header strong")).toHaveText("Changed files");
  await expect(files.locator(".workspace-files__body")).toHaveCSS(
    "padding",
    "4px 5.6px 5.6px",
  );
  await expect(lane.locator(".repository-inline-files")).toHaveCSS(
    "padding-top",
    "0px",
  );
  for (const name of ["Workspace", "Stacks"]) {
    await view(page, name).click();
    await expect
      .poll(() =>
        lane
          .locator("li.selected .repository-revision-graph__svg")
          .evaluate((svg) =>
            [...svg.querySelectorAll("line")].some(
              (line) => line.getAttribute("y2") === svg.getAttribute("height"),
            ),
          ),
      )
      .toBe(true);
  }
  await files
    .getByRole("button", { name: /controller.ts/ })
    .first()
    .click();
  await expect(column(page, "diff-stack-lane-1")).toBeAttached();
  await expect(state(page)).toHaveAttribute("data-commands", "0");
  await open(page, "stacked-branches");
  await expect(column(page, "diff-stack-lane-1")).toContainText(
    "controller.ts",
  );
  await expect(
    column(page, "diff-stack-lane-1").locator(".workspace-hunk-card"),
  ).toHaveCount(3);
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

test("stack navigation uses source pill styling in both views", async ({
  page,
}) => {
  await open(page);
  const tabs = page.getByRole("tablist", { name: "Stack workspace views" });
  await expect(page.locator(".workspace-navigation")).toHaveCSS(
    "border-bottom-width",
    "0px",
  );
  await expect(tabs).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  for (const name of ["Stacks", "Workspace"]) {
    const tab = view(page, name);
    await tab.click();
    await expect(tab).toHaveAttribute("data-state", "active");
    await expect(tab).toHaveCSS("border-radius", "999px");
  }
});

test("workspace picker reuses the searchable command view and preserves host identity", async ({
  page,
}) => {
  await open(page);
  await page.getByRole("combobox", { name: "Active stack workspace" }).click();
  const search = page.getByPlaceholder("Search loaded workspaces", {
    exact: true,
  });
  await expect(search).toBeFocused();
  await search.fill("not-a-workspace");
  await expect(
    page.getByText("No matching workspaces.", { exact: true }),
  ).toBeVisible();
  await search.fill("Review");
  await page
    .getByRole("option", { name: "Review workspace", exact: true })
    .click();
  await expect(state(page)).toHaveAttribute("data-workspace", "review");
  await expect(state(page)).toHaveAttribute(
    "data-pin",
    "operation:recorded-7:workspace:review",
  );
});

test("native hunks render separate range headers and retain partial selection", async ({
  page,
}) => {
  await open(page, "selected-files");
  const diff = column(page, "diff-working");
  const cards = diff.locator(".workspace-hunk-card");
  await expect(cards).toHaveCount(3);
  await expect(cards.first().locator(".workspace-hunk-header code")).toHaveText(
    "@@ -1,4 +1,3 @@",
  );
  const toggles = diff.getByRole("checkbox");
  await expect(toggles).toHaveCount(3);
  await toggles.first().uncheck();
  await expect
    .poll(
      async () =>
        JSON.parse((await state(page).getAttribute("data-diffs"))!)[0].hunks
          .length,
    )
    .toBe(2);
  await toggles.first().check();
  await expect
    .poll(
      async () =>
        JSON.parse((await state(page).getAttribute("data-diffs"))!)[0].hunks
          .length,
    )
    .toBe(3);
  await expect(state(page)).toHaveAttribute("data-commands", "0");
});

test("Git/JJ copy and commit intent reach host callbacks without changing selection", async ({
  page,
}) => {
  await open(page);
  const lane = column(page, "stack-lane-1");
  const selected = await state(page).getAttribute("data-selections");
  for (const [index, chip] of ["GIT", "JJ"].entries()) {
    const button = lane
      .getByRole("button", { name: new RegExp(`^${chip} .*Copy`) })
      .first();
    const value = (await button.getAttribute("aria-label"))!.split(" ").at(-1);
    await button.click();
    await expect
      .poll(
        async () =>
          JSON.parse((await state(page).getAttribute("data-command-log"))!)[
            index
          ]?.copy,
      )
      .toBe(value);
  }
  await lane
    .getByRole("button", { name: "Start a commit…", exact: true })
    .click();
  await expect
    .poll(
      async () =>
        JSON.parse((await state(page).getAttribute("data-command-log"))!)[2]
          ?.command,
    )
    .toEqual({ kind: "create_commit", stack: "lane-1", message: "" });
  await expect(state(page)).toHaveAttribute("data-selections", selected!);
});

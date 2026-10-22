import { test, expect, type Page } from "@playwright/test";

const errors = new WeakMap<Page, string[]>();
test.beforeEach(({ page }) => {
  const messages: string[] = [];
  errors.set(page, messages);
  page.on("pageerror", (error) => messages.push(error.message));
});
test.afterEach(({ page }) => expect(errors.get(page)).toEqual([]));

test("Op Log expansion shows its single changed revision and opens the exact file diff", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=jj-complete-screens-op-log--basic&viewMode=story",
  );
  const row = page.locator(".repository-graph-select").first();
  await expect(row).toBeVisible({ timeout: 30000 });
  await row.click();
  await expect(row).toHaveAttribute("aria-expanded", "true");
  const files = page.getByRole("region", {
    name: "Changed files",
    exact: true,
  });
  await expect(files).toBeVisible();
  await files.getByText("Welcome.md", { exact: true }).click();
  await expect(
    page.getByRole("region", { name: "Changes to Welcome.md", exact: true }),
  ).toBeVisible();
  const state = page.getByTestId("jj-story-state");
  await expect(state).toHaveAttribute("data-errors", "[]");
  await expect(state).toHaveAttribute(
    "data-operations",
    JSON.stringify({
      operation: "ab".repeat(64),
      selected: "ab".repeat(64),
      parent: "cd".repeat(64),
    }),
  );
  await page.screenshot({
    path: ".local/review/jj-op-log-files.png",
    animations: "disabled",
  });
});

test("JJ docs load every foundation without failed dynamic modules", async ({
  page,
  request,
}) => {
  test.setTimeout(180000);
  const response = await request.get("/index.json");
  const index = await response.json();
  const docs = Object.values(index.entries).filter(
    (entry: any) => entry.type === "docs" && entry.title.startsWith("JJ/"),
  ) as { id: string; title: string }[];
  expect(docs).toHaveLength(20);
  for (const entry of docs)
    await test.step(entry.title, async () => {
      await page.goto(`/iframe.html?id=${entry.id}&viewMode=docs`);
      await expect(page.locator(".sbdocs-content h1").first()).toBeVisible({
        timeout: 30000,
      });
      await expect(page.locator("#usage")).toBeVisible();
      await expect(page.getByRole("table").first()).toBeVisible();
      await expect(page.locator(".sb-errordisplay")).not.toBeVisible();
      await expect(page.locator(".sbdocs-content")).not.toContainText(
        "Failed to fetch dynamically imported module",
      );
    });
});

test("Every Empty and Unavailable story uses shadcn Empty with an icon", async ({
  page,
  request,
}) => {
  test.setTimeout(180000);
  const index = await (await request.get("/index.json")).json();
  const entries = Object.values(index.entries).filter(
    (e: any) => e.type === "story" && /empty|unavailable/i.test(e.name),
  ) as { id: string; name: string }[];
  expect(entries.length).toBeGreaterThan(20);
  for (const entry of entries)
    await test.step(entry.id, async () => {
      await page.goto(`/iframe.html?id=${entry.id}&viewMode=story`);
      if (entry.name === "Original Unavailable")
        await page.getByRole("button", { name: /History source:/ }).click();
      const empty = page
        .locator('[data-slot="empty"]:visible')
        .filter({ has: page.locator('[data-ui-part="empty-media"] svg') })
        .first();
      await expect(empty).toBeVisible({ timeout: 15000 });
    });
});
test("Standalone controls use a padded boundary without an unrelated shell", async ({
  page,
}) => {
  for (const id of [
    "jj-history-changed-files--basic",
    "jj-history-comparison-picker--basic",
  ]) {
    await page.goto(`/iframe.html?id=${id}&viewMode=story`);
    const boundary = page.locator("[data-preview-boundary]");
    await expect(boundary).toBeVisible();
    await expect(boundary).toHaveCSS("padding", "16px");
    await expect(page.locator('[data-ui-component="app-shell"]')).toHaveCount(
      0,
    );
  }
});
test("Avatar sizes use a plain background and the reference email resolves through the host", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=jj-foundations-author-avatar--sizes&viewMode=story",
  );
  const avatars = page.locator('.avatar-demo [data-ui-component="avatar"]');
  await expect(avatars).toHaveCount(7);
  expect(
    await avatars.evaluateAll((elements) =>
      elements.map((el) => el.getBoundingClientRect().width),
    ),
  ).toEqual([20, 24, 28, 48, 80, 128, 160]);
  await expect(page.locator('[data-ui-component="app-shell"]')).toHaveCount(0);
  await page.addStyleTag({
    content: ".avatar-demo {--ui-repository-author-avatar-size:2.5rem;}",
  });
  expect(
    await avatars.evaluateAll((elements) =>
      elements.map((el) => el.getBoundingClientRect().width),
    ),
  ).toEqual([40, 40, 40, 40, 40, 40, 40]);
  await page.goto(
    "/iframe.html?id=jj-foundations-author-avatar--gravatar&viewMode=story",
  );
  await expect(
    page.getByText("dev@lapis.md · Gravatar", { exact: true }),
  ).toBeVisible();
  await expect(page.locator(".avatar-demo img").first()).toHaveAttribute(
    "src",
    /^https:\/\/www\.gravatar\.com\/avatar\/[a-f0-9]{64}\?d=404&s=320$/,
  );
});
test("Blame retains Desktop typography, multiple sections and virtualized end-of-file navigation", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=jj-history-blame--comprehensive&viewMode=story",
  );
  const code = page.locator(".blame-group__line code").first();
  await expect(code).toBeVisible();
  await expect(code).toHaveCSS("font-size", "14px");
  await expect(page.locator(".blame-group__author").first()).toHaveCSS(
    "font-size",
    "12px",
  );
  await expect(page.locator(".blame-group__time").first()).toHaveCSS(
    "font-size",
    "12px",
  );
  expect(await page.locator(".blame-group").count()).toBeGreaterThan(2);
  const viewport = page.locator(
    '.store-blame [data-ui-part="scroll-area-viewport"]',
  );
  await viewport.evaluate((el) => {
    el.scrollTop = el.scrollHeight;
  });
  await expect(page.locator(".blame-group__end-divider")).toBeVisible();
  await page.getByRole("button", { name: "Wrap text", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Wrap text", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  await page.screenshot({
    path: ".local/review/jj-blame.png",
    animations: "disabled",
  });
});

test("Parent picker searches and selects a recorded parent by keyboard", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=jj-history-comparison-picker--basic&viewMode=story",
  );
  await page
    .getByRole("combobox", { name: "Compare with parent", exact: true })
    .click();
  const search = page.getByPlaceholder("Find commit", { exact: true });
  await search.fill("Start the vault");
  await expect(
    page.getByRole("row", { name: /Select comparison parent Start the vault/ }),
  ).toBeVisible();
  await search.press("ArrowDown");
  await search.press("Enter");
  await expect(
    page.getByRole("combobox", { name: "Compare with parent", exact: true }),
  ).toHaveAttribute("data-parent", "22".repeat(20));
});
test("Conflict staging previews a local draft without applying repository changes", async ({
  page,
}) => {
  await page.goto("/iframe.html?id=jj-history-conflicts--basic&viewMode=story");
  await page
    .getByRole("button", { name: "Stage merged file", exact: true })
    .click();
  await page.getByRole("button", { name: "Preview 1/1", exact: true }).click();
  const preview = page.getByRole("region", {
    name: "Conflict resolution preview",
    exact: true,
  });
  await expect(preview).toContainText("Base version");
  await expect(page.getByTestId("jj-story-state")).toHaveAttribute(
    "data-actions",
    '["read-conflicts"]',
  );
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(preview).not.toBeVisible();
});
test("File history delegates exact navigation and blame actions to its host", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=jj-history-file-history--basic&viewMode=story",
  );
  await expect(page.locator(".repository-graph-select").first()).toBeVisible();
  await page.locator(".repository-graph-select").first().click();
  await page.getByRole("button", { name: "Blame file", exact: true }).click();
  await expect(page.getByTestId("jj-story-state")).toHaveAttribute(
    "data-actions",
    JSON.stringify([`history:${"11".repeat(20)}`, "open-blame"]),
  );
});
test("Restore preview requires an explicit action and recovery retains the original request", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=jj-history-restore-dialog--recovery&viewMode=story",
  );
  const dialog = page.getByRole("alertdialog");
  await expect(dialog).toBeVisible();
  await expect(page.getByTestId("jj-story-state")).toHaveAttribute(
    "data-actions",
    "[]",
  );
  await dialog
    .getByRole("button", { name: "Restore file", exact: true })
    .click();
  await expect(page.getByTestId("jj-story-state")).toHaveAttribute(
    "data-actions",
    '["restore:retained-restore-request"]',
  );
});

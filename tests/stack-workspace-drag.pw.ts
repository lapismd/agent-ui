import { expect, test, type Page } from "@playwright/test";
const col = (page: Page, id: string) =>
  page.locator(`[data-column-id="${id}"]`);
const state = (page: Page) => page.getByTestId("workspace-drag-state");
const snapshot = async (page: Page) =>
  JSON.parse((await state(page).getAttribute("data-snapshot"))!);
async function open(page: Page) {
  await page.goto(
    "/iframe.html?id=jj-complete-screens-stacks--drag-and-drop&viewMode=story",
  );
  await expect(state(page)).toHaveAttribute("data-loaded", "true", {
    timeout: 30000,
  });
}
async function apply(page: Page) {
  await page
    .getByRole("button", { name: "Apply in example", exact: true })
    .click();
  await expect(state(page)).toHaveAttribute("data-applied", "1");
}

test("workspace file rows expose the native drag source", async ({ page }) => {
  await page.goto(
    "/iframe.html?id=jj-complete-screens-stacks--workspace&viewMode=story",
  );
  await expect(page.getByTestId("stack-workspace-state")).toHaveAttribute(
    "data-loaded",
    "true",
    { timeout: 30000 },
  );
  await expect(
    col(page, "working")
      .getByRole("button", { name: /controller.ts/ })
      .first(),
  ).toHaveAttribute("draggable", "true");
});

test("native file drop previews before apply and moves only that file", async ({
  page,
}) => {
  await open(page);
  const source = col(page, "working").getByRole("button", {
    name: "src/settings.ts",
    exact: true,
  });
  const target = col(page, "stack-api").getByRole("button", {
    name: "Stage changes in this stack",
    exact: true,
  });
  await expect(source).toHaveAttribute("draggable", "true");
  await source.dragTo(target);
  await expect(
    page.getByRole("region", { name: "Drop preview" }),
  ).toContainText("src/settings.ts");
  await expect(state(page)).toHaveAttribute("data-applied", "0");
  await expect(source).toHaveAttribute("draggable", "false");
  await expect(
    col(page, "stack-api").locator('[data-revision-id="api2"]'),
  ).toHaveAttribute("draggable", "false");
  await page.screenshot({ path: ".local/workspace-drag-preview.png" });
  expect(
    (await snapshot(page)).workspaces[0].unassigned.map(
      (file: { path: string }) => file.path,
    ),
  ).toContain("src/settings.ts");
  await apply(page);
  const after = await snapshot(page);
  expect(
    after.workspaces[0].unassigned.map((file: { path: string }) => file.path),
  ).not.toContain("src/settings.ts");
  expect(
    after.workspaces[0].unassigned.map((file: { path: string }) => file.path),
  ).toContain("src/panels.ts");
  expect(
    after.stacks[0].commits
      .at(-1)
      .files.map((file: { path: string }) => file.path),
  ).toEqual(["src/settings.ts"]);
});

test("folder drop stages every loaded descendant", async ({ page }) => {
  await open(page);
  await col(page, "working")
    .getByRole("button", { name: "src", exact: true })
    .dragTo(
      col(page, "stack-api").getByRole("button", {
        name: "Stage changes in this stack",
        exact: true,
      }),
    );
  await expect(
    page.getByRole("region", { name: "Drop preview" }),
  ).toContainText("src/panels.ts");
  await apply(page);
  expect(
    (await snapshot(page)).stacks[0].commits
      .at(-1)
      .files.map((file: { path: string }) => file.path)
      .sort(),
  ).toEqual(["src/panels.ts", "src/settings.ts"]);
});

test("hunk drop retains the exact token and other hunks remain unstaged", async ({
  page,
}) => {
  await open(page);
  await col(page, "working")
    .getByRole("button", { name: "src/settings.ts", exact: true })
    .click();
  const hunk = col(page, "diff-working").getByRole("group", {
    name: "Hunk add keyboard shortcut",
    exact: true,
  });
  await expect(hunk).toHaveAttribute("draggable", "true");
  const target = col(page, "stack-api").locator('[data-revision-id="api2"]');
  await hunk.dragTo(target);
  await expect(state(page)).toHaveAttribute(
    "data-command",
    /src\/settings.ts:add keyboard shortcut/,
  );
  await apply(page);
  const after = await snapshot(page);
  expect(
    after.workspaces[0].unassigned
      .find((file: { path: string }) => file.path === "src/settings.ts")
      .hunks.map((hunk: { id: string }) => hunk.id),
  ).toEqual(["src/settings.ts:remember preference"]);
  expect(
    after.stacks[0].commits
      .find((commit: { id: string }) => commit.id === "api2")
      .files.some((file: { path: string }) => file.path === "src/settings.ts"),
  ).toBe(true);
});

test("immutable targets reject drops and commit moves retain the branch destination", async ({
  page,
}) => {
  await open(page);
  const file = col(page, "working").getByRole("button", {
    name: "src/settings.ts",
    exact: true,
  });
  await file.dragTo(
    col(page, "stack-api").locator('[data-revision-id="api1"]'),
  );
  await expect(page.getByRole("region", { name: "Drop preview" })).toHaveCount(
    0,
  );
  await expect(state(page)).toHaveAttribute("data-applied", "0");
  const commit = col(page, "stack-ui").locator('[data-revision-id="ui1"]');
  await commit.dragTo(
    col(page, "stack-api").locator(".workspace-bookmark-header").first(),
  );
  await expect(state(page)).toHaveAttribute(
    "data-command",
    /"branch":"feature\/api"/,
  );
  await apply(page);
  expect(
    (await snapshot(page)).stacks[0].commits.some(
      (commit: { id: string }) => commit.id === "ui1",
    ),
  ).toBe(true);
});

test("keyboard selection stages the same file and cancel keeps all data", async ({
  page,
}) => {
  await open(page);
  await col(page, "working")
    .getByRole("button", { name: "src/settings.ts", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  const stage = col(page, "stack-api").getByRole("button", {
    name: "Stage changes in this stack",
    exact: true,
  });
  await stage.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("region", { name: "Drop preview" }),
  ).toContainText("src/settings.ts");
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(state(page)).toHaveAttribute("data-applied", "0");
  expect((await snapshot(page)).workspaces[0].unassigned).toHaveLength(3);
});

test("commit row edge drops reorder without squashing", async ({ page }) => {
  await open(page);
  await col(page, "stack-api")
    .locator('[data-revision-id="api2"]')
    .dragTo(col(page, "stack-api").locator('[data-revision-id="api3"]'), {
      targetPosition: { x: 60, y: 4 },
    });
  await expect(state(page)).toHaveAttribute(
    "data-command",
    /"placement":"above"/,
  );
  await apply(page);
  expect(
    (await snapshot(page)).stacks[0].commits.map(
      (commit: { id: string }) => commit.id,
    ),
  ).toEqual(["api1", "api3", "api2"]);
});

test("commit files can be moved back to Unstaged", async ({ page }) => {
  await open(page);
  await col(page, "stack-api")
    .locator('[data-revision-id="api2"] .repository-graph-select')
    .click();
  await col(page, "stack-api")
    .getByRole("button", { name: "src/api.ts", exact: true })
    .dragTo(col(page, "working").locator('[data-ui-part="column-body"]'), {
      targetPosition: { x: 60, y: 60 },
    });
  await expect(
    page.getByRole("region", { name: "Drop preview" }),
  ).toContainText("Unstaged");
  await apply(page);
  expect(
    (await snapshot(page)).workspaces[0].unassigned.some(
      (file: { path: string }) => file.path === "src/api.ts",
    ),
  ).toBe(true);
});

test("keyboard commit move chooses a destination before preview and apply", async ({
  page,
}) => {
  await open(page);
  await page
    .getByRole("button", {
      name: "Move commit Add workspace toolbar",
      exact: true,
    })
    .focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("region", { name: "Drop preview" })).toHaveCount(
    0,
  );
  await page.getByRole("combobox", { name: "Commit destination" }).click();
  await page.getByRole("option", { name: "feature/api", exact: true }).click();
  await expect(
    page.getByRole("region", { name: "Drop preview" }),
  ).toBeVisible();
  await expect(state(page)).toHaveAttribute("data-applied", "0");
  await apply(page);
  expect(
    (await snapshot(page)).stacks[0].commits.some(
      (commit: { id: string }) => commit.id === "ui1",
    ),
  ).toBe(true);
});

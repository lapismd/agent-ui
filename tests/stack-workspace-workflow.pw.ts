import { expect, test } from "@playwright/test";

for (const story of ["stacked-branches", "selected-files"]) {
  test(`${story}: lane description stays out of the commit files`, async ({
    page,
  }) => {
    await page.goto(
      `/iframe.html?id=jj-complete-screens-stacks--${story}&viewMode=story`,
    );
    await expect(page.getByTestId("stack-workspace-state")).toHaveAttribute(
      "data-loaded",
      "true",
      { timeout: 30000 },
    );
    const lane = page.locator('[data-column-id="stack-lane-1"]');
    if (story === "selected-files")
      await lane.locator(".repository-graph-select").nth(1).click();
    await expect(
      lane.getByRole("region", { name: /Changed files in/ }),
    ).toBeAttached();
    await expect(
      lane.getByRole("region", { name: "Commit message body" }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Workspace actions", exact: true }),
    ).toBeVisible();
    await expect(
      lane.getByRole("group", {
        name: "Branch actions for feature/portable-api",
        exact: true,
      }),
    ).toBeVisible();
  });
}

for (const story of ["pull-requests", "branch-pull-requests"]) {
  test(`${story}: PR details sit above the diff and actions retain their scope`, async ({
    page,
  }) => {
    await page.goto(
      `/iframe.html?id=jj-complete-screens-stacks--${story}&viewMode=story`,
    );
    const state = page.getByTestId("workspace-workflow-state");
    await expect(state).toHaveAttribute("data-loaded", "true", {
      timeout: 30000,
    });
    const details = page.locator('[data-column-id="diff-stack-api"]');
    const pr = details.getByRole("region", {
      name: "Pull request for feature/api",
    });
    await expect(pr).toContainText("Review context");
    await expect(pr).toContainText("Sam Rivera, Taylor Chen");
    const file = details.getByRole("region", { name: "Selected file diff" });
    await expect(file).toBeVisible();
    const boxes = await Promise.all([pr.boundingBox(), file.boundingBox()]);
    expect(boxes[0]!.y + boxes[0]!.height).toBeLessThanOrEqual(boxes[1]!.y);
    await expect(
      page
        .locator(".workspace-stack-lane")
        .getByRole("region", { name: "Commit message body" }),
    ).toHaveCount(0);
    await pr
      .getByRole("button", { name: "Pull request actions", exact: true })
      .click();
    await page
      .getByRole("menuitem", { name: "Convert to draft", exact: true })
      .click();
    await expect(
      page.getByRole("region", { name: "Pull request action preview" }),
    ).toBeVisible();
    const request = JSON.parse((await state.getAttribute("data-pr-request"))!);
    expect(request).toMatchObject({
      branch: "feature/api",
      expectedSha: "api2",
      scope: { revision: 1, workspace: "daily" },
      action: { kind: "draft", draft: true },
    });
    await page
      .getByRole("button", { name: "Cancel PR action", exact: true })
      .click();
    await pr
      .getByRole("button", { name: "Close PR details", exact: true })
      .click();
    await expect(details).toHaveCount(0);
    await page
      .locator('[data-column-id="stack-api"]')
      .getByRole("button", {
        name: "PR #42 · Pull request for feature/api",
        exact: true,
      })
      .click();
    await expect(details).toContainText("No file selected");
    await page
      .locator('[data-column-id="stack-api"]')
      .getByRole("button", { name: "src/api.ts", exact: true })
      .click();
    await expect(
      details.getByRole("region", { name: "Pull request for feature/api" }),
    ).toBeVisible();
    await expect(
      details.getByRole("region", { name: "Selected file diff" }),
    ).toContainText("@@");
  });
}

test("floating and docking retain the same PR editor, draft and focus", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=jj-complete-screens-stacks--pull-requests&viewMode=story",
  );
  const pr = page.getByRole("region", { name: "Pull request for feature/api" });
  await pr
    .getByRole("button", { name: "Edit PR details", exact: true })
    .click();
  const title = page.getByRole("textbox", { name: "Title", exact: true });
  await title.fill("Retained floating draft");
  const node = await title.elementHandle();
  await pr
    .getByRole("button", { name: "Float PR details", exact: true })
    .click();
  const window = page.getByRole("dialog", { name: /PR #42/ });
  await expect(window).toBeVisible();
  await expect(
    window.getByRole("textbox", { name: "Title", exact: true }),
  ).toHaveValue("Retained floating draft");
  expect(
    await node!.evaluate(
      (el) => el.isConnected && Boolean(el.closest('[role="dialog"]')),
    ),
  ).toBe(true);
  const before = (await window.boundingBox())!;
  const header = (await window
    .locator("[data-floating-pane-header]")
    .boundingBox())!;
  await page.mouse.move(header.x + 80, header.y + header.height / 2);
  await page.mouse.down();
  await page.mouse.move(header.x + 120, header.y + header.height / 2 + 25, {
    steps: 5,
  });
  await page.mouse.up();
  expect((await window.boundingBox())!.x).toBeGreaterThan(before.x + 30);
  const resizedFrom = (await window.boundingBox())!;
  const rail = (await window
    .getByRole("button", { name: "Resize floating pane se", exact: true })
    .boundingBox())!;
  await page.mouse.move(rail.x + rail.width / 2, rail.y + rail.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    rail.x + rail.width / 2 + 60,
    rail.y + rail.height / 2 + 45,
    { steps: 5 },
  );
  await page.mouse.up();
  expect((await window.boundingBox())!.width).toBeGreaterThan(
    resizedFrom.width + 40,
  );
  expect((await window.boundingBox())!.height).toBeGreaterThan(
    resizedFrom.height + 30,
  );
  await page.screenshot({ path: ".local/stack-workflow-floating.png" });
  await title.focus();
  await title.press("Escape");
  await expect(window).toHaveCount(0);
  await expect(title).toHaveValue("Retained floating draft");
  await expect(
    pr.getByRole("button", { name: "Float PR details", exact: true }),
  ).toBeFocused();
  expect(
    await node!.evaluate(
      (el) => el.isConnected && !el.closest('[role="dialog"]'),
    ),
  ).toBe(true);
  await title.focus();
  await title.press("Tab");
  await pr.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(
    page.getByRole("region", { name: "Pull request action preview" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Apply PR action", exact: true })
    .click();
  await expect(pr).toContainText("Retained floating draft");
  await page.screenshot({ path: ".local/stack-workflow-review.png" });
});

test("commit composer stages a selected file and requests preview before apply", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=jj-complete-screens-stacks--pull-requests&viewMode=story",
  );
  const lane = page.locator('[data-column-id="stack-api"]');
  await page
    .locator('[data-column-id="working"]')
    .getByRole("button", { name: "src/settings.ts", exact: true })
    .click();
  await lane
    .getByRole("button", { name: "Stage changes in this stack", exact: true })
    .click();
  await expect(
    lane.getByRole("group", { name: "Staged files for feature/api" }),
  ).toContainText("settings.ts");
  await lane
    .getByRole("textbox", { name: "Commit title", exact: true })
    .fill("Review staged changes");
  await lane
    .getByRole("button", { name: "Create commit", exact: true })
    .click();
  await expect(
    page.getByRole("region", { name: "Command preview" }),
  ).toBeVisible();
  await expect(page.getByTestId("workspace-workflow-state")).toHaveAttribute(
    "data-applied",
    "0",
  );
  await page
    .getByRole("button", { name: "Apply in example", exact: true })
    .click();
  await expect(page.getByTestId("workspace-workflow-state")).toHaveAttribute(
    "data-applied",
    "1",
  );
  await expect(lane).toContainText("Review staged changes");
});

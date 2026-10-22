import { expect, test } from "@playwright/test";
const screen =
  "/iframe.html?id=jj-complete-screens-files--history&viewMode=story";
test("Files history: grouped cards expose full descriptions and independent Git/JJ actions", async ({
  page,
}) => {
  await page.goto(screen);
  const header = page.locator(
    '[data-ui-part="toolbar"][aria-label="File history header"]',
  );
  await expect(header).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  const sidebar = page.locator(
    '[data-ui-part="body-sidebar"][aria-label="File inspector"]',
  );
  await expect(sidebar).toHaveCSS(
    "background-color",
    await page
      .locator(".repository-browser__file-content-card")
      .first()
      .evaluate((node) => getComputedStyle(node).backgroundColor),
  );
  const main = page.locator(
    '[data-ui-part="toolbar"][aria-label="Repository path header"]',
  );
  const sizes = await Promise.all([header.boundingBox(), main.boundingBox()]);
  expect(Math.abs(sizes[0]!.height - sizes[1]!.height)).toBeLessThanOrEqual(1);
  expect(Math.abs(sizes[0]!.y - sizes[1]!.y)).toBeLessThanOrEqual(1);
  const history = page.getByRole("region", {
    name: "Active file history",
    exact: true,
  });
  const rows = history.locator(".file-history-entry");
  await expect(rows).toHaveCount(4, { timeout: 3000 });
  await expect(
    history.getByRole("heading", { name: /Commits on/ }),
  ).toHaveCount(3);
  const first = rows.first();
  const contentBox = await first
    .locator(".file-history-entry__content")
    .boundingBox();
  const actionsBox = await first
    .locator(".file-history-entry__actions")
    .boundingBox();
  expect(actionsBox!.y).toBeGreaterThan(contentBox!.y);
  expect(Math.abs(actionsBox!.x - contentBox!.x)).toBeLessThanOrEqual(1);
  await first.getByRole("button", { name: /Copy Git commit SHA/ }).click();
  await first.getByRole("button", { name: /Copy JJ Change ID/ }).click();
  await expect(page.getByTestId("browser-state")).toHaveAttribute(
    "data-actions",
    /copy:111111/,
  );
  await expect(page.getByTestId("browser-state")).toHaveAttribute(
    "data-actions",
    /copy:aaaaaa/,
  );
  const disclosure = first.getByRole("button", {
    name: "Show commit description",
    exact: true,
  });
  const initialHover = await disclosure.evaluate(
    (node) => getComputedStyle(node).backgroundColor,
  );
  await disclosure.hover();
  await expect
    .poll(() =>
      disclosure.evaluate((node) => getComputedStyle(node).backgroundColor),
    )
    .not.toBe(initialHover);
  await disclosure.click();
  await expect(
    first.getByRole("button", { name: "Hide commit description", exact: true }),
  ).toHaveAttribute("aria-expanded", "true");
  await expect(
    first.getByRole("region", { name: "Commit message body" }),
  ).toBeVisible();
  const markdown = first.locator(".mira-markdown-preview").first();
  await expect(markdown).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  const document = first.locator(".repository-review-commit-message");
  await page
    .getByRole("button", { name: "Close file inspector", exact: true })
    .focus();
  await page
    .getByRole("button", { name: "Close file inspector", exact: true })
    .hover();
  const detailBackground = await document.evaluate(
    (node) => getComputedStyle(node).backgroundColor,
  );
  await first.hover();
  await expect
    .poll(() =>
      document.evaluate((node) => getComputedStyle(node).backgroundColor),
    )
    .not.toBe(detailBackground);
  await first
    .getByRole("button", { name: "View more of commit message", exact: true })
    .click();
  await expect(
    first.getByRole("button", {
      name: "View less of commit message",
      exact: true,
    }),
  ).toHaveAttribute("aria-expanded", "true");
  await first
    .getByRole("button", { name: "Hide commit description", exact: true })
    .click();
  await expect(
    first.getByRole("region", { name: "Commit message body" }),
  ).toHaveCount(0);
});
test("Files history: code and repository actions retain the selected recorded revision", async ({
  page,
}) => {
  await page.goto(screen);
  const second = page.locator(".file-history-entry").nth(1);
  await second
    .getByRole("button", { name: "View code at this point", exact: true })
    .click();
  await expect(page.getByTestId("browser-state")).toHaveAttribute(
    "data-pin",
    /"revision":"222222/,
  );
  await expect(page.getByTestId("browser-state")).toHaveAttribute(
    "data-path",
    "README.md",
  );
  await page.goto(screen);
  await page
    .locator(".file-history-entry")
    .nth(2)
    .getByRole("button", {
      name: "Browse repository at this point",
      exact: true,
    })
    .click();
  await expect(page.getByTestId("browser-state")).toHaveAttribute(
    "data-pin",
    /"revision":"333333/,
  );
  await expect(page.getByTestId("browser-state")).toHaveAttribute(
    "data-path",
    "",
  );
});

test("Files: both sidebars resize independently with pointer and keyboard", async ({
  page,
}) => {
  await page.goto(screen);
  const left = page.getByRole("button", {
    name: "Resize repository file tree",
    exact: true,
  });
  const right = page.getByRole("button", {
    name: "Resize file history sidebar",
    exact: true,
  });
  await left.focus();
  await page.keyboard.press("ArrowRight");
  await expect(left).toHaveAttribute("data-current-width", "272");
  await right.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(right).toHaveAttribute("data-current-width", "496");
  const rect = await right.boundingBox();
  await page.mouse.move(rect!.x, rect!.y + rect!.height / 2);
  await page.mouse.down();
  await page.mouse.move(rect!.x - 40, rect!.y + rect!.height / 2);
  await page.mouse.up();
  await expect(right).toHaveAttribute("data-current-width", "536");
  await expect(page.getByTestId("browser-state")).toHaveAttribute(
    "data-actions",
    /inspector-layout:536/,
  );
  await expect(left).toHaveAttribute("data-current-width", "272");
  await right.dblclick();
  await expect(right).toHaveAttribute("data-current-width", "480");
  await right.focus();
  await page.keyboard.press("Home");
  await expect(right).toHaveAttribute("data-current-width", "280");
  await page.keyboard.press("End");
  await expect(right).toHaveAttribute("data-current-width", "800");
});

import { expect, test } from "@playwright/test";

const screen = (variant: string) =>
  `/iframe.html?id=jj-complete-screens-files--${variant}&viewMode=story`;

test("Files: navigation, stock Markdown/source and exact host actions", async ({
  page,
}) => {
  await page.goto(screen("host-actions"));
  const state = page.getByTestId("browser-state");
  await expect(
    page.getByRole("table", { name: "Repository files", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Host copy directory", exact: true })
    .click();
  await expect(state).toHaveAttribute("data-actions", /directory:abab/);
  await page
    .getByRole("button", { name: "Open directory src", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Open directory history", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Open file controller.ts", exact: true })
    .click();
  await expect(state).toHaveAttribute("data-path", "src/history/controller.ts");
  await expect(
    page.getByRole("region", {
      name: "Source preview for src/history/controller.ts",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Host open in workspace", exact: true })
    .click();
  await expect(state).toHaveAttribute(
    "data-actions",
    /workspace:.*"path":"src\/history\/controller.ts"/,
  );
  await page.getByRole("link", { name: "Files", exact: true }).click();
  await page
    .getByRole("button", { name: "Open file README.md", exact: true })
    .click();
  const preview = page.getByRole("region", {
    name: "Markdown preview for README.md",
    exact: true,
  });
  await expect(
    preview.getByRole("heading", { name: "Agent UI", exact: true }),
  ).toBeVisible();
  await expect(preview.getByRole("table")).toBeVisible();
  await page.getByRole("button", { name: "Source", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Preview", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Copy file path", exact: true })
    .click();
  await expect(state).toHaveAttribute("data-actions", /copy:README.md/);
});

test("Files: tree disclosure, modes and persisted keyboard/pointer resize", async ({
  page,
}) => {
  await page.goto(screen("basic"));
  const state = page.getByTestId("browser-state");
  const resize = page.getByRole("button", {
    name: "Resize repository file tree",
    exact: true,
  });
  await expect(resize).toHaveAttribute("data-current-width", "256");
  await resize.press("ArrowRight");
  await expect(resize).toHaveAttribute("data-current-width", "272");
  await expect(state).toHaveAttribute("data-actions", /layout:.*"width":272/);
  const box = (await resize.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + 50, box.y + box.height / 2, { steps: 4 });
  await page.mouse.up();
  await expect
    .poll(async () => Number(await resize.getAttribute("data-current-width")))
    .toBeGreaterThan(300);
  await page
    .getByRole("button", { name: "Hide repository file tree", exact: true })
    .click();
  await expect(resize).toHaveCount(0);
  await expect(state).toHaveAttribute("data-actions", /layout:.*"open":false/);
  await page
    .getByRole("button", { name: "Show repository file tree", exact: true })
    .click();
  await expect(resize).toBeVisible();
  const tree = page.locator(".repository-browser__file-tree");
  await tree.getByRole("button", { name: "src", exact: true }).click();
  await expect(tree.getByText("history", { exact: true })).toBeVisible();
  await tree
    .getByRole("radio", { name: "Show files as list", exact: true })
    .click();
  await expect(
    tree.getByRole("radio", { name: "Show files as list", exact: true }),
  ).toHaveAttribute("aria-checked", "true");
  await tree
    .getByRole("button", {
      name: "assets/repository-graph.png Repository file",
      exact: true,
    })
    .click();
  await expect(state).toHaveAttribute(
    "data-path",
    "assets/repository-graph.png",
  );
  await expect(page.getByText("Binary file", { exact: true })).toBeVisible();
});

test("Files: dense virtual directory stays bounded while paging", async ({
  page,
}) => {
  await page.goto(screen("dense"));
  const state = page.getByTestId("browser-state");
  await expect(
    page.getByRole("table", {
      name: "Files in packages/components",
      exact: true,
    }),
  ).toBeVisible();
  await expect
    .poll(async () => Number(await state.getAttribute("data-count")))
    .toBeGreaterThanOrEqual(40);
  const viewport = page
    .getByRole("region", { name: "Repository file browser", exact: true })
    .locator('[data-ui-part="scroll-area-viewport"]')
    .first();
  for (let i = 0; i < 5; i++) {
    await viewport.evaluate((node) => (node.scrollTop = node.scrollHeight));
    if (
      await page
        .getByText("The directory limit has been reached.", { exact: false })
        .isVisible()
    )
      break;
    const more = page.getByRole("button", { name: "More files", exact: true });
    if (await more.isVisible()) await more.click();
  }
  await expect(state).toHaveAttribute("data-count", "120");
  await expect(
    page
      .getByRole("status")
      .filter({ hasText: "The directory limit has been reached." }),
  ).toBeVisible();
  expect(await page.locator("[data-row-index]").count()).toBeLessThan(120);
});

test("Files: existing history and blame read the selected file", async ({
  page,
}) => {
  await page.goto(screen("markdown"));
  await page.getByRole("button", { name: "File history", exact: true }).click();
  await expect(
    page.getByRole("region", { name: "Active file history", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("list", { name: "File revision history", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Create portable repository fixtures", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Close file inspector", exact: true })
    .click();
  await page.getByRole("button", { name: "Blame", exact: true }).click();
  await expect(
    page.getByRole("region", { name: "File blame", exact: true }),
  ).toBeVisible();
  await expect(page.getByTestId("browser-state")).toHaveAttribute(
    "data-actions",
    /blame:.*"path":"README.md"/,
  );
  await expect(
    page.getByRole("complementary", { name: "File inspector", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Blame", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("region", {
      name: "Markdown preview for README.md",
      exact: true,
    }),
  ).toHaveCount(0);
  const blame = page.getByRole("region", { name: "File blame", exact: true });
  await blame
    .getByRole("button", {
      name: "Keep repository history beside the notes — Ada",
      exact: true,
    })
    .hover();
  const details = page.getByRole("region", {
    name: "Commit details",
    exact: true,
  });
  await expect(details.locator(".commit-card__delta i")).toHaveCount(5);
  await expect(details).toContainText("+22");
  await expect(details).toContainText("-15");
  await page.getByRole("button", { name: "Preview", exact: true }).click();
  await expect(
    page.getByRole("region", {
      name: "Markdown preview for README.md",
      exact: true,
    }),
  ).toBeVisible();
});

test("Files: short previews fit available height with the shared panel toggle", async ({
  page,
}) => {
  for (const height of [600, 900]) {
    await page.setViewportSize({ width: 1280, height });
    await page.goto(screen("source"));
    const pane = page.getByRole("region", {
      name: "Repository file browser",
      exact: true,
    });
    const toggle = pane.getByRole("button", {
      name: "Hide repository file tree",
      exact: true,
    });
    await expect(toggle).toHaveAttribute("data-panel-toggle", "true");
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(
      pane.locator(
        '.repository-browser__file-body [data-ui-part="scroll-area-viewport"]',
      ),
    ).toHaveCount(0);
    const viewport = pane
      .locator('[data-ui-part="scroll-area-viewport"]')
      .first();
    await expect
      .poll(() =>
        viewport.evaluate((node) => node.scrollHeight - node.clientHeight),
      )
      .toBeLessThanOrEqual(1);
  }
});

test("Files: description links retain text colour and header actions have hover feedback/tooltips", async ({
  page,
}) => {
  await page.goto(screen("basic"));
  const description = page.getByRole("button", {
    name: /^View path change commit for assets:/,
  });
  const normal = await description.evaluate(
    (node) => getComputedStyle(node).color,
  );
  await expect(description).toHaveCSS("text-decoration-line", "none");
  await description.hover();
  await expect
    .poll(() => description.evaluate((node) => getComputedStyle(node).color))
    .not.toBe(normal);
  await expect(description).toHaveCSS("text-decoration-line", "none");
  await page
    .getByRole("button", { name: "Open file README.md", exact: true })
    .click();
  const filename = page.locator(
    ".repository-browser__file-content-header > span",
  );
  await expect(filename).toHaveCSS("align-items", "center");
  const copy = page.getByRole("button", {
    name: "Copy file path",
    exact: true,
  });
  const background = await copy.evaluate(
    (node) => getComputedStyle(node).backgroundColor,
  );
  await copy.hover();
  await expect(
    page
      .locator('[data-ui-part="tooltip-content"]')
      .filter({ hasText: "Copy file path" }),
  ).toBeVisible();
  await expect
    .poll(() => copy.evaluate((node) => getComputedStyle(node).backgroundColor))
    .not.toBe(background);
});

import { test, expect } from "@playwright/test";
test("Permission panel stays visible during streaming in both views and closes locally", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=agent-complete-screens--permission-dock&viewMode=story",
  );
  await expect(page.locator("#storybook-root")).toHaveAttribute(
    "data-permission-review",
    "complete",
    { timeout: 30000 },
  );
  await page.setViewportSize({ width: 420, height: 800 });
  const panel = page.getByRole("group", {
    name: "Permission request",
    exact: true,
  });
  for (const view of ["Classic", "Document"]) {
    await expect(
      page.getByRole("group", { name: "Message composer", exact: true }),
    ).toHaveCount(0);
    const box = await panel.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(420);
    await page
      .locator(
        '.ui-transcript-viewport > [data-ui-part="scroll-area-viewport"]',
      )
      .evaluate((el) => {
        el.scrollTop = 0;
      });
    const after = await panel.boundingBox();
    expect(Math.abs(after!.y - box!.y)).toBeLessThanOrEqual(1);
    const surface = panel.locator(".request-surface");
    await expect(surface).toHaveCSS(
      "background-color",
      await panel
        .locator(".agent-request-card")
        .evaluate((el) => getComputedStyle(el).backgroundColor),
    );
    await page
      .getByRole("button", { name: `Switch to ${view} view`, exact: true })
      .click();
  }
  await panel
    .getByRole("button", { name: "Dismiss permission request", exact: true })
    .click();
  await expect(panel).toHaveCount(0);
  await expect(
    page
      .getByRole("group", { name: "Message composer", exact: true })
      .getByRole("textbox", { name: "Message", exact: true }),
  ).toHaveText("Retain this draft while permission is pending.");
  await expect(page.getByTestId("request-story-state")).toHaveAttribute(
    "data-calls",
    "0",
  );
});

test("Dismissed refused permission clears only its local prompt and feedback", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=agent-complete-screens--request-refused&viewMode=story",
  );
  const panel = page.getByRole("group", {
    name: "Permission request",
    exact: true,
  });
  await expect(
    panel.locator('[data-ui-component="composer-status-banner"]'),
  ).toHaveAttribute("data-status", "error");
  await panel
    .getByRole("button", { name: "Dismiss permission request", exact: true })
    .click();
  await expect(panel).toHaveCount(0);
  const composer = page.getByRole("group", {
    name: "Message composer",
    exact: true,
  });
  await expect(composer).toBeVisible();
  await expect(
    composer.locator('[data-ui-component="composer-status-banner"]'),
  ).toHaveCount(0);
  await expect(page.getByTestId("request-story-state")).toHaveAttribute(
    "data-calls",
    "1",
  );
});

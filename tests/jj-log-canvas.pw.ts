import { expect, test } from "@playwright/test";

for (const kind of ["jj-log", "op-log"])
  test(`${kind}: trailing space keeps the final diff column resizable`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1500, height: 900 });
    await page.goto(
      `/iframe.html?id=jj-complete-screens-${kind}--all-in-one&viewMode=story`,
      { waitUntil: "domcontentloaded" },
    );
    const canvas = page.getByRole("region", {
      name:
        kind === "jj-log"
          ? "Repository history columns"
          : "Operation log columns",
      exact: true,
    });
    const spacer = canvas.locator('[data-ui-part="trailing-spacer"]');
    await expect(spacer).toHaveCount(1);
    await expect(spacer).toHaveCSS("width", "240px");
    await expect(
      spacer.getByText("Resize columns", { exact: true }),
    ).toBeVisible();
    await expect(
      spacer.locator('[data-ui-part="empty-media"] svg'),
    ).toHaveCount(1);
    const handle = canvas.getByRole("separator", {
      name: "Resize Diff column",
      exact: true,
    });
    await handle.scrollIntoViewIfNeeded();
    const before = Number(await handle.getAttribute("aria-valuenow"));
    const box = (await handle.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 80, box.y + box.height / 2, {
      steps: 6,
    });
    await page.mouse.up();
    await expect
      .poll(async () => Number(await handle.getAttribute("aria-valuenow")))
      .toBeGreaterThan(before + 40);
    const enlarged = Number(await handle.getAttribute("aria-valuenow"));
    await handle.press("ArrowLeft");
    await expect
      .poll(async () => Number(await handle.getAttribute("aria-valuenow")))
      .toBeLessThan(enlarged);
    await page.setViewportSize({ width: 600, height: 900 });
    await expect(canvas).toHaveAttribute("data-display-mode", "fixed");
    await spacer.scrollIntoViewIfNeeded();
    await expect(
      spacer.getByText("Resize columns", { exact: true }),
    ).toBeVisible();
    await handle.scrollIntoViewIfNeeded();
    await expect(handle).toBeVisible();
  });

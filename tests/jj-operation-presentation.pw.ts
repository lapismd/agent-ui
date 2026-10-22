import { expect, test } from "@playwright/test";

for (const mode of ["light", "dark"]) {
  test(`conflicted operation rows and full-width paging in ${mode} mode`, async ({
    page,
  }) => {
    await page.goto(
      `/iframe.html?id=jj-complete-screens-op-log--conflicts&viewMode=story&globals=colorMode:${mode}`,
    );
    await page
      .getByRole("button", { name: "Inspect conflicts", exact: true })
      .waitFor();
    await page
      .getByRole("button", { name: "Close Diff column", exact: true })
      .click();
    const graph = page.getByRole("list", {
      name: "Operation graph",
      exact: true,
    });
    const row = graph.locator(":scope > li").first();
    await expect
      .soft(
        row
          .getByRole("list", { name: "Operation tags", exact: true })
          .getByRole("listitem")
          .filter({ hasText: "Conflicted" }),
      )
      .toBeVisible();
    await expect.soft(row).toHaveClass(/conflicted/);
    const more = page.getByRole("button", {
      name: "More operations",
      exact: true,
    });
    const bounds = await more.boundingBox(),
      graphBounds = await graph.boundingBox();
    expect
      .soft(Math.abs(bounds!.width - graphBounds!.width))
      .toBeLessThanOrEqual(2);
    expect.soft(Math.abs(bounds!.x - graphBounds!.x)).toBeLessThanOrEqual(1);
    await expect.soft(more).toHaveCSS("justify-content", "center");
    await expect.soft(more).toHaveCSS("font-weight", "400");
    await expect
      .soft(more)
      .not.toHaveCSS(
        "color",
        await graph.evaluate((el) => getComputedStyle(el).color),
      );
    await expect
      .soft(row)
      .not.toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    for (const label of ["Snapshot", "default"]) {
      const chip = row
        .getByRole("list", { name: "Operation tags", exact: true })
        .getByRole("listitem")
        .filter({ hasText: label })
        .locator('[data-slot="badge"]');
      await expect(chip).not.toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
      await expect(chip).not.toHaveCSS(
        "background-color",
        await row.evaluate((el) => getComputedStyle(el).backgroundColor),
      );
      await expect(chip.locator("svg")).toHaveCount(1);
    }
    const tint = await row.evaluate((el) => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = getComputedStyle(el).backgroundColor;
      ctx.fillRect(0, 0, 1, 1);
      return [...ctx.getImageData(0, 0, 1, 1).data];
    });
    expect(tint[0]).toBeGreaterThan(tint[1]);
    expect(tint[0]).toBeGreaterThan(tint[2]);
  });
}

test("Op Log reveals retained context between separated edits", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=jj-complete-screens-op-log--conflicts&viewMode=story",
  );
  await page.locator('[data-file-path="src/history/controller.ts"]').click();
  const diff = page.getByRole("region", {
    name: "Changes to src/history/controller.ts",
    exact: true,
  });
  const reveal = diff
    .getByRole("button", { name: /Show (all )?\d+ (unmodified )?lines/ })
    .first();
  await expect(reveal).toBeVisible();
  await expect(diff.getByText(/History preset 32/)).toHaveCount(0);
  await reveal.click();
  await expect(diff.getByText(/History preset 32/)).toBeVisible();
});

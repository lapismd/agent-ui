import { expect, test } from "@playwright/test";
for (const kind of ["jj-log", "op-log"]) {
  test(`${kind}: paged sections, file navigation, retained modes and exact file menus`, async ({
    page,
  }) => {
    await page.goto(
      `/iframe.html?id=jj-complete-screens-${kind}--paged-files&viewMode=story`,
    );
    const viewer = page.locator(".repository-diff-viewer");
    const sections = viewer.locator('[data-ui-part="file-section"]');
    await expect(sections).toHaveCount(4);
    await expect(
      viewer.getByRole("button", {
        name: /^Collapse src\/history\/controller\.ts(?:\s|$)/,
        exact: true,
      }),
    ).toBeVisible();
    const selected = sections.first();
    await expect(selected).toHaveCSS("border-left-width", "0px");
    await expect(selected).toHaveCSS("border-radius", "0px");
    await expect(selected).toHaveCSS("outline-width", "1px");
    await expect(selected).toHaveCSS("outline-offset", "-1px");
    const header = selected.locator("header");
    await header
      .getByText("src/history/controller.ts", { exact: true })
      .click();
    await expect(selected).toHaveAttribute("data-collapsed", "true");
    await header
      .getByText("src/history/controller.ts", { exact: true })
      .click();
    await expect(selected).toHaveAttribute("data-collapsed", "false");
    await expect(
      selected.locator(".ui-diff-file-diff-composer__content"),
    ).toHaveCSS("padding-bottom", "12px");
    const a = await sections.nth(1).boundingBox(),
      b = await sections.nth(2).boundingBox();
    expect(Math.abs(a!.y + a!.height - b!.y)).toBeLessThanOrEqual(1);
    // Navigate past the first visible batch; keep the first file's body expanded.
    await page
      .locator('[data-file-path="assets/repository-graph.png"]')
      .click();
    await expect(sections).toHaveCount(8);
    await expect(
      viewer.getByRole("button", {
        name: /^Collapse assets\/repository-graph\.png(?:\s|$)/,
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      viewer.getByText("Binary file", { exact: true }),
    ).toBeVisible();
    await expect(
      viewer.getByRole("region", {
        name: "Changes to src/history/controller.ts",
        exact: true,
      }),
    ).toHaveCount(1);
    await viewer.getByRole("button", { name: "Load more file diffs" }).click();
    await expect(sections).toHaveCount(12);
    // A nonselected section receives its own path, independently of the binary selection.
    const path = "docs/history/query-guide.md";
    const section = viewer.locator('[data-ui-part="file-section"]').filter({
      has: page.getByRole("button", {
        name: new RegExp(`^Expand ${path.replaceAll(".", "\\.")}(?:\\s|$)`),
        exact: true,
      }),
    });
    await section
      .getByRole("button", { name: `File actions for ${path}`, exact: true })
      .click();
    await expect(page.getByRole("menu")).toBeVisible();
    await page
      .getByRole("menuitem", { name: "Copy path", exact: true })
      .hover();
    const relative = page.getByRole("menuitem", {
      name: "Copy relative path",
      exact: true,
    });
    await expect(relative).toBeVisible();
    expect(
      await relative.evaluate((el) => el.getBoundingClientRect().height),
    ).toBeLessThan(40);
    await relative.click();
    await expect(section).toHaveAttribute("data-collapsed", "true");
    const output = page.getByTestId(
      kind === "jj-log" ? "log-review-state" : "operation-review-state",
    );
    await expect(output).toHaveAttribute(
      "data-actions",
      new RegExp(`copy:${path}`),
    );
    const toggle = page.getByRole("button", {
      name: "All-in-one diff",
      exact: true,
    });
    await toggle.click();
    await expect(viewer).toHaveAttribute("data-file-mode", "single");
    const menu = page.getByRole("button", {
      name: "File actions for assets/repository-graph.png",
      exact: true,
    });
    const close = page.getByRole("button", {
      name: "Close Diff column",
      exact: true,
    });
    await expect(menu).toBeVisible();
    const adjacent = await menu.evaluate((el) =>
      el.nextElementSibling?.getAttribute("data-ui-part"),
    );
    expect(adjacent).toBe("column-close");
    expect(await menu.evaluate((el) => getComputedStyle(el).borderRadius)).toBe(
      await close.evaluate((el) => getComputedStyle(el).borderRadius),
    );
    await toggle.click();
    await expect(
      viewer.getByRole("button", {
        name: /^Collapse src\/history\/controller\.ts(?:\s|$)/,
        exact: true,
      }),
    ).toHaveCount(1);
    await expect(
      viewer.getByRole("button", {
        name: /^Collapse assets\/repository-graph\.png(?:\s|$)/,
        exact: true,
      }),
    ).toHaveCount(1);
  });
}

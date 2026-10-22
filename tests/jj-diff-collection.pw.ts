import { expect, test } from "@playwright/test";
import { PNG } from "pngjs";
for (const kind of ["jj-log", "op-log"]) {
  test(`${kind}: paged sections, file navigation, retained modes and exact file menus`, async ({
    page,
  }) => {
    await page.goto(
      `/iframe.html?id=jj-complete-screens-${kind}--paged-files&viewMode=story`,
      { waitUntil: "domcontentloaded" },
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
    ).toHaveCSS("padding-bottom", "0px");
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

for (const kind of ["jj-log", "op-log"])
  for (const mode of ["light", "dark"])
    test(`${kind}: selected frame paints over content and headers hover in ${mode}`, async ({
      page,
    }) => {
      await page.goto(
        `/iframe.html?id=jj-complete-screens-${kind}--all-in-one&viewMode=story&globals=colorMode:${mode}`,
        { waitUntil: "domcontentloaded" },
      );
      await expect(page.locator("html")).toHaveClass(
        mode === "dark" ? /\bdark\b/ : /^(?!.*\bdark\b)/,
      );
      const selected = page.locator(
        '[data-ui-part="file-section"][data-selected="true"]',
      );
      await expect(
        selected.getByRole("region", {
          name: "Changes to src/history/controller.ts",
          exact: true,
        }),
      ).toBeVisible();
      // An opaque public token makes this a paint test, independent of theme color conversion.
      await selected.evaluate((el) => {
        (el as HTMLElement).style.setProperty(
          "--ui-diff-file-selection-outline",
          "2px solid rgb(12, 106, 222)",
        );
        (el as HTMLElement).style.setProperty(
          "--ui-diff-file-selection-outline-offset",
          "-2px",
        );
      });
      const shot = await selected.screenshot({
        animations: "disabled",
        path: test.info().outputPath("selection.png"),
      });
      await test.info().attach(`${kind}-${mode}-selection`, {
        body: shot,
        contentType: "image/png",
      });
      const png = PNG.sync.read(shot);
      const headerHeight = (await selected.locator("header").boundingBox())!
        .height;
      for (const y of [
        Math.floor(headerHeight + 30),
        Math.floor(png.height * 0.65),
      ]) {
        for (const xs of [
          [0, 1, 2],
          [png.width - 3, png.width - 2, png.width - 1],
        ]) {
          const distance = Math.min(
            ...xs.map((x) => {
              const offset = (png.width * y + x) * 4;
              return Math.max(
                Math.abs(png.data[offset] - 12),
                Math.abs(png.data[offset + 1] - 106),
                Math.abs(png.data[offset + 2] - 222),
              );
            }),
          );
          expect(distance, `${kind}/${mode} frame edge at y=${y}`).toBeLessThan(
            25,
          );
        }
      }
      const header = page
        .locator('[data-ui-part="file-section"]')
        .nth(2)
        .locator("header");
      const before = await header.evaluate(
        (el) => getComputedStyle(el).backgroundColor,
      );
      await header.getByRole("button", { name: /^Expand docs/ }).hover();
      await expect(header).not.toHaveCSS("background-color", before);
    });

for (const kind of ["jj-log", "op-log"])
  test(`${kind}: all changes totals and actions have comparison scope`, async ({
    page,
  }) => {
    await page.goto(
      `/iframe.html?id=jj-complete-screens-${kind}--all-in-one&viewMode=story`,
      { waitUntil: "domcontentloaded" },
    );
    const header =
      kind === "jj-log"
        ? page.locator('[data-ui-part="column-header"]').filter({
            has: page.getByRole("button", {
              name: "Close Diff column",
              exact: true,
            }),
          })
        : page.locator(".operation-file-card > header");
    await expect(header).toContainText("All changes");
    await expect(header.getByText("+142", { exact: true })).toBeVisible();
    await expect(header.getByText("-90", { exact: true })).toBeVisible();
    if (kind === "jj-log") {
      await page
        .getByRole("button", {
          name: "File actions for docs/history/query-guide.md",
          exact: true,
        })
        .click();
      await page
        .getByRole("menuitem", {
          name: "Restore this file version",
          exact: true,
        })
        .click();
      const dialog = page.getByRole("alertdialog");
      await expect(dialog).toContainText("docs/history/query-guide.md");
      await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
    }
    await expect(
      header.getByRole("button", { name: /Restore this file|Open file/ }),
    ).toHaveCount(0);
    await expect(
      header.getByRole("button", {
        name: "Copy all changed file paths",
        exact: true,
      }),
    ).toBeVisible();
    // Selection and paging do not replace complete host totals with one file's counts.
    await page
      .locator('[data-file-path="assets/repository-graph.png"]')
      .click();
    await expect(header.getByText("+142", { exact: true })).toBeVisible();
    await expect(header.getByText("-90", { exact: true })).toBeVisible();
    await header
      .getByRole("button", { name: "All-in-one diff", exact: true })
      .click();
    await expect(header.getByText("+142", { exact: true })).toHaveCount(0);
    await expect(
      header.getByRole("button", { name: /Open file/ }),
    ).toBeVisible();
    await header
      .getByRole("button", { name: "All-in-one diff", exact: true })
      .click();
    // A missing host summary stays absent, rather than displaying a partial sum.
    await page.goto(
      `/iframe.html?id=jj-complete-screens-${kind}--file-actions&viewMode=story`,
      { waitUntil: "domcontentloaded" },
    );
    await expect(header).toContainText("All changes");
    await expect(
      header.locator('[data-ui-component="file-change-stats"]'),
    ).toHaveCount(0);
  });

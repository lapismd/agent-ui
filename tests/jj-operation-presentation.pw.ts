import { expect, test } from "@playwright/test";

for (const mode of ["light", "dark"]) {
  test(`conflicted operation rows and full-width paging in ${mode} mode`, async ({
    page,
  }) => {
    await page.goto(
      `/iframe.html?id=jj-complete-screens-op-log--conflicts&viewMode=story&globals=theme:lapis;colorMode:${mode}`,
    );
    await expect(
      page.locator('[data-ui-theme="lapis"]').first(),
    ).toBeAttached();
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
      const style = getComputedStyle(el);
      ctx.fillStyle = style.backgroundColor;
      ctx.fillRect(0, 0, 1, 1);
      return {
        pixels: [...ctx.getImageData(0, 0, 1, 1).data],
        background: style.backgroundColor,
        base: style.getPropertyValue("--background"),
        destructive: style.getPropertyValue("--destructive"),
        theme: document
          .querySelector("[data-ui-theme]")
          ?.getAttribute("data-ui-theme"),
        dark: document.documentElement.classList.contains("dark"),
      };
    });
    expect(tint.pixels[0], JSON.stringify(tint)).toBeGreaterThan(
      tint.pixels[1],
    );
    expect(tint.pixels[0], JSON.stringify(tint)).toBeGreaterThan(
      tint.pixels[2],
    );
  });
}

for (const kind of ["jj-log", "op-log"])
  for (const layout of ["unified", "split"])
    test(`${kind} reveals and hides retained context in ${layout} view`, async ({
      page,
    }) => {
      await page.goto(
        `/iframe.html?id=jj-complete-screens-${kind}--dense-history&viewMode=story`,
      );
      await page
        .locator('[data-file-path="src/history/controller.ts"]')
        .click();
      await page
        .getByRole("radio", {
          name: layout === "split" ? "Split" : "Unified",
          exact: true,
        })
        .click();
      const diff = page.getByRole("region", {
        name: "Changes to src/history/controller.ts",
        exact: true,
      });
      const reveal = diff
        .getByRole("button", { name: /Show (all )?\d+ (unmodified )?lines/ })
        .first();
      await expect(reveal).toBeVisible();
      if (layout === "split") {
        const left = diff.getByRole("region", {
          name: "Previous revision",
          exact: true,
        });
        await left
          .locator('[data-ui-part="scroll-area-viewport"]')
          .evaluate((el) => {
            el.scrollLeft = 48;
            el.dispatchEvent(new Event("scroll"));
          });
        for (const pane of await diff
          .locator('[data-ui-part="file-diff-pane"]')
          .all()) {
          const gutter = await pane.evaluate((el) => {
            const fold = el
              .querySelector('[data-ui-part="collapsed-context"]')!
              .getBoundingClientRect();
            const box = el.getBoundingClientRect();
            const front = el.ownerDocument.elementFromPoint(
              box.left + 20,
              fold.top + 16,
            )!;
            return {
              diagnostic: {
                tag: front.tagName,
                className: front.className,
                text: front.textContent?.slice(0, 120),
                pane: {
                  x: box.x,
                  y: box.y,
                  width: box.width,
                  height: box.height,
                },
                fold: {
                  x: fold.x,
                  y: fold.y,
                  width: fold.width,
                  height: fold.height,
                },
              },
              opaqueGutter: front.classList.contains(
                "ui-diff-file-diff__gutter",
              ),
              scrollLeft: el.querySelector(
                '[data-ui-part="scroll-area-viewport"]',
              )!.scrollLeft,
            };
          });
          const { diagnostic, ...actual } = gutter;
          expect(actual, JSON.stringify(diagnostic)).toEqual({
            opaqueGutter: true,
            scrollLeft: 48,
          });
        }
      }
      await expect(diff.getByText(/History preset 32/)).toHaveCount(0);
      await reveal.click();
      await expect(diff.getByText(/History preset 32/).first()).toBeVisible();
      if (layout === "split") {
        for (const pane of ["Previous revision", "Later revision"])
          await expect(
            diff
              .getByRole("region", { name: pane, exact: true })
              .getByText(/History preset 32/),
          ).toBeVisible();
      }
      await diff
        .getByRole("button", { name: /Hide \d+ unmodified lines/ })
        .first()
        .click();
      await expect(diff.getByText(/History preset 32/)).toHaveCount(0);
    });

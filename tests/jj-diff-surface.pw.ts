import { expect, test } from "@playwright/test";
import { PNG } from "pngjs";

for (const kind of ["jj-log", "op-log"])
  for (const mode of ["light", "dark"])
    test(`${kind}: flush collection and opaque sticky header in ${mode}`, async ({
      page,
    }) => {
      await page.goto(
        `/iframe.html?id=jj-complete-screens-${kind}--all-in-one&viewMode=story&globals=colorMode:${mode}`,
        { waitUntil: "domcontentloaded" },
      );
      const viewer = page.locator(".repository-diff-viewer");
      const selected = viewer.locator(
        '[data-ui-part="file-section"][data-selected="true"]',
      );
      await expect(
        selected.getByRole("region", {
          name: "Changes to src/history/controller.ts",
          exact: true,
        }),
      ).toBeVisible();
      const header = selected.locator("header");
      await selected
        .getByRole("button", { name: /^Show all \d+ lines$/ })
        .first()
        .click();
      await expect
        .poll(() =>
          viewer.evaluate((el) => {
            const viewport = el.closest(
              '[data-ui-part="scroll-area-viewport"]',
            )!;
            return viewport.scrollHeight - viewport.clientHeight;
          }),
        )
        .toBeGreaterThan(100);
      // Exercise the actual outer column scroll, with content passing behind the header.
      await selected.evaluate((el) => {
        const viewport = el.closest('[data-ui-part="scroll-area-viewport"]')!;
        viewport.scrollTop +=
          el.getBoundingClientRect().top -
          viewport.getBoundingClientRect().top +
          45;
      });
      await expect
        .poll(async () => {
          const headerBounds = (await header.boundingBox())!;
          const sectionBounds = (await selected.boundingBox())!;
          return headerBounds.y - sectionBounds.y;
        })
        .toBeGreaterThan(20);
      await selected
        .getByRole("region", {
          name: "Changes to src/history/controller.ts",
          exact: true,
        })
        .evaluate((el) => (el.style.visibility = "hidden"));
      // Contrasting backdrops must not affect any pixel of the sticky header.
      // This checks real paint, including a translucent theme's selected tint.
      for (const focused of [false, true]) {
        if (focused) await header.getByRole("button").first().focus();
        await selected.evaluate(
          (el) => (el.style.backgroundColor = "rgb(255, 0, 255)"),
        );
        const before = PNG.sync.read(
          await header.screenshot({ animations: "disabled" }),
        );
        await selected.evaluate(
          (el) => (el.style.backgroundColor = "rgb(0, 255, 0)"),
        );
        const after = PNG.sync.read(
          await header.screenshot({ animations: "disabled" }),
        );
        const pixel = (png: PNG) =>
          Array.from(
            png.data.subarray(
              (png.width * 12 + 5) * 4,
              (png.width * 12 + 5) * 4 + 4,
            ),
          );
        expect(pixel(after), `${kind}/${mode}, focused=${focused}`).toEqual(
          pixel(before),
        );
      }
      await expect(viewer).toHaveCSS("padding", "0px");
      const [body, file] = await Promise.all([
        viewer.boundingBox(),
        selected.boundingBox(),
      ]);
      expect(Math.abs(file!.x - body!.x)).toBeLessThanOrEqual(1);
      expect(Math.abs(file!.width - body!.width)).toBeLessThanOrEqual(1);
    });

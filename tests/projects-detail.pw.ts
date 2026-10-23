import { expect, test, type Page } from "@playwright/test";
import { PNG } from "pngjs";

async function expectDetailAlignment(page: Page, kind: "Task" | "Review") {
  const article = page.getByRole("article", { name: `${kind} details` });
  const header = article.locator("header").first();
  const back = header.getByRole("button", { name: /^Back to/ });
  const heading = header.getByRole("heading", { level: 2 });
  const frame = (await page.locator(".repository-body-frame").boundingBox())!;
  const b = (await back.boundingBox())!;
  const t = (await heading.boundingBox())!;
  const h = (await header.boundingBox())!;
  // Back has its own layout cell; text cannot paint beneath its hit target.
  expect(t.x - (b.x + b.width)).toBeGreaterThanOrEqual(7);
  expect(b.x - frame.x).toBeGreaterThanOrEqual(0);
  expect(b.x - frame.x).toBeLessThanOrEqual(9);
  expect(h.y - frame.y).toBeLessThanOrEqual(1);
  expect(t.y - h.y).toBeLessThanOrEqual(10);
  await expect(header).toHaveAttribute("data-ui-part", "toolbar");
  const refresh = (await header
    .getByRole("button", { name: /^Refresh/ })
    .boundingBox())!;
  const last = (await header
    .getByRole("button", { name: /^Chat about/ })
    .boundingBox())!;
  expect(t.x + t.width + 7).toBeLessThanOrEqual(refresh.x);
  expect(last.y).toBeCloseTo(refresh.y, 0);
  expect(b.y).toBeCloseTo(refresh.y, 0);
  expect(last.x + last.width).toBeLessThanOrEqual(frame.x + frame.width);
  expect(
    await article.evaluate((el) => el.scrollWidth - el.clientWidth),
  ).toBeLessThanOrEqual(1);
}

for (const mode of ["light", "dark"])
  for (const width of [1280, 420, 320]) {
    test(`task detail visible hover and keyboard feedback ${mode} ${width}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(
        `/iframe.html?id=jj-complete-screens-projects--task&viewMode=story&globals=colorMode:${mode}`,
      );
      const trigger = page.getByRole("button", {
        name: "Description",
        exact: true,
      });
      await expect(trigger).toBeVisible({ timeout: 30000 });
      await expect(
        page.getByText("Metadata stays at its home.", { exact: true }),
      ).toBeVisible();
      await expectDetailAlignment(page, "Task");
      await page.getByRole("heading", { level: 2 }).click();
      await page.mouse.move(1, 1);
      const before = PNG.sync.read(await trigger.screenshot());
      await trigger.hover();
      const after = PNG.sync.read(await trigger.screenshot());
      const point = (image: PNG) => {
        const offset =
          (Math.floor(image.height / 2) * image.width + image.width - 12) * 4;
        return [...image.data.subarray(offset, offset + 3)];
      };
      const delta = point(before).map((c, i) => Math.abs(c - point(after)[i]));
      expect(Math.max(...delta)).toBeGreaterThan(5);
      // Hover paints an opaque surface, so underlying page content cannot bleed through.
      expect(
        await trigger.evaluate((el) => {
          const c = document.createElement("canvas").getContext("2d")!;
          c.fillStyle = getComputedStyle(el).backgroundColor;
          c.fillRect(0, 0, 1, 1);
          return c.getImageData(0, 0, 1, 1).data[3];
        }),
      ).toBe(255);
      await trigger.focus();
      await page.keyboard.press("Enter");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(trigger).toHaveCSS("outline-width", "2px");
      const refresh = (await page
        .getByRole("button", { name: "Refresh projects" })
        .boundingBox())!;
      const chat = (await page
        .getByRole("button", { name: "Chat about this view" })
        .boundingBox())!;
      expect(chat.y).toBeCloseTo(refresh.y, 0);
      const footer = page.getByLabel("Task comment composer", { exact: true });
      const beforeScroll = (await footer.boundingBox())!;
      await page
        .getByRole("region", { name: "Task content", exact: true })
        .locator(':scope > [data-ui-part="scroll-area-viewport"]')
        .evaluate((el) => (el.scrollTop = el.scrollHeight));
      expect((await footer.boundingBox())!.y).toBeCloseTo(beforeScroll.y, 0);
      await expectDetailAlignment(page, "Task");
      if (width === 1280) {
        await page.getByRole("button", { name: "Toggle details" }).click();
        await expect(
          page.getByRole("complementary", {
            name: "Projects details",
            exact: true,
          }),
        ).toBeVisible();
        await expectDetailAlignment(page, "Task");
      }
    });
    test(`review detail fixed chrome and responsive comparison ${mode} ${width}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(
        `/iframe.html?id=jj-complete-screens-projects--review-detail&viewMode=story&globals=colorMode:${mode}`,
      );
      const footer = page.getByLabel("Review comment composer", {
        exact: true,
      });
      await expect(footer).toBeVisible({ timeout: 30000 });
      await expectDetailAlignment(page, "Review");
      const start = (await footer.boundingBox())!;
      await page
        .getByRole("button", { name: "Files changed", exact: true })
        .click();
      await page.getByRole("button", { name: "Commits", exact: true }).click();
      await page
        .getByRole("region", { name: "Review content", exact: true })
        .locator(':scope > [data-ui-part="scroll-area-viewport"]')
        .evaluate((el) => (el.scrollTop = el.scrollHeight));
      const end = (await footer.boundingBox())!;
      expect(end.y).toBeCloseTo(start.y, 0);
      await expect(
        page.getByRole("button", { name: "Back to reviews" }),
      ).toBeInViewport();
      expect(
        await page
          .getByRole("article", { name: "Review details" })
          .evaluate((el) => el.scrollWidth - el.clientWidth),
      ).toBeLessThanOrEqual(1);
      await page.getByRole("button", { name: "Diff settings" }).click();
      await page.getByRole("menuitemradio", { name: "Split diff" }).click();
      await expect(
        page.getByRole("checkbox", { name: "Mark src/context.ts as viewed" }),
      ).toBeVisible();
    });
  }

for (const variant of [
  "review-detail-unavailable",
  "review-detail-read-only",
  "review-detail-recovery",
]) {
  test(`detail header alignment in ${variant}`, async ({ page }) => {
    await page.setViewportSize({ width: 420, height: 900 });
    await page.goto(
      `/iframe.html?id=jj-complete-screens-projects--${variant}&viewMode=story`,
    );
    await expect(
      page.getByRole("article", { name: "Review details" }),
    ).toBeVisible({ timeout: 30000 });
    await expectDetailAlignment(page, "Review");
    await page.getByRole("button", { name: "Back to reviews" }).click();
    await expect(
      page.getByRole("heading", { name: "Reviews", exact: true }),
    ).toBeVisible();
  });
}

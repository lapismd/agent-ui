import { test, expect } from "@playwright/test";
import { PNG } from "pngjs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const artifacts = path.resolve(".local/source-parity");
for (const theme of ["light", "dark"])
  for (const width of [420, 900, 1280])
    for (const state of ["chat", "list", "inspector"]) {
      test(`${theme} ${width} ${state}: original Desktop pixels`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.clock.setFixedTime(new Date("2026-10-21T12:30:00Z"));
        page.on("pageerror", (error) =>
          console.error("Reference runtime:", error.message),
        );
        const query = new URLSearchParams();
        if (theme === "dark") query.set("dark", "");
        if (state !== "chat") query.set(state, "");
        const captures: Buffer[] = [];
        for (const source of ["desktop", "extracted"]) {
          query.set("source", source);
          await page.goto(`/?${query}`);
          await expect(
            page.getByRole("heading", { name: "Review workspace changes" }),
          ).toBeVisible();
          await page.evaluate(() => document.fonts.ready);
          await expect(page.locator(".ai-session-thread")).toHaveCSS(
            "height",
            "782px",
          );
          await expect(page.locator(".session-header")).toHaveCSS(
            "min-height",
            "52px",
          );
          await expect(page.locator(".ai-session-footer")).toHaveCSS(
            "height",
            "32px",
          );
          if (state === "inspector") {
            await page.getByRole("button", { name: "Tool output" }).click();
            const layer = page.getByLabel("Tool details", { exact: true });
            await expect(layer).toBeVisible();
            await expect
              .poll(async () => {
                const bounds = await layer.boundingBox();
                return { x: bounds?.x, y: bounds?.y };
              })
              .toEqual({ x: 8, y: 8 });
          }
          captures.push(
            await page.screenshot({ animations: "disabled", caret: "hide" }),
          );
        }
        const [before, after] = captures.map((value) => PNG.sync.read(value));
        expect({ width: after.width, height: after.height }).toEqual({
          width: before.width,
          height: before.height,
        });
        let different = 0;
        const diff = new PNG({ width: before.width, height: before.height });
        for (let pixel = 0; pixel < before.data.length; pixel += 4) {
          const changed = before.data
            .subarray(pixel, pixel + 4)
            .some((value, channel) => value !== after.data[pixel + channel]);
          if (changed) different++;
          diff.data.set(
            changed
              ? [255, 0, 255, 255]
              : [
                  before.data[pixel],
                  before.data[pixel + 1],
                  before.data[pixel + 2],
                  90,
                ],
            pixel,
          );
        }
        await mkdir(artifacts, { recursive: true });
        const name = `${theme}-${width}-${state}`;
        await Promise.all([
          writeFile(path.join(artifacts, `${name}-reference.png`), captures[0]),
          writeFile(path.join(artifacts, `${name}-candidate.png`), captures[1]),
          writeFile(
            path.join(artifacts, `${name}-diff.png`),
            PNG.sync.write(diff),
          ),
        ]);
        expect(
          different,
          `${name}: different pixels; inspect .local/source-parity`,
        ).toBe(0);
      });
    }

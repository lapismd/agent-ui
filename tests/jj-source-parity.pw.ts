import { test, expect } from "@playwright/test";
import { PNG } from "pngjs";
import { mkdir, writeFile } from "node:fs/promises";
// Match the macOS Desktop reference display density for native-pixel evidence.
test.use({ deviceScaleFactor: 2 });
for (const theme of ["light", "dark"])
  for (const width of [420, 900, 1280])
    for (const mode of ["log", "operations", "blame"]) {
      test(`JJ ${theme} ${width} ${mode}: Desktop pixels`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.clock.setFixedTime(new Date(1792252800000));
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        // Optional external avatar enrichment must not introduce network timing into pixel evidence.
        await page.route("https://www.gravatar.com/**", (route) =>
          route.abort(),
        );
        const captures: Buffer[] = [];
        await page.goto(
          `/?jj=${mode}&source=desktop${theme === "dark" ? "&dark" : ""}`,
        );
        await page.addStyleTag({
          content:
            "*,*::before,*::after{transition:none!important;animation:none!important;}",
        });
        for (const source of ["desktop", "extracted"]) {
          if (source === "extracted")
            await page.getByTestId("reference-switch").dispatchEvent("click");
          await expect(page.locator(".reference-repository")).toHaveAttribute(
            "data-source",
            source,
          );
          if (mode === "blame")
            await expect(
              page.locator(".blame-group__line code").first(),
            ).toBeVisible();
          else
            await expect(
              page.locator(".repository-graph-row").first(),
            ).toBeVisible();
          await page.evaluate(() => document.fonts.ready);
          if (mode !== "blame")
            await expect(
              page.getByRole("region", {
                name:
                  mode === "log"
                    ? "Repository history"
                    : "Repository operation log",
                exact: true,
              }),
            ).toHaveAttribute("aria-busy", "false");
          else
            await expect(
              page.locator(".ui-code-token-keyword").first(),
            ).toBeVisible();
          // Wait for optional avatar rejection and settled frame paint in both sources.
          await page.evaluate(
            () =>
              new Promise<void>((resolve) =>
                requestAnimationFrame(() =>
                  requestAnimationFrame(() => resolve()),
                ),
              ),
          );
          await expect(page.getByTestId("reference-errors")).toHaveText("");
          let settled: Buffer | undefined;
          await expect
            .poll(
              async () => {
                const next = await page.screenshot({
                  animations: "disabled",
                  caret: "hide",
                });
                const stable = settled?.equals(next) ?? false;
                settled = next;
                return stable;
              },
              { timeout: 10000, intervals: [50, 100, 250] },
            )
            .toBe(true);
          captures.push(settled!);
        }
        expect(errors).toEqual([]);
        const [a, b] = captures.map((buffer) => PNG.sync.read(buffer));
        expect({ width: b.width, height: b.height }).toEqual({
          width: a.width,
          height: a.height,
        });
        let different = 0;
        for (let i = 0; i < a.data.length; i += 4)
          if (a.data.subarray(i, i + 4).some((v, c) => v !== b.data[i + c]))
            different++;
        await mkdir(".local/jj-source-parity", { recursive: true });
        await writeFile(
          `.local/jj-source-parity/${theme}-${width}-${mode}-desktop.png`,
          captures[0],
        );
        await writeFile(
          `.local/jj-source-parity/${theme}-${width}-${mode}-extracted.png`,
          captures[1],
        );
        expect(
          different,
          "Different pixels; inspect .local/jj-source-parity",
        ).toBe(0);
      });
    }

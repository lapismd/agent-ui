import { test, expect } from "@playwright/test";

for (const kind of ["Loading", "Empty", "Unavailable"] as const) {
  test(`Every ${kind} story renders its shared content state`, async ({
    context,
    request,
  }) => {
    test.setTimeout(240000);
    const index = await (await request.get("/index.json")).json();
    const entries = Object.values(index.entries).filter(
      (entry: any) =>
        entry.type === "story" && new RegExp(`\\b${kind}$`).test(entry.name),
    ) as { id: string }[];
    expect(entries.length).toBeGreaterThan(10);
    const failures: string[] = [];
    for (const { id } of entries) {
      await test.step(id, async () => {
        const page = await context.newPage();
        try {
          await page.goto(`/iframe.html?id=${id}&viewMode=story`);
          await expect(page.locator("#storybook-root > *").first()).toBeVisible(
            {
              timeout: 15000,
            },
          );
          if (id.startsWith("jj-browsing-reference-picker--"))
            await page
              .getByRole("combobox", { name: "Repository bookmark or change" })
              .click();
          if (id === "jj-history-comparison-picker--loading")
            await page
              .getByRole("combobox", { name: "Compare with parent" })
              .click();
          const state =
            kind === "Loading"
              ? page.locator('[data-slot="skeleton"]:visible').first()
              : page
                  .locator('[data-slot="empty"]:visible')
                  .filter({
                    has: page.locator('[data-ui-part="empty-media"] svg'),
                  })
                  .first();
          await expect(state).toBeVisible({ timeout: 15000 });
          await expect(page.locator(".sb-errordisplay")).not.toBeVisible();
        } catch {
          failures.push(id);
        } finally {
          await page.close();
        }
      });
    }
    expect(failures, `Missing shared ${kind} presentation`).toEqual([]);
  });
}

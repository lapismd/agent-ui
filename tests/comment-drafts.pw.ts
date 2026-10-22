import { test, expect } from "@playwright/test";
for (const mode of ["document", "classic"] as const)
  test(`Empty inline draft Backspace removes only that comment in ${mode}`, async ({
    page,
  }) => {
    await page.goto(
      "/iframe.html?id=agent-complete-screens--inline-comments&viewMode=story",
    );
    const inline = page.locator(
      '[data-placement="inline"] [data-comment-id="review-comment-0"]',
    );
    await expect(
      inline.getByRole("button", { name: "Add emoji to comment" }),
    ).toBeVisible();
    if (mode === "classic")
      await page
        .getByRole("button", { name: "Switch to Classic view", exact: true })
        .click();
    const editor = inline.getByRole("textbox");
    await editor.click();
    await editor.press("Home");
    await editor.press("Shift+End");
    await editor.press("x");
    await expect(editor).toHaveText("x");
    await editor.press("End");
    await editor.press("Backspace");
    await expect(editor.locator(".cm-placeholder")).toBeVisible();
    await expect(inline).toBeVisible();
    await editor.press("Backspace");
    await expect(
      page.locator('[data-comment-id="review-comment-0"]'),
    ).toHaveCount(0);
    await expect(
      page.locator(
        '[data-placement="inline"] [data-comment-id="review-comment-1"]',
      ),
    ).toContainText("Retain the original export.");
    await expect(
      page.locator('[data-block-id="answer/body"]').first(),
    ).toContainText("Keep the exact captured text");
  });

test("Expanded comment quotes share the context surface in both themes", async ({
  page,
}) => {
  for (const theme of ["light", "dark"]) {
    await page.goto(
      `/iframe.html?id=agent-complete-screens--inline-comments&viewMode=story&globals=colorMode:${theme}`,
    );
    const quote = page.locator(
      '[data-placement="queue"] .ui-transcript-comment-quote',
    );
    await expect(quote).toBeVisible();
    await expect(quote.locator(".mira-markdown-preview")).toHaveCSS(
      "background-color",
      "rgba(0, 0, 0, 0)",
    );
    await expect(quote.locator("p")).toHaveCSS(
      "background-color",
      "rgba(0, 0, 0, 0)",
    );
    await expect(quote).toContainText("Keep the exact captured text");
    await expect(quote.locator("..")).not.toHaveCSS(
      "background-color",
      "rgba(0, 0, 0, 0)",
    );
  }
});

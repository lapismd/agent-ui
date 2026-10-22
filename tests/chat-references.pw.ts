import { test, expect, type Page } from "@playwright/test";
const diagnostics = new WeakMap<Page, string[]>();
test.beforeEach(({ page }) => {
  const errors: string[] = [];
  diagnostics.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
});
test.afterEach(({ page }) => {
  expect(diagnostics.get(page)).toEqual([]);
});

for (const story of [
  "paired-references",
  "jj-store-references",
  "classic-references",
]) {
  test(`Composer and preview share references: ${story}`, async ({ page }) => {
    await page.goto(
      `/iframe.html?id=agents-chat-message-composer--${story}&viewMode=story`,
      { waitUntil: "domcontentloaded" },
    );
    const preview = page.getByRole("region", { name: "Reference preview" });
    await expect(
      preview.locator('[data-ui-component="reference-chip"]'),
    ).toHaveCount(6);
    await expect(
      preview.getByRole("img", { name: ":lapis:", exact: true }),
    ).toHaveCount(1);
    await expect(preview.locator("code").first()).toContainText(
      "@Reviewer :lapis:",
    );
    const author = preview.getByText("Alex Morgan", { exact: true });
    await author.hover();
    const profile = page.getByRole("group", {
      name: "About Alex Morgan",
      exact: true,
    });
    await expect(profile).toContainText("@repository principal");
    await expect(
      profile.getByRole("button", { name: "Message", exact: true }),
    ).toBeDisabled();
    await preview.getByText("Alex Morgan", { exact: true }).click();
    await expect(page.getByTestId("reference-opened")).toContainText("person:");
    const editor = page
      .getByRole("group", { name: "Message composer", exact: true })
      .getByRole("textbox", { name: "Message", exact: true });
    const composer = page.getByRole("region", { name: "Reference composer" });
    await expect(composer.locator(".cm-lineNumbers")).toHaveCount(0);
    for (const checkbox of await composer
      .locator('.cm-task-line input[type="checkbox"]')
      .all()) {
      const visible = await checkbox.evaluate((element) => {
        const box = element.getBoundingClientRect();
        const scroller = element
          .closest(".cm-scroller")!
          .getBoundingClientRect();
        return box.left >= scroller.left;
      });
      expect(visible).toBe(true);
    }
    for (const surface of [composer, preview])
      for (const site of ["github", "forgejo"])
        await expect(surface.locator(`[data-link-site="${site}"]`)).toHaveCount(
          1,
        );
    for (const chip of await preview
      .locator(".ui-reference-chip__target")
      .all())
      await expect(chip).toHaveCSS("text-decoration-line", "none");
    await editor.click();
    await editor.press("ControlOrMeta+End");
    await editor.press("Enter");
    await editor.pressSequentially("@Alex");
    await page.getByRole("option", { name: /Alex Morgan/ }).waitFor();
    await editor.press("Tab");
    await expect(page.getByRole("option", { name: /Alex Morgan/ })).toHaveCount(
      0,
    );
    await expect(page.getByTestId("reference-source")).toContainText(
      story === "jj-store-references"
        ? "jj-store-member:"
        : "[Alex Morgan](/people/alex)",
    );
    await page
      .getByRole("region", { name: "Reference composer" })
      .getByRole("button", { name: "Remove Lapis Desktop", exact: true })
      .click();
    await expect(page.getByTestId("reference-source")).not.toContainText(
      "[Lapis Desktop]",
    );
    await editor.press("ControlOrMeta+z");
    await expect(page.getByTestId("reference-source")).toContainText(
      "[Lapis Desktop]",
    );
    await page.screenshot({
      path: `.local/review/${story}.png`,
      animations: "disabled",
    });
  });
}
for (const story of ["chat-references", "chat-references-classic"]) {
  test(`Complete chat retains rich actions and usable tool toggles: ${story}`, async ({
    page,
  }) => {
    await page.goto(
      `/iframe.html?id=agent-complete-screens--${story}&viewMode=story`,
      { waitUntil: "domcontentloaded" },
    );
    const block = page.getByRole("group", {
      name: "Captured tool output",
      exact: true,
    });
    await block.scrollIntoViewIfNeeded();
    await block.hover();
    const toggle = block.getByRole("button", {
      name: "Show raw capture",
      exact: true,
    });
    await toggle.click();
    await expect(
      block.getByRole("button", { name: "Show formatted output", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    const comment = block.getByRole("button", {
      name: "Comment on Captured tool output",
      exact: true,
    });
    await expect(comment).toHaveText("");
    await block
      .getByRole("button", {
        name: "More actions for Captured tool output",
        exact: true,
      })
      .click();
    await expect(
      page.getByRole("menuitem", { name: /Edit message/ }),
    ).toBeDisabled();
    await page
      .getByRole("menuitem", { name: "Copy message ID", exact: true })
      .click();
    await expect(page.getByTestId("reference-action")).toHaveText(
      "message-id:reference-tool",
    );
    await block.hover();
    await comment.click();
    const inline = page
      .getByRole("group", {
        name: "Inline comments on Captured tool output",
        exact: true,
      })
      .getByRole("textbox", {
        name: "Comment on Captured tool output",
        exact: true,
      });
    await inline.pressSequentially("@Alex");
    await page.getByRole("option", { name: /Alex Morgan/ }).waitFor();
    await inline.press("Enter");
    await expect(
      inline.locator('[data-ui-component="reference-chip"]'),
    ).toHaveCount(1);
    await expect(page.getByTestId("reference-comments")).toContainText(
      "[Alex Morgan](/people/alex)",
    );
    await page.screenshot({
      path: `.local/review/${story}.png`,
      animations: "disabled",
    });
  });
}
test("Complete host routing is explicit and the authored mention stays exact", async ({
  page,
}) => {
  for (const [story, expected] of [
    ["chat-jj-store-references", ""],
    ["chat-host-routing", "2".repeat(32)],
  ]) {
    await page.goto(
      `/iframe.html?id=agent-complete-screens--${story}&viewMode=story`,
      { waitUntil: "domcontentloaded" },
    );
    const editor = page
      .getByRole("group", { name: "Message composer", exact: true })
      .getByRole("textbox", { name: "Message", exact: true });
    await editor.click();
    await editor.press("ControlOrMeta+Enter");
    await expect(page.getByTestId("reference-source")).toHaveText("");
    await expect(editor.locator(".cm-placeholder")).toBeVisible();
    await expect(page.getByTestId("reference-recipients")).toHaveText(expected);
  }
});

test("A fully unavailable hover bar is absent while tool controls remain usable", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=agent-complete-screens--chat-read-only-references&viewMode=story",
    { waitUntil: "domcontentloaded" },
  );
  await expect(page.getByRole("group", { name: /^Actions for / })).toHaveCount(
    0,
  );
  const block = page.getByRole("group", {
    name: "Captured tool output",
    exact: true,
  });
  await block
    .getByRole("button", { name: "Show raw capture", exact: true })
    .click();
  await expect(
    block.getByRole("button", { name: "Show formatted output", exact: true }),
  ).toBeVisible();
});

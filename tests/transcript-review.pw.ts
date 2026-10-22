import { test, expect } from "@playwright/test";
test("Inline comment hover actions stay in the row before the T", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=agent-complete-screens--inline-comments&viewMode=story",
  );
  const card = page
    .locator('.ui-transcript-comment-card[data-status="draft"]')
    .first();
  const editor = card.getByRole("textbox");
  await editor.click();
  await card.hover();
  const actions = card.locator(".ui-transcript-comment-links");
  const toggle = card.getByRole("button", {
    name: "Comment formatting options",
  });
  await expect(actions).toHaveCSS("opacity", "1");
  const controls = await actions.boundingBox();
  const formatting = await toggle.boundingBox();
  expect(Math.abs(controls!.y - formatting!.y)).toBeLessThanOrEqual(1);
  expect(controls!.x + controls!.width).toBeLessThanOrEqual(formatting!.x);
  const row = await card.locator(".ui-comment-composer__card").boundingBox();
  expect(
    Math.abs(formatting!.x + formatting!.width - row!.x - row!.width),
  ).toBeLessThanOrEqual(1);
  const heading = page.getByRole("heading", {
    name: "Review workspace changes",
    exact: true,
  });
  await heading.click();
  await heading.hover();
  await expect(actions).toHaveCSS("opacity", "0");
  await expect(card.locator(".ui-comment-composer__actions")).toHaveCSS(
    "position",
    "absolute",
  );
  await expect(editor).toHaveText("Keep this captured wording.");
});
test.beforeEach(({ page }) => {
  page.on("pageerror", (error) =>
    console.error("Transcript browser error:", error.message),
  );
  page.on("console", (message) => {
    if (message.type() === "error")
      console.error("Transcript console error:", message.text());
  });
});
test("Context and handoff prose match message typography", async ({ page }) => {
  await page.goto(
    "/iframe.html?id=agents-chat-transcript--typography&viewMode=story",
  );
  await page
    .getByRole("button", { name: "Workspace context", exact: true })
    .click();
  const prose = page
    .locator('[data-block-id="answer/body"] .cm-content')
    .first();
  await expect(prose).toBeVisible();
  const size = await prose.evaluate((el) => getComputedStyle(el).fontSize);
  const context = page
    .getByRole("group", { name: "Admitted workspace", exact: true })
    .locator('[data-ui-component="chat-markdown"] p')
    .first();
  const handoff = page
    .getByRole("group", { name: "Handoff context", exact: true })
    .locator('[data-ui-component="chat-markdown"] p')
    .first();
  await expect(context).toHaveCSS("font-size", size);
  await expect(handoff).toHaveCSS("font-size", size);
});
test("All messages includes Desktop errors, ACP context and saved turn changes", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=agent-complete-screens--all-messages&viewMode=story",
  );
  await expect(
    page.getByRole("alert", { name: "Turn interrupted", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Saved turn changes", exact: true }),
  ).toBeVisible();
  const sent = page.locator('[data-chat-item="prompt"]');
  await sent.getByRole("button", { name: "Sent context", exact: true }).click();
  await expect(sent).toContainText("lapis_context");
  await expect(sent).toContainText("lapis-context");
});
test("Retained unavailable comments have a gap between rows", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=agents-chat-transcript--stale-comments&viewMode=story",
  );
  const cards = page.locator(".ui-transcript-stale > [data-chat-comment-area]");
  await expect(cards).toHaveCount(2);
  const first = await cards.nth(0).boundingBox(),
    second = await cards.nth(1).boundingBox();
  expect(second!.y - first!.y - first!.height).toBeGreaterThanOrEqual(8);
});
test("Document failed send stays below the saved composer draft", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=agent-complete-screens--chat-error&viewMode=story",
  );
  await expect(
    page.getByRole("region", { name: "AI conversation", exact: true }),
  ).toBeVisible({ timeout: 30000 });
  const composer = page.locator("[data-transcript-composer]");
  await expect(
    composer.getByRole("textbox", { name: "Message", exact: true }),
  ).toHaveText("Retain my exact authored draft.");
  const metadata = composer.getByRole("group", {
    name: "Composer feedback",
    exact: true,
  });
  await expect(metadata).toContainText(
    "The simulated host refused this action.",
  );
  const editor = await composer
    .getByRole("textbox", { name: "Message", exact: true })
    .boundingBox();
  const status = await metadata.boundingBox();
  expect(status!.y).toBeGreaterThanOrEqual(editor!.y + editor!.height);
  await expect(page.locator('[data-chat-item="failed-prompt"]')).toHaveCount(0);
  await expect(
    page.locator('.ui-transcript-body-footer [role="alert"]'),
  ).toHaveCount(0);
  await page.screenshot({
    path: ".local/review/error-document.png",
    animations: "disabled",
  });
});
test("Document composer keeps the trailing document buffer", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=agents-chat-transcript--basic&viewMode=story",
  );
  await expect(
    page.getByRole("region", { name: "AI conversation", exact: true }),
  ).toBeVisible({ timeout: 30000 });
  const composer = page.locator("[data-transcript-composer]");
  await expect(composer).toHaveCSS("padding-bottom", "64px");
  await page.setViewportSize({ width: 420, height: 900 });
  await expect(composer).toHaveCSS("padding-bottom", "48px");
  await page
    .getByRole("button", { name: "Switch to Classic view", exact: true })
    .click();
  await expect(composer).toHaveCSS("padding-bottom", "16px");
});
test("Classic failed send shares the attached composer error feedback", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=agents-chat-transcript--classic-error&viewMode=story",
  );
  await expect(
    page.getByRole("region", { name: "AI conversation", exact: true }),
  ).toBeVisible({ timeout: 30000 });
  const footer = page.locator(".ui-transcript-body-footer");
  await expect(
    footer.locator('[data-ui-component="composer-status-banner"]'),
  ).toHaveCount(0);
  const error = page
    .getByRole("group", { name: "Composer feedback", exact: true })
    .getByRole("alert");
  await expect(error).toContainText("The simulated host refused this action.");
  await expect(
    page.getByRole("group", { name: "Composer feedback", exact: true }),
  ).toHaveCount(1);
  await expect(
    page
      .locator("[data-transcript-composer]")
      .getByRole("textbox", { name: "Message", exact: true }),
  ).toHaveText("Retain my exact authored draft.");
  await expect(page.getByTestId("agent-story-state")).toHaveAttribute(
    "data-calls",
    "1",
  );
  await page.screenshot({
    path: ".local/review/error-classic.png",
    animations: "disabled",
  });
});
test("Tool result uses one reusable icon-only view toggle", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=agents-tool-calls-tool-result--basic&viewMode=story",
  );
  const toggle = page.getByRole("button", {
    name: "Show raw capture",
    exact: true,
  });
  await expect(toggle).toHaveText("");
  await toggle.click();
  await expect(
    page.getByRole("button", { name: "Show formatted output", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("group", { name: "json", exact: true }),
  ).toContainText('"capture":"exact"');
  await page
    .getByRole("button", { name: "Show formatted output", exact: true })
    .click();
  await page.screenshot({
    path: ".local/review/tool-result.png",
    animations: "disabled",
  });
});
test("Read-file overlay shares the icon-only view toggle", async ({ page }) => {
  await page.goto(
    "/iframe.html?id=agents-chat-tool-inspector--code&viewMode=story",
  );
  await page.getByRole("button", { name: "Show source", exact: true }).click();
  const formatted = page.getByRole("button", {
    name: "Show formatted output",
    exact: true,
  });
  await expect(formatted).toHaveAttribute("aria-pressed", "true");
  await formatted.click();
  await expect(
    page.getByRole("button", { name: "Show source", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  await page.screenshot({
    path: ".local/review/read-file-overlay.png",
    animations: "disabled",
  });
});

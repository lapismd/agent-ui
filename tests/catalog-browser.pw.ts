import { readFileSync } from "node:fs";
import { test, expect, type Page } from "@playwright/test";
const tokens = JSON.parse(
  readFileSync(
    new URL(
      "../packages/agent-ui/src/chat/transcript/AgentTranscript.tokens.json",
      import.meta.url,
    ),
    "utf8",
  ),
);
const errors = new WeakMap<Page, string[]>();
test.beforeEach(({ page }) => {
  const messages: string[] = [];
  errors.set(page, messages);
  page.on("pageerror", (error) => messages.push(error.message));
});
test.afterEach(({ page }) => {
  expect(errors.get(page)).toEqual([]);
});
test("Markdown anatomy and styling tables render semantic rows", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=agents-chat-transcript--docs&viewMode=docs",
    {
      waitUntil: "domcontentloaded",
    },
  );
  await expect(page.locator("#transcript")).toBeVisible({ timeout: 30000 });
  const anatomy = page.locator("#anatomy + table");
  await expect(anatomy).toBeVisible();
  await expect(anatomy.getByRole("row")).toHaveCount(5);
  await expect(anatomy).toContainText("Captured items");
  const styles = page.locator("#styling-variables + p + table");
  await expect(styles).toContainText("--ui-transcript-max-width");
  await expect(styles.getByRole("row")).toHaveCount(
    tokens.variables.length + 1,
  );
  await expect(styles).toContainText("62rem");
  await page.screenshot({ path: ".local/agent-transcript-docs.png" });
});
test("Docs shell previews are bounded and flush while Canvas fills the viewport", async ({
  page,
}) => {
  test.setTimeout(60000);
  await page.goto("/iframe.html?id=agents-chat-transcript--docs&viewMode=docs");
  const preview = page.locator(".docs-story .sb-story").first();
  await preview.scrollIntoViewIfNeeded();
  await expect(preview.locator(".foundation-host")).toBeVisible();
  await expect(preview).toHaveCSS("padding", "0px");
  await expect(preview.locator(".foundation-host")).toHaveCSS(
    "height",
    "640px",
  );
  await page.goto(
    "/iframe.html?id=agents-chat-transcript--basic&viewMode=story",
  );
  await expect(page.locator(".foundation-host")).toHaveCSS("height", "900px");
  await page.goto("/iframe.html?id=agent-complete-screens--docs&viewMode=docs");
  const screen = page.locator(".docs-story .sb-story").first();
  await screen.scrollIntoViewIfNeeded();
  await expect(screen.locator(".agent-demo")).toBeVisible({ timeout: 30000 });
  await expect(screen).toHaveCSS("padding", "0px");
  await expect(screen.locator(".agent-demo")).toHaveCSS("height", "640px");
});
test("Theme dropdown and mode toggle preserve authored draft and exact comments", async ({
  page,
}) => {
  await page.goto("/?path=/story/agents-chat-transcript--inline-comments");
  const frame = page.frameLocator("#storybook-preview-iframe");
  const editor = frame
    .getByRole("group", { name: "Message composer" })
    .getByRole("textbox", { name: "Message" });
  await editor.fill("Preserve this authored draft across themes");
  const state = frame.getByTestId("agent-story-state");
  const anchors = await state.getAttribute("data-anchors");
  expect(anchors).toContain("captured-v1");
  await page.getByTitle("Switch to dark mode", { exact: true }).click();
  await expect(frame.locator("html")).toHaveClass(/dark/);
  await expect(editor).toHaveText("Preserve this authored draft across themes");
  await expect(state).toHaveAttribute("data-anchors", anchors!);
  await page.getByRole("button", { name: /Brand theme/ }).click();
  await page.getByText("Default", { exact: true }).click();
  await expect(frame.locator("html")).toHaveAttribute(
    "data-ui-theme",
    "default",
  );
  await expect(editor).toHaveText("Preserve this authored draft across themes");
  await expect(state).toHaveAttribute("data-anchors", anchors!);
});

test("Settings page includes JJ Store path controls without an extra action row", async ({
  page,
}) => {
  for (const width of [1280, 420]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(
      "/iframe.html?id=jj-settings-settings-page--basic&viewMode=story",
    );
    const card = page.getByRole("region", {
      name: "Selected folder",
      exact: true,
    });
    const open = card.getByRole("button", {
      name: "Open repository folder",
      exact: true,
    });
    const copy = card.getByRole("button", {
      name: "Copy full Folder path: /Users/example/code/example-repository",
      exact: true,
    });
    await expect(open).toBeVisible();
    await expect(copy).toBeVisible();
    await page.evaluate(() =>
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: async (value: string) => {
            (window as unknown as { copied: string }).copied = value;
          },
        },
      }),
    );
    await copy.focus();
    await page.keyboard.press("Enter");
    await expect(
      card.getByText("Folder path copied", { exact: true }),
    ).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(() => (window as unknown as { copied: string }).copied),
      )
      .toBe("/Users/example/code/example-repository");
    await open.focus();
    await expect(open).toBeFocused();
    const bounds = await card.boundingBox(),
      action = await open.boundingBox();
    expect(action!.height).toBe(24);
    expect(action!.x).toBeGreaterThan(bounds!.x + 16);
    expect(
      bounds!.x + bounds!.width - action!.x - action!.width,
    ).toBeGreaterThan(16);
    await expect(card).toHaveJSProperty(
      "scrollWidth",
      await card.evaluate((node) => node.clientWidth),
    );
  }
});

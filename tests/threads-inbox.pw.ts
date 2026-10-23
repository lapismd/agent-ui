import { test, expect } from "@playwright/test";
const story = (variant: string) =>
  `/iframe.html?id=agents-complete-screens-threads--${variant}&viewMode=story`;
for (const width of [420, 1280])
  test(`Threads keep scoped drafts and reachable conversation at ${width}px`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({ width, height: 900 });
    await page.goto(story("layout"));
    const a = page.getByRole("group", {
        name: "Agent UI Threads",
        exact: true,
      }),
      b = page.getByRole("group", { name: "JJ Desktop Threads", exact: true });
    await a
      .getByRole("button", { name: /Open Thread Review shared screens/ })
      .click();
    await expect(
      page.getByText("Saved conversation in Agent UI.", { exact: true }),
    ).toBeVisible();
    const editor = page
      .getByRole("group", { name: "Message composer", exact: true })
      .getByRole("textbox", { name: "Message", exact: true });
    await editor.fill("Retain this Agent UI draft");
    await page
      .getByRole("button", { name: "Toggle thread conversations", exact: true })
      .click();
    if (width === 1280)
      await page
        .getByRole("button", {
          name: "Toggle thread conversations",
          exact: true,
        })
        .click();
    await b
      .getByRole("button", { name: /Open Thread Review shared screens/ })
      .click();
    await expect(
      page.getByText("Saved conversation in JJ Desktop.", { exact: true }),
    ).toBeVisible();
    await expect(editor).not.toContainText("Retain this Agent UI draft");
    await expect(
      page.getByRole("button", { name: "Send message", exact: true }),
    ).toBeDisabled();
    await page
      .getByRole("button", { name: "Toggle thread conversations", exact: true })
      .click();
    if (width === 1280)
      await page
        .getByRole("button", {
          name: "Toggle thread conversations",
          exact: true,
        })
        .click();
    await a
      .getByRole("button", { name: /Open Thread Review shared screens/ })
      .click();
    await expect(editor).toHaveText("Retain this Agent UI draft");
    await expect(
      page
        .locator('[data-repository-id="a"] [data-ui-part="inbox-conversation"]')
        .first(),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(
      page
        .locator('[data-repository-id="b"] [data-ui-part="inbox-conversation"]')
        .first(),
    ).toHaveAttribute("aria-pressed", "false");
    await page.screenshot({ path: `.local/threads-review-${width}.png` });
    expect(errors).toEqual([]);
  });
test("Threads list resizes with the keyboard and resets to source width", async ({
  page,
}) => {
  await page.goto(story("layout"));
  const list = page.getByRole("complementary", {
    name: "Thread conversations",
    exact: true,
  });
  const rail = page.getByRole("button", {
    name: "Resize thread conversations",
    exact: true,
  });
  await expect(rail).toBeVisible();
  const before = (await list.boundingBox())!.width;
  await rail.focus();
  await rail.press("ArrowRight");
  await expect
    .poll(async () => (await list.boundingBox())!.width)
    .toBeGreaterThan(before);
  await rail.dblclick();
  await expect.poll(async () => (await list.boundingBox())!.width).toBe(before);
});

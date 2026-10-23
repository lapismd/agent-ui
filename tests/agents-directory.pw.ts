import { expect, test } from "@playwright/test";

const story = (variant: string) =>
  `/iframe.html?id=agents-complete-screens-agents--${variant}&viewMode=story`;

for (const width of [320, 420, 1280])
  test(`configured agents preserve source geometry at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(story("layout"));
    const card = page.locator('[data-agent-id="builder"]');
    await expect(card).toBeVisible();
    const geometry = await card.evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      const avatar = element
        .querySelector('[data-ui-component="avatar"]')!
        .getBoundingClientRect();
      return {
        height: bounds.height,
        avatar: avatar.width,
        end: bounds.right,
        viewport: innerWidth,
      };
    });
    if (width === 1280)
      await page.screenshot({ path: ".local/agents-gallery-review.png" });
    expect(geometry.height).toBe(260);
    expect(geometry.avatar).toBe(96);
    expect(geometry.end).toBeLessThanOrEqual(geometry.viewport);
    await expect(
      page.getByRole("article", { name: "Builder agent profile" }),
    ).toHaveCount(0);
    await page
      .getByRole("button", { name: "View Builder", exact: true })
      .click();
    await expect(
      page.getByRole("article", { name: "Builder agent profile" }),
    ).toBeVisible();
    if (width === 1280 || width === 320)
      await page.screenshot({
        path: `.local/agents-profile-${width}-review.png`,
      });
    await page.getByRole("button", { name: "Close agent details" }).click();
    await expect(
      page.getByRole("button", { name: "View Builder", exact: true }),
    ).toBeFocused();
  });

test("configuration cancellation retains the host draft and saves only explicitly", async ({
  page,
}) => {
  await page.goto(story("empty"));
  await page.getByRole("button", { name: "Add agent", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Add agent", exact: true });
  await dialog
    .getByRole("textbox", { name: "Agent name" })
    .fill("Retained draft");
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "View Retained draft", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Add agent", exact: true }).click();
  await expect(dialog.getByRole("textbox", { name: "Agent name" })).toHaveValue(
    "Retained draft",
  );
  await dialog.getByRole("button", { name: "Save agent", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "View Retained draft", exact: true }),
  ).toBeVisible();
});

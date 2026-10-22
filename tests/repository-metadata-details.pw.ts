import { expect, test } from "@playwright/test";
for (const [variant, label] of [
  ["basic", "Repository directory"],
  ["source", "Selected file metadata"],
]) {
  test(`Files ${variant}: summary disclosure reveals shared recorded commit details below the row`, async ({
    page,
  }) => {
    await page.goto(
      `/iframe.html?id=jj-complete-screens-files--${variant}&viewMode=story`,
    );
    const metadata = page.getByRole("region", { name: label, exact: true });
    await expect(metadata).toBeVisible({ timeout: 30000 });
    const toggle = metadata.getByRole("button", {
      name: "Show commit description",
      exact: true,
    });
    await expect(toggle).toBeVisible({ timeout: 3000 });
    const row =
      variant === "basic"
        ? metadata.locator(".repository-browser__file-browser-summary")
        : metadata;
    const before = await row.boundingBox();
    const collapsedBackground = await toggle.evaluate(
      (node) => getComputedStyle(node).backgroundColor,
    );
    await toggle.click();
    const expandedToggle = metadata.getByRole("button", {
      name: "Hide commit description",
      exact: true,
    });
    await page
      .getByRole("button", { name: "Resize repository file tree", exact: true })
      .hover();
    await expect
      .poll(() =>
        expandedToggle.evaluate(
          (node) => getComputedStyle(node).backgroundColor,
        ),
      )
      .not.toBe(collapsedBackground);
    const details = page.getByRole("region", {
      name: "Commit message body",
      exact: true,
    });
    await expect(details).toBeVisible();
    await expect(
      metadata.getByRole("region", {
        name: "Commit message body",
        exact: true,
      }),
    ).toBeVisible();
    const attached = metadata.locator(".repository-commit-details");
    await expect(attached).toHaveCSS("border-top-width", "1px");
    await expect(details).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    const card =
      variant === "basic"
        ? metadata.locator(".repository-browser__file-browser-card")
        : metadata;
    const cardBox = await card.boundingBox(),
      panelBox = await attached.boundingBox();
    expect(Math.abs(panelBox!.x - cardBox!.x - 1)).toBeLessThanOrEqual(1);
    expect(Math.abs(panelBox!.width - cardBox!.width + 2)).toBeLessThanOrEqual(
      1,
    );
    await expect(details).toHaveCSS("padding-top", "8px");
    await expect(details).toHaveCSS("padding-bottom", "0px");
    await expect(details).toHaveCSS("padding-left", "8px");
    await expect(details).toHaveCSS("margin-top", "0px");
    await expect(details).toHaveCSS("margin-bottom", "0px");
    await expect(details).toContainText("Preserve the selected operation pin");
    expect((await details.boundingBox())!.y).toBeGreaterThanOrEqual(
      before!.y + before!.height,
    );
    await expect(details.locator(".mira-markdown-preview")).toHaveCSS(
      "background-color",
      "rgba(0, 0, 0, 0)",
    );
    await details
      .getByRole("button", { name: "View more of commit message", exact: true })
      .click();
    await expect(
      details.getByRole("button", {
        name: "View less of commit message",
        exact: true,
      }),
    ).toBeVisible();
    await metadata
      .getByRole("button", { name: "Hide commit description", exact: true })
      .click();
    await expect(details).toHaveCount(0);
    await expect(page.getByTestId("browser-state")).toHaveAttribute(
      "data-actions",
      "",
    );
  });
}

import { expect, test } from "@playwright/test";

for (const kind of ["jj-log", "op-log"]) {
  test(`${kind} uses row-specific avatar positions and scrolls a wide paged graph`, async ({
    page,
  }) => {
    await page.goto(
      `/iframe.html?id=jj-complete-screens-${kind}--dense-history&viewMode=story`,
    );
    await page
      .getByRole("button", {
        name:
          kind === "jj-log" ? "Review selected revision" : "Review operation",
        exact: true,
      })
      .waitFor();
    const graph = page.locator(".repository-graph");
    await expect(graph.locator(":scope > li")).toHaveCount(12);
    const avatars = await graph
      .locator(".repository-graph-row > .repository-review-author-avatar")
      .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().x));
    expect(new Set(avatars).size).toBeGreaterThan(1);
    expect(
      Number(await graph.locator("svg").first().getAttribute("width")),
    ).toBeGreaterThanOrEqual(200);
    const more = page.getByRole("button", {
      name: kind === "jj-log" ? "More revisions" : "More operations",
      exact: true,
    });
    await expect(more).toHaveCSS("font-weight", "400");
    await more.click();
    await expect(graph.locator(":scope > li")).toHaveCount(24);
    const scroll = await graph.evaluate((el) => {
      let parent = el.parentElement;
      while (
        parent &&
        !/(auto|scroll)/.test(getComputedStyle(parent).overflowY)
      )
        parent = parent.parentElement;
      return parent
        ? { height: parent.clientHeight, content: parent.scrollHeight }
        : null;
    });
    expect(scroll!.content).toBeGreaterThan(scroll!.height);
  });

  test(`${kind} uses the shared syntax editor and autocomplete`, async ({
    page,
  }) => {
    await page.goto(
      `/iframe.html?id=jj-complete-screens-${kind}--dense-history&viewMode=story`,
    );
    await page
      .getByRole("button", {
        name: kind === "jj-log" ? "Search revisions" : "Search operations",
        exact: true,
      })
      .click();
    const editor = page.getByRole("searchbox", {
      name: kind === "jj-log" ? "Revision query" : "Operation query",
      exact: true,
    });
    await expect(editor).toHaveAttribute("contenteditable", "true");
    await editor.fill(kind === "jj-log" ? "anc" : "des");
    await editor.press("Control+Space");
    const option = page.getByRole("option").filter({
      hasText: kind === "jj-log" ? "ancestors(revisions)" : "description:",
    });
    await expect(option).toBeVisible();
    await editor.press("Tab");
    await expect(editor).toContainText(
      kind === "jj-log" ? "ancestors(revisions)" : "description:",
    );
    await page
      .getByRole("button", { name: "Query context and syntax", exact: true })
      .click();
    await expect(
      page.getByText(/Ctrl\/Cmd\+Space opens completion/),
    ).toBeVisible();
  });
}

test("changed files retain conflict markers and loaded folder totals", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=jj-complete-screens-op-log--conflicts&viewMode=story",
  );
  const conflict = page.locator('[data-file-path="src/history/query.ts"]');
  await expect(conflict).toHaveAttribute("data-conflicted", "true");
  await expect(
    conflict.getByRole("img", { name: "Conflicted", exact: true }),
  ).toBeVisible();
  const folder = page.locator('[data-directory-path="src/history"]');
  await expect(folder).toContainText("+13");
  await expect(folder).toContainText("-6");
  await folder.click();
  await expect(folder).toContainText("+13");
  await expect(conflict).toHaveCount(0);
});

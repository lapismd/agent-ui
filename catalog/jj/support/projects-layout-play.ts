import { expect, userEvent, within } from "storybook/test";

/** Exercise the rendered layout, not only the control's selected value. */
export async function exerciseProjectLayouts(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  async function expectSourceAvatars(region: HTMLElement) {
    for (const avatar of region.querySelectorAll(
      '[data-ui-component="avatar"]',
    )) {
      const rect = avatar.getBoundingClientRect();
      await expect(rect.width).toBeCloseTo(24, 0);
      await expect(rect.height).toBeCloseTo(24, 0);
    }
  }
  async function toggle(tab: string, list: string) {
    await userEvent.click(canvas.getByRole("tab", { name: tab }));
    await canvas.findAllByRole("list", { name: list });
    await expect(
      canvas.getAllByRole("button", { name: /^Show (cards|list)$/ }),
    ).toHaveLength(1);
    await userEvent.click(canvas.getByRole("button", { name: "Show cards" }));
    await expect(
      canvas.getByRole("button", { name: "Show list" }),
    ).toHaveFocus();
    for (const region of canvas.getAllByRole("list", { name: list })) {
      await expect(region).toHaveAttribute("data-layout", "grid");
      await expectSourceAvatars(region);
      const items = within(region).getAllByRole("listitem");
      const container = region.getBoundingClientRect();
      await expect(items.length).toBeGreaterThan(1);
      await expect(region.scrollWidth).toBeLessThanOrEqual(
        region.clientWidth + 1,
      );
      for (const item of items) {
        const card = item.querySelector("article")!;
        const timestamp = card.querySelector("time");
        if (timestamp) {
          const date = timestamp.getBoundingClientRect();
          await expect(date.height).toBeGreaterThan(0);
          await expect(date.height).toBeLessThan(24);
          await expect(date.right).toBeLessThanOrEqual(
            card.getBoundingClientRect().right,
          );
          if (list === "Project tasks")
            await expect(date.top).toBeGreaterThanOrEqual(
              card
                .querySelector(".community-projects__task-repository")!
                .getBoundingClientRect().bottom,
            );
        }
        const projectTitle = card.querySelector<HTMLElement>(
          ".community-projects__card-copy strong",
        );
        if (projectTitle)
          await expect(projectTitle.scrollWidth).toBeLessThanOrEqual(
            projectTitle.clientWidth + 1,
          );
        await expect(card.scrollWidth).toBeLessThanOrEqual(
          card.clientWidth + 1,
        );
        await expect(item.getBoundingClientRect().right).toBeLessThanOrEqual(
          container.right + 1,
        );
      }
      const columns = getComputedStyle(region)
        .gridTemplateColumns.split(" ")
        .filter((v) => parseFloat(v) > 0);
      if (container.width > 900) {
        await expect(columns.length).toBeGreaterThan(1);
        await expect(items[0].getBoundingClientRect().top).toBeCloseTo(
          items[1].getBoundingClientRect().top,
          0,
        );
      } else if (container.width < 500) {
        await expect(columns).toHaveLength(1);
        await expect(items[1].getBoundingClientRect().top).toBeGreaterThan(
          items[0].getBoundingClientRect().top,
        );
      }
    }
    await userEvent.keyboard(" ");
    await expect(
      canvas.getByRole("button", { name: "Show cards" }),
    ).toHaveFocus();
    for (const region of canvas.getAllByRole("list", { name: list })) {
      await expect(region).toHaveAttribute("data-layout", "list");
      await expectSourceAvatars(region);
    }
  }
  for (const [tab, list] of [
    ["Projects", "Projects"],
    ["Tasks", "Project tasks"],
    ["Reviews", "Reviews"],
    ["Repositories", "Repositories"],
  ])
    await toggle(tab, list);
  await userEvent.click(canvas.getByRole("tab", { name: "Projects" }));
  await userEvent.click(
    (
      await canvas.findAllByRole("button", {
        name: "Open project Repository toolkit",
      })
    )[0],
  );
  for (const [tab, list] of [
    ["Tasks", "Project tasks"],
    ["Reviews", "Reviews"],
    ["Repositories", "Repositories"],
  ])
    await toggle(tab, list);
  await userEvent.click(canvas.getByRole("link", { name: /^Projects$/ }));
  await userEvent.click(
    await canvas.findByRole("button", { name: "Show cards" }),
  );
}

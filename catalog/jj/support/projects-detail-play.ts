import { expect, userEvent, within } from "storybook/test";

export async function exerciseReviewDetail(element: HTMLElement) {
  const canvas = within(element);
  const detail = await canvas.findByRole("article", { name: "Review details" });
  const review = within(detail);
  const activity = review.getByRole("region", { name: "Review activity" });
  const heading = within(activity)
    .getByRole("button", { name: "Activity" })
    .getBoundingClientRect();
  const commit = activity.querySelector(".community-projects__activity-item")!;
  const avatar = commit
    .querySelector('[data-ui-component="avatar"]')!
    .getBoundingClientRect();
  const comment = within(activity).getByRole("list", {
    name: "Review comments",
  });
  const commentAvatar = comment
    .querySelector('[data-ui-component="avatar"]')!
    .getBoundingClientRect();
  const commentText = comment
    .querySelector(
      '[data-ui-component="ai-chat-message"] > [data-ui-part="content"]',
    )!
    .getBoundingClientRect();
  await expect(avatar.width).toBeCloseTo(32, 0);
  await expect(avatar.left - heading.left).toBeCloseTo(24, 0);
  await expect(commentAvatar.width).toBeCloseTo(36, 0);
  await expect(commentAvatar.left - heading.left).toBeCloseTo(12, 0);
  await expect(commentText.left - heading.left).toBeCloseTo(56, 0);
  await expect(review.getByText("Anchor", { exact: true })).toBeVisible();
  await expect(review.getByText("Author", { exact: true })).toBeVisible();
  await expect(review.getByText("Snapshot", { exact: true })).toBeVisible();
  await expect(
    review.getByRole("region", { name: "Review content" }),
  ).toBeVisible();
  for (const name of ["Description", "Files changed", "Commits", "Activity"])
    await expect(review.getByRole("button", { name })).toBeVisible();
}

export async function exerciseTaskHover(element: HTMLElement) {
  const canvas = within(element);
  await canvas.findByRole("article", { name: "Task details" });
  const trigger = canvas.getByRole("button", {
    name: "Description",
  });
  trigger.focus();
  await userEvent.keyboard("{Enter}");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await userEvent.keyboard("{Enter}");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  const refresh = canvas.getByRole("button", { name: "Refresh projects" });
  const chat = canvas.getByRole("button", { name: "Chat about this view" });
  await expect(chat.getBoundingClientRect().top).toBeCloseTo(
    refresh.getBoundingClientRect().top,
    0,
  );
}

export async function exerciseReviewActions(element: HTMLElement) {
  await exerciseReviewDetail(element);
  const canvas = within(element);
  const review = within(
    canvas.getByRole("article", { name: "Review details" }),
  );
  await userEvent.click(review.getByRole("button", { name: "Files changed" }));
  await expect(await review.findByText("1 changed files")).toBeVisible();
  await userEvent.click(
    review.getByRole("checkbox", { name: "Mark src/context.ts as viewed" }),
  );
  await expect(
    review.getByRole("checkbox", { name: "Mark src/context.ts as viewed" }),
  ).toBeChecked();
  await userEvent.click(review.getByRole("button", { name: "Commits" }));
  await userEvent.click(
    review.getByRole("button", {
      name: "Open review commit Retain the recorded code target",
    }),
  );
  await expect(canvas.getByLabelText("Host navigation")).toHaveTextContent(
    "Open commit: portable-beta:a3affd3",
  );
  await userEvent.click(
    review.getByRole("button", { name: /Copy full review root/ }),
  );
  await expect(canvas.getByLabelText("Host navigation")).toHaveTextContent(
    "Copied: 86f2f212",
  );
  const input = await review.findByRole("textbox", { name: "Add comment" });
  await userEvent.type(input, "Retained while resolved");
  await userEvent.click(review.getByRole("button", { name: "Resolve" }));
  await review.findByRole("button", { name: "Reopen" });
  await expect(input).toHaveTextContent("Retained while resolved");
  await userEvent.click(review.getByRole("button", { name: "Reopen" }));
  await userEvent.click(review.getByRole("button", { name: "Send comment" }));
  await expect(
    await review.findByText("Retained while resolved"),
  ).toBeVisible();
  await userEvent.click(review.getByRole("button", { name: "Resolve" }));
  await review.findByRole("button", { name: "Reopen" });
  await expect(
    review.queryByRole("textbox", { name: "Add comment" }),
  ).toBeNull();
  await userEvent.click(review.getByRole("button", { name: "Reopen" }));
  await expect(
    await review.findByRole("textbox", { name: "Add comment" }),
  ).toBeVisible();
}
export async function exerciseReviewUnavailable(element: HTMLElement) {
  const review = within(
    await within(element).findByRole("article", { name: "Review details" }),
  );
  await userEvent.click(review.getByRole("button", { name: "Files changed" }));
  await expect(
    await within(
      review.getByRole("region", { name: "Review file comparison" }),
    ).findByText("Review context unavailable"),
  ).toBeVisible();
  await userEvent.click(review.getByRole("button", { name: "Retry" }));
  await expect(review.queryByLabelText("Changed files")).toBeNull();
}
export async function exerciseReviewReadOnly(element: HTMLElement) {
  const review = within(
    await within(element).findByRole("article", { name: "Review details" }),
  );
  await expect(review.queryByRole("button", { name: "Resolve" })).toBeNull();
  await expect(
    review.queryByRole("textbox", { name: "Add comment" }),
  ).toBeNull();
  await expect(
    review.getByRole("list", { name: "Review comments" }),
  ).toBeVisible();
}

export async function exerciseReviewRecovery(element: HTMLElement) {
  const canvas = within(element);
  const review = within(
    await canvas.findByRole("article", { name: "Review details" }),
  );
  await userEvent.click(review.getByRole("button", { name: "Resolve" }));
  await expect(
    await canvas.findByRole("region", { name: "Pending metadata request" }),
  ).toBeVisible();
  await expect(review.getByRole("button", { name: "Resolve" })).toBeDisabled();
  await userEvent.click(canvas.getByRole("button", { name: "Check outcome" }));
  await expect(
    await review.findByRole("button", { name: "Reopen" }),
  ).toBeEnabled();
  await expect(
    canvas.queryByRole("region", { name: "Pending metadata request" }),
  ).toBeNull();
}

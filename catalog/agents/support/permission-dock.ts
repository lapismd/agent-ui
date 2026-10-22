import { expect, within, userEvent, waitFor } from "storybook/test";

export async function verifyPermissionDock({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) {
  const c = within(canvasElement);
  for (const next of ["Classic", "Document"]) {
    const dock = c.getByRole("group", {
      name: "Permission request",
    });
    expect(dock.closest(".ui-transcript-body-footer")).not.toBeNull();
    expect(
      c.queryByRole("group", { name: "Message composer" }),
    ).not.toBeInTheDocument();
    expect(c.getByRole("button", { name: "Allow once" })).toBeVisible();
    const top = dock.getBoundingClientRect().top;
    const viewport = canvasElement.querySelector<HTMLElement>(
      '.ui-transcript-viewport > [data-ui-part="scroll-area-viewport"]',
    )!;
    await waitFor(() =>
      expect(viewport.scrollHeight).toBeGreaterThan(
        viewport.clientHeight + 100,
      ),
    );
    viewport.scrollTop = 0;
    if (next === "Classic") {
      const ticks = Number(
        c.getByTestId("permission-stream-state").dataset.ticks,
      );
      await waitFor(() =>
        expect(
          Number(c.getByTestId("permission-stream-state").dataset.ticks),
        ).toBeGreaterThan(ticks),
      );
    }
    await waitFor(() =>
      expect(
        Math.abs(dock.getBoundingClientRect().top - top),
      ).toBeLessThanOrEqual(1),
    );
    await userEvent.click(
      c.getByRole("button", { name: "Collapse Permission requested 1" }),
    );
    await waitFor(() =>
      expect(
        c.queryByRole("button", { name: "Allow once" }),
      ).not.toBeInTheDocument(),
    );
    await userEvent.click(
      c.getByRole("button", { name: "Expand Permission requested 1" }),
    );
    await expect(c.getByRole("button", { name: "Allow once" })).toBeVisible();
    await userEvent.click(
      c.getByRole("button", { name: `Switch to ${next} view` }),
    );
  }
  canvasElement.dataset.permissionReview = "complete";
}

export async function verifyPermissionDraftRestored({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) {
  const c = within(canvasElement);
  expect(
    c.queryByRole("group", { name: "Message composer" }),
  ).not.toBeInTheDocument();
  await expect(c.getByRole("button", { name: "Send message" })).toBeDisabled();
  await userEvent.click(c.getByRole("button", { name: "Allow once" }));
  await waitFor(() =>
    expect(
      c.queryByRole("group", { name: "Permission request" }),
    ).not.toBeInTheDocument(),
  );
  const composer = c.getByRole("group", { name: "Message composer" });
  expect(
    within(composer).getByRole("textbox", { name: "Message" }),
  ).toHaveTextContent("Retain this draft while permission is pending.");
}

export async function verifyPermissionDismissed({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) {
  const c = within(canvasElement);
  const dock = c.getByRole("group", { name: "Permission request" });
  const close = within(dock).getByRole("button", {
    name: "Dismiss permission request",
  });
  const header = close.closest(".request-heading")!;
  expect(
    Math.abs(
      close.getBoundingClientRect().right -
        header.getBoundingClientRect().right +
        parseFloat(getComputedStyle(header).paddingInlineEnd),
    ),
  ).toBeLessThanOrEqual(1);
  await userEvent.click(close);
  expect(
    c.queryByRole("group", { name: "Permission request" }),
  ).not.toBeInTheDocument();
  expect(
    within(c.getByRole("group", { name: "Message composer" })).getByRole(
      "textbox",
      { name: "Message" },
    ),
  ).toHaveTextContent("Retain this draft while permission is pending.");
  expect(c.getByTestId("request-story-state")).toHaveAttribute(
    "data-calls",
    "0",
  );
}

export async function verifyDismissedResponseRecovery({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) {
  const c = within(canvasElement);
  await userEvent.click(c.getByRole("button", { name: "Allow once" }));
  await waitFor(() =>
    expect(
      c.getByRole("button", { name: "Check original response" }),
    ).toBeEnabled(),
  );
  await userEvent.click(
    c.getByRole("button", { name: "Dismiss permission request" }),
  );
  expect(
    c.queryByRole("group", { name: "Permission request" }),
  ).not.toBeInTheDocument();
  const composer = c.getByRole("group", { name: "Message composer" });
  expect(
    composer.querySelector('[data-ui-component="composer-status-banner"]'),
  ).toHaveAttribute("data-status", "warning");
  expect(c.getByTestId("request-story-state")).toHaveAttribute(
    "data-calls",
    "1",
  );
  await userEvent.click(
    c.getByRole("button", { name: "Check original response" }),
  );
  await waitFor(() =>
    expect(
      c.queryByRole("button", { name: "Check original response" }),
    ).not.toBeInTheDocument(),
  );
  expect(c.getByTestId("request-story-state")).toHaveAttribute(
    "data-calls",
    "1",
  );
  expect(
    within(c.getByRole("group", { name: "Message composer" })).getByRole(
      "textbox",
      { name: "Message" },
    ),
  ).toHaveTextContent("Retain this draft while permission is pending.");
}

export async function verifyClassicRequests({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) {
  const c = within(canvasElement);
  await userEvent.click(c.getByRole("button", { name: "Allow once" }));
  await userEvent.click(
    await c.findByRole("checkbox", { name: /^Search API/ }),
  );
  await userEvent.click(
    c.getByRole("button", { name: "Switch to Document view" }),
  );
  await expect(
    await c.findByRole("checkbox", { name: /^Search API/ }),
  ).toHaveAttribute("aria-checked", "true");
  await userEvent.click(c.getByRole("checkbox", { name: /^UI components/ }));
  await userEvent.click(c.getByRole("button", { name: "Submit answer" }));
  await userEvent.click(
    await c.findByRole("button", {
      name: "Response submitted: Your input is needed",
    }),
  );
  await waitFor(() =>
    expect(c.getByTestId("ai-question-card")).toHaveAttribute(
      "data-state",
      "answered",
    ),
  );
}

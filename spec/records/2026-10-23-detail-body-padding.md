# Detail body alignment with title

## Scope

RUI-WORK-001: Task and Review detail body content, metadata-card edges,
disclosure headings and the fixed composer now start at the title text. The
3rem logical start inset matches the header's 8px padding, 32px Back button and
8px gap. Back, right padding and vertical spacing remain unchanged. This is the
user-requested adaptation of the copied JJ Store styles; the source ledger
records the change. No public API or host behavior changed.

## Regression and verification

The existing browser geometry check now compares title, Description,
metadata-card and composer start positions, including the task details rail.

- Exact target: `pnpm exec playwright test --config tests/catalog-browser.config.ts projects-detail.pw.ts -g 'light 1280'` had 2 failures before (body start 21px versus title 57px), then 2 passes after. Logs: `.local/detail-body-padding-before.log` and `.local/detail-body-padding-after.log`.
- `pnpm exec playwright test --config tests/catalog-browser.config.ts projects-detail.pw.ts`: 15 passed, 0 failures. Fresh isolated Storybook covers light/dark, 320/420/1280px, rail visibility, review states and fixed chrome.
- `pnpm test:storybook packages/repository-ui/src/jj/projects/screen/ProjectsScreen.stories.ts`: 104 interaction/accessibility passes (26 stories across four theme/viewport combinations).
- `pnpm spec:check`: first failed because the source-ledger change also maps to AUI-GOV-003; added the explicit alignment qualification to that canonical chapter and reran successfully.
- `pnpm check`: passed, 0 Svelte errors/warnings; source fingerprints, architecture and formatting passed.
- `pnpm --filter @lapismd/repository-ui build`: passed with publint.
- `pnpm exec vitest run --project unit tests/projects-controller.test.ts`: 6 passed.

Full package/static/Desktop qualification remains pending under the existing
screen-review policy. No visual baselines changed. Exact review stories:
`jj-complete-screens-projects--task` and
`jj-complete-screens-projects--review-detail`.

# Review detail and task hover alignment

## Scope and source comparison

RUI-WORK-001 and AUI-GOV-001 remain in progress. The user requested the Review
detail composition, task-detail hover feedback, Review Activity alignment and
consistent body-header positioning across both detail pages.
This slice does not close the full Projects/Agents/Threads/Desktop plan.

Read-only reference: JJ Store at `42ae3473081a50b5acfbd2a763421af18d4608d0`,
`StoreReviewDetail`, `StoreReviewFiles`, `StoreReviewCommits`,
`StoreReviewConversation` and `StoreRepositoryActivity`. Source and adapted file
hashes are recorded in `docs/desktop-layout-sources.json`. JJ Store's existing
unrelated documentation changes were left untouched.

The running JJ Store review `9ed0406f7a0ed81c3fc87da30794d3de` in repository
`c235f6f48a44e496f4f22a150a7a0356` supplied live composition evidence:
header/opened time, Anchor/Author/Status/Snapshot rows, Description, Files changed,
Commits and Activity disclosures, independently scrolling content and a fixed
composer. Shared Review detail now owns that composition instead of using the
generic task detail. Host-provided recorded comparisons preserve repository and
operation identity; navigation/copying use existing explicit callbacks. Missing
context is unavailable, never replaced with the active checkout. Read-only
review actions are absent; resolving preserves an existing unsent draft.

Live Activity geometry relative to the disclosure's left edge: commit avatar
24px inset/32px wide, commit text 72px inset; comment avatar 12px inset/36px wide,
comment text 56px inset. The previous shared adaptation incorrectly used 24px
avatars and the description's 24px inset for comments. The exact geometry now
matches using the shared avatar token and public balanced Message density.
Directory card/list avatars remain 24px.

Task section hover uses an opaque 5% foreground/body mix instead of an 18%
transparent muted overlay. Keyboard focus receives the same surface and a ring.
Refresh/Chat share one header grid cell, preventing the Chat action wrapping onto
a second row. Review ancestry is present in the complete story's breadcrumbs.

Follow-up header audit found a collision between the generic Projects header
rules and the copied absolute Back positioning: the review title overlapped
Back's hit area by 12px. The task header also sat 31px from the body edge at
1280px. Both now use one private WorkDetailHeader composed with public
AppShell.Toolbar. Back has its own grid cell with an 8px body-edge inset, the
title wraps in a shrinking middle cell, and actions remain grouped. Removed
obsolete positioning and centered root widths; metadata, disclosures and
composer retain compact outer insets. The toolbar and composer remain outside
the scrolling body. This is an explicit user-requested adaptation of source
geometry, not a host CSS workaround.

## Regression history

- Initial exact Storybook target: `pnpm exec vitest run --project storybook packages/repository-ui/src/jj/projects/screen/ProjectsScreen.stories.ts -t 'Review Detail|Task Hover'`: 2 failures (missing review metadata; hover). The synthetic Storybook hover probe did not drive CSS `:hover`; replaced that probe with real-pointer pixel coverage and retained keyboard/header interaction coverage in the story.
- Real-pointer original-style reproduction: `pnpm exec playwright test --config tests/catalog-browser.config.ts projects-detail.pw.ts -g 'task detail visible hover and keyboard feedback light 1280'`: 1 failure; original hover changed the sampled pixel by only 2 levels. The original CSS was temporarily restored for this isolated run and the fix restored in a `finally` block.
- Activity exact target: `pnpm exec vitest run --project storybook packages/repository-ui/src/jj/projects/screen/ProjectsScreen.stories.ts -t '^Review Detail$'`: 1 failure (24px versus source 32px). Same target included in the passing review rerun.
- Expanded focused review target: 6 passes, 0 failures, including exact commit navigation, snapshot copy, viewed files, resolve/reopen, retained draft, read-only, unavailable and unknown-outcome inspection. Earlier test-authoring failures (copy accessible-name mismatch and a hidden duplicate unavailable state) were corrected by using actual accessible names and the labelled file-comparison region.
- Initial browser harness: 8 failures from cold-load timing, a pre-focused story masking hover and an unscoped nested viewport locator. The repair waits for rendered fixture readiness, removes focus before sampling and targets the direct review viewport. Final cold matrix covers all eight theme/width cases; actual results below.

- Exact header regression: `pnpm exec playwright test --config tests/catalog-browser.config.ts projects-detail.pw.ts -g 'light 1280'`: 2 failures before (31px Task Back inset and 12px Review overlap), then 2 passes after replacing the headers. Logs: `.local/detail-header-before.log` and `.local/detail-header-after.log`.

## Verification

- `pnpm check`: passed; 396 source fingerprints, architecture/file budgets, formatting and Svelte with 0 errors/0 warnings. Log: `.local/review-check.log`.
- `pnpm test`: 192 tests passed in 33 files for the review/context slice. Subsequent changes only adjust the detail presentation and its browser coverage. Log: `.local/review-unit.log`.
- `pnpm --filter @lapismd/repository-ui build`: package build and publint passed after the header correction. Log: `.local/review-build.log`.
- `pnpm spec:check`: validate, mdbook and spec-first passed. Log: `.local/review-spec.log`.
- `pnpm test:storybook packages/repository-ui/src/jj/projects/screen/ProjectsScreen.stories.ts packages/repository-ui/src/jj/navigation/page-frame/RepositoryPageFrame.stories.ts`: 124 interaction/accessibility passes, 31 in each light/dark and wide/narrow combination. Log: `.local/review-story-matrix.log`.
- `pnpm exec playwright test --config tests/catalog-browser.config.ts projects-detail.pw.ts`: 15 passes, 0 failures on a fresh isolated Storybook at port 7498. Task/Review cover 320/420/1280px in light/dark, Back/title/action geometry, fixed composer/header, responsive comparison and the Task details rail; separate Review unavailable/read-only/recovery cases also verify Back navigation. Log: `.local/detail-header-browser-final.log`.
- Manual running-browser comparison: both final complete screens inspected after HMR at port 7490. Review title no longer overlaps Back; header is at the body edge and body sections/composer share compact outer insets. Local screenshots: `.local/projects-review/review-detail-final.png` and `.local/projects-review/task-detail-final.png`.

Final functional/interaction/accessibility failure count is 0 in these focused
lanes. Original hover and activity evidence remain in
`.local/task-hover-original.log` and `.local/review-activity-before.log`.

## Exact stories for review

- `jj-complete-screens-projects--review-detail`
- `jj-complete-screens-projects--review-detail-actions`
- `jj-complete-screens-projects--review-detail-unavailable`
- `jj-complete-screens-projects--review-detail-read-only`
- `jj-complete-screens-projects--review-detail-recovery`
- `jj-complete-screens-projects--task-hover`

Existing Task, Activity, Reviews and complete Projects stories are also affected.
No visual baselines were updated; new stories remain visual-pending.

## Remaining qualification and implementation

This presentation pass does not claim complete review conversation parity:
thread connectors, reactions, captured edit revisions, inline diff annotations,
comment continuation and recorded agent/lifecycle supplements remain tracked
with the discussion slice. Shared context is bounded and host supplied; native
review adapters, consumer routing and package-archive integration remain part of
the larger approved plan. Broad static/package/Desktop browser/native acceptance
is pending. No package publication or installed-app replacement occurred.

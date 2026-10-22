# All-file diff header review

RUI-HISTORY-001 / AUI-GOV-003: both complete logs show optional complete host
totals through `getDiffStats(RepositoryDiffComparisonContext)`. The callback is
synchronous and reads a host cache; it must not fetch. Unknown totals stay absent,
zero is measurable and selected-file/paged metadata never supplies a fallback.
The in-memory host computes totals across all 48 fixture files, including files
not yet loaded: +142 / -90 textual lines. Binary/conflicted files do not invent
text counts.

`allChangesActions` receives full typed screen state and renders only in the
comparison-wide header; existing `diffActions` renders only in single-file mode.
Built-in JJ Log restore moves to each section's file menu, requesting a preview
for that exact path. It no longer appears ambiguously beside All Changes. The requested final refinement removes expanded file-body bottom padding so the selected frame ends at its content.

## Source reproduction and intake

The original four JJ/Op × light/dark `selected frame paints` cases failed on
actual side pixels. The original two `all changes totals` cases failed because
the header showed a selected-file count or no total. Computed outline checks
alone had missed opaque descendants painting above the side edges.

Design Core commit `0af650f4` owns the inert selection layer and public semantic
hover/focus tokens. Source family: 16 interaction/a11y cases passed; source spec:
all 3 lanes passed. Its independent source record is
`design-core/spec/records/2026-10-22-diff-header-review.md`.

The ignored review hook now consumes a clean committed-source prepared archive:
`design-core/.local/packages/lapismd-design-core-0.6.0-diff-header-review-source-built.tgz`.
SHA256: `f0e613acd5c54258c418eb0c877640cbfd96019f36a57c9804fa84e3357e3e07`.
Preparation audited 265 CSS files with zero remaining utility references.
Original source is retained for the existing documentation-token audit while runtime exports still resolve through prepared dist. An initial dist-only archive failed that audit because its source paths were absent; the corrected source-retaining archive restores the original review policy.
Unrelated AppShell work was excluded. Existing Mira/jj-history review entries
were retained; manifests and lockfile remain portable registry ranges. A released
dependency is still required before downstream adoption/publication.

## Targeted qualification

The first exact totals rerun passed both logs. An expanded rerun during live
compilation subsequently failed two startup/navigation cases; these are reported
separately from the original functional regressions and require the cold rerun.
The new source story initially used a synthetic hover that did not activate CSS;
native focus now verifies the source interaction and browser tests drive a real
pointer without weakening the hover assertion.

- `pnpm exec vitest run --project storybook packages/repository-ui/src/jj/screens/panel/RepositoryPanel.stories.ts packages/repository-ui/src/jj/screens/operations/RepositoryOperations.stories.ts -t 'All In One|Paged Files|File Actions|Host Actions|Dense History'`: 9 interaction/accessibility cases passed; 25 unrelated cases unselected.
- `pnpm --filter @lapismd/repository-ui build`: public dist generation and publint passed.
- `pnpm spec:check`: 3 lanes passed after adding the required canonical governance coverage for the new paint probes.
- `pnpm check:architecture`: file budgets and production boundaries passed.
- `node scripts/source-layout.mjs --source-root ..`: 196 fingerprints and 141 original layouts verified with explicit adaptations.

Broad suites, static/package matrix, downstream consumers and publication remain
deferred until final review. Stories remain visual-pending; no baselines changed.

## Final refinements and regression results

The requested bottom inset is now zero. Op Log's outer overlay scrollbar was
also obscuring the repaired right edge: both Op paint cases failed until the
collection reserved its own documented `0.5rem` inline-end scrollbar clearance.
The same shared viewer applies that clearance in both logs. The unchanged pixel
threshold then passed in both Op themes; no dependency selectors were overridden.

The optional light-mode class attribute is now checked with a class matcher,
retaining the light/dark assertion when no class attribute exists. Capture stops
animations, and local PNG evidence is saved. Navigation waits for DOM readiness
rather than unrelated external-image load; all rendered UI assertions remain.
An initial type run overlapped dependency replacement and reported 271 missing
module/derived diagnostics; the installed-package rerun reported 0 errors and
0 warnings.

- Final directly affected Storybook command: `pnpm exec vitest run --project storybook packages/repository-ui/src/jj/history/diff-viewer/RepositoryDiffViewer.stories.ts packages/repository-ui/src/jj/screens/panel/RepositoryPanel.stories.ts packages/repository-ui/src/jj/screens/operations/RepositoryOperations.stories.ts -t 'All In One|Paged Files|File Actions|^Basic$|^Split$|^Paged$'`: 11 interaction/accessibility cases passed; 30 unrelated cases unselected.
- `pnpm exec playwright test --config .local/live-chat.config.ts tests/jj-diff-collection.pw.ts`: 7 passed, 1 initial JJ paging-story startup failure. All four light/dark paint/hover cases and both total/action/restore cases passed. The exact unchanged JJ paging case then passed with `pnpm exec playwright test --config .local/live-chat.config.ts tests/jj-diff-collection.pw.ts -g 'jj-log: paged sections'`: 1 passed. All 8 browser cases are verified; no failure remains unexplained.
- Final `pnpm spec:check`: all 3 lanes passed with the source-retaining public archive.

Storybook was restarted and its fail-closed client readiness probe completed.
The actual open JJ AllInOne tab was refreshed; the ignored screenshot at
`.local/review/all-changes-header.png` shows host totals, all four selected edges
and zero file-content bottom padding. Stop for review before the next section.

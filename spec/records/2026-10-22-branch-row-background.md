# Branches default row background

Requirements: RUI-BRANCH-001 and AUI-GOV-003. User requested the white default
row surface shown in JJ Store. Bookmark and working-copy rows used `--card`
(`#fafafa` in the light theme); they now use `--background` (`#ffffff`). Command
root and group-heading surfaces share the same fallback. The public override
`--ui-repository-branch-background` remains available. Hover, selected surfaces
and the primary selection marker are unchanged; dark mode uses its theme body
surface instead of a hard-coded light color.

Read-only comparison: JJ Store's CommunityRepositoryBranchCommand and
CommunityWorkingCopyCard share its repository-row surface token. This consumer
adaptation selects the requested body surface explicitly. Source ledger records
that adaptation and retains source revisions and hashes.

## Focused verification

- Before: computed paint in the current Basic story showed `rgb(250, 250, 250)`
  on both unselected working copies and an unselected bookmark row.

- After refreshing the Basic story: both working copies and an unselected
  bookmark paint `rgb(255, 255, 255)`. Screenshot:
  `.local/branch-row-background-review.png`.
- `pnpm exec vitest run --project storybook packages/repository-ui/src/jj/branches/branch-command/RepositoryBranchCommand.stories.ts packages/repository-ui/src/jj/screens/branches/RepositoryBranches.stories.ts`:
  17/17 interaction/accessibility tests pass in light mode; the same target with
  `CATALOG_THEME=dark` passes 17/17. Functional/accessibility failures: zero.
- `node scripts/source-layout.mjs`: all 226 destination fingerprints pass.
  The same source comparison restricted to Branches with `--source-root ..`
  passes eight fingerprints/four original layouts with documented adaptations.
- `pnpm --filter @lapismd/repository-ui build`: package build and publint pass.
- `pnpm spec:first` and `pnpm spec:check`: pass. Changed-file formatting passes.

Stories remain visual-pending. Broad suites and baselines remain deferred until
final screen review. No source application or Design Core changes are required.

## Remaining selected-row fill

The follow-up inspection found `main` was still grey at rest because the earlier
change covered unselected rows only. Its computed fill was
`color(srgb 0.896 0.896 0.896)`, while adjacent rows were white and no row was
hovered. The selected-row default now uses `--background` as well; the primary
3px left marker remains the selection indication. The host override and hover
feedback remain supported. The same rule covers selected working copies.

After HMR, the selected `main` row and adjacent unselected rows all paint
`rgb(255, 255, 255)` while the selected marker remains 3px. Screenshot:
`.local/branch-selected-background-review.png`. The same two story families pass
17/17 in light mode and 17/17 with `CATALOG_THEME=dark`; failures remain zero.
Repository UI build/publint, all 226 fingerprints, eight Branches fingerprints
and four original-layout comparisons, `pnpm spec:check` and changed-file
formatting pass. Broader qualification remains deferred.

## 2026-10-23: restore selected colour

The user clarified that the selected colour must stay as it was. Restore the
selected-row default to `color-mix(in srgb, var(--foreground) 12%, var(--background))`
for bookmark and working-copy rows, retaining the primary left marker. Unselected
rows remain on the white body surface. The selected-white follow-up above is
superseded by this correction. Restore the matching audited token, documentation
and source-ledger adaptation from `c28a8986` without discarding recorded evidence.

Before correction, the selected `main` row and its adjacent unselected row both
painted `rgb(255, 255, 255)` on the current Basic page.

After HMR settles, selected `main` again paints
`color(srgb 0.896 0.896 0.896)` with the 3px marker; its unselected neighbour
remains `rgb(255, 255, 255)`. Screenshot:
`.local/branch-selection-restored-review.png`.

Targeted Basic/Working Copy checks use the same two Branches story files with
`-t 'Basic|Working'`: 3/3 pass in light mode and 3/3 with `CATALOG_THEME=dark`
(14 unrelated stories skipped per run). Source fingerprints (226), spec check,
Repository UI build/publint and changed-file formatting pass. Full checks remain
deferred until final review.

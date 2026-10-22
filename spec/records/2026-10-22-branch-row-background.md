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

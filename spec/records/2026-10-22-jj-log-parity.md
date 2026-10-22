# JJ Log portability and dense review slice

Implements the first repository slice under RUI-HISTORY-001, RUI-FOUND-001 and
RUI-LIFE-001. The user authorized the plan and requires targeted checks now,
with an explicit review pause before Op Log. Broad qualification remains deferred.

## Ownership and source comparison

Reuse the existing Desktop extraction, HistoryReader and HistoryController.
jj-store f58b9363 is a read-only reference: CommunityProjectsRepositoryLog,
its header/files/diff presentation and native browser read contract. The source
applications are unchanged; their unrelated working-copy edits were preserved.
Design Core and Mira required no changes or package rebuilds for this slice.
The previously documented ignored dependency archives remain review prerequisites;
manifests retain npm ranges and no dependency files or aliases were patched.

The source ledger checks the prior original layout before documenting each new
adaptation and refreshing its fingerprint. Adaptations add optional host slots,
explicit query/paging state and recorded file provenance while retaining the
original AppShell/Column Canvas boundaries and default geometry. RepositoryLogQuery
is a private part owned and documented by the complete RepositoryPanel family.

## Delivered behavior

- Optional native revset search retains its exact operation/workspace, clears
  dependent comparisons, rejects late replies and pins the displayed operation.
  User email, clock, page size and display bound are host-configurable; indexed
  full-text search remains a host service through replaceable header controls.
- Paging retains one evaluation clock and rejects duplicate rows/repeated cursors;
  a bounded result explains the displayed limit instead of implying completeness.
- Header controls can be replaced, and header, selected-revision, changed-file
  and diff actions can be added without changing component markup. Complete
  screen file/diff actions receive the current HistoryState and exact pin context.
- Non-virtualized changed files expose an explicit More changed files action.
- Dense in-memory history includes 64 revisions, multiple authors, merges,
  divergent/conflicted revisions, nine tags on one row and multiple workspaces.
  Comparisons include 15 paths, multiple text hunks, rename provenance, a binary
  image and an oversized capture. Native binary/unavailable data uses Empty with
  an icon and never fabricated text.

## Focused evidence

- Initial `pnpm exec vitest run --project unit tests/jj-log-query.test.ts`:
  3 failed / 1 passed; the query/context/bounds gaps were repaired.
- Exact controller target after implementation: 4 passed; the final additional
  repeated-cursor regression makes 5 passed, zero failures.
- `pnpm exec vitest run --project unit tests/jj-log-query.test.ts tests/jj-history-controllers.test.ts`:
  11 passed before the additional repeated-cursor case; the unchanged seven
  original pin/merge/operation/lifetime/restore regressions remained passing.
- Four directly affected Storybook files (Panel, LogHeader, ChangedFiles, Diff):
  26 interaction/accessibility cases passed. Final targeted refresh below.
- Four native browser workflows passed: contextual actions with binary/rename
  rendering, revset empty/failure recovery, paging/bounds and host controls.
  The final explicit changed-file paging assertion passed its exact rerun.
- One initial browser attempt used the default five-second expectation during
  first module loading and failed before the story mounted. The initial story
  readiness now uses the ordinary Playwright action deadline; no functional
  assertion or diagnostic capture was removed. The native view-mode control is
  correctly addressed by its radio role. One anchored grep selected no tests and
  was corrected; that attempt is not counted as acceptance.
- Strict type checking initially found one fixture number/bigint conversion and
  one Svelte initial-value warning; both were repaired without changing contracts.
- The architecture gate initially caught the controller exceeding its 300-line
  budget; query reset state now lives with the existing state-reset helpers.
- Source ledger: 193 fingerprints and 140 original layouts matched.
- Spec validation: 9 validators / 5 chapters / 22 requirements passed.

Final focused refresh:

- `svelte-check --tsconfig tsconfig.json --fail-on-warnings`: zero errors and warnings.
- Panel and ChangedFiles final interaction/accessibility refresh: 16 passed.
- `pnpm --filter @lapismd/repository-ui build`: package build and publint passed.
- `pnpm check:architecture`: passed. `pnpm spec:first`: 40 protected files / two chapters passed before the final message correction.
- Fresh 7490 Storybook startup succeeded. The first cold browser navigation
  exceeded its 30-second deadline during initial dependency optimization;
  the identical four-workflow rerun passed all four once startup completed.
- User review caught the white Markdown commit-message surface. The exact
  `commit Markdown` browser regression failed once with white instead of
  transparent. RepositoryCommitMessage now configures Mira's existing public
  preview background variable, documented through its owning Revisions family.
  Design Core and Mira source required no edits.
- Dense JJ Log now reuses the full rich commit message. Op Log Metadata records
  that same multiline message in its original command arguments; its exact
  regression initially failed once against the previous subject-only fixture.
- `pnpm exec playwright test --config .local/live-chat.config.ts tests/jj-log-parity.pw.ts`:
  all six cases passed after both corrections, with zero browser/console errors.
  The final six-case refresh also passed and the message case checks transparency,
  clamp, expansion, collapse and keyboard-link focus revealing the full body.
- Final four-family message story refresh (Panel, Revisions, Operations,
  OperationColumn): 22 interaction/accessibility cases passed.
- Final package build/publint, strict types (zero errors/warnings) and source
  ledger (193 fingerprints / 140 original layouts) passed after the corrections.
- Final spec-first gate passed: 46 protected files / two canonical chapters.
  Adding message acceptance first exposed one excess-bullet failure and then
  one multi-sentence failure; the single existing fixture-acceptance bullet now
  covers the added examples without relaxing either governance rule.
- Final spec validation passed: nine validators, five chapters, 22 requirements.

Stories remain visual-pending. Full suites, static/packed consumer matrix,
publication and downstream application/service changes wait for later approval.

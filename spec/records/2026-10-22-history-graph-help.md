# Progressive graph and query-help review

RUI-HISTORY-001 / AUI-GOV-003 follow-up in the current Op Log review section.
Repository browsing, downstream adoption and publication remain gated.

## Changes

- The shared 64-row fixture adds one topic lane per row up to sixteen lanes,
  then converges from the outside inward. A second smaller wave repeats the
  pattern. Both logs show row-specific avatar movement during widening and
  narrowing; the first operation retains its single comparison parent.
- Expanded query help copies JJ Store's StoreHistoryQueryContext and
  StoreSettingsNotice Alert composition, semantic surface, spacing and centered
  info icons. The labeled help region shows the applicable language and host
  vocabulary. Application-owned workspace/email controls are not copied into
  this generic query editor. Keyboard wording retains this editor's existing
  Enter-to-apply contract.
- Query stories exercise expanded help; styling documentation and the source
  adaptation ledger record the change. The public Alert dependency is explicitly
  prebundled for dev and story tests to prevent a first-import optimizer reload.

## Focused evidence

- Before implementation, `pnpm exec vitest run --project unit tests/jj-history-presentation.test.ts`
  had one pass and one failure: only two early row offsets instead of gradual
  depth. The exact graph test passed after the fixture change.
- Before implementation, `pnpm exec playwright test --config .local/live-chat.config.ts tests/jj-history-review.pw.ts -g 'row-specific avatar positions|shared syntax editor'`
  failed all four cases: two abrupt graph offsets and two missing structured help
  regions. After implementation, both graph cases passed; two text probes needed
  whitespace normalization for the wrapped guidance. Icon centering already passed.
- `pnpm exec playwright test --config tests/catalog-browser.config.ts tests/jj-history-review.pw.ts -g 'row-specific avatar positions|shared syntax editor'`:
  four passed using a fresh isolated Storybook process. Checks cover at least ten
  early avatar offsets, widening, narrowing after paging, sixteen-lane width,
  vertical scrolling, autocomplete and two icon-centered informational alerts.
- The first `pnpm exec vitest run --project storybook packages/repository-ui/src/jj/history/query/RepositoryHistoryQuery.stories.ts`
  failed three cases after Vite discovered the new Alert import and reloaded.
  The immediate rerun passed all three. Explicit prebundling repairs cold startup;
  the final repeat re-optimized from the changed configuration and passed all
  three interaction/accessibility cases without a mid-test reload.
- `pnpm exec vitest run --project unit tests/jj-history-presentation.test.ts tests/storybook-dependencies.test.ts`:
  five passed, including shared dev/test prebundle configuration and graph topology.
- `pnpm exec svelte-check --tsconfig tsconfig.json --fail-on-warnings`:
  zero errors and warnings.
- `pnpm spec:validate`: nine validators, five chapters, twenty-two requirements passed.
- `node scripts/source-layout.mjs --source-root ..`: 196 fingerprints and
  141 original layouts matched after explicit review of the source adaptation.
- `pnpm check:architecture`: ownership and file budgets passed.
- `pnpm --filter @lapismd/repository-ui build`: package build and publint passed.
- Scoped Prettier and `pnpm spec:first` passed. `pnpm storybook:restart` followed
  by a successful catalog-ready read refreshed port 7490. The expanded help and
  progressive avatar positions were inspected in the in-app browser; local
  review image: `.local/review/history-graph-help.png`.

Changed stories remain visual-pending. Full suites, static/packed matrices,
baseline updates and application/service changes were not run for this slice.

# Stacks bookmark and inline-file review

Requirement: RUI-STACK-001, RUI-HISTORY-001 and AUI-GOV-003. Visual-pending.

The selected branch now demonstrates three recorded bookmark segments, retained
through lazy history reads, without duplicating commits. The Stacked Branches
story starts with a selected commit and its recorded text diff. Fixture startup
loads files before selecting them, and dense/paged bookmark boundaries remain
inside the next bounded history batch.

Inline source files use the source compact frame, count badge, short heading and
thin body padding. Accessible labels retain the branch context. Stack graphs use
the source continuous inset and pass continuous mode to the SVG, keeping its
connector visible throughout expanded files in both views. The screen toolbar
has no bottom divider; the target branch column icon is 16px. Target history
still uses its previous component and controller, as requested after reverting
the separate JJ Log reuse attempt.

## Focused evidence

- Exact browser regression: `pnpm exec playwright test --config tests/catalog-browser.config.ts tests/stack-workspace-presentation.pw.ts -g 'selected branch showcases'`.
  Before: 1 failure (one bookmark card instead of three); initial selection also
  exposed a missing initial diff. The repaired section run passed all 11 tests.
- `pnpm exec playwright test --config tests/catalog-browser.config.ts tests/stack-workspace-presentation.pw.ts`: final section run 11 passed, 0 failed.
  An earlier run had 10 passed/1 failed because the fixture's unloaded lower head
  hid paged rows; the exact paging target subsequently passed after correction.
  One earlier cold startup timed out before tests; no timeout was increased.
- Navigation divider target: 1 failure (1px), repaired to 0px in the section run.
  Target history icon target: 1 failure (24px), repaired to 16px in that run.
- Live Stacked Branches and Workspace continuation reproduction: connector ended
  at 115.28px while the expanded SVG was 473.69px in both views before forwarding
  continuous mode. A focused browser assertion now checks both views.
  After: the connector and SVG both reach 473.69px in each view; the exact cold
  browser target passed 1/1 and five Graph/Stacks stories passed in all four
  theme/viewport combinations (20 additional targeted checks).
- `pnpm exec vitest run --project unit tests/stack-workspace-presentation.test.ts`:
  7 passed, including segment identity and initial text-diff selection.
- `pnpm test:storybook` with the four changed Graph/Files/Stack lane/Stacks story
  files: 36 passed per light/dark and desktop/narrow combination (144 checks).
  Strengthening the new initial-diff assertion exposed 1 failed/1 passed target;
  after correction, five directly affected screen stories passed in all four
  combinations (20 checks). The later graph rerun is recorded above.
- `pnpm exec svelte-check --tsconfig tsconfig.json --fail-on-warnings`:
  0 errors, 0 warnings. Repository UI package build and publint passed.
- `pnpm spec:validate`: 9 validators, 5 chapters and 23 requirements passed.
- `node scripts/source-layout.mjs`: 241 destination fingerprints passed;
  `.local/stack-branch-ledger.mjs` compared five changed layouts against their
  pinned original sources and documented adaptations.
- Architecture audit retains the pre-existing unchanged
  `tests/repository-branches.pw.ts` 305-counted-line finding against its 300-line
  script rule. No unrelated file or assertion was changed to conceal it.

## Additional source comparison

Apache-2.0 JJ Store at revision `6961bd1c`, compared before adapting its spacing:

- `web/src/lib/ui/community-projects/CommunityProjectsRepositoryLogFiles.svelte`:
  SHA-256 `85e45fec794148fb6a40b1fd88c61e112c04f23d93cc0f9c07d945ee38a45e21`.
- `web/src/lib/ui/community-projects/CommunityProjectsRevisionGraph.svelte`:
  SHA-256 `8ca68b659c7808f4cd35891c7488e5b8b75f46c9dedcca21417e0d72d3c55fdc`.

Storybook 7490 was restarted after the review server was unavailable, preserving
other servers. No source application, dependency, native execution or mutation
contract changed. Full suites, the complete static/package matrix, downstream
adoption and visual baselines remain deferred until final screen review.

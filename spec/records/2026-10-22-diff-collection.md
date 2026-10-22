# JJ and Op Log diff collections

RUI-HISTORY-001 / RUI-FOUND-001 / AUI-GOV-003.

The shared production Diff Viewer supports host-controlled single/all-file
preferences, 20-section default batches, independently loaded file bodies and
exact per-file action contexts. Both complete log screens use it. The ordinary
RepositoryDiff and public Design Core FileDiff remain the text renderer.

Selected-file navigation reveals its batch, expands and scrolls to the section,
including repeated selections. Mode changes retain disclosure; comparison
changes fence cached and pending reads. Existing 500-path bounds remain explicit.
Menus use icons, nested copy paths and host-owned clipboard/absolute-path/reveal
callbacks. Unsupported capabilities and empty menus have no invented actions.

Live review refinements use vertical kebabs, the real public Button trigger,
the same hover radius as Close, content-width single-line popovers, square
continuous headers, separators, body-bottom padding and inset selected outlines.
The main file menu immediately precedes Close. Header labels and metadata form
one native disclosure button; trailing actions remain independent.

JJ Butler's MultiDiffView and Drawer were read-only interaction references.
Their services, renderer and implementation were not copied. Existing Desktop
column boundaries and metadata are retained, with reviewed source adaptations
recorded without changing original source fingerprints.

## Focused evidence

- `pnpm exec vitest run --project unit tests/comparison-diffs.test.ts tests/jj-diff-collection.test.ts tests/jj-history-controllers.test.ts tests/jj-operation-files.test.ts tests/history-controller.test.ts`: 22 passed.
- `pnpm exec vitest run --project storybook packages/repository-ui/src/jj/history/diff-viewer/RepositoryDiffViewer.stories.ts packages/repository-ui/src/jj/screens/panel/RepositoryPanel.stories.ts packages/repository-ui/src/jj/screens/operations/RepositoryOperations.stories.ts -t 'All In One|Paged Files|File Actions|^Basic$|^Split$|^Paged$|Single File|Retry|^Loading$|^Empty$|Dense History'`: 21 interaction/accessibility cases passed, 20 unrelated cases unselected.
- `pnpm exec svelte-check --tsconfig tsconfig.json --fail-on-warnings`: 0 errors and 0 warnings.
- `pnpm check:architecture` and `pnpm check:source-layout`: passed, including 196 extracted source fingerprints.
- `pnpm spec:check`: all 3 lanes passed.
- `pnpm --filter @lapismd/repository-ui build`: public dist build and publint passed.

A new all-file wrapper initially collapsed the single-file split pane to zero
height. The exact retained-context gutter case failed, then passed after restoring
its explicit fill height. The original gutter hit-test assertions remain intact,
with diagnostic geometry added for failures. A new empty-story navigation wrapper
also failed axe's prohibited-label check; using a native nav fixed it. Compiler
warnings, duplicate test-fixture attributes and initial role/name assumptions were
corrected before the final passing story run; no checks were weakened.

One cold browser attempt timed out loading the first story while the other five
cases passed; the same unchanged six-case command was rerun after readiness.
Final browser counts and cold review are recorded below.

## Temporary dependency intake

Design Core commits `7b8c95fe` and `81502ad4` own typed file bodies, content sizing,
header-wide disclosure and public section tokens. Their focused source family
passed 16 interaction/a11y cases, strict typing and the 3 spec lanes. The source
record is `design-core/spec/records/2026-10-22-diff-collection.md`.

The ignored `.local/review-dependencies.cjs` supplies a prepared public archive:
`design-core/.local/packages/lapismd-design-core-0.6.0-continuous-collection-review-built.tgz`.
SHA256: `10cf15c1553df4222dcb5f3167399ab7dd2dbb60d63a22364d0539b2e041f8db`.
Prepared CSS audited 265 files with zero remaining utility references. Existing
Mira and jj-history review archives were preserved. Public manifests and lockfile
retain registry ranges; released dependency intake remains required before
adoption/publication. No dependency source edits, aliases or patches were used.

Storybook was restarted on 7490 and its client readiness probe completed before
browser acceptance. The in-app review screenshot is ignored at
`.local/review/all-in-one-diff.png`.

The complete package/static matrix and broad suites remain deferred until final
human screen review. Stories remain visual-pending and no baselines, source apps,
downstream services, repository browsing or publication were changed.

## Final browser and catalog results

`pnpm exec playwright test --config .local/live-chat.config.ts tests/jj-operation-presentation.pw.ts tests/jj-diff-collection.pw.ts -g 'retained context|paged sections'`:
6 passed on the unchanged rerun, including all-file navigation/menus and the
original JJ/Op unified/split reveal, hide and gutter assertions. New checks also
verify header-label expansion, independent menu actions, zero row gaps, square
sections, body-bottom padding, inset outlines, matching Close radius and single-line
nested menu labels.

`node scripts/catalog-index-audit.mjs .local/diff-collection-index.json` against
the running cold catalog: 40 total documented foundation families, 162 foundation
variations and all 5 specification pages present. This live-index check does not
claim the deferred static build/package matrix passed.

The original manual review confirmed continuous sections and retained ordinary
diff styling, but missed side outlines obscured by opaque diff content. The
follow-up in `2026-10-22-diff-header-review.md` supersedes that selection-frame
claim with actual painted-pixel checks in both themes and logs.

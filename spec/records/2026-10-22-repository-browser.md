# Repository Files review slice

Requirements: RUI-BROWSE-001, RUI-FOUND-001, RUI-HISTORY-001, AUI-GOV-003.
The enclosing Jujutsu change is the implementation revision. Visual review is
pending; broad qualification waits for the user's final screen review.

## Delivered section

Seven documented families: Breadcrumb, File Tree, Directory, File Preview,
Reference Picker, Change Card and the complete Files screen. Each owns stories,
MDX, public usage/styling examples and audited native CSS-variable defaults.
Independent parts are registered in `docs/jj-component-families.json`.

The host-owned read-only browser controller retains exact repository, operation,
revision, path, recursion and cursor identities; rejects mismatched replies,
duplicate paths/repeated cursors; fences late responses; bounds loaded pages;
and aborts/drains owned work on close. Construction issues no reads or mutations.
Hosts retain routing, admission, clipboard, references and layout persistence.

JJ Store layouts/CSS were adapted first. The public AppShell regions, headers,
FileListing/FileTypeIcon, PanelToggle and stock code/Markdown primitives remain
the boundaries. Short files have no forced preview height or redundant inner
vertical scroller. Preview/Source/Blame text toggles replace file contents inline.
Blame retains Desktop's existing hover card, five-segment delta and supplied
commit statistics. README's file history contains four recorded revisions.

The bookmark button opens the shared command picker with bookmark/change filters
and recorded author/message/ID search. Changes use the shared Change Card with
avatar, description, time and exact Git/JJ copy controls. The picker uses the
public Command View grid/rowgroup/row/gridcell roles and a grid-popup combobox,
so controls remain valid interactive cell content and do not select a row.

File history follows the user-supplied timeline reference: date-grouped cards,
author/avatar/date, shared Git/JJ buttons and independent recorded View code and
Browse repository callbacks. Ellipsis reveals the recorded Markdown body with
shared View more/View less. The outer description surface has an unchanged-default public styling token; Mira remains transparent. Actions start at the left when wrapping. Semantic
hover tokens distinguish the description button and expanded details surface.
A transparent public AppShell.Toolbar matches the sidebar/body header heights;
the inspector uses the same semantic background as the body. Both sidebars have
independent pointer/keyboard resize, reset and host persistence callbacks.

## Source evidence

Source applications remain unchanged: JJ Store `f58b9363`, Desktop `52516ae9`.
The source ledger records exact hashes and explicit layout adaptations for the
browser, extracted resize flow and reviewed file-history presentation.

Local review uses Design Core source `6f740f9c` via its prepared source-built
public archive, SHA-256
`7e58e2bdeb270d928f7444029d2440a04239d96f19ae2e8f9e87d087db0091b4`.
There was no Design Core edit in this slice.

The checked-task defect belonged to Mira's safe preview sanitization. Mira
commit `0a72edf8` permits the HAST `dataTask` property, preserving the artwork's
checked/custom marker while retaining the safe schema. Before: 1 failed and
1 passed safe-task test. After: 19 focused safe-task/portable-surface tests
passed; source Svelte/TypeScript checks passed with no diagnostics; four source
specification lanes and eight root build tasks passed. Its separate source
record is `mira-mde/spec/records/2026-10-22-safe-task-markers.md`.

The rebuilt local Mira archive has SHA-256
`c9e024d35e013676905120347bbfe3ca832f3e9e4f4ede74a7dc2b25161078b4`.
Only ignored `.local/review-dependencies.cjs` selects validation archives;
tracked manifests/lockfile retain released-package ranges. No publication or
downstream application changes were made.

## Focused qualification

Commands run from Agent UI, with logs under ignored `.local/`:

- `pnpm exec vitest run --project unit tests/repository-browser.test.ts`:
  10 passed; exact-pin reads, reply validation, paging, stale responses and close.
- `pnpm exec vitest run --project storybook packages/repository-ui/src/jj/browse/*/*.stories.ts packages/repository-ui/src/jj/screens/browser/RepositoryBrowser.stories.ts packages/repository-ui/src/jj/history/file-history/RepositoryFileHistory.stories.ts`:
  54 directly affected interaction/accessibility stories passed. The shared outer message-surface token follow-up also passed 23 Files/history/revision-detail stories and 14 complete JJ Log stories; the default JJ Log surface is unchanged.
- `pnpm exec playwright test --config .local/live-chat.config.ts tests/repository-file-history.pw.ts tests/repository-browser.pw.ts tests/repository-browser-docs.pw.ts`:
  13 passed against the review server. Includes semantic documentation tables,
  marker paint, shared reference cards, matching header geometry, pinned actions,
  virtual paging, stock previews, history/blame, hover/tooltips and both resizers.
- `pnpm exec playwright test --config tests/catalog-browser.config.ts tests/repository-file-history.pw.ts tests/repository-browser.pw.ts tests/repository-browser-docs.pw.ts`:
  fresh-process run: 12 passed, one docs-readiness assertion failed while the
  first lazily compiled MDX page still showed Storybook's loading table.
  The new docs test now awaits the real `.sbdocs-content h1`, matching the
  existing JJ docs browser contract, before retaining its content assertions.
  The exact cold docs target rerun passed all four cases (including the seven MDX families); the final history target passed all three cases with hover, wrap and transparent-preview assertions.
- `pnpm exec svelte-check --tsconfig tsconfig.json --fail-on-warnings`:
  zero errors and warnings.
- `pnpm check:architecture`: file budgets and package ownership passed.
- `pnpm --filter @lapismd/repository-ui build`: package build and publint passed.
- `pnpm spec:check`: validate, mdbook and spec-first passed, three lanes.
- Changed-file Prettier checks run; no broad format mutation is required.
- `node .local/browser-source-layout.mjs --source-root ..`: 23 reviewed
  fingerprints and 22 original layouts matched with explicit adaptations.
  The picker CSS extraction records its full source/component hash and native
  destination fingerprint, without claiming identical cross-format layout.
- `pnpm check:source-layout`: 218 extracted fingerprints verified.

## Failures repaired during iteration

The exact grouped-card regression initially failed: zero of four expected
revision cards. The final history checks cover disclosure, long-body expansion,
independent identity actions, exact revision navigation and sidebar geometry.

Reference picker iteration went from four functional failures to one nested
interactive accessibility violation. Public grid roles repair that boundary;
obsolete option-role selectors were updated to row-role selectors. The final
54-story target has no functional or accessibility failures. Early local import,
type and file-budget errors were repaired before the passing commands above.

One token-source error after moving picker CSS was repaired by retaining its
inline width variable's actual Svelte source; the three specification lanes pass.

The repository-wide original-source comparison has a pre-existing
`ChatComposerDrawer.svelte` layout mismatch outside this section. Its production
file and prior ledger row remain unchanged. The affected-file original-layout
comparison and complete destination fingerprint check are reported separately;
no global original-layout pass or baseline approval is claimed.

## Review boundary

Review Files Basic/History/Blame, Reference Picker Changes and Change Card Basic.
All new/changed stories remain visual-pending. Full product suites, static build,
clean package/example matrix, broader downstream acceptance and publication are
deferred until final human screen review. Stop before overview, branches,
workspace presentation or transfers.

## Metadata disclosure follow-up

After Files foundation commit `4d469e20`, the two user-marked metadata locations
reuse one private RepositoryCommitDetails implementation with File History.
Directory and file headers expose the same ellipsis button; its recorded
Markdown body opens beneath the row with transparent preview and shared
View more/View less. Existing commit links retain host navigation, while local
disclosure changes neither the pin nor host action state. Fixtures now include
a complete long description. The new part is owned by the Revision details
family and its source/default contracts remain audited.

Before: `pnpm exec playwright test --config .local/live-chat.config.ts tests/repository-metadata-details.pw.ts`
failed both exact cases, because the controls/panels were absent. After:
`pnpm exec playwright test --config .local/live-chat.config.ts tests/repository-metadata-details.pw.ts tests/repository-file-history.pw.ts tests/repository-browser.pw.ts`
passed all 11 cases, including both original regressions, metadata placement,
transparent preview, long-body expansion and no host navigation side effects.

The four directly affected Directory/File Preview/File History/Files story
families passed 33 interaction/accessibility cases with
`pnpm exec vitest run --project storybook packages/repository-ui/src/jj/browse/directory/RepositoryDirectory.stories.ts packages/repository-ui/src/jj/browse/file-preview/RepositoryFilePreview.stories.ts packages/repository-ui/src/jj/history/file-history/RepositoryFileHistory.stories.ts packages/repository-ui/src/jj/screens/browser/RepositoryBrowser.stories.ts`.
Svelte-check had zero errors/warnings and architecture passed. Source
fingerprints/original-layout adaptations and the owning package build are
rechecked. Specification checks retain the canonical governance mapping in this
follow-up change. Broad qualification and human visual approval remain deferred.

Metadata spacing review adds compact disclosure styling with no vertical
padding/margins and an 8px horizontal inset, configured through unchanged-default
public message spacing tokens. The original spacing target failed both cases
before this correction. Final metadata/history tests explicitly assert those
computed styles while preserving the history layout defaults. Cold metadata
acceptance passed both exact cases after awaiting the owning region's startup
readiness; the control-presence assertions remain unchanged. The first cold
attempt had one startup-readiness failure, distinct from the repaired UI cases.

Final spacing qualification: all five metadata/history browser cases passed,
including zero vertical padding/margins and the 8px inline inset. The five
Directory/File Preview/File History/Revision details/Files Storybook families
passed 36 interaction/accessibility cases. Types had zero diagnostics;
architecture, the three specification lanes, package build/publint and source
checks passed. The review gate and broad-check deferral remain unchanged.

The shared long-description fixture also passes all 13 Reference Picker/Change Card interaction and accessibility cases. The final public package build/publint and changed-file formatting check pass.

## Attached metadata card review

Following `ef4f750e`, the user's reference requires directory and file commit
bodies to remain within the metadata card instead of a separate rounded panel.
The shared disclosure now supports an attached body with one divider and a
muted theme surface; the stock Markdown is transparent. File metadata retains
its original header controls/height in a private row within the existing card.
The directory header avoids a duplicate divider. Compact spacing and host
navigation/pin behavior remain unchanged. File Preview documents the native
attached-body surface variable.

Before: the exact `Files source` target in
`pnpm exec playwright test --config .local/live-chat.config.ts tests/repository-metadata-details.pw.ts -g 'Files source'`
failed one containment assertion. After: the two metadata targets pass with
explicit descendant containment, full inner-card width, one divider, transparent
Markdown, compact spacing, long-message expansion and unchanged host actions.
The complete focused browser group also passed all 11 cases. No broad suite or
baseline update is part of this review correction.

The final inline review increases both metadata bodies to 8px top padding,
retains their 8px horizontal inset and zero bottom padding/margins, and gives
the shared ellipsis a persistent semantic background while expanded. These are
native documented variables in both metadata families; the history button uses
the same expanded-state styling. The latest padding instruction supersedes the
previous zero-top-spacing preference. Focused browser assertions cover the
computed top inset and persistent button fill after moving the pointer away.

Attached-card qualification passes 33 affected story/accessibility cases,
11 focused browser cases, both cold containment cases and the final five
metadata/history cases with the 8px top inset and expanded-button fill.
Svelte-check has zero errors/warnings; architecture, package build/publint,
three specification lanes and reviewed source/fingerprint checks pass. The
user's full-suite and visual-review deferral remains in place.

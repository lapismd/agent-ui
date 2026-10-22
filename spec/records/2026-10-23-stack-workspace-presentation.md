# Stacks and Workspace presentation

Requirement: RUI-STACK-001; related RUI-FOUND-001, RUI-HISTORY-001 and AUI-GOV-003.
Status: targeted qualification complete; visual-pending; paused for screen review.

## Scope and source

Adapted JJ Store revision `87f2f603` stack workspace canvas, grouped bookmark
cards, Unstaged/source files, target history and adjacent per-origin diff UI into
four governed public families under `@lapismd/repository-ui/jj`. Source hashes,
exact layout substitutions and destination fingerprints are recorded in
`docs/desktop-layout-sources.json`; provenance is in `docs/provenance.json`.
The existing frozen scaffold remains untouched. JJ Store is a read-only reference.

The public screen receives the existing host-retained StackWorkspaceController.
It preserves captured repository/operation/readKey, named workspaces, source
identities, graph parents, shared heads/aliases, immutable target history,
independent selections, cached diffs and existing host drafts. Header, column,
branch, commit, file, diff and composer snippets expose recorded contexts.
Commands request host handling; mount and selection never call preview/apply.
Navigation, persistence, notifications and controller disposal stay host-owned.
Transfers, mutation dialogs, forge execution and downstream adoption are later slices.

Source dimensions remain Branches 320 (260–520), Unstaged 330 (260–520), stack and
target 390 (310–640), diff 580 (360–980). Workspace tail space is 390 and Stacks 240. Public Column Canvas owns collapse and keyboard/pointer resizing.

File metadata accepts optional additions/deletions/conflicted fields. Unknown
counts remain absent; folder totals use loaded descendants. Binary, conflict,
unloaded and successful empty text states are separate. The graph accepts
optional recorded author email and a per-row action snippet without fabricating
native transport commit objects.

## Regression and repairs

- Original boundary before editing: `pnpm exec vitest run --project unit tests/stack-workspace-selection.test.ts tests/stack-workspace-sorting.test.ts tests/stack-workspace-header-drops.test.ts`: 11/11 passed.
- Draft type checks found 52 errors/3 warnings, then 5/3, 1/3, and 9/0 while adding fixtures/stories. Incorrect import depth, unsupported Toolbar/Skeleton props, rune-name collision, icon export, type-only clone import and story matcher types were repaired. Final type result is recorded below.
- First four-family Storybook run: 24 passed, 11 failed. Duplicate Unstaged column/list landmark labels and two story selectors/matchers were repaired; exact complete-screen rerun passed 17/17.
- Adding the graph host-action story initially selected a dense fixture unexpectedly: 38 passed, 1 failed. A dedicated RowActions fixture variant restores the ordinary two-row graph; exact graph rerun passed 4/4.
- First cold browser run: 2 passed, 4 failed. It exposed repeated file reads as history updates replaced snapshots, plus missing nonvirtual file continuation and incorrect test roles/cold-load wait. Source/diff effects now depend on a stable serialized repository/workspace/revision/readKey scope, and file cleanup runs untracked. The nonvirtual listing has an explicit continuation button.
- Second browser run: 4 passed, 2 failed (one test started before the scope repair; one split-diff selector used the wrong class). The exact full target is rerun after both repairs, without filtering runtime/console errors.
- A concurrent extra browser invocation did not run: port 7498 was already owned by the active isolated lane. It was retried only after that lane completed.
- First specification run found three missing explicit Story annotations in new families and an acceptance-section paragraph. Corrected; `pnpm spec:validate` passes 9 validators, 5 chapters, 23 requirements.

## Commands and final evidence

- `pnpm exec vitest run --project unit tests/stack-workspace-presentation.test.ts tests/stack-workspace-selection.test.ts tests/stack-workspace-sorting.test.ts tests/stack-workspace-header-drops.test.ts`: 15/15 passed. Covers recorded graph metadata, unknown/zero file counts, scoped paging, retained independent diffs and immutable target/workspace switching.
- `node .local/stack-view-source-layout.mjs --source-root ..`: 15 fingerprints verified; 12 original layouts matched with documented presentation/host substitutions. The ignored helper filters the unchanged canonical checker to this slice's new/modified copied files.
- `node scripts/source-layout.mjs`: 239 fingerprints verified before the final file-read adaptation refresh; rerun final fingerprints after formatting.
- `pnpm --filter @lapismd/repository-ui build`: passed package generation and publint.
- `pnpm storybook:restart`: cold local 7490 restart; retained the unrelated Desktop listener on 7491. Browser acceptance also starts a fresh isolated Storybook on 7498.
- Final cold browser target: `pnpm exec playwright test --config tests/catalog-browser.config.ts stack-workspace-presentation.pw.ts`: 6/6 passed with no runtime/console errors, after the source-scope and test selector repairs.
- The five directly affected story files (Stacks, Stack lane, Source files, Workspace diff and Revision graph) passed 39/39 in light desktop and light narrow. Dark desktop initially passed 38/39 with one Empty-state action contrast failure (2.42:1). The command action now uses the stock outlined Button variant. Exact dark Empty rerun passed 1/1 (16 other stories skipped); dark desktop and dark narrow then each passed 39/39. Final qualified impact surface: 156 theme/viewport story interaction and accessibility checks.
- `pnpm exec vitest run --project unit tests/jj-history-presentation.test.ts tests/jj-history-controllers.test.ts tests/history-controller.test.ts`: 10/10 passed. Combined with the stack targets: 25 focused unit tests.
- `pnpm exec svelte-check --tsconfig tsconfig.json --fail-on-warnings`: 0 errors, 0 warnings. Prettier checked all changed files successfully.
- Final source refresh: 239 destination fingerprints pass; the focused original comparison again passes 15 fingerprints and 12 documented layouts.
- Final package build/publint and `pnpm spec:validate` pass. The verification row was corrected from unsupported Visual pending to Partial; screen review remains explicitly pending in its evidence.
- The footer distinguishes unread Unstaged metadata from a genuine loaded zero. Manual browser review confirmed populated Workspace files, Stacks branch selection, source dimensions and the corrected footer. Local proof images: `.local/workspace-review.jpg` and `.local/stacks-review.jpg`. No baselines changed.

`pnpm check:architecture` reports an existing 305-counted-line browser test,
`tests/repository-branches.pw.ts`, against its 300-line script rule. That file is
unchanged by this slice; the guide allows tests up to 500 lines. This existing
checker/classification mismatch is recorded separately, not waived or changed.

Full repository suites, complete package/static catalog acceptance, baseline
updates, publication and downstream adoption remain deferred until final screen
review, as requested. This record does not claim aggregate qualification.

## Review stories

- `jj-complete-screens-stacks--basic`: Stacks, captured branch picker and grouped history.
- `jj-complete-screens-stacks--workspace`: Unstaged and multiple applied lanes.
- `jj-complete-screens-stacks--selected-files`: adjacent lazy diff.
- `jj-complete-screens-stacks--dense` and `--paged`: long lanes, paging, aliases and merges.
- `jj-complete-screens-stacks--conflicts` and `--binary`: semantic unavailable files/diffs.
- `jj-complete-screens-stacks--target-history`: read-only target history.
- `jj-complete-screens-stacks--host-actions` and `--retained-draft`: extension slots and retained host draft.
- Complete family also includes bounded/loading/empty/unavailable/unlinked/incomplete-topology/retry states; source files, stack lane and workspace diff have standalone families.

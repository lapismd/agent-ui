# Stacks/Workspace review fixes and action audit

Requirements: RUI-STACK-001, RUI-FOUND-001, RUI-DRAG-001, RUI-COMMAND-001.
Status: presentation review follow-up; visual-pending; action parity remains partial.

## Fixed presentation

- Both navigation states now copy JJ Store's application pill presentation: transparent list, 999px triggers, matching gaps/typography and active/hover fills.
- The toolbar reuses RepositoryWorkspacePicker, its existing Command View search/close/keyboard controls and host-owned selection callback. Optional recorded entries supply exact IDs, display names, descriptions and disabled state without creating synthetic native commits; legacy commit-derived workspace/overview behavior stays available.
- Workspace diffs use a source-adapted private hunk part with recorded `@@` headers, native-token checkboxes, unique accessible labels and optional host assignment requests. Read-only target, immutable, ambiguous and unavailable sources cannot create a mutable selection.
- Fixtures now supply three genuine independent native-shaped hunks across a long file instead of one file-sized hunk. Complete file totals remain two additions/one deletion and displayed hunk context preserves those exact changes.
- Catalog host-call recording is reactive, so copied identifiers and requested commands can be asserted from actual callbacks rather than a stale zero count.

## Action audit

| Surface                           | Current wiring                                                            | Remaining work                                                                          |
| --------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Git/JJ identifier controls        | Exact full identifiers call host `copyText`, independent of row selection | The catalog records clipboard requests; real clipboard behavior belongs to each host    |
| Native hunk checkboxes            | Retain exact native tokens through `controller.selectFile`                | No mutation occurs from selection                                                       |
| Assign hunk                       | Capability-gated host transfer intent with exact source/path/native token | Host destination picker and admitted execution; no target is invented                   |
| Stage/Start a commit              | Host create-commit intent with stack/selected changes                     | Full built-in inline commit composer is not ported; the host can supply `composer`      |
| Per-commit menus                  | Typed `commitActions` snippet receives the recorded commit/stack          | JJ Store's built-in edit/reword/move/split/reorder/squash/uncommit menus are not ported |
| File/folder/hunk/commit drag/drop | Portable validation/session helpers exist in `src/stacks`                 | Production presentation has no connected row drag handlers or drop targets              |
| Preview/apply/recovery            | Existing controller/adapters own request and pending-outcome contracts    | Presentation must not claim those workflows are complete from callback-only stories     |

The original slice intentionally stopped before transfer/mutation UI. This audit
confirms those gaps instead of presenting the controller helpers as proof of
end-to-end UI behavior. Native operations and source applications remain untouched.

## Before/after verification

The exact new browser target was:

`pnpm exec playwright test --config tests/catalog-browser.config.ts stack-workspace-presentation.pw.ts -g 'source pill|searchable command|native hunks'`

Before edits, all three targets failed: stock segmented tabs instead of source
pills, no searchable workspace input, and one hunk instead of three. After the
source fixes, pill and hunk tests passed; the picker test still used an incorrect
accessible-name assumption. The public Command View names its input from the
root label; querying the existing search placeholder preserves the focus/search
assertions. The exact picker rerun passed 1/1.

Final targeted commands:

- `pnpm exec playwright test --config tests/catalog-browser.config.ts stack-workspace-presentation.pw.ts`: 10/10 passed in a fresh isolated 7498 Storybook, including source pill geometry, searchable exact-ID workspace switching, three selected hunks, split layout in all hunk cards, independent diff retention, paging, target immutability, resizing, exact Git/JJ copy callbacks and create-commit intent payloads; runtime/console error count is zero.
- `pnpm test:storybook` with the five directly affected Stacks, Stack lane, Source files, Workspace diff and Workspace picker files: 40/40 each in light desktop, light narrow, dark desktop and dark narrow (160 interaction/accessibility checks); HunkActions and NamedWorkspaces are real production-component stories.
- `pnpm exec vitest run --project unit tests/stack-workspace-presentation.test.ts tests/stack-workspace-selection.test.ts`: 8/8 passed, including three native token/context partitions and exact whole-file statistics.
- `pnpm exec svelte-check --tsconfig tsconfig.json --fail-on-warnings`: drafting caught one invalid Storybook `exact` option; corrected to an anchored name matcher; final result is 0 errors and 0 warnings.
- `node .local/stack-review-ledger.mjs`: five pinned source layouts/fingerprints verified after documented adaptations. The comparison reads recorded JJ revisions rather than treating a subsequently updated source checkout as that historical revision. Its initial formatting probe needed the same TypeScript script wrapper as the canonical checker; no production syntax change was needed.
- `node scripts/source-layout.mjs`: 241 destination fingerprints verified.
- `pnpm --filter @lapismd/repository-ui build`: package generation and publint passed.
- `pnpm spec:validate`: drafting found six acceptance bullets where four are allowed; moved the detailed contract into requirement prose, preserving the four atomic acceptance bullets; final result passes 9 validators, 5 chapters and 23 requirements.

Final source comparison uses JJ Store `6961bd1c` for newly adapted tab/hunk
parts, retaining previous per-file source revisions for modified copied parts.
Source/provenance records explain all host-policy and presentation substitutions.

Full suites, complete static/package acceptance, baseline updates and native
execution remain deferred. The previously recorded unchanged Branches browser-test
size audit finding is outside this review fix. Next implementation slice is the
actual drag/drop and commit-action/composer UI wiring, with pointer and keyboard
paths and host preview/admission boundaries.

All changed files pass Prettier. The local 7490 catalog was restarted after a
stale dynamic-import failure during warm review; the isolated cold browser lane
had already passed the same production stories.

Live 7490 review after restart confirmed the corrected pills and Command View
picker on the user's open Workspace story, plus all three native range cards,
checkboxes and assignment requests in HunkActions. Local review proof is saved in
`.local/stack-review-hunks.jpg` and `.local/stack-review-picker.jpg`; these are
review captures, not approved baselines.

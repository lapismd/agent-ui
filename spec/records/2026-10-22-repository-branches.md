# Repository Branches review

The user selected Branches as the next slice and confirmed that Files already
provides the repository overview. Requirements: RUI-BRANCH-001, RUI-FOUND-001,
RUI-HISTORY-001, RUI-LIFE-001 and AUI-GOV-003. This change pauses before Workspace.

## Delivered boundary

- Copied/adapted JJ Store's bookmark/working-copy command cards and Branches
  composition at `87f2f603`. The source checkout remains read-only, with its four
  unrelated documentation modifications preserved.
- Branches/Revisions/Diff retain 380/480/560px defaults, source resize bounds and
  path levels. The existing 240px resize hint, graph, changed files, commit
  messages, conflict surface and single/all-file diff are reused.
- Typed captured-reference ports bind repository, operation and continuation.
  The controller resolves references before requesting graph ancestry. Remote
  names, deleted/multiple targets and working-copy IDs remain explicit.
- Reference switching clears dependent revision/files/diff. Graph paging retains
  the same immutable targets and clock. Invalid pages, repeated cursors,
  duplicate identities, late reference/graph replies and disposal are covered.
  Refresh can resolve a retained reference across bounded pages.
- Host column/branch/revision/file/diff actions and optional persisted canvas
  state remain injectable. Mounting subscribes only; hosts own controller
  lifetime, routing, admission, notifications, persistence and mutations.
- Two documented families provide public examples, tokens and 17 governed
  stories: Basic, Working Copy, Remote, Conflicted, Deleted, Dense, Bounded,
  All In One, Host Actions, Loading, Empty, Unavailable and Retry as applicable.
  Card contents use a command grid so author/time popovers and host actions are
  independently accessible without nested selection controls.

## Focused verification and failure counts

- Before implementation, `pnpm exec vitest run --project unit tests/branches-controller.test.ts`
  exited 1 because the target did not exist; this was missing coverage, not a
  pre-existing failing test.
- `pnpm exec vitest run --project unit tests/branches-controller.test.ts tests/jj-history-controllers.test.ts tests/jj-log-query.test.ts`:
  29/29 pass (17 Branches and 12 existing history/query tests). Initial 6/26
  failures exposed an omitted-query default and a merge fixture's required
  explicit parent; later 2/28 exposed the queued-read disposal boundary and
  test scheduling. The implementation now fences before port reads and tests
  await actual reads when exercising abort/stale responses. Final failures: 0.
- `pnpm exec vitest run --project storybook packages/repository-ui/src/jj/branches/branch-command/RepositoryBranchCommand.stories.ts packages/repository-ui/src/jj/screens/branches/RepositoryBranches.stories.ts`:
  17/17 light stories/axe pass. The first pass had 12/16 accessibility failures;
  grid/cell semantics and an empty controlled grid with external Empty status
  repaired nested controls and combobox ownership. Intermediate empty-state
  failures were 1/16 and 2/17; final failures: 0.
- The same target with `CATALOG_THEME=dark` initially had 3/17 contrast failures
  for the shared Divergent warning tag. Design Core source fix `36c8412e` uses
  semantic foreground while retaining warning fill/border. Its exact regression
  changed from 1 failure to 0, and its seven TagList stories pass. Consumer
  revalidation against the refreshed public review package is recorded below.
- `pnpm exec playwright test --config tests/catalog-browser.config.ts tests/repository-branches.pw.ts`:
  five cold browser cases cover branch/remote/deleted/workspace transitions,
  loaded search/filters, separate host actions, conflict-target unions, paging,
  all-file diff, three keyboard resize edges, retry and both documentation pages.
  Initial 3/5 failures exposed a nonreactive catalog action log, a documentation
  locator and initial cold compilation. After repairing the fixture/locators,
  one cold test exceeded its overall 30s deadline. Its first cold-import budget
  is now 60s; functional assertions retain their original deadlines. Exact warm
  transition check passed 1/1; the fresh server run passed 5/5 (42s).
- `pnpm exec svelte-check --tsconfig tsconfig.json --fail-on-warnings`:
  0 errors, 0 warnings. Draft diagnostics (3 errors/1 warning, then 1/1) were
  corrected without suppressions.
- `pnpm check:architecture`: production ownership and file budgets passed.
- `pnpm --filter @lapismd/repository-ui build`: public declarations and publint
  passed. No full workspace build or clean-package matrix was run.
- `pnpm spec:check`: validate, mdbook and spec-first passed (three lanes).
  Draft acceptance formatting failed once and was repaired to canonical form.
- `pnpm check:source-layout`: 226 destination fingerprints pass. The focused
  Branches source comparison verifies eight source fingerprints and four
  original Svelte layouts with explicit grouped adaptations. CSS extraction,
  portable ports/types and optional initial history query are documented in
  `docs/desktop-layout-sources.json` and `docs/provenance.json`.

## Local dependencies and review

Design Core code `36c8412e` is supplied through the ignored review hook using
`lapismd-design-core-0.6.0-branches-warning-review-source-built.tgz`, SHA-256
`3cf11eb4fb4150d6ef488ac70ae68c8062e87b8970999ffa0379c2daf6302785`.
It contains prepared browser CSS, declarations and retained sources. The existing
Mira and jj-history review archives are retained. Tracked manifests and lockfile
remain npm ranges. `pnpm storybook:restart` restarts only this catalog on 7490.
The updated Design Core source archive remains a temporary review setup;
publication and registry dependency qualification are separate gates.

Review `jj-complete-screens-branches--basic`, `--working-copy`, `--remote`,
`--conflicted`, `--deleted`, `--dense`, `--bounded`, `--all-in-one` and
`--host-actions`, plus the standalone `jj-browsing-branches` family.
All stories remain visual-pending, with no screenshot baseline updates.
Workspace, downstream adoption, full suites, static/clean-package qualification,
release and publication remain deferred until the requested review.

The previously recorded global original-source comparison still has the unrelated
ChatComposerDrawer source drift. This slice uses its own source comparison and
normal complete destination fingerprints; it does not claim that unrelated
original-source lane is repaired.

## Final acceptance with refreshed Design Core

- Focused Branches stories/axe: 17/17 light and 17/17 dark; the warning-tag
  contrast failures are now 0/17 in the affected dark target.
- The complete five-case browser target passed again against a fresh 7498
  process with the new public archive (1.7 minutes including cold compilation).
  The ordinary review catalog is restarted on 7490; its Basic screen was
  refreshed and retained for review. Screenshot: `.local/branches-review.png`.
- Type check remains 0 errors/0 warnings. Public Repository UI build/publint,
  architecture, all 226 destination fingerprints, the eight-source/four-layout
  Branches comparison and all three spec lanes pass. Changed-file formatting
  passes. No required targeted failure remains open.

# Workspace drag/drop review follow-up

Requirements: RUI-DRAG-001, RUI-STACK-001, RUI-COMMAND-001, RUI-FOUND-001 and
AUI-GOV-003. Stories remain visual-pending; screenshot baselines are unchanged.

## Before and implementation

The user reported that workspace drag/drop did not work and the standalone
Hunk Actions story provided no working destination. The parent implementation
(`f122c750`) retained the portable drag session/helpers but did not pass native
drag props to FileListing, bind hunk sources or connect stack/Unstaged targets.
The resumed handoff already contained the UI wiring, so a pre-edit automated
functional failure count was not available; the missing wiring was confirmed
against that parent source rather than inventing a failing run.

The authorized follow-up reconnects JJ Store's native file/folder, hunk and
mutable-commit sources and stack/branch/commit/Unstaged/new-stack destinations.
Source row geometry, valid/invalid guides and row-edge sorting are retained.
Each drop rechecks the current snapshot, source/target eligibility and preview
lock before emitting an exact typed host command. Drag end and scope changes
clear feedback. File selection plus Stage changes, hunk assignment and Move
commit/destination choices provide keyboard paths. Production rendering and
drops never call preview/apply; the host retains admission and execution.

`jj-complete-screens-stacks--drag-and-drop` uses the production screen/controller
and the existing isolated adapter. It shows a preview, Apply and Cancel, then
visibly updates the fixture only after Apply. It includes two applied stacks,
multiple hunks/files in Unstaged, immutable history and sortable/movable commits.
No source application, dependency manifest, registry package or service changed.

The private DropGuide is owned by the Stack lane family. The first
`pnpm spec:validate` found one RUI-DOCS-UNOWNED failure for this new compound
part; declaring its owner and documenting the example repaired that exact
target (one failure to zero). The source ledger records the native event and
feedback adaptations against the pinned JJ Store/Desktop revisions.

## Validation

- `pnpm exec vitest run --project unit tests/stack-workspace-drag-handlers.test.ts tests/stack-workspace-header-drops.test.ts tests/stack-workspace-sorting.test.ts tests/stack-workspace-selection.test.ts`:
  15 passed, zero failures.
- `pnpm exec vitest run --project unit tests/stack-workspace-*.test.ts`:
  all five workspace test files, 22 passed, zero failures. An earlier shell
  invocation with an additional nonexistent `tests/stacks*.test.ts` glob exited
  before running tests; the corrected command above completed.
- `pnpm test:browser tests/stack-workspace-drag.pw.ts tests/stack-workspace-presentation.pw.ts`:
  19 passed, zero failures, using a fresh Storybook/Vite on port 7498. Native
  drags verify file/folder staging, exact hunk tokens, immutable rejection,
  branch destination, commit reordering, movement back to Unstaged and Cancel.
- `pnpm test:browser tests/stack-workspace-drag.pw.ts` after adding preview-lock
  assertions and keyboard commit destination coverage: nine passed, zero
  failures, again with a fresh server. Preview screenshot:
  `.local/workspace-drag-preview.png`.
- `pnpm test:storybook` with the nine affected `RepositoryStackWorkspace`,
  `RepositoryStackLane`, `RepositoryWorkspaceFiles`, `RepositoryWorkspaceDiff`,
  `RepositoryGraph`, `RepositoryRevisions`, `RepositoryBranches`,
  `RepositoryPanel` and `RepositoryOperations` story files: 93 stories passed
  in each light/dark desktop/narrow combination, 372 checks and zero
  interaction/accessibility/runtime-diagnostic failures.
- `pnpm exec svelte-check --tsconfig tsconfig.json --fail-on-warnings`:
  zero errors and warnings.
- `pnpm --filter @lapismd/repository-ui build`: package build and publint passed.
- `pnpm spec:validate`: nine validators, five chapters and 23 requirements passed.
- `pnpm check:source-layout`: 243 destination fingerprints verified. The local
  ledger preparation also checked all ten changed layouts against their pinned
  source revisions before recording the explicit adaptations.
- Changed-file `pnpm exec prettier --check`: passed.
- `pnpm check:architecture`: two pre-existing file-budget failures, zero new
  findings. `tests/repository-branches.pw.ts` has 305 counted lines and
  `tests/stack-workspace-presentation.pw.ts` has 315 against the checker's 300-line
  browser-test limit. Both are byte-for-byte unchanged from `f122c750`, with the
  same counts there. Owner: Agent UI's browser-test organization follow-up;
  this slice does not alter the files or weaken the limit. The architecture
  gate remains failing and is not presented as passed.

The open in-app Storybook was also exercised with a native pointer drag of
`src/settings.ts` onto the stack staging area. Its preview named the exact file
and retained all three Unstaged files until Apply.

Full suites, static/clean-package matrix, downstream/native-host acceptance and
visual approval remain deferred until final screen review. Focused mock/browser
success is not native repository mutation qualification.

# Op Log portability review

The user authorized the two pending presentation corrections first, followed by
the approved Op Log slice. Work uses targeted checks and separate verified
commits; broad suites and downstream changes are outside this review.

## Presentation correction

RUI-HISTORY-001 now keeps the shared limit notice outside the complete JJ Log's
scrolling body. Standalone Revisions retain the same notice by default. Long
recorded operation commands reuse the commit-message disclosure pattern with a
nine-rem preview, exact text, accessible expansion state and selection reset.
The private notice belongs to the Revisions documentation/token family.

- Exact before target: `pnpm exec playwright test --config .local/live-chat.config.ts tests/jj-log-parity.pw.ts -g 'Op Log metadata|graph and changed-file paging'`: two failures (missing disclosure and a 284px bottom gap).
- The identical after target passed both cases, including footer geometry before
  and after scrolling, expansion/collapse and unchanged captured command text.
- Strict types: zero errors/warnings; repository-ui build and publint passed.
- Two selected Storybook interaction/accessibility cases passed; 14 unselected.
- Spec validation: nine validators, five chapters, 22 requirements; spec-first:
  11 protected files / two chapters; source ledger: 193 fingerprints and 140
  original layouts verified.

Filename/icon consolidation is already committed by the other agent; this work
does not modify its components or dependency setup. Source applications remain
unchanged and stories remain visual-pending.

## Op Log portability

RUI-HISTORY-001 / RUI-LIFE-001 / RUI-FOUND-001 extend the existing Desktop-derived
OperationController and screen, with jj-store's CommunityProjectsRepositoryLog,
StoreHistoryQuery and exact operation-difference contract as read-only references.
Source applications and foundational packages are unchanged by this slice.

- Native operation metadata queries use the existing `operations_filtered`
  public reader variant; blank queries restore the ordinary operation graph.
  The exact pin/workspace context is retained and dependent selections reset.
  This does not implement commit revsets or host-owned indexed search.
- An optional fourth constructor argument retains 50/200 defaults and supports
  smaller operation pages and display bounds. Operation, group and path pages
  reject duplicate identities, repeated cursors and empty advancing pages.
  Group/path 500-item bounds are explicit rather than silently truncated.
- Optional screen/header/metadata/file/diff snippets receive full OperationState.
  Revert requests delegate to an optional host callback, with the default disabled.
  Routing, admission, confirmation, pending effects and execution stay host-owned.
- Exact selected revisions can load their recorded conflicts. Scope changes
  fence late reads and reset the conflict surface; staging/preview remains local.
- Twelve complete review variations cover 64 operations, several authors/hosts,
  timestamps, snapshots/workspaces, merge parents, explicit multiple/ambiguous
  changed revisions, metadata-only/root operations, captured conflicts, failed
  reads/retry, host controls, complex/binary/renamed/oversized file comparisons.
  The standalone details family also demonstrates the complete recorded command.
- New private query and Empty parts have explicit family ownership; usage,
  variations, public host examples and styling tokens are colocated and audited.

Focused qualification:

- Initial new controller target: three failed cases; the implemented target and
  existing operation/history regressions passed 17 cases. Adding repeated-cursor
  and stale-conflict regressions makes the final targeted unit result 19 passed.
- Initial strict compilation exposed fixture typing and a Svelte rune-name issue;
  the repaired tree passed with zero errors/warnings. No type shim was added.
- Initial new-story render failed because the fixture refreshed the same owned
  controller twice. The fixture now selects from the screen's subscribed ready
  state, and all 17 Op Log stories passed interaction/accessibility checks.
- File budgets caught an oversized controller and duplicated Empty markup;
  operation lifetime/metadata helpers and one private shared Empty part retain
  the existing contracts within the unchanged 300-line budget.
- Six Op Log browser workflows passed. Expanded coverage passed 11 of 12 combined
  JJ/Op Log workflows; one ambiguous Root operation selector was scoped to its
  Empty title, and its exact regression then passed.
- Repository-ui build/publint, strict types, architecture and specification
  validation passed before the final cold refresh recorded below.

Final targeted evidence:

- Unit/controller lane: 21 passed across operation query, operation files and
  existing history controllers, including the 500-group limit and duplicate paths.
- After adding controller-close coverage, the exact query/lifecycle target
  (`pnpm exec vitest run --project unit tests/jj-operation-query.test.ts`)
  passed all six cases, including draining an outstanding filter without a late
  state or listener update.
- Operation screen/details Storybook lane: 21 interaction/accessibility cases passed.
- After a fresh `pnpm storybook:restart`, combined JJ/Op Log browser workflows:
  12 passed with zero captured runtime or console errors.
- Strict Svelte/TypeScript: zero errors/warnings; repository-ui build and publint
  passed; architecture budgets and production ownership passed.
- Source ledger: 193 fingerprints / 140 original layouts matched; spec validation:
  nine validators / five chapters / 22 requirements; spec-first: 31 protected files
  / two canonical chapters after the final documentation refresh.
- Scoped formatting passed for the changed files, including the final lifecycle
  regression and this evidence record.

Broad suites, the complete static/packed-example matrix, native-service
qualification, publication and downstream adoption remain deferred. The next
action is user review of Op Log, not repository browsing implementation.

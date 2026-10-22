# JJ and Op Log presentation follow-up

RUI-HISTORY-001 / RUI-FOUND-001 / RUI-LIFE-001: the user expanded this reviewed
section to shared paging, conflict/chip presentation, file counts, larger diff
context, wide branching graphs, lane-dependent avatars and query completion.
This remains a targeted local catalog slice, with review before repository
browsing, broad suites or downstream adoption.

## Shared presentation

- Both graph screens use the same RepositoryGraph; file rows use Design Core
  FileListing. Paging spans the row with centered muted text in both logs.
- Known conflicts render the existing Conflicted tag and an 8% semantic
  destructive wash, retained through selection and hover. Operation graph
  metadata marks only known selected after-revisions; it does not fabricate
  conflict state for unread operations.
- Snapshot, merge, workspace, bookmark and divergence chips use known icons;
  neutral chips use an opaque secondary surface on selected rows.
- File conflicts come from native after terms or explicit conflict content.
  Line counts come from supplied text, with absent binary/unknown counts kept
  absent. Folder totals include only loaded descendants with known counts,
  independent of collapse state. The fixture supplies text summaries rather
  than inventing counts for not-requested content.
- The shared diff reader now receives a long retained query-preset section
  between two edits; its native unmodified-line controls are exercised.

## Source adaptation and host boundaries

Both dense fixtures expose 64 operations/revisions, sixteen parallel topic
branches, merges and continuation. RepositoryGraph now uses jj-store's
repositoryLogContentLeft(row) and graph-width-plus-20rem reserve. Avatars follow
active lanes instead of one global column; constrained columns can scroll.
The source observeRevisionRow helper coalesces row/parent measurements through
an owned animation frame, preventing ResizeObserver writes during delivery.

The shared RepositoryHistoryQuery is copied/adapted from StoreHistoryQuery and
history-language. Public SearchFilterInput supplies the pill/editor. Native
revsets and operation metadata retain separate lexing/completion; hosts may
provide signatures, aliases, operators, fields and symbols through queryInfo.
Tab accepts completion; Enter accepts an open suggestion or applies a draft;
Ctrl/Cmd+Enter applies explicitly. Newer drafts survive completion of older
host queries. Hosts retain validation, query execution, pins and feedback.
Both complete screens expose search by default and may explicitly disable it.

The query has its own stories, public sources, MDX, tokens and fail-closed family
registration. Copied source hashes/layout adaptations and secondary jj-store
references remain in the source ledger; no source application was edited.

## Qualification and review limits

- Initial light/dark paging/conflict regressions: two failed; both passed after
  the implementation. New-chip assertions were scoped to visible list items
  after accounting for TagList's measurement markup and whitespace.
- Design Core: four focused model tests and eleven FileListing interaction/axe
  cases passed; strict types had zero errors/warnings; spec check passed all
  three lanes. The separate source records include repaired accessibility and
  story-query failures.
- Source-only consumer packaging exposed Vite 8 .svelte.ts optimizer parsing.
  The existing prepared-package workflow repaired that boundary; the ignored
  review hook now uses the prepared archive. Portable manifests and lock entries
  keep registry ranges; no aliases, node_modules edits or package patches.
- The source-only server exited during optimization (eight connection failures).
  Later restart/readiness races were recorded separately; final cold evidence waits for
  the catalog-ready endpoint. No functional assertion or accessibility rule
  was weakened.
- Matching the public editor's searchbox role fixed two new query story failures.
  Existing file-selection assertions now use exact data-file-path identities,
  because accessible names correctly include visible counts. The fixture adds
  a sixteenth file and a second conflicted revision; exact counts are updated.
  Final targeted evidence:

- `pnpm exec vitest run --project unit tests/jj-history-presentation.test.ts`: two passed (lossless counts/conflicts and sixteen-lane topology/offsets).
- The selected six story families with `-t 'Revset|Operations|Pending|Conflicts|DenseHistory|RichHistory|Complex|Basic'`: twelve interaction/accessibility cases passed, thirty-three unselected. No failures remain in this target.
- After a fresh `pnpm storybook:restart` and a successful catalog-ready read, `pnpm exec playwright test --config .local/live-chat.config.ts tests/jj-log-parity.pw.ts tests/jj-operation-parity.pw.ts tests/jj-operation-presentation.pw.ts tests/jj-history-review.pw.ts`: twenty passed. Existing diagnostics assertions captured no runtime/console errors.
- The wider graph exposed a ResizeObserver-delivery write; copying jj-store's frame-coalesced measurement helper repaired it. Existing browser tests moved from six failures, through ten passes/two outdated file-name selectors, to all twelve passing as part of the final twenty-case run. The exact two repaired selector cases also passed independently.
- Strict Svelte/TypeScript: zero errors and warnings. Repository UI build/publint and unchanged architecture budgets passed.
- Specification: nine validators, five chapters, twenty-two requirements passed. The source ledger verified 196 fingerprints and 141 original layouts after explicit source/adaptation comparison.
- Scoped formatting and the final spec-first gate accompany this record; no broad suite or baseline update was run.

Full product/unit/story suites, static catalog/packed-example matrices, native
service acceptance, publication and downstream adoption remain deferred. The
existing unpublished jj-history portable-lock prerequisite remains explicit;
CodeMirror's direct registry dependencies are recorded using existing lock
snapshots. Visual baselines were not changed; stories remain visual-pending.

# Delivery and review

| Slice                                       | Status                 | Evidence                                                                                  |
| ------------------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------- |
| Agent foundations and five complete screens | Awaiting visual review | 18 documented families, full transcript, turn changes and tool renderers                  |
| Desktop JJ history                          | Awaiting visual review | 20 documented families; JJ Log, Op Log, file history, blame, conflicts and restore        |
| JJ workspace and repository browsing        | Deferred               | jj-store workspace, drag/drop and repository/forge screens require a later reviewed slice |
| Downstream adoption and publication         | Review gate            | No application/service changes, deployment or publication                                 |

The user authorized the Desktop-first JJ slice and requested a pause for review
before continuing. AGENTS.md records the current source-copy, AppShell/Column
Canvas, per-family docs, native CSS variables, in-memory controllers and
fail-closed specification guidance.

Current JJ review covers 51 copied Desktop components, 30 pure controller/model
helpers, eight original styles and the existing shared graph algorithm. Small
controls have padded bounded examples; complete screens retain the original
shell and controller composition. The Desktop backup/provider/settings subtree
and App-owned footer contributions remain host integration or later work.

The source ledger records exact revisions, hashes and reviewed adaptations.
The file-icon follow-up refreshes the public Design Core review package for all
FileListing consumers and replaces remaining filename icons in JJ headers,
attachment chips/search, saved-file headers and file-backed catalog skills.
The current user corrections add single-change Op Log expansion, rich multi-author
blame, host-resolved author avatars, icon-bearing Empty/unavailable states and
Design Core's cold-catalog dependency optimization. Visual baselines remain
unchanged.

The unpublished public jj-history protocol package is supplied through an ignored
review archive. The checked-in manifests retain semver ranges; ordinary registry
installation and lockfile refresh remain a release prerequisite, not a passed
review check. Details and actual qualification counts belong in
`spec/records/2026-10-22-desktop-jj-review.md`.

The filename-icon follow-up adopts public Design Core FileTypeIcon in attachment
chips, attach-file suggestions, saved-file headers, local catalog skills and JJ filename titles. Shared
FileListing and diff/tool presentation inherit the source implementation. The
source ledger documents each intentional glyph substitution at the original
size; geometry and actions remain owned by the existing components. Qualification
is recorded in `spec/records/2026-10-22-file-type-icons.md`. Before release,
publish the icon-capable Design Core version and update the dependency minimum
and portable lockfile; the local packed overlay is review evidence only.

Earlier Agent records remain in `spec/records`. Final approval of each section
and all downstream migration remain explicit user decisions.

## Portable jj-store parity review sequence

The approved plan delivers one complete section at a time, using focused checks
and pausing for review before the next. Broad suites wait for final screen review.

1. Chat references, composer/preview parity and configurable transcript actions — committed with focused checks; visual review remains pending.
2. JJ Log: portable controllers, header actions, search and dense examples — implemented; the requested fixed paging footer and recorded-command disclosure are committed separately.
3. Op Log: pinned comparisons, native metadata filters, host actions, conflicts and dense operation examples — implemented with targeted checks; awaiting review before repository browsing.
4. Repository file browser: directory rows, file tree, breadcrumbs, code/documents and file history.
5. Repository overview and branches: navigation, selectors, bookmark/branch details and host actions.
6. Workspace presentation: original columns, stack cards, source files, target history and retained selection.
7. Workspace transfers: file/folder/hunk drag/drop, keyboard alternatives and exact preview/apply/recovery.
8. Stack and commit operations: original supported menus, drafts, placement controls and conflict surfaces.
9. Projects: directory/details, linked repositories and host-owned metadata/access.
10. Tasks: lists, hierarchy, editing, references and comments with retained drafts.
11. Agent directory and comparison: managed/recorded sessions, workspace changes and Compare Agents.
12. Embedded evolution, review, activity, agent-context and forge/checks panels — each a separate review slice.

Generic references and actions belong to Design Core; host navigation, identity
lookup, notifications, persistence and agent dispatch remain injected. Mentions
are references by default, with explicit host-configured routing. Complete
Threads, Workflows and settings are deferred. Actual downstream adoption and
publication require separate approval.

Implemented review follow-up aligns JJ/Op Log paging, conflict and chip presentation, loaded file/folder stats, sixteen-lane graph examples and source-adapted query completion. Targeted checks only; repository browsing and downstream adoption remain gated.

The graph review now widens and narrows gradually in both logs so lane-dependent
avatars can be inspected across successive rows. Expanded search help adopts
JJ Store's icon-bearing informational alerts in the shared query component.

The long-diff review exposed missing context folding in Design Core's split
reader. The source fix and local review package now pass reveal/hide checks in
both JJ and Op Log unified/split layouts; the corrected screen awaits review.
The horizontal-scroll follow-up retains an opaque gutter beside split fold
controls, qualified in the same complete-screen regressions.

The approved all-in-one diff slice adds the documented shared Diff Viewer family,
host-controlled single/all-file settings, lazy per-file reads, bounded append
paging, navigation into expandable sections and icon-bearing per-file menus.
Both complete logs retain the ordinary unified/split reader and original column
boundaries. Header-wide disclosure, continuous square sections, separators,
inset selection outlines and vertical menus incorporate the live review feedback.
Focused qualification is recorded in `spec/records/2026-10-22-diff-collection.md`.
This section is visual-pending; stop for review before repository browsing.

All-file header review adds complete optional host totals and separate
comparison-wide action slots in both logs. Exact file restores stay beside their
file. Shared Design Core selection layering and header hover/focus are qualified
with painted side-edge probes; evidence is in
`spec/records/2026-10-22-diff-header-review.md`. Continue to pause for screen review.

The log-canvas follow-up adopts JJ Store's fixed scrolling configuration and
240px trailing spacer with a shared icon-bearing Empty hint, retaining pointer
and keyboard resizing of the final Diff column. Evidence is in
`spec/records/2026-10-22-log-canvas-spacer.md`; screen review remains pending.

All Changes surface review removes the collection's default inline-end inset
and Op Log's inner side borders, keeps the selected frame visible, and restores
Op Log sticky headers to the actual column viewport. Translucent header tints
now have an opaque backing in Design Core. Focused evidence is recorded in
`spec/records/2026-10-22-diff-surface.md`; review remains pending.

# Repository

The current review slice copies Desktop JJ history components and controllers
through public, operation-pinned HistoryReader ports, with complete in-memory
examples under JJ. Native admission, repository access, notification policy,
avatar resolution and preference persistence stay host-owned.

## RUI-FOUND-001 — Component foundations

**Requirement.** JJ foundations MUST follow the same per-folder documentation, styling contracts and fail-closed specification enforcement as Agent foundations.

Filename titles and shared file listings MUST use the public Design Core
FileTypeIcon from the host-issued path while retaining original geometry,
truncation, folder affordances and explicit navigation identities.

### Acceptance details

- Every independent family MUST own its component, stories, MDX, complete public usage/styling examples and audited CSS-variable defaults.
- Complete screens MUST compose the same source-copied production components and host-owned controllers as the standalone foundations.
- Empty and unavailable states MUST use public shadcn Empty with an icon and applicable retry actions, and small standalone controls MUST use padded bounded previews or their real composition context.
- New components, missing family structure, undocumented variations and token drift MUST fail validation while frozen pre-review scaffolding remains explicitly deferred.

## RUI-DESKTOP-001 — Desktop history review

**Requirement.** The Desktop JJ slice MUST preserve the original AppShell/Column Canvas layouts and controller flow for JJ Log, Op Log, file history, blame, conflicts and restore presentation.

### Acceptance details

- Copied source revisions, licenses, fingerprints and intentional host bindings MUST remain reviewable without changing source applications.
- In-memory stories MUST cover meaningful populated, empty, loading, unavailable, recovery, pinned selection and comparison states without contacting native services.
- Exact pin/lifetime tests, interaction/accessibility, public-package examples and source-layout comparison MUST precede the explicit user review gate.
- Expanding an operation with one fully loaded change group MUST select that group and show its recorded changed paths, while multiple or paged groups and ambiguous endpoints MUST retain explicit selection; unavailable comparisons MUST never invent endpoints.

## RUI-BROWSE-001 — Repository browsing

**Requirement.** Repository screens MUST preserve host-issued operation, revision and path identities while composing file, directory, code and document views through public primitives.

The browser adapts JJ Store's resizable AppShell body sidebar, breadcrumb,
directory table with attribution and recorded file/document previews. Typed
read-only ports bind repository, operation, revision, canonical path and
recursive/page scope. Controllers reject mismatched responses, repeated cursors
and duplicate rows, fence stale reads, bound loaded pages and abort/drain owned
work on close. Construction and mounting MUST NOT mutate repository state.
Hosts supply navigation, clipboard, history/blame actions, custom header/row
controls and layout persistence. Sidebar actions MUST use public Design Core
PanelToggle controls; file previews MUST size to available space without forced
minimum content heights or redundant nested vertical scrolling. File display
MUST retain JJ Store's Preview/Source/Blame text toggles, render Blame in place
of the file contents and expose shadcn tooltips plus semantic hover feedback
for header actions. Directory description links MUST retain normal text colour
until hover. The reusable snapshot picker MUST preserve JJ Store's command
view with bookmark/change filters, commit keyword search and typed complete
choices; the host resolves zero/multiple targets and owns pinned navigation.
Change choices MUST reuse a documented shared card with author avatar, message,
time and exact Git/JJ copy controls that do not activate the surrounding row.
Complete Files headers MUST use public AppShell header components with matching
body/sidebar header heights; standalone trees MAY receive a host header snippet.
Both body sidebars MUST expose independent bounded pointer and keyboard resize controls, bindable widths and host persistence callbacks. The right inspector MUST default/reset to 420px while retaining host-controlled width and 280–800px resize bounds, and use the same semantic background as the body.
File history MUST use a transparent public AppShell.Toolbar of the same height,
group recorded revisions by date, retain the shared Git/JJ copy buttons, and
expose separate host callbacks for viewing file code and browsing the repository
at that revision. Description disclosure MUST reveal the recorded Markdown body
with the existing View more/View less behavior for long messages. Directory summaries and file metadata MUST reuse this same local disclosure beneath the metadata row, without navigating to another commit or changing the selected pin. Directory and file metadata MUST keep the expanded description inside their existing bordered card, below the unchanged header row, with a divider and a theme-muted body surface. The description button MUST retain a visible theme-based background while expanded. Metadata detail panels MUST retain 8px top and horizontal padding with zero bottom padding and outer margins; other commit-description surfaces keep their existing defaults. Missing host
navigation capabilities MUST remain absent rather than inventing routes.

### Acceptance details

- Filename-bearing rows and headers MUST use public Design Core FileListing and FileTypeIcon, preserving file artwork and sizing tokens.
- Each reusable browser family MUST own documented public examples, styling variables and governed stories that fail validation when its required structure is absent.
- Exact-pin controller tests MUST verify scoped reads, invalid replies, bounded paging, stale-response rejection and disposal without repository mutations.
- Complete in-memory screens MUST reuse the existing history/blame components and cover populated, nested, dense, Markdown/source, binary/empty, loading, unavailable and retry states before pausing for review.

## RUI-HISTORY-001 — History

**Requirement.** Commit, operation, evolution, file history and blame screens MUST preserve explicit pins, parent comparisons and bounded paging. Missing content MUST remain distinct from empty content.

Bounded history notices MUST remain outside the scrolling column body at its
bottom edge, and long recorded command arguments MUST offer keyboard-accessible
View more/View less without altering captured text.

Op Log MUST use operation metadata filters through the public native query port,
retain exact pins and immediate-parent comparisons, reject stale/invalid pages
and expose bounds for operations, changed revisions and paths. Hosts MUST be
able to supply typed header, operation, metadata, file and diff actions without
moving routing, admission or mutation execution into the shared UI. Conflicts
MUST be read against the selected recorded commit/change pair.
Known conflicted rows MUST display a Conflicted badge and a subtle semantic
destructive tint in light and dark themes. Operation paging MUST span its row
with a centered, muted label.
Operation chips MUST remain distinct during selection and use icons for known
metadata. Dense comparisons MUST include unchanged sections large enough to
demonstrate the shared diff reader's context expansion and collapse in both
unified and split layouts, including synchronized split-pane controls that
remain beneath the opaque number gutter while scrolling horizontally.
JJ Log and Op Log MUST share the source-adapted query editor presentation,
syntax highlighting, explicit completion and host-provided vocabulary while
retaining their distinct revset and operation query languages. Hosts retain
validation and query execution. Dense examples MUST exercise several graph
lanes that progressively widen and narrow, merges, continuation and scrolling
in both logs, making row-specific avatar movement visible. Expanded query help
MUST use the source informational Alert composition with centered icons,
language-specific syntax and accurate keyboard guidance. Changed-file rows MUST
retain known conflicts and supplied counts, with loaded descendant totals.

Both logs MUST accept a host-controlled single/all-file diff preference. All-file
presentation MUST reuse the shared diff reader inside expandable file sections,
start with the selected file expanded, append bounded batches and reveal, expand
and scroll to explicit changed-file selections including repeated requests.
Per-file content reads MUST be deduplicated, independently retryable and fenced
by their exact comparison and controller lifetime. File menus MUST accept typed
host actions with icons and exact per-file identities; path resolution, clipboard,
file-manager access and preference persistence remain host-owned.

All Changes headers MUST show optional host-provided totals for the exact
comparison, including unpaged files; missing totals MUST remain absent rather
than falling back to selected-file or partially loaded counts. Single-file
actions MUST stay in single-file headers or per-file menus; an independent
all-changes action snippet MUST provide explicit comparison-wide controls.
The collection MUST be flush with the column by default, retain visible selected
frame edges beside overlay scrollbars, and have no extra bottom padding after
the final content row. Sticky headers MUST have an opaque surface beneath their
semantic selection and hover tints, preventing scrolled content showing through.
Unavailable and binary diff status messages MUST use compact interface typography
(14px title and 13px description at the default root size), independent of the
code reader's monospace font, with documented host styling variables.

JJ Log and Op Log MUST use fixed-width scrolling canvases with a 240px trailing
spacer, using the public Column Canvas controller and trailing-content slot.
The spacer MUST show an icon-bearing shadcn Empty resize hint, keep the final
Diff column edge reachable for pointer and keyboard resizing. Smaller panes
MUST retain horizontal scrolling and independently resizable columns.

### Acceptance details

- JJ Log MUST retain its exact operation and workspace while applying a host-configured revset query, clearing dependent revision/file selections and discarding late replies.
- Graph paging MUST retain the query's identity and evaluation clock, reject duplicate identities and repeated cursors, and expose an explicit bounded-result state.
- Complete screens MUST expose header controls, additional header/diff actions and selected-revision actions through public snippets with typed selection context and source-faithful defaults.
- Production building blocks and complete in-memory screens MUST demonstrate dense tags, merges, conflicts, paged and bounded history, text/binary diffs, unavailable reads and long messages on parent-matched surfaces with expansion/collapse and complete multiline Op Log command arguments.

## RUI-STACK-001 — Workspace

**Requirement.** Stack workspace screens MUST retain named workspace, branch, commit, file and hunk selections through navigation, resize and refresh using an injected adapter.

### Acceptance details

- Public types express the boundary.
- Focused tests and production-component stories verify the behavior.

## RUI-DRAG-001 — Drag and keyboard

**Requirement.** Workspace file, folder, hunk and commit transfers MUST offer pointer and keyboard paths, validate the current source/target and stage or preview before execution.

### Acceptance details

- Public types express the boundary.
- Focused tests and production-component stories verify the behavior.

## RUI-COMMAND-001 — Preview and outcomes

**Requirement.** Commands MUST bind an exact request to preview and apply. Unknown outcomes MUST preserve that request and block automatic replay; stale or unavailable selections MUST not mutate.

### Acceptance details

- Public types express the boundary.
- Focused tests and production-component stories verify the behavior.

## RUI-FORGE-001 — Forge and settings

**Requirement.** Forge, checks and repository settings screens MUST preserve drafts, capability gates and pending effects through navigation and floating. Credentials and execution MUST remain host-owned.

### Acceptance details

- Public types express the boundary.
- Focused tests and production-component stories verify the behavior.

## RUI-LIFE-001 — Repository lifetime

**Requirement.** Repository controllers MUST discard late scoped responses and release owned resources on close without changing host admission or durable repository state.

### Acceptance details

- Public types express the boundary.
- Focused tests and production-component stories verify the behavior.

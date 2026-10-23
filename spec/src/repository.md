# Repository

Documented public-import examples MUST compile in clean package acceptance,
including icon dependencies explicitly imported by the consumer. Host-owned
controller lifetimes MUST capture their initial constructor inputs explicitly;
reactive callback props MUST remain invoked through closures. Documentation
example repairs do not change the completed history/browser screen contracts.

Following the same active editor file MUST retain its explicitly selected
operation; only an explicit new operation or changed file scope replaces it.

The current review slice copies Desktop JJ history components and controllers
through public, operation-pinned HistoryReader ports, with complete in-memory
examples under JJ. Native admission, repository access, notification policy,
avatar resolution and preference persistence stay host-owned.

## RUI-FOUND-001 — Component foundations

**Requirement.** JJ foundations MUST follow the same per-folder documentation, styling contracts and fail-closed specification enforcement as Agent foundations.

Filename titles and shared file listings MUST use the public Design Core
FileTypeIcon from the host-issued path while retaining original geometry,
truncation, folder affordances and explicit navigation identities.
Hosts can use the public `encodeJjChangeId` helper for native hex change IDs
before passing display models to file, branch and stack components.

### Acceptance details

- Every independent family MUST own its component, stories, MDX, complete public usage/styling examples and audited CSS-variable defaults.
- Complete screens MUST compose the same source-copied production components and host-owned controllers as the standalone foundations.
- Empty and unavailable states MUST use public shadcn Empty with an icon and applicable retry actions, and small standalone controls MUST use padded bounded previews or their real composition context.
- New components, missing family structure, undocumented variations and token drift MUST fail validation while frozen pre-review scaffolding remains explicitly deferred.

## RUI-DESKTOP-001 — Desktop history review

**Requirement.** The Desktop JJ slice MUST preserve the original AppShell/Column Canvas layouts and controller flow for JJ Log, Op Log, file history, blame, conflicts and restore presentation; public `/history` controller exports MUST load without Svelte components.

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

## RUI-BRANCH-001 — Captured branches

**Requirement.** Branches MUST adapt JJ Store's bookmark and working-copy cards
and Branches/Revisions/Diff canvas, with host-owned exact operation pins and
read-only reference ports. Files provides the repository overview.

References resolve before graph reads. Single targets use exact ancestry,
conflicted targets use a union, and deleted references use none(). Branch
switches clear dependent selections. Working copies open their exact commit
while retaining the ancestry graph. Reference paging is bounded and
deduplicated; graph paging retains its target query and evaluation clock.
Invalid pins, repeated cursors, duplicate identities and stale replies fail
closed. Closing aborts/drains owned work and releases history handles.

The independently resizable three-column canvas reuses existing graph, changed
files and single/all-file diff components, with keyboard controls and trailing
resize space. Host actions and persisted canvas state remain injectable; UI
mount only subscribes and never mutates repositories. Selection controls keep
author popovers and host actions independently accessible. Selected working
copies MUST use the same primary left-edge marker and semantic row surface as
bookmarks. Unselected bookmark and working-copy rows MUST use the theme body
background (white in light mode), retaining distinct hover and selected surfaces.
Branch and working-copy chips MUST retain an opaque theme body fill and a
visible outline during pointer hover, keyboard focus and retained selection.
Branch cards and their content MUST fill the available column width;
long names MUST truncate with the complete name retained in a title. As columns
shrink, optional heading badges and relative timestamps MAY hide while author,
workspace identity and conflicted/deleted status remain available.

### Acceptance details

- Recorded local/remote, workspace/change and bookmark status identities MUST remain distinct.
- Focused controller tests MUST verify exact target scopes, paging, stale replies and disposal.
- Isolated stories MUST cover populated, conflicted/deleted, remote, workspace, dense/paged, bounded, all-file, custom-action, loading, Empty, Unavailable and retry states.
- Stories MUST remain visual-pending with a review pause before Workspace.

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

The presentation slice MUST adapt JJ Store's fixed Branches/Stacks and Workspace
canvases, original column geometry, grouped bookmark cards, applied stack lanes,
unstaged files, target history and per-origin adjacent diff columns. It MUST reuse
the host-owned portable StackWorkspaceController and operation/read-key-pinned
adapter. The UI may request bounded reads but MUST NOT preview or apply commands
on mount. Workspace changes, command requests, clipboard and custom header,
branch, revision, file and diff actions MUST remain explicit host callbacks or
snippets. Transfers, mutation dialogs and forge transport remain separate slices.
Normal rows and cards MUST retain theme surfaces, keyboard selection, semantic
conflicts, explicit immutable/alias/shared tags and icon-bearing Empty/unavailable
states. Unknown file counts MUST stay absent; supplied counts and loaded
folder totals MUST remain accurate. Refresh, view changes and independent
column resizing MUST preserve retained source/file selections and drafts when
still present in the same scope. Controller disposal belongs to the host.

Stacks/Workspace navigation MUST share the source pill states; named workspace selection MUST reuse the searchable Command View picker and emit exact recorded IDs without fabricated commits.
Recorded native hunks MUST render separate range headers and independent selection controls, preserving native tokens, complete file statistics and read-only target/immutable boundaries. Assignment and commit controls MUST distinguish host requests from execution.
Selected branch examples MUST preserve recorded stacked bookmark boundaries
through lazy history reads. Inline commit files MUST retain JJ Store's compact
frame, graph-lane inset and thin inner spacing, with independent contextual
labels and a short Changed files heading.
The Stacks/Workspace body toolbar MUST omit its lower divider; target-history
column icons MUST match the other 16px column header icons.
Continuous graph connectors MUST remain visible beside expanded commit files
in both Stacks and Workspace, spanning the complete selected row height.
Stack and Workspace lanes MUST show commit summaries and inline changed files
without expanded commit-description bodies. PR descriptions and additional
host-supplied details MUST appear above the selected file diff in the adjacent
per-origin column, including PR-only selection before a file is chosen.
Both views MUST retain JJ Store's workspace controls, branch action bars,
stack/commit menus and capability/immutable-aware requests. PR details MUST
expand, edit and detach into the public Design Core floating window, retaining
the same content instance, draft, scroll and focus when docking or closing it.
PR checks and merge/draft/refresh actions MUST use exact host-supplied records
and explicit callbacks; presentation MUST NOT load credentials, contact a forge
or execute repository/PR mutations. Missing capabilities stay disabled or absent.
PR examples MUST exercise passed, failed and running checks, including their
summary and result descriptions in the floating view.

Stacks/Workspace hosts MAY hide the local view tabs through `showViewTabs` when
the outer frame owns navigation; the workspace picker and action bars remain shared.

### Acceptance details

- Complete in-memory Stacks and Workspace screens MUST use the same production lanes, source files, graph and diff components, with exact host action contexts.
- Dense examples MUST include multiple applied lanes, grouped/shared heads, conflicts, long messages/tags, paged history/files, binary/unavailable diffs and independent adjacent file selections.
- Focused controller, interaction/accessibility, cold browser and source-layout checks MUST precede a screen-review pause; broad checks wait until final review.
- Component families MUST own public examples, styling contracts, governed states and source/provenance records; host selection/persistence callbacks MUST retain original identities.

## RUI-DRAG-001 — Drag and keyboard

**Requirement.** Workspace file, folder, hunk and commit transfers MUST offer pointer and keyboard paths, validate the current source/target and stage or preview before execution.

Workspace presentation MUST connect native file/folder rows, individual native
hunks and mutable commit rows to the existing controller drag session. Stack,
branch-header, commit, Unstaged and new-stack targets MUST show valid/invalid
feedback and revalidate the current snapshot, capabilities and lock state on
drop before emitting an exact host command. Commit row edges MUST request
reordering while their centers retain commit-target behavior. Pending previews,
immutable or stale sources and unavailable targets MUST reject transfers.
Drag end and snapshot/workspace changes MUST clear transient feedback.

Keyboard users MUST be able to select files/hunks and request staging, assign a
hunk or choose a commit move/reorder destination. A complete in-memory example
MUST demonstrate drop preview, explicit Apply/Cancel and visible fixture changes
only after Apply. Production components MUST leave preview, admission and
execution to the host; rendering or dropping MUST NOT execute a command itself.

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

Settings card headers MUST own a single compact inset and align section icon centres with row icon centres.

### Acceptance details

- Shared appearance and settings presentation is exported through `/settings` using JJ Store palettes, theme pairing, preview tiles, settings cards and page geometry.
- Settings pages and their stories use the production AppShell body, standard toolbar header and scrolling body content with a 1rem card inset.
- Hosts own storage namespaces, native capabilities and repository policy; the portable framework does not enable native glass.
- Appearance previews do not persist, invalid values fall back safely, and disposal restores the owning root and removes browser listeners.

## RUI-LIFE-001 — Repository lifetime

**Requirement.** Explicit file-history navigation MUST accept the selected operation before its first read. Repository controllers MUST discard late scoped responses and release owned resources on close without changing host admission or durable repository state.

### Acceptance details

- Public types express the boundary.
- Focused tests and production-component stories verify the behavior.

## RUI-NAV-001 — Contextual application navigation

**Requirement.** Shared application navigation MUST compose public AppShell,
ResponsiveTabs, Breadcrumb and CommandView primitives with host-owned routes.

Contextual tabs MUST retain JJ Store's compact 0.75rem typography through a public styling token, including the overflow measurement.

### Acceptance details

- Contextual tabs MUST distinguish Projects, a selected project, repository views and Stacks subviews, omit Actions, and retain accessible overflow navigation.
- Repository selection MUST use exact supplied identities, searchable command rows, explicit unavailable states and an optional native-open callback.
- Breadcrumbs MUST support the repository picker as their first item without implying that global pages belong to the active repository.
- Mounting navigation MUST NOT mutate repositories; selection, continuation, routes and controller lifetime remain host-owned.

## RUI-WORK-001 — Projects and reviews

**Requirement.** Complete Projects screens MUST adapt JJ Store's directory, task, review, activity and linked-repository flows through scoped host ports, preserving metadata homes separately from linked code targets.

Projects MUST NOT be marked complete until each new page composition has been compared with the running JJ Store: Topbar ancestry outside the body, contextual navigation, search/filter/action toolbar, Mine/Other groups, creation dialogs, fixed task header/composer, discussion, activity timeline and contextual rail. Interaction passes alone do not satisfy this user-required composition gate; remaining differences MUST be recorded explicitly.

Empty review collections MUST render their Empty state outside list semantics, while populated collections retain list/listitem relationships.

Creation cards MUST use the theme body surface (white in the default light theme) for editable rows and retain tinted headers; Reviews MUST expose the shared expanding search with query submission, Escape dismissal and trigger focus restoration.

Review details MUST retain JJ Store's compact header and metadata rows for Anchor, Author, Status and Snapshot, followed by Description, Files changed, Commits and Activity disclosures with an independently scrolling body and fixed composer. Host-supplied review code context MUST retain exact repository/operation identities, Git/JJ identifiers and patches; absent or failed context MUST show an explicit unavailable state and retry without substituting the active checkout. Resolve/Reopen and replies MUST retain captured versions and metadata-home routing. Review activity MUST retain source timeline geometry, with 32px Git author avatars and 36px comment participants and their distinct row insets. Task disclosure headings MUST have visible opaque hover and keyboard-focus feedback, and header actions MUST remain in one group. Task and Review detail MUST share a full-width AppShell body header: Back occupies its own layout cell near the body edge, the title wraps without overlapping controls, and actions remain reachable at narrow widths. The body content, metadata-card edge, disclosure headings and composer MUST align with the start of the title text, while Back remains near the body edge and the body scrolls independently.

Global task creation MUST group the task's project selector with its metadata home in the shared card rows before showing the selected project's task fields.

All card/list directories MUST share one toggle button whose icon, accessible name and tooltip identify the destination layout, retaining keyboard focus when toggled. Cards MUST size and wrap to the available width without clipped project titles or horizontal overflow. Project, task, review and repository authors MUST retain the source 1.5rem avatar size in both layouts; dates MUST retain their source placement and fit on one line.

### Acceptance details

- Native identities, exact versions, bounded per-home continuation, independent loading/retry, duplicate names and stale-response rejection MUST remain explicit in the production controller and stories.
- Create, edit, link, comments and review controls MUST retain host-owned drafts and exact outcomes; mounting or refreshing MUST NOT replay a mutation, and unknown requests MUST require explicit status inspection.
- Hosts MAY omit the Projects outer header and contextual tabs through explicit public props when the application already owns those regions; complete body, detail rail and interactions MUST remain shared and the frame MUST own responsive contextual tabs without duplicate navigation, while host callbacks provide ancestry, chat context and code activation; agent content MUST compose through snippets without importing the agent package.
- Complete stories MUST exercise populated, empty, unavailable, partial, paged and recovery states, source provenance and source-faithful list/grid/detail layouts; visual baselines MUST remain unchanged.

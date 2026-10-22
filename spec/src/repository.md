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

### Acceptance details

- Public types express the boundary.
- Focused tests and production-component stories verify the behavior.

## RUI-HISTORY-001 — History

**Requirement.** Commit, operation, evolution, file history and blame screens MUST preserve explicit pins, parent comparisons and bounded paging. Missing content MUST remain distinct from empty content.

### Acceptance details

- Public types express the boundary.
- Focused tests and production-component stories verify the behavior.

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

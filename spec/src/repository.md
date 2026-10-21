# Repository

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

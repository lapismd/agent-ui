# Agent

## AUI-CHAT-001 — Conversation

**Requirement.** Conversation screens MUST compose Design Core Transcript and controlled composer state, retaining drafts, attachments, comments and request identities across presentation changes.

### Acceptance details

- Copied source markup and styles MUST preserve pixel-perfect presentation at matching viewport, theme, fonts and data.
- AppShell frame, header, body and footer boundaries MUST remain available for host composition.
- Normalized source fingerprints MUST record and verify explicit host bindings.
- Interaction, accessibility and pixel review MUST qualify the extracted presentation before downstream adoption.

## AUI-CHAT-002 — Submission

**Requirement.** Submission MUST retain authored input until host acknowledgement. Unknown outcomes MUST preserve the exact pending request and MUST NOT replay automatically.

### Acceptance details

- Public types express the boundary.
- Focused tests and production-component stories verify the behavior.

## AUI-CHAT-003 — Interactions

**Requirement.** Approvals and questions MUST use exact host-provided identities and advertised options. Cancellation and queued follow-ups MUST remain explicit host actions.

### Acceptance details

- Public types express the boundary.
- Focused tests and production-component stories verify the behavior.

## AUI-SCREEN-001 — Agent screens

**Requirement.** Shared screens MUST copy Desktop's sessions, history, catalog, imports and recorded preview layouts and styles through capability-aware host interfaces, with pixel-perfect parity at matching viewport, theme, fonts and data.

Complete and review the Agent section before continuing Repository or Combined
screens. Standalone settings, agent management, clients, models, compute and memory
pages are excluded. Inline chat controls remain part of the conversation.
Storybook MUST mount each complete source-derived screen with in-memory
controllers. Do not add invented application navigation or replacement layouts.

### Acceptance details

- Public types express the boundary.
- History MUST reveal the host’s current scope ancestry and retain it as the initial new-chat scope.
- Focused tests and production-component stories verify the behavior.

## AUI-LIFE-001 — Lifetime

**Requirement.** Hosts MUST retain controller ownership across mounts. Controllers MUST reject late reads after selection changes or disposal and release owned subscriptions without stopping host services implicitly.

### Acceptance details

- Public types express the boundary.
- Focused tests and production-component stories verify the behavior.

## AUI-FOUND-001 — Component foundations

**Requirement.** Agent foundations MUST have their own logical component folders with colocated stories, documentation and consumer-ready examples, and complete screens MUST compose those same production components.

### Acceptance details

- Transcript coverage MUST include every supported item/block kind, captured tools, error states and exact anchored comments.
- Stories MUST use production controllers with isolated in-memory host effects.
- Catalog-only stories and fixtures MUST be excluded from published package archives.
- Specification validation MUST reject new unowned components, missing family files or usage/anatomy/variation/API documentation, unrendered variations, private example imports, undocumented variables and defaults that differ from their source.

## AUI-THEME-001 — Styling and themes

**Requirement.** Every documented foundation MUST expose audited styling variables with source-faithful default values, and Storybook MUST offer the same independent brand and light/dark controls as Design Core.

### Acceptance details

- Component docs MUST list variable names, defaults, ownership and usage examples.
- Styling examples MUST override documented variables without CSS selector patches.
- Theme and mode changes MUST retain controller, draft and comment identity.
- Markdown documentation previews MUST bound shell examples to 40rem without preview-wrapper padding while Canvas screens retain the full viewport.

## AUI-VERIFY-001 — Foundation qualification

**Requirement.** Foundation changes MUST pass strict compile/runtime diagnostics, documentation and token audits, interaction/accessibility and keyboard/pointer checks, package acceptance and static catalog verification.

### Acceptance details

- Every component family MUST have complete highlighted consumer source and visual-pending metadata.
- Svelte warnings and runtime diagnostics MUST fail the owning checks through rendering and teardown.
- The full affected component and complete-screen matrix MUST run in both color modes and desktop/narrow viewports, including semantic Markdown tables and docs-only height limits.
- Visual baselines MUST remain unchanged until explicit human approval.

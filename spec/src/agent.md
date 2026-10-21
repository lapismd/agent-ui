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

# Agent

The publishable package consumes Design Core `^0.7.1` through its public npm
exports. Registry release qualification is recorded separately from source
review archives; this dependency intake does not change the public UI API.

Recorded screen metadata comes from host-provided capture groups, preserving
source/profile, timestamps, version identities and incomplete state. Public
recorded transcript and captured-session surfaces accept host transcript hooks
while enforcing read-only interaction.

Complete History, Catalog and Imports screens also accept structural presentation
ports when a host owns App-specific search, registry events or validated import
plans. The shared screen remains the only layout. These ports cannot import App,
start native services or bypass host validation. Import transcript options remain
read-only and never replace the host save plan or captured source payload.

## AUI-CHAT-001 — Conversation

**Requirement.** Conversation screens MUST compose Design Core Transcript and controlled composer state, retaining drafts, attachments, comments and request identities across presentation changes.

Expanded comment quotes MUST inherit their context surface through public Design
Core presentation. Plain Backspace on an already empty inline draft MUST remove
only that draft in either view, preserving other comments and captured text.

### Acceptance details

- Copied source markup and styles MUST preserve pixel-perfect presentation at matching viewport, theme, fonts and data.
- AppShell frame, header, body and footer boundaries MUST remain available for host composition.
- Normalized source fingerprints MUST record and verify explicit host bindings.
- Interaction, accessibility and pixel review MUST qualify the extracted presentation before downstream adoption.

## AUI-CHAT-002 — Submission

**Requirement.** Submission MUST retain authored input until host acknowledgement. Unknown outcomes MUST preserve the exact pending request and MUST NOT replay automatically.

ChatMessageComposer.status and AgentTranscriptOptions.composer.status MUST be the
shared error/warning presentation API. Controller action, permission/question,
unknown-submission and comment-send feedback MUST use the same attached composer
status in both views; fixed footer actions and send hints MUST NOT render another
banner. Error metadata MUST retain the shared status typography and red tone,
while unknown outcomes remain warnings and stale draft errors remain suppressed.
Externally controlled presentations MUST also receive controller-owned feedback
when their host status is empty; supplying host controls cannot hide a refusal.
A new exact error notice captured by the same send in the same session MUST
remain the sole feedback for that outcome. Historical, missing or different
notices MUST NOT suppress retained-draft feedback or unknown-outcome recovery.
Host-supplied statuses follow that same exact-capture rule. Controlled permission
and question callbacks MUST return their response promise so cards retain and
present host failures without unhandled rejections.

### Acceptance details

- Public types express the boundary.
- Focused tests and production-component stories verify the behavior.
- A refused send MUST retain its exact draft and show red MessageMetadata in an attached error footer below the framed composer in both Document and Classic views.
- Errors MUST NOT be attributed to another session or an edited draft, and unknown outcomes MUST retain recovery feedback without retry.

## AUI-CHAT-003 — Interactions

**Requirement.** Approvals and questions MUST use exact host-provided identities and advertised options. Cancellation and queued follow-ups MUST remain explicit host actions.

By default, active permission requests MUST replace the message input with an initially open,
expandable themed panel pinned outside transcript scrolling in both views.
Streaming and reading earlier messages MUST NOT move the panel out of view.
Its bounded content MUST retain exact options and attached error/unknown feedback.
New request identities MUST reopen it; completing the request MUST restore the
retained message draft without sending it. Answer requests retain their existing
presentation in this permission-only slice. Hosts with durable follow-up queues
MAY opt into `queueWhileAwaitingApproval`; both views MUST then retain the
editable draft and the exact permission controls, with one Send/Queue/Stop action.
Typing or toggling cannot submit a response or send the queued draft.
An active host without the send capability MUST retain Stop and the unsent draft
without offering Queue; text entry cannot imply a supported host capability.
Withdrawing send capability MUST preserve the active conversation and composer
presentation; catalog variations MUST identify the withheld action explicitly.
Footer capability checks MUST remain independent of draft ownership. A host's
composer draft MUST enable its supported send action without requiring a second
copy in the comments controller's message field.
The controller MUST snapshot reactive submissions before recipient resolution
and host dispatch, retaining exact comments and anchors as cloneable data.
The header MUST expose a far-right Close control that dismisses only the exact
local request presentation, without granting, denying or replaying a decision.
Dismissal MUST survive refreshes of the same request, preserve drafts and remain
session-scoped; unknown submitted operations MUST retain explicit status recovery.

A typed captured request result MUST select its read-only card renderer even
when the host's original block used Markdown, preserving source text, identity
and revision.

### Acceptance details

- Permission cards MUST show only advertised decisions, explicit host scopes and captured resources/commands, preserving exact option identities and acknowledged outcomes in initially collapsed inline transcript rows that expand to the same read-only card; granted icons MUST use semantic green, denied text/icons MUST use readable red, and collapsed history rows MUST use the compact tool-row gap.
- Question cards MUST support host-declared single/multiple choices, optional decorative letter/number labels, independent custom answers and freeform/secret input, retaining request-scoped drafts through refresh and presentation changes.
- Submissions MUST remain pending until acknowledgement, reject stale identities and duplicate sends, and preserve unknown requests without replay; secret answers MUST remain absent from history.
- Focused production-controller and component stories MUST cover both themes, narrow layouts, keyboard interaction and the complete-screen drawer/result compositions.

## AUI-CHAT-004 — Portable references and actions

**Requirement.** Complete chats MUST forward the host's composer, preview, reader and action configuration through the same public Design Core components used by standalone examples.

### Acceptance details

- Editor, Markdown preview and transcript references MUST preserve authored Markdown or registered host tokens, use shared InlineReference/ReferenceChip presentation and keep identity lookup, navigation and recipient dispatch host-owned.
- Agent mentions MUST be references by default; only an explicit host policy may derive recipients from the exact submitted text.
- Editable inline comments MUST place the formatting T last on the same row as hover actions, without reserving hidden action width, and open shared Markdown actions and the emoji picker below the input aligned with the text while retaining drafts and selection; default Comment MUST be icon-only; configurable reactions and overflow actions MUST remain clear of tool controls, while wholly unavailable hover controls MUST be absent.
- Paired editor/preview and complete-screen stories MUST demonstrate people/agents, repositories, GitHub/Forgejo link icons, emoji, spoilers, suggestions and retained source with stock Mira content styling, a line-number-free composer and targeted functional/accessibility evidence.

## AUI-SCREEN-001 — Agent screens

**Requirement.** Shared screens MUST copy Desktop's sessions, history, catalog, imports and recorded preview layouts and styles through capability-aware host interfaces, with pixel-perfect parity at matching viewport, theme, fonts and data.

Initial and paged content reads MUST use public shadcn Skeleton with accessible
loading labels, including catalog, import folders, saved comparisons/files and
per-repository Threads reads. Empty, unavailable and failed content reads MUST
use public shadcn Empty with a relevant icon and applicable retry. Import read
failure state MUST retain earlier content, reject stale/cancelled completions
and clear only after a successful explicit read. Busy actions, streaming and
missing scalar values retain their own feedback. The catalog-wide browser audit
and complete production-screen stories MUST exercise these shared states.

The Agent section remains awaiting visual approval. The approved shared
Projects/Agents/Threads plan authorizes the JJ Store configured-agent directory,
configuration, sessions and saved captures. Configured agents, running native
sessions and repository-owned captures MUST remain distinct identities. Global
browsing MUST NOT activate an execution checkout or dispatch a message. Hosts
advertise supported actions, persist drafts and exact requests before side effects,
and inspect unknown outcomes without replay. Session/capture identities include
their metadata home; continuation MUST preserve the snapshot and reject stale or
duplicate pages. Hosts MUST omit unavailable session timestamps and configured
agent associations rather than infer them from the client or current time.
Compute and memory management remain excluded.
Storybook MUST mount each complete source-derived screen with in-memory
controllers. Do not add invented application navigation or replacement layouts.

Completed chats MUST allow host snapshots to disable unavailable attachment,
approval-policy and runtime footer controls independently, without replacing
screen geometry or implying that native actions are supported. Omitted restrictions
preserve the All Messages defaults. Consumers MUST mount the public complete
chat screen and use the host port for durable sending and exact permissions.

### Acceptance details

- Public types express the boundary.
- History MUST reveal the host’s current scope ancestry and retain it as the initial new-chat scope.
- Catalog read failures MUST announce the exact host error through an alert while retaining earlier rows during refresh, with ordinary empty and loading states remaining non-alert.
- Focused tests and production-component stories verify the behavior.

## AUI-LIFE-001 — Lifetime

**Requirement.** Hosts MUST retain controller ownership across mounts. Controllers MUST reject late reads after selection changes or disposal and release owned subscriptions without stopping host services implicitly.

Configured-agent controllers MUST expose a non-disposing drain for native close.
Failed draft writes MUST block that drain until an explicit save succeeds; the
editable draft remains available and no configuration action is replayed.

### Acceptance details

- Public types express the boundary.
- Focused tests and production-component stories verify the behavior.

## AUI-THREAD-001 — Registered Threads inbox

**Requirement.** The complete Threads screen MUST adapt JJ Store's grouped
repository inbox, compact rows, search, contextual views and resizable list.
Rows and selections MUST use metadata-home plus thread identity, including when
names or entity IDs coincide. Global reads MUST NOT change the active checkout.
Hosts supply bounded, snapshot-bound pages and independent unavailable/retry
states. Late reads, repeated cursors and duplicate rows MUST be rejected without
discarding other homes. Repository fanout and loaded rows MUST be bounded.

The host supplies the complete AgentChatScreen conversation through a snippet;
the inbox MUST NOT reconstruct the transcript or composer. Create, reply,
contributors, settings and execution remain explicit host actions. An omitted
capability MUST NOT imply that the host supports it. Mounting MUST NOT mutate.
Narrow windows MUST retain access to the list and selected conversation, with
keyboard resizing, labelled controls and focus restoration on panel close.
Nested inboxes MUST choose their mobile stage from their available body width;
an explicit host selection or creation MUST reveal its conversation, including
when it bypasses the list's own selection callback.
Full reply/reaction/settings and native execution qualification remain separate
from the read-only directory acceptance.

### Acceptance details

- Production-controller tests MUST cover duplicate homes/threads, bounded pagination, partial failures, stale replies and retained snapshots after invalid pages.
- Complete-screen stories and cold browser checks MUST exercise grouped selection, retained conversation drafts, keyboard resizing, narrow navigation and focus.

## AUI-FOUND-001 — Component foundations

**Requirement.** Agent foundations MUST have their own logical component folders with colocated stories, documentation and consumer-ready examples, and complete screens MUST compose those same production components.

Tool result renderers MUST have their own documented Agents/Tool calls families,
including generic/normalized details, inventory, local reports and host registered
results. The transcript MUST compose these same production renderers. Tool result
and read-file overlays MUST reuse the shared icon-only Code/BookOpen content
view toggle, with accessible action labels and separate raw capture where needed.
Attachment chips, attach-file suggestions and saved-file headers MUST render the
public Design Core FileTypeIcon from their explicit path, preserving the original
12px, 16px and 16px slots and exact selection/removal identities.
Local catalog skills MUST resolve the same icon from their exact file path in
the original 16px slot; bundled skills without a path MUST retain the package
icon and explicit open-file actions MUST retain the host path.
At browser zoom, filename icons MUST match the unchanged neighboring catalog
icon slot instead of relying on device-dependent integer pixel rounding.

The 2026-10-22 user-authorized request-card adaptation follows supplied outlined
permission and question references while retaining existing AppShell/composer
boundaries. Resource rows, answer options and all text, textarea and secret fields MUST share the theme background surface, distinct from their containing card. Decorative choice labels MUST precede their radio buttons or checkboxes and use a solid theme fill through public Badge tokens. Agents/Requests families MUST document every variant and styling
variable. Desktop and JJ Store adoption follows explicit review of this slice.

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

Empty and unavailable stories MUST render the public shadcn Empty pattern with a
relevant icon in the owning production component.

Filename-bearing attachments, file-search results, saved-file headers and catalog
files MUST use public Design Core FileTypeIcon; shared file lists and captured
tool targets retain their Design Core-owned icons and status precedence.

### Acceptance details

- Every component family MUST have complete highlighted consumer source and visual-pending metadata.
- Svelte warnings and runtime diagnostics MUST fail the owning checks through rendering and teardown.
- The full affected component and complete-screen matrix MUST run in both color modes and desktop/narrow viewports, including semantic Markdown tables and docs-only height limits.
- Visual baselines MUST remain unchanged until explicit human approval.

## AUI-PARITY-001 — Desktop transcript completeness

**Requirement.** Agent transcript foundations and complete-screen examples MUST cover every visible Desktop transcript renderer and preserve its source presentation through public, host-owned contracts.

### Acceptance details

- The full recorded conversation MUST include Desktop system/warning/error rows, complete outgoing ACP XML context, tools, local reports, recipients, retries and the working state.
- Turn changes MUST include the original summary card, file listing, rail, file preview and explicit undo/checkpoint dialogs with in-memory effects.
- Context, handoff and rootless tool readers MUST share the surrounding transcript typography and support the original preview/source/capture states; Document composers with attached status MUST inherit the shared framed input body so feedback joins its edge; failed message metadata MUST match the attached status text size and line height, using red error text in both themes; attached composer status and retained-comment spacing MUST match the reviewed Document/Classic presentation.
- A source coverage inventory and focused browser regressions MUST distinguish shared primitive defects from missing extraction or fixture coverage.

# Integrating complete repository screens

Personal settings mount `RepositoryProfileSettings` with a host-owned
`RepositoryProfileController` and typed `ProfilePort` from
`@lapismd/repository-ui/settings`. Place `RepositoryProfileMenu` in the
AppShell sidebar footer; its callbacks open Profile or Settings. Keep one
controller across repository switches, since profile identity, draft, uploads
and receipts belong to the installation. Drain it before close. The host
normalizes raster uploads natively and retains stable asset references; the
browser receives display URLs only. Unknown saves require inspection and an
explicit retry of the original request. No sign-in/out controls are included.

Applications mount the completed production screen and implement its host ports.
Content reads use public shadcn Skeleton with the JJ Store surface geometry and
an accessible loading label. Empty, unavailable and failed content reads use
public shadcn Empty with a relevant icon, explanation and applicable retry.
Apply these states in the shared screen; host admission placeholders follow the
same rule. Retain loaded content while refreshing and append skeletons during
pagination. Busy actions, live streaming and missing scalar values retain their
own semantics. `RepositoryReadOnlyRow loading` covers pending settings values.
Complete-screen stories are the reference composition and geometry. They are
not mockups to reproduce with smaller components. A missing native adapter is
an integration task, not permission to create a different application screen.

| Application view | Public component from `@lapismd/repository-ui/jj` | Controller / port                                                                       |
| ---------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------- |
| JJ Log           | `RepositoryPanel`                                 | `HistoryController`, `HistoryReader`                                                    |
| Op Log           | `RepositoryOperations`                            | `OperationController`, `HistoryReader`                                                  |
| Overview         | `RepositoryBrowser`                               | `RepositoryBrowserController`, `RepositoryBrowserPort`; directory and landing documents |
| Files            | `RepositoryBrowser`                               | Same controller/port, with file tree and file selection                                 |
| Branches         | `RepositoryBranches`                              | `RepositoryBranchesController`, `RepositoryBranchesPort`, `HistoryReader`               |
| Stacks           | `RepositoryStackWorkspace`                        | `StackWorkspaceController` and `StackWorkspaceAdapter` from `/stacks`, branches page    |
| Workspace        | `RepositoryStackWorkspace`                        | Same controller/adapter, workspace page                                                 |

| Projects, Tasks, Reviews | `ProjectsScreen` | `ProjectsController`, `WorkPort`; source-composition acceptance remains open |

## Host boundary

The host owns the outer window and navigation, admitted repository selection,
native transport, typed adapter projections, credentials, persistence, toasts and
execution. Create controllers for the admitted repository and retain them across
navigation/settings; drain and dispose them when that repository closes.
Preserve exact operation/revision/workspace/path identities and reject late
responses. Mounting a screen never authorizes writes or fabricated success.

The library owns the screen's AppShell/Column Canvas, columns, headers, lists,
queries, selection flow, paging, diff modes, resizing and responsive geometry.
Use the documented public props, callback ports and action snippets. Request an
upstream generic extension when needed. Do not copy screen markup into the host,
override dependency internals, or replace a complete screen with a custom layout
around `RepositoryGraph`, `RepositoryChangedFiles` and `RepositoryDiff`.

Each screen's colocated MDX and example sources provide its public usage. The
older `/screens` scaffolding is deferred and must not be chosen in place of these
completed `/jj` exports. Primitive composition is appropriate only for a genuinely
different surface for which no completed screen exists.

## Appearance and acceptance

Use the shared JJ Store appearance/settings presentation with public Design Core
tokens. Host-owned theme preferences and storage keys remain device-local.
Read-only values use `RepositoryReadOnlyRow` from `/settings`, ported from
JJ Store's `StoreReadOnlyRow`. Supply exact `value`, optional `onOpen` and
`openDisabled`; the row owns icon, padding, truncation, full-value copy and
feedback. Use it inside `dl.store-settings__rows` rather than adding raw
definition rows or standalone path action buttons. The Settings page Basic
story includes the folder/open/copy and collaboration-storage composition.
Preserve source typography, opaque surfaces, spacing, selected/hover states and
native chrome geometry. Avoid a second host reset that restyles shared buttons,
Markdown, headings, cards or lists.

Consumer acceptance must prove the actual screen exports are mounted for every
route, with real admitted adapters in native acceptance and isolated adapters in
browser tests. Verify navigation/settings retention, stale-response isolation,
native startup and teardown, and the source-faithful layout. Screenshots and
successful compilation alone do not establish integration completeness.

Native host adapters can import `encodeJjChangeId` from
`@lapismd/repository-ui/history` without loading Svelte components. Pass native
hex IDs to this formatter before constructing display-only change models.

## Agent conversations

Mount `AgentChatScreen` from `@lapismd/agent-ui/chat` (or `AgentWorkbench`
from `/screens`) with a host-owned `AgentUiController` and `AgentPort` from
`/core`. The All Messages complete-screen example is the reference for the
transcript font, Document/Classic toggle, fixed composer footer and one Send
flow. Do not reconstruct it from Transcript, ChatMessageComposer or session
primitives. Import `@lapismd/agent-ui/styles.css`.

The host persists intent before dispatch, preserves exact unknown outcomes,
projects captured responses and permission identities, and resolves explicitly
selected recipients. No recipients can mean a saved human message when the host
supports it. Mention text alone must not grant execution. Only acknowledge sends
after durable acceptance. Native targets, context and credentials remain owned
by the host. `snapshot.chat.controls` can disable attachment, approval-policy and
runtime controls independently when the host has no adapter for those actions;
keep the ordinary footer and its typography instead of substituting host markup.

## Contextual navigation

Use `RepositoryPageFrame`, `RepositoryBreadcrumbs`, `RepositoryPicker` and
`navigationSections` from the public `/jj` entry point. The page frame composes
AppShell and ResponsiveTabs with typed host selection, header/search/action slots
and a canvas scrolling opt-out. Contexts distinguish repository, Stacks, Projects
and a selected project.

Repository routes place the single controlled command picker in the breadcrumb
root snippet. Global Projects/Agents/Threads keep that picker separate from
ancestry; changing it does not filter global content. Preserve page/subtab and
reset repository-specific pins after admitted selection. Native folder opening
is the picker's explicit `onOpenRepository` callback.

## Projects composition gate

Before declaring the Projects family or its consumer routes complete, compare
each new composition against the running JJ Store. The user explicitly made
source composition a completion gate. Preserve the Topbar breadcrumb outside
the rounded body, contextual tabs/search/filter row, compact surface actions,
Mine/Other directories, settings-card creation dialogs, fixed task header and
composer, threaded discussion, chronological activity and contextual rail.
Passing interaction tests or refreshing source fingerprints does not close
that gate. Record remaining differences; keep visual baselines unchanged.

Use ProjectsScreen with a host-owned ProjectsController/WorkPort. Local home
IDs, portable linked repositories and execution targets remain distinct. Hosts
provide bounded snapshots, persisted drafts, exact action outcomes and retained
unknown requests. Chat and agent surfaces compose through callbacks/snippets.
Use onOpenActivity for exact recorded repository/operation/revision navigation,
onCopyLink for canonical route links and copyText for identifier copying.
Do not implement source-missing controls in a replacement consumer screen.

The live comparison and unresolved gaps are recorded in
`spec/records/2026-10-23-project-composition.md`.

Review details remain owned by ProjectsScreen. Supply optional `WorkReview.context`
with the recorded comparison's repository, operation, files and commits; set its
loading/unavailable state explicitly. Supply `anchor` and `reviewRoot` for native
identity controls. Reuse `onOpenActivity` and `copyText` for navigation and copying.
Task and Review detail provide their own AppShell body header, fixed composer
and scrolling content; hosts supply breadcrumb ancestry outside that body.
Do not add a second detail header or replace the detail page with the active checkout.

Hosts providing outer ancestry use ProjectsScreen showHeader=false; repository
contexts providing tabs also set showNavigation=false. Preserve the shared body
and bind showRail for the outer details control.

## Configured agents and sessions

Mount `AgentsScreen` from `@lapismd/agent-ui/screens` with a host-owned
`AgentDirectoryController` and `AgentDirectoryPort`. The shared screen owns the
JJ Store gallery, attached profile, configuration dialog and sessions/captures
collections. Native executable discovery, installation-owned configuration and
credentials remain host-owned. Do not recreate the gallery in the consumer.

Keep configured agents, running native sessions and recorded captures distinct.
Scope session and capture IDs by metadata home. `onSessions` and `onBack` can bind
host routes; `onChat` requests an explicit conversation without sending. Use
`sessionContent` for complete capture/chat content through host composition.
The port persists exact requests before effects; `resolve` only inspects. Retain
unknown requests, drafts and late-response guards across navigation and Settings.
Call `controller.drain()` before native close; failed draft writes keep the editor
available for an explicit save retry. `close()` disposes subscriptions after the
host has drained its owned work. Global browsing must not activate a checkout or
start an agent.

JJ Desktop `23e0116d` adopts these exports with native persistence and registered
native-capture reads, using public `CapturedSessionBrowser` through the content
snippet. It leaves unsupported imported formats explicitly unavailable. Its
browser and cold native acceptance pass; the larger Threads/contextual-chat and
settings plan and broad source qualification remain open.

## Global Threads inbox

Mount `ThreadsScreen` with a host-owned `ThreadsController` and read-only
`ThreadsPort` from `@lapismd/agent-ui/screens`. Supply registered-home pages;
never turn a row's home ID or a repository link into native admission. Selection
and conversation controllers use `threadKey({home,id})`, preserving drafts even
when repositories have identical names and local entity IDs.

Render the existing public `AgentChatScreen` through `conversation`, including
its provided navigation snippet in `headerActions`. Retain those chat controllers
across navigation and Settings. Do not rebuild the inbox or composer in the host.
Creation, code navigation and attached details remain explicit callbacks/slots.
Omit unavailable capabilities. Native replies/reactions/settings and distinct
execution targets require their own host qualification; this inbox export does
not authorize automatic sending or automatic repository switching.

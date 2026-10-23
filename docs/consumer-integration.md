# Integrating complete repository screens

Applications mount the completed production screen and implement its host ports.
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

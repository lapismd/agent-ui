# @lapismd/repository-ui

Controller-driven Svelte screens. Hosts inject services; Storybook demonstrates
complete screens with isolated in-memory adapters.

Use these public exports from `@lapismd/repository-ui/jj` as application views:

| View               | Component                  | Host-owned controller                     |
| ------------------ | -------------------------- | ----------------------------------------- |
| JJ Log             | `RepositoryPanel`          | `HistoryController`                       |
| Op Log             | `RepositoryOperations`     | `OperationController`                     |
| Overview / Files   | `RepositoryBrowser`        | `RepositoryBrowserController`             |
| Branches           | `RepositoryBranches`       | `RepositoryBranchesController`            |
| Stacks / Workspace | `RepositoryStackWorkspace` | `StackWorkspaceController` from `/stacks` |

The complete-screen stories are production compositions. Mount these components
and supply adapters; do not recreate their layouts using lower-level graph,
file-list or diff components. Hosts retain native chrome, routing, admission,
execution, credentials, notifications, persistence and controller disposal.
Use public action snippets and props for integration. Missing generic screen
extension points belong in this package; native transport belongs in the host.

The older `/screens` scaffolding is not a replacement for the completed `/jj`
views. Overview uses the directory/landing-document presentation of
`RepositoryBrowser`; Files uses the same screen with its file tree and selection.

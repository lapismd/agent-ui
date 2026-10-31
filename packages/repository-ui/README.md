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

## Shared settings and appearance

Import `RepositoryAppearance`, `RepositorySettingsPage`,
`RepositorySettingsCard` and `ownAppearance` from
`@lapismd/repository-ui/settings`, plus
`@lapismd/repository-ui/settings/styles.css`. Call `ownAppearance` once in the
host shell with the host storage key. The public framework supplies JJ Store's
palettes, theme/mode selection, density and typography; hosts supply persistence,
settings navigation and repository-specific content. Native glass is disabled.

## Required dependency setup

Configure the shared temporary Bits UI 2.20.2 lifecycle/focus repair in each
application's pnpm installation root. Copy `patches/bits-ui@2.20.2.patch` from
[the released Core package](https://github.com/lapismd/design-core/releases/tag/design-core%400.7.4) into the application's `patches/`
directory and verify SHA-256
`debd3bc7d43917f0967f0cc1e212fc5c7721c751d3b92bf8f31030d1c96289ad`.

```json
{
  "pnpm": {
    "overrides": {
      "bits-ui": "2.20.2"
    },
    "patchedDependencies": {
      "bits-ui@2.20.2": "patches/bits-ui@2.20.2.patch"
    }
  }
}
```

Regenerate and commit that root's lockfile, then use frozen installs. The
published dependency's pnpm settings do not configure the application root.
Core's packaged `patches/manifest.json` and `patches/README.md` retain the exact
registry/file identities, all three owner fixes and removal requirements. Remove
the patch only after the resolved released dependency contains all three repairs
and the source, package and consumer acceptance passes without it.

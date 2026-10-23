# Agent and repository UI

Read this guide and the owning canonical chapter in `spec/src` before changing
implementation. Apply the parent workspace guidance. This repository owns
`@lapismd/agent-ui` and `@lapismd/repository-ui`.

## Review boundary

Deliver one user-authorized section at a time with complete Storybook screens
using production UI controllers and isolated in-memory adapters. The current
section is Stacks and Workspace presentation, authorized after Branches. Files
provides the repository overview. Copy JJ Store's stack lanes/bookmark cards,
unstaged and source files, target history and adjacent diff canvas; reuse the
existing portable stack controller and shared graph/files/diff primitives.
Preserve workspace/operation/source identities, topology, paging, independent
selections, host actions and controller lifetime. Stop for review before
transfers, mutation dialogs, forge integration and downstream adoption.
Stop for explicit user review after this slice and before modifying
Lapis Desktop, jj-store, downstream services, publishing or deploying anything.
The approved plan authorizes generic fixes in Design Core; source applications
remain read-only references during this phase.

## Consumer integration

Applications MUST mount the completed production screens from the public package.
The complete-screen stories demonstrate the intended application views, not
layouts for a host to recreate from graph, file-list or diff primitives. Use
`RepositoryPanel` for JJ Log, `RepositoryOperations` for Op Log,
`RepositoryBranches` for Branches, `RepositoryBrowser` for Overview and Files,
and `RepositoryStackWorkspace` for Stacks and Workspace. See
`docs/consumer-integration.md` for the export/controller map and host boundary.

Hosts own native window chrome, navigation, repository admission, adapters,
credentials, execution, persistence and controller lifetime. The shared screen
owns its layout and interaction flow. Preserve its AppShell/Column Canvas,
headers, columns, selections, paging, actions and responsive behavior. Extend
public props/snippets; add missing generic extension points in this repository.
Do not substitute a custom screen because an adapter capability is missing.
Expose that capability gap explicitly and implement the owning host adapter.
Use primitives directly only for a distinct surface with no completed screen.

JJ Desktop is the explicitly authorized first consumer. Its current integration
includes complete repository screens and shared JJ Store appearance/settings
presentation. This authorization does not publish packages or change JJ Store.

## Package architecture

Reuse public Design Core AppShell, Column Canvas, chat, forms and diff primitives.
Packages cannot import each other, application-private types, native transports,
App, catalog fixtures or test code. Hosts supply services through typed ports.
Controller lifetime belongs to the host; mounting cannot issue mutations.
Keep execution, credentials, persistence and repository authority in host adapters.
Catalog adapters simulate effects only and never enter production exports.

## Components and source fidelity

- Copy and adapt the existing Desktop component, markup, CSS, assets and controller
  flow first; do not recreate a similar UI. Record source revisions, licenses,
  hashes and explicit adaptations in the source ledger, and compare original
  layouts before refreshing fingerprints.
- Preserve AppShell and Column Canvas boundaries, headers, bodies, footers,
  responsive behavior and default geometry. Use the same production building
  blocks in standalone examples and complete screens so fixes reach both.
- Put each component in its own kebab-case feature folder. Keep independent
  catalog surfaces in separate families; assign private compound parts to one
  documented owner. Avoid catch-all component folders and compatibility copies.
- Organize Agent stories under `Agents` and repository stories under `JJ`, with
  logical Foundations/History/Operations sections before Complete screens.
- Each family requires colocated `Component.stories.ts`, `Component.mdx`,
  `Component.example-sources.ts` and `Component.tokens.json`, naming the actual
  production component in story metadata.
- Docs follow Design Core Chat: Usage, Anatomy, Variations, Behavior and
  accessibility, Styling variables, API and Composition. Render every variation,
  complete highlighted public-import usage and styling examples, and the audited
  variable table with names, exact defaults, purpose, owner and source.
- Keep Mira editor and preview content styles stock, apart from removing the
  centered note column and the host-requested compact shell inset; configure
  optional features through public props and
  keep custom reference/suggestion styling in its owning component.
- Expose native CSS variables with source-faithful defaults; inherit semantic
  Design Core tokens. Fix primitive defects in their owner, without consumer
  selector patches or dependency-internal imports.
- Spec validation must reject missing ownership, folders, documentation,
  variations, public examples or styling contracts and drifted token defaults.
  Keep the static catalog and clean packed-example acceptance in sync.

## Storybook and controllers

- Demonstrate meaningful populated, empty, loading, unavailable/error, disabled,
  retry and selection states where supported. Use production controllers with
  disposable in-memory ports; no native service, credentials or live repository.
- Keep immutable operation/revision/path/comparison identities and host-owned
  controller lifetimes. Reject stale responses, drain owned work and retain
  drafts and exact unknown requests without replaying mutations.
- Host adapters own routing, persistence, admission, execution and notifications;
  UI callbacks request explicit actions. Mounting may read through an injected
  port but must never issue a mutation.
- Empty and unavailable states use public shadcn Empty with a relevant icon,
  distinct title/description and applicable retry action. Apply it in production
  building blocks so complete screens share the same presentation.
- Show small standalone controls on padded, bounded preview surfaces; use the
  real shell/column context only where it is part of the component contract.
- Keep independent brand and light/dark controls and semantic GFM tables. Bound
  shell previews to 40rem and remove wrapper padding only in Markdown docs;
  Canvas complete screens retain the full viewport.
- Use `pnpm storybook:restart` for this checkout (port 7490), particularly after
  dependency/archive, export, manager or startup changes; preserve other servers.

## Workflow

Update the owning AUI/RUI requirement and verification before or with protected
changes. Record actual commands/counts/gaps under `spec/records` and update
`PLAN.md`. Start with the exact regression; then run targeted type, unit,
Storybook interaction/accessibility, browser and spec checks for the section.
Commit focused verified sections with broad qualification explicitly pending.
Pause for screen review after each section. Run broad suites and the complete
package/static matrix only after the final screen review, as the user requested.
Keep stories visual-pending; do not update screenshot baselines.
Use native CSS and public tokens. Files have one feature responsibility; new
production/scripts stay within 300 counted lines, stories 400, tests 500.
Canonical Markdown stays within 400 lines and 32768 bytes.
Use Jujutsu and commit every verified slice. Preserve unrelated changes.

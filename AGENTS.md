# Agent and repository UI

Read this guide and the owning canonical chapter in `spec/src` before changing
implementation. Apply the parent workspace guidance. This repository owns
`@lapismd/agent-ui` and `@lapismd/repository-ui`.

## Review boundary

Deliver one user-authorized section at a time with complete Storybook screens
using production UI controllers and isolated in-memory adapters. The current
section is Desktop-derived JJ history; Agent visual review remains pending.
Stop for explicit user review after this slice and before modifying
Lapis Desktop, jj-store, downstream services, publishing or deploying anything.
Source repositories are read-only references during this phase.

## Architecture

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
- Keep independent brand and light/dark controls and semantic GFM tables. Bound
  shell previews to 40rem and remove wrapper padding only in Markdown docs;
  Canvas complete screens retain the full viewport.
- Use `pnpm storybook:restart` for this checkout (port 7490), particularly after
  dependency/archive, export, manager or startup changes; preserve other servers.

## Workflow

Update the owning AUI/RUI requirement and verification before or with protected
changes. Record actual commands/counts/gaps under `spec/records` and update
`PLAN.md`. Start with the exact regression; then run affected suites and full
check, test, package build, Storybook interaction/accessibility and spec checks.
Keep stories visual-pending; do not update screenshot baselines.
Use native CSS and public tokens. Files have one feature responsibility; new
production/scripts stay within 300 counted lines, stories 400, tests 500.
Canonical Markdown stays within 400 lines and 32768 bytes.
Use Jujutsu and commit every verified slice. Preserve unrelated changes.

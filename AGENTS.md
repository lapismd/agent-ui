# Agent and repository UI

Read this guide and the owning canonical chapter in `spec/src` before changing
implementation. Apply the parent workspace guidance. This repository owns
`@lapismd/agent-ui` and `@lapismd/repository-ui`.

## Review boundary

Phase 1 delivers complete Storybook screens using production UI controllers and
isolated in-memory adapters. Stop for explicit user review before modifying
Lapis Desktop, jj-store, downstream services, publishing or deploying anything.
Source repositories are read-only references during this phase.

## Architecture

Reuse public Design Core AppShell, Column Canvas, chat, forms and diff primitives.
Packages cannot import each other, application-private types, native transports,
App, catalog fixtures or test code. Hosts supply services through typed ports.
Controller lifetime belongs to the host; mounting cannot issue mutations.
Keep execution, credentials, persistence and repository authority in host adapters.
Catalog adapters simulate effects only and never enter production exports.

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

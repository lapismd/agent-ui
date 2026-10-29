# Refresh registry pins for jj-history and Design Core 0.7.0

Date: 2026-10-29  
Revision: enclosing Jujutsu changes on `fix/jj-history-lockfile`

## Scope

GitHub Actions `check.yml` failed after `lapismd/agent-ui` main landed at
`0e549ebc`:

1. `pnpm install --frozen-lockfile` — root and `packages/repository-ui` declare
   `@lapismd/jj-history@^0.1.0`, but the lockfile omitted that specifier while
   the package was unpublished.
2. `pnpm check` / `spec:validate` — `AUI-DOCS-TOKEN-DEFAULT` against Design Core
   `0.6.0` source. Chat token contracts reference files and `var(--…, default)`
   fallbacks that exist in published Design Core `0.7.0`.

## Validation

```shell
npm view @lapismd/jj-history version
# 0.1.0

pnpm install
pnpm install --frozen-lockfile
AGENT_UI_VALIDATION_RUNTIME=native pnpm check
```

Frozen install resolves `@lapismd/jj-history@0.1.0` and
`@lapismd/design-core@0.7.0`. `pnpm check` passes (spec validate, architecture,
source layout, svelte-check, format).

## Follow-up — browser coverage on Design Core 0.7.0

Hosted `pnpm test:browser` failed on:

1. Branches content-fit — `aria-valuenow` stayed at `380` after double-click.
   Content-fit only measures nodes with client rects; the overflowing
   `review/long-branch-name` row can sit below the fold. The browser test now
   waits for fonts, scrolls that row into view, asserts label overflow, then
   fits with a longer poll. Catalog browser retries once under `CI`.
2. Saved-file icon — `FilePreview` story play closed the panel before the
   iframe browser assertion ran. Play now leaves the panel open; close coverage
   moved to `FilePreviewClose`. Local exact cases and Turn-changes Storybook
   interactions (11) pass.

## Contract

Unchanged production UI contracts. Registry intake of published
`@lapismd/jj-history@0.1.0` and Design Core minimum bump `^0.6.0` → `^0.7.0`
for token-source parity. Browser coverage only makes the overflowing fixture
visible before content-fit.

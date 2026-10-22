# Branches Column Canvas fit toggle

Requirements: RUI-BRANCH-001, AUI-GOV-001 and AUI-GOV-003.

The shared resize rail now expands a default-sized column to its mounted
contents, within a finite cap and column limits. Double-clicking at any other
width resets to default. Enter has identical behavior. Design Core owns this
behavior; Agent UI adds no production workaround. Branches retains its
380px default, 300px minimum and 640px maximum.

## Focused evidence

- Before refreshing the public review package,
  `pnpm exec playwright test --config .local/live-chat.config.ts tests/repository-branches.pw.ts -g 'resize rail toggles'`
  failed 1/1: double-click retained the old 380px reset-only behavior.
- After refreshing the archive and restarting Storybook on 7490, that exact
  target passed 1/1 (18.6s cold compilation), including double-click expand/reset,
  reset after arrow-key resizing, Enter expand/reset, the 640px cap and retained
  reference/path selection. No browser runtime or console errors were recorded.
- Manual check of the existing in-app Basic tab: rail width 380 → 386 → 380,
  with the public toggle help text visible and selection retained. Screenshot:
  `.local/column-fit-toggle-review.png`.
- `pnpm exec playwright test --config .local/live-chat.config.ts tests/repository-branches.pw.ts`:
  7/7 passed (23.4s), covering existing selections, filters/actions, paging/diffs,
  responsive minimum/maximum sizing, docs, retry and the new toggle.
- `pnpm exec vitest run --project storybook packages/repository-ui/src/jj/branches/branch-command/RepositoryBranchCommand.stories.ts packages/repository-ui/src/jj/screens/branches/RepositoryBranches.stories.ts`:
  17/17 interaction/accessibility tests passed.
- `pnpm spec:first` and `pnpm spec:check`: passed, along with changed-file formatting.
- Source evidence and exact before/after counts live in Design Core's
  `spec/records/column-canvas-fit-toggle.md`.

The prepared source-inclusive Design Core archive contains source change
`1981b801` (including warning-tag fix `36c8412e`), SHA-256
`f4b58f28cdeaf50cdf12d4fc73e46d952afd3143b2b7df6ac3d8007b63621c12`.
`pnpm install --lockfile=false --ignore-scripts --config.pnpmfile=.local/review-dependencies.cjs`
installed that archive, followed by `pnpm storybook:restart`. The restart retained
Lapis Desktop's separate auxiliary listener.

The temporary ignored package hook preserves existing Mira and JJ History
review archives. Tracked manifests and lockfiles retain normal registry ranges.
Broad qualification, static package/catalog matrices, visual baselines,
publication and downstream application adoption remain deferred until the final
screen review. The Branches stories remain visual-pending.

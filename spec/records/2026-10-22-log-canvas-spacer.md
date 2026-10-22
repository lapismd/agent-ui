# Log canvas resize space

RUI-HISTORY-001 / RUI-DESKTOP-001 / AUI-GOV-003.

Both logs configure the existing public controller with
`trailingSpacerWidth: 240` and use `displayMode="fixed"`, matching JJ Store's
workspace canvas configuration. Every column retains its original preferred
width and bounds and resizes independently. Small panes retain horizontal
scrolling. The shared private `RepositoryCanvasSpacer` part belongs to the Shell
family and fills the public trailing slot with shadcn Empty, a MoveHorizontal
icon and a resize hint. It introduces no branch command or drop target.

Source references are JJ Store's `StoreStackWorkspaceCanvas.svelte` and
`StoreStackWorkspaceSpacer.svelte` at `f58b9363` (Apache-2.0). The copied Empty
composition, changed icon/text and omitted workspace authority are recorded in
both source/provenance ledgers. JJ Store and Design Core remain unchanged.

## Focused evidence

- Exact baseline: `pnpm exec playwright test --config .local/live-chat.config.ts tests/jj-diff-collection.pw.ts -g 'trailing space'`: 2 failed, no trailing spacer.
- Adding only the spacer left the adaptive canvas's final resize handle hidden; a warm rerun reproduced the missing handle in Op Log, while initial live compilation also interrupted navigation. Configuring the source workspace's fixed mode repairs the actual resize boundary.
- Exact post-fix target: the same command passed 2 cases, including the real pointer drag, keyboard width change and continued access at 600px in each log. The initial test's inferred compact-mode assumption was replaced with the intended fixed scrolling behavior copied from JJ Store; width and handle checks were retained.
- `pnpm exec svelte-check --tsconfig tsconfig.json --fail-on-warnings`: 0 errors and 0 warnings after introducing the private part and controller setting.
- `pnpm spec:check`: all 3 lanes passed after registering the new private part under its documented Shell owner. The initial ownership failure was not allowlisted or suppressed.
- `node scripts/source-layout.mjs --source-root ..`: 197 fingerprints and 142 original layouts matched, including the documented private spacer adaptation. The controller's changed fingerprint is recorded explicitly.

Storybook was restarted on 7490 and its client readiness probe completed.
Only targeted log checks run in this slice. Broad suites, package/static matrix,
baseline updates and downstream migration remain deferred for human review.

## Final targeted results

- The affected diff-collection browser command passed all 10 cases: paging, menus, host totals, selection-frame paint/hover in both themes, and both new final-column resize cases.
- The new cases were then moved unchanged into `tests/jj-log-canvas.pw.ts` and registered in the existing browser configuration to keep each test file within the enforced line budget. `pnpm exec playwright test --config .local/live-chat.config.ts tests/jj-log-canvas.pw.ts`: 2 passed. The initial budget failure was repaired by splitting responsibilities, without changing the checker.
- `pnpm exec vitest run --project storybook packages/repository-ui/src/jj/screens/panel/RepositoryPanel.stories.ts packages/repository-ui/src/jj/screens/operations/RepositoryOperations.stories.ts -t 'All In One|^Empty$'`: 4 interaction/accessibility cases passed; 30 unrelated cases unselected.
- `pnpm check:architecture`: file budgets and production ownership passed.

The actual in-app AllInOne story was refreshed and scrolled to the end. The
ignored `.local/review/log-canvas-spacer.png` shows the final Diff column and
icon-bearing resize hint with the new trailing space. Stories remain
visual-pending for user review.

# All Changes flush surface and opaque sticky headers

RUI-HISTORY-001 / AUI-GOV-003.

The shared Diff Viewer now defaults its optional inline-end inset to zero. The
public variable remains available to hosts. Both logs show continuous sections
flush with the column. In Op Log, the all-file card omits side borders and corner
rounding; `overflow: clip` retains clipping without creating an intermediate
scroll container that prevents file headers sticking to the real viewport.
The removed side border also leaves the section's outermost selected edge clear
of the scrollbar thumb, retaining normal scrolling without a compensating inset.
Single-file card presentation is unchanged. The source ledger records and checks
the exact CSS adaptation against Desktop.

Design Core commit `9362a4ba` layers normal, selected and hover/focus header tints
over its opaque public diff surface. Existing semantic tokens and tint values
remain intact. The fix uses the same composition as its opaque split gutters.

## Reproduction and focused evidence

- Exact consumer target: `pnpm exec playwright test --config .local/live-chat.config.ts tests/jj-diff-surface.pw.ts`.
- Initial test setup produced four failures because short folded content did not overflow, and Op Log's metadata offset was not accounted for. The probe now reveals unchanged context, waits for real overflow and scrolls past the actual section origin. These were probe corrections, not passing product evidence.
- With that setup, JJ Log failed both theme paint probes: changing a backdrop behind the selected sticky header changed its sampled pixel. After correcting the Op Log clip/scroll boundary, the exact `-g 'op-log'` target failed both themes on the same paint assertion. The original inset was independently measured as `0px 8px 0px 0px`.
- Removing the inset initially reproduced two Op Log selected-edge failures. Removing the redundant all-file side borders restored both existing pixel assertions; the remaining two interim hover failures were expected while the consumer still had the prior source archive. Hover assertions now compare the visible gradient tint instead of the solid backing colour.
- Design Core exact composition family: 1 failure and 2 passes before repair; both File Diff source families: 16 interaction/accessibility passes after repair. Its source specification check passed all 3 lanes. A name-filtered source attempt selected no tests and is not counted as passing evidence.
- `pnpm exec svelte-check --tsconfig tsconfig.json --fail-on-warnings`: 0 errors, 0 warnings.
- `node scripts/source-layout.mjs --source-root ..`: 197 fingerprints and 142 original layouts matched.
- `pnpm check:architecture`: ownership and file budgets passed.

The ignored review hook consumes a prepared source-retaining archive from the
clean committed Design Core snapshot, excluding unrelated AppShell work:
`design-core/.local/packages/lapismd-design-core-0.6.0-opaque-diff-review-source-built.tgz`.
SHA256: `df4f6fbf2dfb3172421e970b94b083c63428f90c28e1173b7298aa47c7a03fa2`.
Preparation audited 265 CSS files with zero remaining utility references.
Manifests and lockfile retain registry ranges; this is local review evidence,
not publication or a completed registry dependency upgrade.

Final cold-consumer results are recorded below. Full suites and package/static
matrix remain deferred until final human screen review. No visual baseline or
downstream application/service changed.

## Final cold-consumer results

- Storybook was restarted with `pnpm storybook:restart`; its fail-closed `__lapis_catalog_ready` probe returned `Catalog client ready`.
- `pnpm exec vitest run --project storybook packages/repository-ui/src/jj/history/diff-viewer/RepositoryDiffViewer.stories.ts packages/repository-ui/src/jj/screens/panel/RepositoryPanel.stories.ts packages/repository-ui/src/jj/screens/operations/RepositoryOperations.stories.ts -t 'All In One|Paged Files|File Actions|^Basic$|^Split$|^Paged$'`: 11 interaction/accessibility cases passed; 30 unselected.
- `pnpm exec playwright test --config .local/live-chat.config.ts tests/jj-diff-surface.pw.ts tests/jj-diff-collection.pw.ts tests/jj-log-canvas.pw.ts`: 11 passed, 3 initial cold navigation/readiness failures (both paged screens and Op Log totals). All four new flush/sticky paint cases, all four unchanged selection-edge/hover cases and both resize cases passed.
- Exact unchanged follow-up: `pnpm exec playwright test --config .local/live-chat.config.ts tests/jj-diff-collection.pw.ts -g 'paged sections|op-log: all changes totals'`: 3 passed. All 14 affected browser cases are verified; no functional failure remains unexplained. Assertions and timeouts were not relaxed.
- `pnpm spec:check`: all 3 lanes passed with the refreshed dependency archive.
- `pnpm check:architecture`, source-layout comparison and changed-file Prettier check passed.

The actual open JJ AllInOne page was refreshed, unchanged context expanded and
the diff scrolled. The header remains at y=62 while the selected section starts
at y=-535; the viewer has zero padding and the header has an opaque RGB backing.
Screenshot: `.local/review/all-changes-opaque-header.png`. Stop for review.

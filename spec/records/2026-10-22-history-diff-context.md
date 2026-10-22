# History diff context folding

RUI-HISTORY-001 / AUI-GOV-003: the long file diff was present in the dense fixture,
but JJ Log's default split view rendered all unchanged rows. Design Core's
FileDiff used the collapsed display model only for unified view. The earlier
Op Log regression covered unified view and was insufficient evidence for split.

The owning Design Core source now retains collapsed blocks while pairing visible
split rows. Its existing controls share expansion state across both panes. No
consumer production or styling workaround is introduced. RepositoryDiff docs
describe the source-owned behavior; the browser regression covers both layouts
in both complete screens and verifies reveal, synchronized panes and hide.

## Qualification

- Before source repair, `pnpm exec playwright test --config .local/live-chat.config.ts tests/jj-operation-presentation.pw.ts -g 'retained context'`
  passed both unified cases and failed both split cases because reveal controls
  were absent.
- Source qualification is recorded in Design Core's
  `spec/records/2026-10-22-split-diff-context.md`: thirteen FileDiff story cases,
  fourteen focused model cases, strict types and a prepared review archive.
- The ignored local overlay uses
  `design-core/.local/packages/lapismd-design-core-0.6.0-split-context-review-built.tgz`,
  SHA-256 `8c0e605a564a1f4417512cb3e88cd8fe193130fb5e4729cd3f334e72933f9927`.
  Source installation uses `--lockfile=false --ignore-scripts`; portable package
  manifests and lockfile retain registry ranges. A released dependency version
  remains required before publication or downstream adoption.
- Source fix committed in Design Core as `e999ed91`; no consumer component
  implementation was changed.
- After `pnpm storybook:restart` and a successful catalog-ready read, the exact
  browser command above passed all four cases on the fresh process and archive.
  Unified/split reveal and hide both work in JJ Log and Op Log; each split pane
  displays the revealed middle context.
- `pnpm spec:validate`: nine validators, five chapters, twenty-two requirements
  passed. The first spec-first run required the mapped governance chapter for
  changed documentation; after recording the multi-layout evidence requirement,
  `pnpm spec:first` passed. Scoped Prettier passed.
- In-app browser inspection opened Dense History's `src/history/controller.ts`
  with both split panes folded and the Show all 63 lines control visible.
  Local review capture: `.local/review/folded-long-diff.png`.

Full suites, other sections, static/packed matrices and visual baselines remain
deferred pending the user's final screen review. No downstream service changed.

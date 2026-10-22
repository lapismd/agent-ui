# Branch chips and row paint

Requirements: RUI-BRANCH-001 and AUI-GOV-003. The user requests visible chips on
hover and a check for colour leaking into the white Branches rows.

## Before

The live Basic page shows secondary chips with `rgb(246, 246, 246)` fill and a
transparent border against hover paint `color(srgb 0.939333 0.939333 0.939333)`.
Normal bookmark and working-copy rows and the command root paint fully opaque
`rgb(255, 255, 255)`. Their ancestor chain has opacity 1, no filters, and normal
blending. The Column Canvas frame paints `rgb(250, 250, 250)` and outer shell
`rgb(246, 246, 246)`; these do not bleed through the opaque row backgrounds.
The existing selected and hover colours must remain unchanged.

The exact focused browser target is the existing `working copies share` case in
`tests/repository-branches.pw.ts`. Additional checks cover chip fill/outline on
selected and ordinary hovered bookmarks and a selected working copy, and the
white normal surface before/after hovering.

## Change and verification

Chips use public Badge `outline` variants and native root style props, with two
audited feature variables for their opaque theme body fill and semantic outline.
This applies to default/workspace/applied/deleted/conflicted bookmarks and working
copies. Row background, hover and selected colours are unchanged.

- Before, the exact browser target failed 1/1 because the selected hovered chip
  still painted `rgb(246, 246, 246)` with a transparent border. After the change,
  `pnpm exec playwright test --config .local/live-chat.config.ts tests/repository-branches.pw.ts -g 'working copies share'`
  passes 1/1, covering normal white paint before/after hover, selected and ordinary
  hovered bookmark chips, a selected hovered working-copy chip, and the existing
  marker/responsive-sizing checks. Runtime/console failures: zero.
- Both Branch Command and complete Branches story files pass 17/17 interactions
  and accessibility checks in light mode and 17/17 with `CATALOG_THEME=dark`.
- `node scripts/source-layout.mjs`: 226 destination fingerprints pass. The
  Branches-only source comparison passes eight fingerprints/four original layouts
  with documented Badge adaptations.
- `pnpm exec svelte-check --tsconfig tsconfig.json --fail-on-warnings`: zero
  errors/warnings. Repository UI build/publint and `pnpm spec:check` pass.
- Final live-page paint: normal rows and chips are `rgb(255, 255, 255)`; chip
  outlines are `color(srgb 0.783333 0.783333 0.783333)`. The existing selected
  background remains `color(srgb 0.896 0.896 0.896)`. The page was refreshed after
  the docs-build reload and the complete story is visible again. Review image:
  `.local/branch-chip-contrast-review.jpg`.

Screen review remains visual-pending. Full suites, static catalog/package
qualification and visual baselines remain deferred until final review.

# Shared filename icon adoption — 2026-10-22

The user authorized the Design Core filename icon and adoption across Agent/JJ
presentation, then requested the remaining source filename surfaces and wider
checks before committing. Work is isolated in the `file-type-icons` JJ workspace
(change `znqymzxr`, parent `75b525e1`) to preserve concurrent default-checkout
chat/reference work. Desktop, jj-store, downstream services and publication stay
outside this slice.

## Public source and adaptation

Design Core owns the artwork, resolver, curated asset generation and styling.
The review archive is
`lapismd-design-core-0.6.0-file-icons-review.tgz`, SHA-256
`5e55494444d7d580c198fb91a80c66225c858135a4786e8fe0e54a1a66891dd3`,
from Design Core change `mtrtuvpr` at parent `749de753`. It was prepared with
`packLocal({retainSource:true})`; the package compiler prepares public Svelte,
CSS, rune modules and types. No internal dependency import or node_modules edit
is used.

Production adoption uses the exact host filename/path in five private compound
parts: attachment chips (`xs`, 12px), attach-file suggestions (`md`, 16px), saved
file headers (`md`, 16px), local catalog skills (`md`, 16px) and JJ filename titles
(`s`, 14px). Complete screens
compose these same components. File listings, diff headers and normalized tool
read/edit/search results inherit Design Core's shared implementation. Folder,
action and status affordances and all host identities remain intact.

The source ledger records only these five reviewed glyph substitutions. Its
comparison passed: 193 destination fingerprints and 140 original layouts with
explicit adaptations. The icon artwork is intentionally new and remains
visual-pending; baseline images are unchanged.

## Focused qualification

Exact target:

```sh
pnpm exec vitest run --project storybook \
  packages/agent-ui/src/chat/composer-drawer/ChatComposerDrawer.stories.ts \
  packages/agent-ui/src/chat/transcript-footer/AiTranscriptFooter.stories.ts \
  packages/agent-ui/src/chat/turn-changes/AiTurnChanges.stories.ts \
  packages/repository-ui/src/jj/history/file-history/RepositoryFileHistory.stories.ts
```

Before implementation: 4 failures and 18 passes. After first adoption, a cold
optimizer reload produced 11 failures and one runtime error; explicitly
prebundling the public FileTypeIcon subpath removed the reload and runtime error.
The remaining suggestion assertion needed to wait for the real popover opening
and closing transitions; its visibility and close assertions are retained.
The final exact target passed all 22 scenarios. The first wider run passed all
92 unit tests and all 656 story/axe checks (164 in each theme/viewport) but failed
four of 21 browser scenarios during startup. The first cold reproduction passed
three and retained the docs-preview failure; scrolling the lazy Canvas into view
repaired that bound-preview check without changing the height/padding assertions.
A configuration regression then proved that the prebundle list was missing from
Storybook dev's viteFinal hook (one failure/one pass). Wiring the same list through
that hook passed both unit cases and all four exact cold-browser scenarios.
The final full qualification is recorded below.

## Final wider qualification

`AGENT_UI_REVIEW_PNPMFILE=.local/review-dependencies.cjs pnpm checks` passed in
full after the repairs:

- Specification: nine validators, five canonical chapters and 21 requirements;
  architecture/file budgets, 193 source fingerprints, strict Svelte types with
  zero errors/warnings, and repo-wide formatting passed.
- Unit: 93 passed, zero failed.
- Storybook interaction/accessibility: 164 passed in each light/dark and
  desktop/narrow combination (656 total), zero failed.
- Fresh-process browser suite: 21 passed, zero failed, including semantic tables,
  bounded/flush docs previews, mode/theme retention, all JJ documentation,
  Empty/unavailable patterns and transcript/turn-change behavior.
- Both packages built and passed publint. Static Storybook verified 38 foundation
  families, 145 foundation variations and five specification chapters.
- Clean packed-package acceptance passed strict types and a production Vite
  build, compiling all 77 documented public-import examples. No catalog material
  entered the package archives.
- Final `pnpm spec:check` passed validation, book generation and spec-first.

## Reproducible dependency boundary

The ignored `.local/review-dependencies.cjs` hook substitutes packed public
Design Core and JJ history dependencies. Installation uses:

```sh
pnpm --config.pnpmfile=.local/review-dependencies.cjs install --lockfile=false
AGENT_UI_REVIEW_PNPMFILE=.local/review-dependencies.cjs pnpm checks
```

Tracked manifests retain npm ranges; the hook and archives are not committed.
Before publication, release the icon-capable Design Core package, raise the
consumer dependency minimum to that release and refresh the portable registry
lockfile. The existing unpublished JJ history release prerequisite also remains.
A passed packed-overlay review does not establish ordinary registry installation.

## Review gate

No screenshot baselines, downstream applications/services, release, publication
or deployment are changed. Agent and Desktop-derived JJ visual review remain
pending.

## Catalog consistency follow-up

The final audit found CatalogSkill still used a generic file glyph for an
explicit host path. It now uses the shared icon in its original 16px slot;
pathless bundled skills retain PackageIcon. The complete Catalog story verifies
the Markdown artwork, decorative semantics, exact CSS dimensions and unchanged
explicit host navigation. Its exact target was:

`pnpm exec vitest run --project storybook catalog/AgentScreens.stories.ts -t '^Catalog$'`

Before: one failure, 14 skipped. After: one pass, 14 skipped. Initial type checking
also found two unsupported Testing Library `exact` options; anchored name
expressions retain exact matching with the supported API. The live in-app preview
exposed a fractional transformed bounding rectangle at browser zoom; the story
now verifies the declared `md` preset and exact width/height equality with an
unchanged neighboring source icon slot, including fractional browser zoom. Source comparison
again passed all 193 fingerprints and 140 adapted original layouts.

## Combined reference review

The independently committed chat-reference slice is merged with the icon slice,
preserving both parent histories. The original four-mode follow-up was stopped
after 93 units and both 164-case light-mode runs passed so qualification could
target the combined tree instead. No passing result is claimed for its cancelled
dark-mode and remaining lanes.

The combined prepared Design Core archive is
`lapismd-design-core-0.6.0-agent-icons-reference-review-v3.tgz`, SHA-256
`a62a66af2569f1fdf526b11627e76725dfae5b769d222802120b210d73164443`.
The ignored hook retains the reference slice's prepared Mira and JJ history
dependencies and substitutes this combined public archive. The existing npm
ranges and registry lockfile remain portable. Combined strict types and all
97 units pass; the complete qualification is running against this tree.
V3 includes the source's strict optional-property repairs and public Mira font
binding for rootless/custom-size transcript readers; earlier combined archives
are superseded. One prior light/narrow full run timed out in the unchanged
Source Picker (171 passed, one failed). Its exact narrow family rerun passed both
stories without changing the component, assertions or timeout. The final Catalog
target passed one case with 19 intentionally unselected, and the live browser
completed its icon-size and explicit-selection checks at fractional zoom. Its
selection assertion now waits for the acknowledged host action.

The first combined full theme/viewport matrix passed all 688 story/axe cases and
97 units. Its browser suite passed 26 and failed two cases: first-document cold
compilation exhausted the test clock, and the Classic reference flow failed at
its inline chip check. Both exact cases passed in a fresh process; a fresh V3
archive reproduced cold-clock exhaustion before the docs heading and during the
Classic Enter event. No assertion or interaction timeout was changed.

The catalog now adapts Design Core's fail-closed compiler readiness probe. Its
unit wiring regression failed once (two existing cases passed), then all eight
readiness/dependency units passed. Missing docs/screens, unsettled imports and
failed transforms prevent readiness; successful repair permits retry. The browser
server waits on that probe before starting tests. The final exact cold two-case
run passed in 33.8s overall, with docs in 9.7s and Classic interactions in 3.6s.
The docs probe scopes its semantic styling table to its heading and waits for
the owned DOM rather than unrelated asset loading. Row, variable and value
assertions remain intact. Strict types, architecture, source ledger and formatting
pass. Full final qualification is running against V3 and this readiness boundary.

## User-directed closeout

On 22 October the user requested: “commit all changes and update downstream
repos without running any further tests.” The owned aggregate and browser
descendants were stopped; no further tests were started.

Before cancellation the final combined tree passed strict types, architecture,
source-ledger and formatting checks, all 103 unit cases, and all 688 Storybook
interaction/accessibility cases (172 in each theme/viewport combination). The
final browser lane completed 11 passing cases out of 28 before cancellation;
17 cases remain incomplete. Its later static/package/spec aggregate stages
were not reached. Earlier focused cold-browser and packed-output evidence
above is retained without claiming that the complete final aggregate passed.

The user now authorizes local downstream icon/dependency integration. This
supersedes the earlier application review boundary for this requested slice.
Published manifests and lockfiles retain registry ranges; unpublished output
is consumed only through documented ignored local archive overlays. Package
publication, pushes, deployment and native-service restarts remain outside
this closeout. Changed stories remain visual-pending.

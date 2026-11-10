# Forge overflow and disclosure follow-up

Requirement: RUI-FORGE-001. The Maintenance live review exposed check rows
painting over the merge footer, rounded status headers, clipped wide Markdown
and expanded empty results. Fixes remain in Repository UI and use the public
Design Core ScrollArea viewportProps contract; no consumer patch or private
import is involved.

The user subsequently requested finishing, pushing, dependency publication and
GitHub Pages deployment. That explicit request authorizes this dependency's
publication after qualification; the earlier publication-review hold is no
longer pending. Source applications remain read-only references.

## Changes and source evidence

- Constrain the checks viewport as well as its root, retaining intrinsic height
  for short lists and scrolling long results above the merge footer.
- Give group disclosure headers square corners; start empty/unavailable results
  collapsed while retaining explicit expansion and refresh.
- Wrap stock PR Markdown in a named public horizontal ScrollArea for wide tables.
- Document and render long checks, wide description and square-header examples.
- Compare all three adapted original JJ Store files and their source hashes;
  update the documented layout adaptations and destination fingerprints.

All 424 local source fingerprints pass. Whole-tree optional source-root parity
could not run because an unrelated historical Desktop reference path is absent;
this is distinct from the three changed source files, whose hashes and previous
adaptation chains were checked before the ledger refresh.

## Verification

Native commands explicitly use AGENT_UI_VALIDATION_RUNTIME=native and Node
24.15.0. Spec Validator remains the latest Deno-free release, 0.2.0.

- Exact new stories: 3 failures before edits in light/desktop (overflow, missing
  horizontal viewport, rounded headings). After fixes: both complete families,
  16 cases across light/dark and desktop/narrow, all 64 passed including axe.
- Initial one-cell wide fixture wrapped its long inline code: 1 failed/15 passed;
  the replacement twelve-column table has intrinsic overflow and the horizontal
  scroll assertion remains intact.
- pnpm check: types, ownership, specification, catalog composition, formatting
  and 424 source fingerprints passed.
- pnpm test: 237 unit cases passed, plus the runner's validation checks.
- pnpm build: both package builds and publint passed.
- Full local Storybook began with 113 and 126 passing light/desktop shard cases,
  then was stopped during shard 3 to avoid duplicating the complete hosted gate
  while qualifying the consumer on the same machine. This is not a full pass.
- Complete hosted interaction, browser, static, package and specification gates
  remain required on the updated PR before merge and publication.
- QMD search and doctor passed under Node 24; doctor retains one known script
  alias warning because this repository intentionally wraps portable lanes.

No visual baseline was changed. Consumer integration remains separately
qualified with a packed archive until the registry release is verified.

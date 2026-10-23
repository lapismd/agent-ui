# Responsive directory cards and one layout control

## Scope

RUI-WORK-001: the shared ProjectToolbar now uses one public Design Core Button
and Tooltip in place of the two ToggleGroup items. Its icon, accessible name
and tooltip describe the destination view: Show cards from list, Show list
from cards. The same mounted button retains focus when toggled.

This reaches global Projects, Tasks, Reviews and Repositories plus project-scoped
Tasks, Reviews and linked Repositories. Activity and Agents have no card/list
control. Existing directory layout state, data and host contracts are unchanged.
The source ledger records this requested adaptation to JJ Store's toolbar.

The populated LayoutToggle example supplies six projects, tasks and reviews per
metadata home. Project cards now borrow JJ Store's task/repository card anatomy:
stacked readable copy, wrapping metadata and consistent gaps, retaining the source
auto-fit column widths. The former list-style metadata columns squeezed project
titles even when the outer card fit the viewport.

RUI-NAV-001: contextual tabs now inherit 0.75rem through the public Design Core
small-text token and the documented page-frame styling variable. Live comparison
measured source tabs at 12px / 17.1429px line height / 500 weight versus the shared
14px / 20px before this change. The updated shared measurements match the source.

## Avatar and timestamp comparison

- Running JJ Store Tasks, Projects and Repositories in grid mode each measured
  24 × 24px author avatars. Reviews had no author rows in the running view; its
  StoreWorkReviewRow source uses the same CommunityMemberHoverCard xsmall size
  (1.5rem). All four source directories use this size in both layouts.
- The shared rows had mapped xsmall to xs (20px). They now use the existing
  public RepositoryAuthorAvatar sm size (24px), with no avatar-primitive change.
- Live card review also exposed timestamps wrapping to three lines in the icon
  column. Copied selectors expected a direct time element, whereas public
  RelativeTime renders an outer span and tooltip button. WorkTime now owns a
  source-sized wrapper; copied layout rules target its class, restoring task
  date placement, secondary typography and responsive metadata behavior across
  the four directories without targeting dependency internals.

## Evidence

- `pnpm exec vitest run --project storybook packages/repository-ui/src/jj/projects/screen/ProjectsScreen.stories.ts -t '^Layout Toggle$'`:
  before, 1 failure / 19 skipped; after, 1 pass / 19 skipped. Exercises both
  directions in all seven views, a single control, keyboard Space, focus
  retention and each rendered collection's layout state.
- The same target with `CATALOG_NARROW=1`: 1 pass / 19 skipped.
- Populated project-title regression: 1 failure before the card anatomy fix;
  `pnpm test:storybook packages/repository-ui/src/jj/projects/screen/ProjectsScreen.stories.ts -t '^Layout Toggle$'`
  then passed all four light/dark × desktop/narrow targets.
- The exact Vitest Layout Toggle target reproduced the avatar regression:
  1 failure, expected 24px but received 20px. The same four-target matrix passed
  after the public size mapping changed.
- The exact Vitest Layout Toggle target reproduced timestamp wrapping:
  1 failure, measured 58.5px height. The same four-target matrix passed after
  the WorkTime integration fix, asserting one-line dates inside every card and
  task dates below the repository label.
- `pnpm test:storybook packages/repository-ui/src/jj/projects/screen/ProjectsScreen.stories.ts packages/repository-ui/src/jj/navigation/page-frame/RepositoryPageFrame.stories.ts`:
  final interaction/accessibility matrix passed 100 targets, 0 failures
  (25 per light/dark × desktop/narrow combination).
- `pnpm check`: passed spec validation, architecture, all 389 source
  fingerprints, Svelte diagnostics (0 errors/warnings) and formatting.
- Initial `pnpm spec:check` found one missing mapped governance chapter update
  for the populated catalog fixture; AUI-GOV-003 now records that geometry
  qualification boundary. The exact rerun passed validation, mdbook and spec-first.
- `pnpm test`: 192 tests passed across 33 files, 0 failures.
- `pnpm --filter @lapismd/repository-ui build`: package build and publint passed.
- `pnpm storybook:restart`: fresh port-7490 process loaded the populated example;
  cold browser review measured 24px avatars and a single 18px-high task date.
  Screenshot: `.local/projects-review/shared-task-cards-final.png`.

No visual baselines changed. The user accepted the reviewed Projects appearance
and requested continued implementation. The remaining functional, full package,
static and native consumer gates in `2026-10-23-project-composition.md` remain
open; this does not qualify the whole integration.

## Review

`jj-complete-screens-projects--layout-toggle` exercises global and selected-project
views. `--directory`, `--project`, `--reviews`, `--repositories` and
`--linked-repositories` expose the button directly. All remain visual-pending.

# Projects dialog and Reviews search

## Scope

Follow-up to RUI-WORK-001 and RUI-FORGE-001. Both Metadata home and Project
details use the theme body surface for editable rows, retaining tinted headers.
The default light theme resolves to white. The shared settings header owns its
inset once and accounts for the different section/row icon sizes so their
centres align. Reviews now uses the same expanding search as the other tabs.
Global Create Task places its project selector in the Metadata home card as a
labelled icon row beside Home repository, retaining selection and continuation.

The settings card configures the public Card.Header style prop. Creation forms
configure the existing public settings-card background token. No dependency
patch, source application change, visual baseline or host policy changed.
Source adaptations and destination fingerprints are recorded in the ledger.

## Before and after

- Live Create Project Dialog: two styling defects reproduced. Both card bodies
  resolved to `rgb(250, 250, 250)` and header insets compounded 16px + 16px.
- After: both card bodies resolve to `rgb(255, 255, 255)` in light mode. Headers
  retain their tint and use a 12.4px inline inset with no duplicate padding.
  Header/row icon centres differ by less than 0.01px in the measured viewport.
- `pnpm exec vitest run --project storybook packages/repository-ui/src/jj/projects/screen/ProjectsScreen.stories.ts -t '^Reviews$'`:
  before, 1 failure / 17 skipped (missing Search reviews); after, 1 pass /
  17 skipped. Covers query submission, no results, body-text matches across
  both homes, Escape, restored tabs and trigger focus.
- `pnpm exec vitest run --project storybook packages/repository-ui/src/jj/projects/screen/ProjectsScreen.stories.ts -t '^Create Task Dialog$'`:
  before, 1 failure / 18 skipped (Task project outside the card); after, 1 pass /
  18 skipped. Selecting a project reveals the Task details card and title field.

## Qualification

- `pnpm test:storybook packages/repository-ui/src/jj/projects packages/repository-ui/src/jj/settings`:
  first matrix 96 passes; final matrix including Create Task 100 passes,
  0 failures across light/dark and desktop/narrow.
- `pnpm test`: 192 unit tests / 33 files passed, 0 failures.
- `pnpm --filter @lapismd/repository-ui build`: final build and publint passed.
- Initial `pnpm check` found two acceptance-bullet-count violations. Additional
  requirements moved to requirement prose; exact rerun passed specification,
  architecture, 389 source fingerprints, Svelte (0 errors/warnings) and formatting.
- `pnpm storybook:restart`: fresh port-7490 startup passed and preserved the
  unrelated 7491 server. Cold Create Project and Create Task dialogs retain
  white rows/tinted headers. Task project and Home repository controls align
  on the right. Screenshots are in `.local/projects-review/` as
  `shared-create-project-updated.png` and `shared-create-task-updated.png`.

Broader static/package/desktop-native qualification remains pending final screen
review. The live JJ Store composition gate remains open as recorded in
`2026-10-23-project-composition.md`.

## Review stories

- `jj-complete-screens-projects--create-project-dialog`
- `jj-complete-screens-projects--create-task-dialog`
- `jj-complete-screens-projects--reviews`
- `jj-settings-settings-card--basic` and `--appearance`
- `jj-settings-settings-page--basic` and `--appearance`

All remain visual-pending. No visual baselines were changed.

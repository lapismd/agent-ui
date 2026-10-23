# Projects host composition

RUI-WORK-001 and AUI-GOV-001: JJ Desktop already owns the outer application
header and repository contextual tabs. ProjectsScreen now exposes showHeader and
showNavigation, both default true, so the host can preserve the complete screen
body and bind its details rail without duplicate header or tab bars. Existing
standalone stories retain their layout. The Embedded story demonstrates the
explicit host composition. Source provenance records this adaptation.

`pnpm exec vitest run --project storybook packages/repository-ui/src/jj/projects/screen/ProjectsScreen.stories.ts -t Embedded`: 1 pass.
`pnpm test:storybook packages/repository-ui/src/jj/projects/screen/ProjectsScreen.stories.ts`: 108 interaction/accessibility passes across light/dark and wide/narrow.
`pnpm check`, repository package build/publint and `pnpm spec:check` pass. Visual
baselines remain unchanged. Consumer archive acceptance is tracked in JJ Desktop.

# Empty Reviews semantics

RUI-WORK-001 and AUI-GOV-003: JJ Desktop's complete-shell axe pass found
aria-required-children in both empty repository Reviews groups. The shared
ProjectHomeContent rendered Empty directly inside role=list. It now renders the
list only for populated rows and renders Empty beside it for an empty collection.
The source ledger records this intentional adaptation; the consumer has no CSS
or markup workaround.

Exact source regression: `pnpm exec vitest run --project storybook packages/repository-ui/src/jj/projects/screen/ProjectsScreen.stories.ts -t 'Reviews Empty'`: 1 failure before (two empty lists), then 1 pass after. The ReviewsEmpty story owns this case. `pnpm test:storybook packages/repository-ui/src/jj/projects/screen/ProjectsScreen.stories.ts`: 112 interaction/accessibility passes (28 stories across light/dark and wide/narrow). `pnpm check`, repository package build/publint and `pnpm spec:check` pass.

The original desktop axe regression will be rerun against the rebuilt verified
archive. Visual baselines remain unchanged.

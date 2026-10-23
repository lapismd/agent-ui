# Stack host navigation

RUI-STACK-001 and AUI-GOV-001: The simple desktop app uses the shared page frame
for repository/Stacks contextual tabs. The complete Stacks screen can now hide
only its local Stacks/Workspace tabs using showViewTabs=false while retaining
the workspace picker, actions, canvas and footer. Default standalone composition
is unchanged; Embedded demonstrates this explicit host adaptation.

`pnpm test:storybook packages/repository-ui/src/jj/screens/stack-workspace/RepositoryStackWorkspace.stories.ts`: 96 interaction/accessibility passes (24 stories across four combinations).
`pnpm check`, repository build/publint and `pnpm spec:check` pass. Visual baselines remain unchanged.

# PR check-result examples

Requirements: RUI-STACK-001 and RUI-FORGE-001. Stories remain visual-pending;
baselines are unchanged.

The shared PR example retains passed Type check and Workspace interactions
results, adds a failed Formatting result with “Two files need formatting”, and
retains the running Visual review result. Production check rendering already
supports these states; no component logic, public API or source fingerprints
changed. Both complete-screen views and the standalone PR family share this
record. The Floating Pull Request story checks the visible results and failure
summary after detaching the production panel.

## Qualification

- Exact regression: `pnpm exec vitest run --project storybook packages/repository-ui/src/jj/screens/stack-workspace/RepositoryStackWorkspace.stories.ts -t 'Floating Pull Request'`:
  one failure before the fixture change (missing Formatting result); one passed
  afterward, zero failures. An initial camel-case filter selected zero tests;
  the recorded regression uses the actual spaced story name.
- `pnpm test:browser tests/stack-workspace-workflow.pw.ts`: six passed, zero
  failures, using a fresh Storybook process on port 7498.
- `pnpm test:storybook packages/repository-ui/src/jj/screens/stack-workspace/RepositoryStackWorkspace.stories.ts packages/repository-ui/src/jj/forge/pull-request/RepositoryPullRequest.stories.ts`:
  29 stories in each light/dark desktop/narrow combination, 116 passed and zero
  interaction/accessibility/runtime-diagnostic failures.
- `pnpm exec vitest run --project unit tests/pull-request-review.test.ts`:
  three passed, zero failures.
- `pnpm exec svelte-check --tsconfig tsconfig.json --fail-on-warnings`:
  zero errors and warnings.
- `pnpm spec:validate`: nine validators, five chapters and 23 requirements
  passed. An intermediate five-bullet acceptance section was rejected; moving
  the new example requirement into the owning requirement prose fixed it.
- The existing 7490 Floating Pull Request page was refreshed and scrolled to
  the checks. Passed icons, the failed icon/description, running state and
  mixed-result summary are visible. Screenshot: `.local/pr-check-results.png`.
- Focused Prettier check passed for all seven changed files.

Broad qualification and live forge execution remain outside this fixture-only
review slice. Human visual review remains pending.

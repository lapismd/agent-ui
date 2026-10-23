# Projects, agents, threads and desktop integration

User-approved implementation plan; enclosing Jujutsu changes provide revisions.

## Sequence

1. Shared navigation, command repository picker and breadcrumbs — implemented; visual review pending.
2. Registered local directory and scoped routing — pending.
3. Projects, Tasks, Reviews and contextual rails — pending.
4. Agents, sessions, Threads and contextual chat — pending.
5. Profile, emoji, Integrations and final desktop wiring — pending.

Source references: JJ Store at `42ae3473`; public Design Core ResponsiveTabs,
AppShell, CommandView and Breadcrumb. Existing source-reference changes remain
untouched. Package independence and explicit host ports are retained.

## Verification

New navigation acceptance starts with `tests/jj-navigation.test.ts` and the
three navigation story families. Before implementation these exports/scenarios
do not exist. Actual command outcomes are recorded as each slice is verified.
Broad package, cold consumer and visual review remain pending. No publication,
installed-app replacement or visual baseline updates are authorized.

### Navigation verification

- Initial exact unit command: 1 failed suite (missing new module); after implementation, 2 tests pass.
- Initial story run: 2 fixture compile failures and 1 keyboard expectation failure; corrected explicit initial state and CommandView first-match Enter behavior. A subsequent run found 2 incorrectly cased default breadcrumb labels; the tests now assert the actual public primitive name. No product assertion was waived.
- `pnpm test:storybook packages/repository-ui/src/jj/navigation`: 48 interaction/accessibility passes across light/dark and desktop/narrow, 0 remaining failures.
- `pnpm exec svelte-check --tsconfig tsconfig.json --fail-on-warnings`: 0 errors/warnings.
- `pnpm --filter @lapismd/repository-ui build`: package build and publint pass.
- `pnpm check`: specification, architecture, provenance, Svelte types and formatting passed.
- `pnpm test`: 32 files, 186 unit tests passed.
- `pnpm spec:validate`: 9 validators, 5 chapters and 24 requirements passed.
- Source layout verifies 349 fingerprints; architecture passes after classifying `.pw.ts` browser tests under the already documented 500-line test ceiling (previously incorrectly treated as 300-line production files).

New stories: `jj-navigation-repository-picker`, `jj-navigation-breadcrumbs`,
`jj-navigation-page-frame`. Visual review and final package/consumer matrix remain pending.

# Lapis Desktop portable history intake

RUI-DESKTOP-001: the public `/history` entry now exports the existing portable
controllers and exact revision navigation helper without importing any Svelte
component. Lapis Desktop's isolated integration workspace can retain its native
reader, guarded restore services and controller lifetime while mounting complete
shared screens. No controller behavior or source application changed here.

- Exact target: `pnpm exec vitest run --project unit tests/jj-history-controllers.test.ts`: 8 passed, 0 failures using the portable entry instead of `/jj`.
- `pnpm --filter @lapismd/repository-ui build`: passed, including publint.
- Initial `pnpm check`: two specification-shape findings because a prose addition was placed after an acceptance-details list; moved the clause into the owning requirement without changing the acceptance-count bound.

Consumer acceptance and the remaining migration are tracked in the isolated
Lapis Desktop workspace. Visual baselines remain unchanged.

- `pnpm check`: type, architecture and source-ledger checks pass after copying each package's dependency links into the new workspace; the initial incomplete dependency setup reported 32 type errors in four files.
- Initial affected Storybook run: 14 passed and one suite failed to import while Vite discovered missing workspace dependencies; a fresh process rerun follows the completed dependency setup.
- Broader unit qualification is rerun with two workers after cancelling the unbounded run; this is resource scheduling, not a test exclusion.

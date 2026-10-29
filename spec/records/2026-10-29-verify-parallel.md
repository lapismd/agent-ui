# Hosted verify parallelism

Requirement: AUI-GOV-004.

Design Core's `turbo.json` uses signed remote caching, `futureFlags.longerSignatureKey`,
and a `CI` global environment. Its CI workflow fans governance, quality, unit,
static Storybook, Storybook interaction, and browser lanes across runners.
`checks:nonvisual` keeps the heavy Storybook and browser suites sequential on
one machine.

Agent UI's verify job on run 40855077011 ran those lanes in one runner for
about 46 minutes. `pnpm test:storybook` took about 21 minutes and
`pnpm test:browser` took about 21 minutes, one after the other.

Hosted verification now uses that Turbo shape. Root scripts are `//#` tasks so
the package workspaces cannot skip them. `test:storybook` and `test:browser`
are separate jobs: Vitest browser mode uses API port 63315 and
`.local/validation/storybook`, while cold browser acceptance binds Storybook to
port 7498 and writes `.local/catalog-browser`. `storybook:check` stays
sequential because one worker shares `node_modules/.vite`. `ci:governance` is
uncached and still runs `pnpm spec:check`.

Validation:

- `node --test scripts/turbo.test.mjs scripts/validation.test.mjs`: 16 passed.
- `actionlint .github/workflows/check.yml`: passed.
- `node scripts/architecture.mjs`: passed.
- `AGENT_UI_VALIDATION_RUNTIME=native pnpm spec:check`: passed on
  `@lapismd/spec-validator` 0.2.0, including spec-first.
- `pnpm exec turbo run ci:storybook-interaction ci:browser ci:governance --dry-run`:
  three root tasks, no dependencies between Storybook interaction and browser
  acceptance, and `ci:governance` cache disabled.
- The first hosted run failed immediately with `spawnSync jj ENOENT` because
  Turbo 2.11 strict mode hid `AGENT_UI_VALIDATION_RUNTIME` and the lanes entered
  the Docker path. `envMode` is `loose` so those lanes stay on the explicit
  native runtime.
- `@lapismd/spec-validator` moves from `^0.1.4` (resolved 0.1.4) to `^0.2.0`,
  the latest registry version and the same caret range Design Core uses.
- npm publish packs with `npm pack --pack-destination` into
  `$GITHUB_WORKSPACE/.release` so the release artifact upload can see both
  tarballs.

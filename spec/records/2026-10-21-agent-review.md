# Agent review slice — 2026-10-21

Scope: Chat, History, Catalog, Imports and Recorded transcripts. Standalone
Agents, Clients, Models, Compute, Memory and AI Settings pages, stories, fixtures,
controller branches and public settings exports were removed at user request.
The inline chat profile editor and composer preferences remain part of chat.
Repository and Combined screens are deferred and excluded from this catalog.

## Extraction and review boundary

Desktop markup and CSS were copied, with host ports replacing App, persistence
and native orchestration. `docs/desktop-layout-sources.json` identifies the source
bytes and extracted fingerprints. `check:source-layout -- --source-root ..`
verified 88 extracted fingerprints and 70 original Svelte/CSS layouts, allowing
only the documented host bindings. No downstream source repository was changed.

`pnpm test:source-parity --max-failures=1` passed 18 comparisons with zero differing
pixels for the original/extracted session shell, header, footer, list and tool
inspector at 420, 900 and 1280 pixels in light/dark themes. This isolates shell
boundaries with a common neutral body; it does not prove complete-screen pixel
parity. Full-screen visual review remains the user gate. No screenshot baselines
were updated.

## Regression counts

| Exact boundary                                                                                    | Before                                                                | After                                          |
| ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------- |
| `pnpm exec vitest run --project unit tests/import-controller.test.ts`                             | 2 failed, 1 passed                                                    | 3 passed                                       |
| `pnpm exec vitest run --project storybook catalog/AgentFlows.stories.ts -t 'Inline Agent Editor'` | Full flows exposed 1 visibility failure                               | 1 passed, 3 skipped                            |
| `pnpm spec:validate`                                                                              | 3 acceptance-detail violations; 15 unsupported draft statuses         | 0 violations; 15 requirements                  |
| `pnpm exec vitest run --project unit tests/history-controller.test.ts`                            | 1 initial-scope failure                                               | 1 passed                                       |
| `pnpm test:package`                                                                               | 2 fixture lifecycle warnings, then 1 fixture Vite configuration error | Passed: 0 errors/warnings and Vite consumption |

History now follows the source’s initial scope ancestry and new-chat location,
while an explicit tree selection remains stable across host context changes.

The import controller now owns and releases every acquired reader, serializes
pause/resume reads, fences stale selection/disposal responses and drains pending
work at close. The inline editor saves typed participant data through the host
controller. Its story filters the original picker to reveal the saved item.
The package fixture now captures controller ownership explicitly and supplies a
package name for Vite’s generated CSS bundle.

## Validation

| Lane                   | Result                                                                                         |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| `pnpm check`           | Passed: specification, architecture, source fingerprints, 0 Svelte errors/warnings, formatting |
| `pnpm test`            | 29 passed across 7 files                                                                       |
| `pnpm test:storybook`  | 14 stories × light/dark × desktop/420px; 56 passed, 0 interaction/accessibility failures       |
| `pnpm build`           | Both packages built; publint passed                                                            |
| `pnpm build-storybook` | Passed; ordinary bundle-size advisories retained                                               |
| `pnpm test:package`    | Passed: clean pnpm 10.34.5 install, 0 type errors/warnings and Vite consumption                |
| `pnpm spec:check`      | Passed: validate, mdbook and spec-first                                                        |

No native execution, credential management, persistence integration, downstream
migration, registry publication or deployment is qualified by these fixtures.
Those remain behind explicit user review approval. Repository tests in the unit
count preserve the earlier extraction draft; Repository screen delivery remains
deferred.

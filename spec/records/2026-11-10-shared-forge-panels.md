# Shared forge panels and checks

RUI-FORGE-001 and RUI-FOUND-001: user-requested shared presentation for Lapis
Maintenance, adapted from JJ Store revision `6961bd1c` through public components.

## Delivered behavior

- Public RepositoryChecks owns the ring, revision/completeness summary, divided
  result rows, status grouping and independent public Collapsible disclosures.
- Public RepositoryForgePanel owns the shared border, title disclosure,
  float/dock controls and detachable content; PR, workflow and deployment hosts
  compose that frame instead of copying it.
- RepositoryPullRequest retains its body, scoped refresh and exact merge
  request controls, composing RepositoryChecks and RepositoryForgePanel.
- Floating content keeps its instance, focus, scroll and owning theme, follows
  theme changes, fits initial bounds to content/viewport and has an inert,
  transparent title disclosure.
- Both new public families include production-component metadata, variations,
  usage/styling examples, API/behavior/composition docs and native token audits.
- Pinned originals were compared before ledger updates; 424 source fingerprints
  now include the extracted frame and shared checks, with explicit adaptations.

## Verification

Commands use the repository-approved explicit native authoring runtime;
Docker qualification, visual parity, publication and installed-host changes
remain separate gates.

| Command                                                                                                                                                                                                                                                                                     | Result                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `AGENT_UI_VALIDATION_RUNTIME=native pnpm check`                                                                                                                                                                                                                                             | Passed: composition, spec, architecture, source ledger, types and formatting                                        |
| `AGENT_UI_VALIDATION_RUNTIME=native pnpm test --maxWorkers=2`                                                                                                                                                                                                                               | 237 unit tests passed; preceding runner/composition audits also passed                                              |
| `AGENT_UI_VALIDATION_RUNTIME=native pnpm test:storybook packages/repository-ui/src/jj/forge/panel/RepositoryForgePanel.stories.ts packages/repository-ui/src/jj/forge/pull-request/RepositoryPullRequest.stories.ts packages/repository-ui/src/jj/forge/checks/RepositoryChecks.stories.ts` | 16 cases in each of four theme/viewport modes, 64 passes, zero interaction/accessibility failures                   |
| `AGENT_UI_VALIDATION_RUNTIME=native pnpm test:storybook packages/repository-ui/src/jj/screens/stack-workspace/RepositoryStackWorkspace.stories.ts`                                                                                                                                          | 24 cases in each mode, 96 passes, zero failures                                                                     |
| `AGENT_UI_VALIDATION_RUNTIME=native pnpm build-storybook`                                                                                                                                                                                                                                   | Both packages built and publint passed; static catalog audited 68 documented families and 417 foundation variations |
| `AGENT_UI_VALIDATION_RUNTIME=native pnpm test:package`                                                                                                                                                                                                                                      | Clean packed type/Vite consumption passed; 153 documented public examples compiled                                  |
| `AGENT_UI_VALIDATION_RUNTIME=native pnpm spec:check`                                                                                                                                                                                                                                        | Validation, mdBook and mapped spec-first passed                                                                     |
| `pnpm --filter @lapismd/repository-ui pack --pack-destination .local/packages`                                                                                                                                                                                                              | Public archive built for explicit temporary consumer qualification                                                  |
| `pnpm exec spec-validator doctor` under installed Node 24                                                                                                                                                                                                                                   | Passed with existing wrapper-script alias warning                                                                   |
| `pnpm spec:search "RUI-FORGE-001"` under Node 24                                                                                                                                                                                                                                            | QMD-backed search passed                                                                                            |

The initial grouped-check family had one import failure from five Svelte fixture
warnings and five failing a11y cases; the next run exposed ten label failures,
then two interaction assertions and finally one dropdown-close timing assertion.
All are resolved in the 64-case matrix without disabling diagnostics or a11y
rules. Group/outer disclosure checks wait for completed visibility changes;
the dropdown journey waits for close before the next pointer action.

The first floating-height assertion incorrectly included both valid window and
tab headers; it now measures unused space below content directly, retaining the
requested no-bottom-gap contract. Stack Workspace initially had one failure
from the expanded accessible summary including counts; its assertion now matches
the summary prefix while retaining individual result/description assertions.

## Consumer and release boundary

Lapis Maintenance temporarily installs the normal packed archive with pnpm,
restoring its tracked registry manifest and lock bytes immediately afterward.
No dependency source edits, aliases, patches or private imports are used.
This is archive qualification, not a frozen-registry claim; the new exports are
not yet published. The minor changeset is prepared for explicit publication
approval under AGENTS.md. Full Maintenance Slice 2 acceptance remains owned by
that repository and is not implied by these shared UI checks.

All changed stories remain visual-pending; no screenshot baseline was updated.

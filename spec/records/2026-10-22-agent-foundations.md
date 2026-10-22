# Agent foundations — 2026-10-22

Scope: the Agent review slice in this repository. Desktop, Design Core and
jj-store were read-only references. No downstream application or service,
publication, deployment or visual baseline changed.

## Delivered composition

Thirteen independently documented families live under Agents: Session frame,
Session header, Session list, Message composer, Footer, Composer drawer, Approval
card, Question card, Transcript, Tool inspector, Send feedback, History toolbar
and Catalog toolbar. Each primary component owns its folder, stories, MDX,
public consumer examples and styling contract. The inventory assigns private
compound parts explicitly; new unowned production Svelte components fail.

AgentChatScreen now composes the extracted AgentTranscript used by standalone
stories. Both use the same production controller and presentation adapter.
Captured examples cover all five item kinds and five block kinds; user/assistant
messages; Markdown tables, tasks and code; sent context; reasoning; handoffs;
complete/running/error/unknown tools; queues; draft/published/stale anchored
comments; loading, empty and host feedback states. Streaming is simulated in
memory. Complete screens use the same scenario factory for messages, comments
and errors. Hosts retain execution, persistence and publication authority.

Sent-comment editing is not enabled by the Agent controller. Unknown-delivery
fixtures preserve pending identities without claiming automatic recovery or
replay. These examples do not qualify a live provider or downstream integration.

## Documentation and enforcement

Docs follow the Design Core Chat and Astryx composer-drawer structure: Usage,
Anatomy, Variations, Behavior and accessibility, Styling variables, API and
Composition. Highlighted examples import public package APIs. Token tables list
names, defaults, purposes and owning packages; defaults are checked against CSS.

The published spec-validator loads the repository-owned agentFoundations plugin.
It rejects missing inventory, component folders, family files, sections,
variation previews, actual-component metadata, highlighted public examples,
audited styling usage, unknown variables and defaults that drift from source.
Its negative tests exercise omissions and drift. Built-in Storybook source
validation is also enabled, following Design Core's configuration.

The canonical chapters render directly in Storybook. Brand selection is separate
from the copied Design Core light/dark manager toggle. MDX enables remark-gfm,
matching Design Core's table fix. Shell examples in docs have a 40rem host and
zero preview-wrapper padding; Canvas retains full viewport height. No product
selector override sizes the shell.

## Before and after

| Exact boundary                                   | Before                                                       | Final                                                                             |
| ------------------------------------------------ | ------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| Original complete-screen command below           | 14 passed                                                    | 19 passed, including five added scenarios                                         |
| First foundation svelte-check                    | 1 error, 1 warning                                           | 0 errors, 0 warnings                                                              |
| spec:validate during foundation development      | 4 diagnostics                                                | 0 diagnostics; 7 validators, 18 requirements                                      |
| Markdown anatomy and styling tables browser test | 1 semantic-table failure                                     | Passed: native table with five rows and correct styling defaults                  |
| Footer Basic story                               | 1 invalid empty-text assertion against a visible placeholder | 4 footer stories passed; retained state, cleared draft and disabled Send asserted |
| Narrow Composer drawer Basic                     | 1 closing-animation race                                     | 4 narrow drawer stories passed with the same assertion awaited                    |
| Foundation story type checks                     | 4 invalid testing-library option errors                      | 0 errors, 0 warnings                                                              |
| Initial filtered package build                   | 6 missing declaration entry points                           | Both packages build and pass publint                                              |
| First clean consumer-example check               | 8 errors, 8 warnings in two inspector examples               | All 26 examples compile with 0 errors/warnings                                    |
| Cold docs browser lane                           | 2 startup/readiness failures                                 | 3 passed with explicit preview readiness and unhandled-error checks               |
| Formatting                                       | 1 unformatted tsconfig                                       | Full formatter check passed                                                       |

Original complete-screen command:
`pnpm exec vitest run --project storybook catalog/AgentScreens.stories.ts catalog/AgentFlows.stories.ts`.

## Final verification

| Command                                           | Result                                                                                                                           |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm check`                                      | Spec, architecture, fingerprints, strict Svelte diagnostics and formatting passed                                                |
| `pnpm test`                                       | 53 passed across 9 files, including documentation omissions and runtime diagnostic guards                                        |
| `pnpm test:storybook`                             | 61 stories in each of light/dark × desktop/420px; 244 passed, 0 interaction/accessibility failures                               |
| `pnpm test:browser`                               | 3 cold-browser tests passed: semantic tables, docs sizing/padding versus Canvas, theme changes retaining draft and exact anchors |
| `pnpm test:source-parity`                         | 18 original/extracted shell pixel comparisons passed                                                                             |
| `node scripts/source-layout.mjs --source-root ..` | 88 destination fingerprints and 70 original layouts verified                                                                     |
| `pnpm build-storybook`                            | Both package builds/publint, static catalog and index audit passed; 13 families, 42 foundation variations and 5 spec chapters    |
| `pnpm test:package`                               | Clean archives exclude catalog code; 26 public examples pass strict type checking and Vite build                                 |
| `pnpm spec:check`                                 | Validation, book build and spec-first passed                                                                                     |

The source ledger retains original hashes and records explicit token adaptations
with unchanged defaults. Relative imports moved with component folders. Layout
fingerprints were refreshed only after matching transformed originals.

The pixel lane isolates the session shell/header/footer, list and inspector with
a neutral body at 420/900/1280px in both modes. It does not establish full-screen
pixel parity. All changed stories remain visual-pending for explicit user review.
Repository screens and downstream adoption remain deferred until that review.

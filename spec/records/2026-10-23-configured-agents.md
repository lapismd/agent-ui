# Configured agents and scoped session presentation

AUI-SCREEN-001, AUI-LIFE-001 and AUI-GOV-001/002/003: implement the next shared
presentation slice of the approved Projects/Agents/Threads plan. The enclosing
Jujutsu change is the source revision. This record does not close native adoption
or the full five-slice plan.

## Source and public boundary

Copy/adapt JJ Store CommunityAgents, CommunityAgentEditorDialog,
CommunityAgentProfile, StoreAgentDetailsSidebar and StoreAgentSessions/Row at
`42ae3473081a50b5acfbd2a763421af18d4608d0`. Nine copy records retain source hashes,
normalized destination hashes and explicit adaptations in the source ledger.
The source checkout's four unrelated documentation edits are preserved.

The public `AgentsScreen` and `AgentDirectoryController`/`AgentDirectoryPort`
provide the 13rem gallery grid, 16.25rem cards, source 6rem/4rem avatars, attached
resizable profile with narrow replacement and focus return, retained editor,
separate running/captured collections, partial unavailable/retry states and
continuation. Hosts supply client inventory, configuration persistence, exact
requests/outcomes, scoped session/capture selection and complete content snippets.
Unavailable daemon start/stop controls are omitted for per-chat ACP consumers.
The Agent package imports neither Repository UI nor native application services.

The controller rejects late scopes, wrong-home rows, duplicate identities and
changed/repeated continuations. Unknown actions retain their exact request and
resolve through inspection only. A known rejection refreshes saved versions
without erasing the edited draft; using the latest version and saving remain
separate explicit actions. Draft writes serialize, freeze their input and drain
on teardown; failed writes retain the current edited draft in the controller.

## Failures found and repaired

- Before implementation, `pnpm exec vitest run --project unit tests/agent-directory.test.ts`
  failed to collect one suite because the controller did not exist. The initial
  five behavior cases passed after implementation; expanded coverage now has 12.
- First interaction execution failed 3/8 cases: missing capture item metadata,
  nested banner semantics and clicking during menu dismissal. Complete captured
  item data, a semantic session section and waiting for actual menu closure fix
  these cases. No assertion or accessibility rule is disabled.
- First cold browser execution failed 3/4 cases: two overlapped the Basic story's
  own play function; a separate static Layout story isolates browser gestures.
  The remaining case proved Cancel left a closed editor mounted and prevented
  reopening. Controlled close now drains the draft and unmounts the editor.
- The added configuration-conflict story exposed structuredClone on a Svelte
  proxy. Snapshot conversion now protects editor initialization and host callbacks.
- Initial type checks found 9 errors/2 warnings in new story code, then one
  missing captured-item metadata error. Final checks have zero errors/warnings.
- Clean package acceptance initially stopped on existing computed example strings
  in History Query, JJ Log and Op Log. Four computed exports are now complete
  literals; all 15 exports in those three files were verified byte-identical.
  The next run found 3 missing direct icon imports and 6 existing capture warnings.
  The isolated consumer now declares the icons its examples import; Browser and
  Diff Viewer examples explicitly capture controller inputs and forward callbacks.
  Strict diagnostics and all examples remain enabled.
- The first spec check required the owning governance chapter. Agent, governance
  and repository example contracts are updated together with this record.

## Final verification

- `pnpm exec vitest run --project unit tests/agent-directory.test.ts`: 12 pass.
- `pnpm test:storybook packages/agent-ui/src/directory/screen/AgentsScreen.stories.ts`:
  40 interaction/accessibility passes (10 stories, light/dark, desktop/narrow).
- `pnpm test:browser tests/agents-directory.pw.ts`: 4 cold passes at 320/420/1280px,
  including source dimensions, viewport bounds, profile focus and Cancel/reopen/save.
  Review screenshots are ignored local artifacts; no baseline changes.
- `pnpm check`: pass; 405 source fingerprints, architecture, types (0/0) and format.
- `pnpm --filter @lapismd/agent-ui build`: Svelte package and publint pass.
- `AGENT_UI_REVIEW_PNPMFILE=.local/review-dependencies.cjs pnpm test:package`:
  clean packed type/Vite consumption passes; all 140 documented examples compile
  with the existing documented public archive overlay. No package was published.
- `pnpm spec:check`: validation, mdbook and spec-first all pass.

## Review and remaining work

Exact review stories under `Agents/Complete screens/Agents`: Basic, Layout,
Empty, Loading, Unavailable, Sessions, Partial, Configuration, Recovery and
Configuration Conflict. All remain visual-pending. The source comparison retains
markup/CSS provenance and measured geometry; live JJ Store visual approval and
broader final catalog/regression qualification remain separate.

JJ Desktop has not adopted this new Agent archive yet. Its running preview still
contains the verified shared Projects integration and Agents placeholder. Next:
installation-owned native configured-agent persistence; bounded registered-home
session/capture adapters and complete saved views; archive refresh and application
wiring. Global Threads, contextual chat, Profile/Emoji/Integrations/footer and
remaining Projects/native capabilities stay open. No native/provider or installed
application acceptance is claimed for this source-only slice.

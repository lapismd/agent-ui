# Permission and answer-request component review

## Scope and authority

AUI-CHAT-003/AUI-FOUND-001/AUI-THEME-001 govern this user-authorized slice.
Adapt the attached outlined-card references to semantic Lapis themes. Preserve
Desktop/Agent UI composer-drawer placement and JJ Store's transcript placement.
Complete shared Agent UI demos first, then stop before downstream adoption.
The user selected focused checks only before this review.

Isolated Jujutsu workspaces: `agent-ui-requests` (base `316670b3`) and
`design-core-requests` (base `29d2a048`). Default checkouts and their concurrent
work remain untouched. Storybook uses this workspace's ignored port file, 7590.

## Implementation

The existing permission/question cards compose public Card, Field, Radio Group,
Checkbox, Input, Textarea, Button, Dropdown Menu, Collapsible, CodeBlock, Empty
and FileTypeIcon primitives. Resources/commands, scopes and outcome timestamps
are captured host data. Allow-always never invents project or device authority.

Transient drafts are keyed by session/request and stable option IDs. Explicit
submissions retain their exact request until acknowledgement; refused responses
retain drafts for retry, while unknown outcomes permit status checks without
replaying. Refreshed options replace refused captures and feedback follows its
matching request. Disposal drains effects and clears transient data.

Question labels support letters (default), numbers or no badges. Decorative
badges do not change accessible names or response values. Host-permitted Other
answers work alone and alongside multiple choices. A restricted-choice example
retains `allowOther: false`; capability removal cannot serialize stale custom
text. Secret inputs are masked and absent from captured response history.

Resource and answer rows use `--ui-agent-request-option-background` with the
semantic `var(--background)` default: white in light themes, theme-owned in dark.
Selected options retain their surface and use the primary border/control state.

Acknowledged permissions remain inline as collapsed native Transcript disclosure
rows, labelled with outcome/title. Expanding renders the same full card read-only;
denials remain distinct from execution failure. Result capture/persistence belongs
to the host. In-memory adapters demonstrate it; no Desktop/JJ Store adoption occurs.

Agents/Requests documents 13 permission and 18 question variants, their public
examples, API and audited CSS defaults. Complete requests, Classic, custom answer,
command, scopes, denial, refused and unknown stories use production controllers.
The source ledger records the user-authorized departure from original card
visuals while preserving existing AppShell and composer boundaries.

## Before and repaired failures

Initial exact boundary:

```sh
pnpm exec vitest run --project storybook \
  packages/agent-ui/src/chat/approval-card/AiApprovalCard.stories.ts \
  packages/agent-ui/src/chat/question-card/AiQuestionCard.stories.ts
```

Five passed. Existing cards lacked structured resources, commands, scope
selection, multiple choice and multiline input.

During implementation the expanded boundary reported 19 passed/8 failed:
reactive request cloning required `$state.snapshot`, and scope-menu selection
required awaiting menu teardown before clicking its response. The next run was
26 passed/1 failed: the scope trigger's accessible name omitted its visible
selected allowance. Its label now includes that text; all 27 then passed.
Initial type diagnostics (10 errors/7 warnings, then 3 narrowing errors) were
repaired without suppressions: alias the `state` prop, install the public radio
family archive and narrow the retained interaction before use.

The user follow-up regressions ran exactly:

```sh
pnpm exec vitest run --project storybook \
  packages/agent-ui/src/chat/question-card/AiQuestionCard.stories.ts \
  catalog/AgentScreens.stories.ts -t '^(Basic|Requests)$'
```

Two failed before implementation (missing letter badges and collapsed outcome
row), then two passed. The first after-run also reported one fatal runtime
update-depth error: completed standalone draft cleanup subscribed to its own
writes. Cleanup now runs untracked; the exact rerun has zero runtime errors.

Cold manual review additionally exposed a zero-width question form in the
Document drawer. The new width assertion in
`vitest run --project storybook catalog/AgentScreens.stories.ts -t '^Requests$'`
failed once (`0 > 200`), then passed after the owning form declared full width
and zero minimum width. The final four-layout matrix includes this assertion.
No dependency selectors, diagnostic exclusions or baseline changes were added.

The architecture audit initially reported one over-budget adapter (303 counted
lines); request selection now lives with the request-action helpers. Spec
validation initially found two non-atomic acceptance bullets; the requirements
were rewritten without dropping behavior. Both final audits pass.

## Final focused qualification

| Boundary                                                     | Result                                                          |
| ------------------------------------------------------------ | --------------------------------------------------------------- |
| Permission, question, composer drawer and transcript stories | 46 passed per configuration                                     |
| Selected complete request screens                            | 9 passed per configuration; 19 unrelated stories excluded       |
| Light/dark × desktop/narrow matrix                           | 220 passed; zero interaction, accessibility or runtime failures |
| Request and presentation-controller unit targets             | 16 passed across two files                                      |
| Root svelte-check with fail-on-warnings                      | 0 errors, 0 warnings                                            |
| Agent UI public build and publint                            | Passed                                                          |
| Architecture/file budgets                                    | Passed                                                          |
| Source ledger                                                | 193 extracted fingerprints verified                             |
| Canonical specification validation                           | Passed                                                          |
| Spec-first, original base to this slice                      | Passed                                                          |

The component command selects these four exact story files under
`packages/agent-ui/src/chat`:
`approval-card/AiApprovalCard.stories.ts`,
`question-card/AiQuestionCard.stories.ts`,
`composer-drawer/ChatComposerDrawer.stories.ts` and
`transcript/AgentTranscript.stories.ts`.

The complete-screen command is:

```sh
pnpm exec vitest run --project storybook catalog/AgentScreens.stories.ts \
  -t '^(Requests|Requests Classic|Requests Free Text|Permission Command|Permission Scopes|Request Refused|Request Unknown|Permission Denied|Requests Other)$'
```

Both commands run with normal environment, `CATALOG_THEME=dark`,
`CATALOG_NARROW=1` and both variables together. Narrow is 420×800; desktop is
1280×900. The unit command selects `tests/agent-requests.test.ts` and
`tests/presentation-controllers.test.ts` with `--project unit`.

Other exact lanes: `pnpm exec svelte-check --tsconfig tsconfig.json
--fail-on-warnings`, `pnpm --filter @lapismd/agent-ui build`,
`pnpm check:architecture`, `pnpm check:source-layout`, `pnpm spec:validate`,
`pnpm spec:first --base 316670b3 --head @`, and Prettier on changed files.

`pnpm storybook:restart` replaced only the 7590 preview. Manual browser review
verified the cold complete AppShell, permission acknowledgement, initially
collapsed history row, expansion to the read-only resource card, full-width
active question and semantic Markdown docs with all variants/API/token tables.

## Design Core dependency and limits

Design Core source commits `225df7cf` and `96eef010` add the public Radio Group,
its generator recipe/semantic marker and root-style-site parity repairs,
provenance, docs and DC-SHA-065 governance. Source evidence is in that workspace's
`spec/records/2026-10-22-agent-request-radio.md`: two zero-pixel light/dark parity
cases, four family interaction/axe cases, 13 focused unit cases, clean types,
specification validation and spec-first all pass.

This review uses the prepared public archive
`design-core-requests/.local/packages/lapismd-design-core-0.6.0-agent-requests-review.tgz`,
SHA-256 `e841c0227cec3cf4862784796a320a27c6c88dc4fbd15c2630a46695bf322d81`.
An ignored `.local/review-dependencies.cjs` pnpm hook selects it, preserving the
existing local Mira/JJ-history review archives. Tracked manifests and lockfile
retain their registry ranges/bytes. Registry release and ordinary lockfile refresh
remain prerequisites for adoption; this is not frozen-registry acceptance.

Repository-wide suites, packed-consumer/static matrix, live host integration and
publication are deliberately deferred under the user's focused-review instruction.
All changed stories remain visual-pending; no visual baselines were updated.
Pause for user review before changing Desktop, JJ Store or downstream services.

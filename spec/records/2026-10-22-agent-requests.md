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

## Follow-up: solid choice-label backgrounds

The user requested solid letter/number label backgrounds similar to the card.
The shared question field now composes the filled Badge variant and sets its
public background/foreground variables from the documented Agent UI label tokens
(`var(--muted)` and `var(--foreground)`). Answer-row backgrounds are unchanged.
This applies to single/multiple choices, Other labels and complete chat screens.

The exact regression was `pnpm exec vitest run --project storybook
packages/agent-ui/src/chat/question-card/AiQuestionCard.stories.ts
-t '^Numbered Options$'`: one failed before (transparent computed background),
one passed after. The full question family passed 18 cases in each color mode;
complete `Requests` and `Requests Classic` passed two in each color mode:
40 focused interaction/accessibility cases total. Manual Storybook review
confirmed the filled numeric badges. Type diagnostics remain zero errors and
warnings; Agent UI build/publint, spec validation, architecture, changed-file
formatting and the 193-fingerprint source ledger pass. Source adaptations and
both request-family variable tables are updated. Controller behavior is unchanged;
unit and broad qualification lanes were not repeated for this paint-only change.
Downstream adoption and visual baselines remain pending review.

The follow-up spec-first gate initially required the mapped governance chapter
for its source-ledger change; the public-token paint boundary is now explicit
there and the final original-base gate passes.

## Follow-up: label order and answer-field surfaces

The user requested choice badges before radio buttons/checkboxes, then the same
choice-row background for free-text, character-count, secret and other text
answers. The shared field renders its decorative badge first, then the control
and answer text, including Other. Input and Textarea receive the existing
`--ui-agent-request-option-background` through their public HTML style props;
their default transparent primitive behavior is unchanged and no dependency
selectors are introduced. Both family token tables document the expanded use.

The exact question-story target
`-t '^(Numbered Options|Multiple Choice)$'` failed two placement assertions
before and passed two after. The additional exact
`-t '^(Free Text|Secret)$'` target failed two background assertions before and
passed two after. Both use `pnpm exec vitest run --project storybook
packages/agent-ui/src/chat/question-card/AiQuestionCard.stories.ts`.

Final focused light/dark qualification: 18 question-family cases plus the three
complete-screen cases selected by
`-t '^(Requests|Requests Classic|Requests Free Text)$'` from
`catalog/AgentScreens.stories.ts`, totalling 42 passed with zero interaction,
accessibility or runtime failures. Architecture and spec validation pass;
Agent UI build/publint and root type checking pass without warnings. Manual
review confirms the label order and opaque textarea background. Changed-file
formatting and the original-base spec-first gate pass. Controller/unit behavior,
wide qualification, downstream adoption and visual baselines remain outside
this focused presentation follow-up.

## Follow-up: attached Document composer feedback

The user marked the All Messages context-window warning: its rounded footer was
not joined to a framed input in Document view. This is owned by Design Core's
MarkdownComposer; the fix retains its existing Composer frame while status is
attached and restores prose styling when feedback clears. There is no consumer
CSS workaround. Ordinary failed-draft metadata stays below its retained draft.

The new exact complete-screen regression
`pnpm exec vitest run --project storybook catalog/AgentScreens.stories.ts
-t '^All Messages$'` failed once before the review dependency refresh and passed
once afterward. It checks the body frame, overlapping banner edge and frame
retention across Classic/Document switches. The Design Core source regression
failed two cases before the repair, then its five-file focused lane passed 29,
including light/dark warning/error, top status and clearing-with-retained-draft
cases. Source types, spec, native CSS and original-base spec-first pass; source
implementation is committed as `01984d92` in `design-core-requests`.

Agent UI acceptance selects Message composer and Transcript families (17 cases)
plus complete All Messages, Chat Error, Refused Submission and Unknown Submission
(four cases). Both light and dark runs passed: 42 interaction/accessibility cases,
zero failures or runtime diagnostics. Consumer types and architecture pass.

The initial compiled-only archive caused 34 documentation-token audit failures
because the validator reads the dependency's source CSS. The review archive is
rebuilt using `packLocal(..., { retainSource: true })`, preserving the audited
source alongside the same public compiled exports; no token assertion is relaxed.
The existing ignored pnpm hook supplies the archive. Installation preserves the
tracked lockfile bytes; no registry manifests, native apps or services change.
Final spec/format/package acceptance and the archive digest are recorded below.

The 7590 Storybook is restarted after the dependency refresh. Manual cold browser
review confirms the input frame and attached curved warning in the complete
AppShell. Broad suites, publication and visual baselines remain pending review.

The source-inclusive warning-frame archive contains 2726 byte-identical compiled
runtime files compared with its compiled-only predecessor; retaining source
restores all 34 token audits without modifying runtime output. Consumer spec
validation and Agent UI build/publint then pass.

The user also requested the same frame/footer treatment for Chat Error and red
errors. The shared `statusContent` extension now composes the original
MessageMetadata inside the existing attached footer. Exact retained-draft errors
supply an error tone and bottom placement, while Classic keeps its previous
feedback. The native metadata owns the single alert announcement. No application
state, retries or transport policy moves into the shared UI.

The new exact Chat Error target failed once before integration (unframed input),
with the metadata still retained in its original location. Its final regression
also requires the metadata to sit within an error-tone shared status banner,
below the saved draft. Source contrast testing exposed and repaired three
insufficient-red-contrast cases without weakening accessibility rules.

Final red/footer parity qualification: the Lapis-dark Classic Error target
initially failed once at 3.68:1. Design Core's existing metadata-style dark red
mix repairs it; the exact target now passes without an accessibility exclusion.
The follow-up font request exposed two source status-story failures (11px nested
metadata versus 12px status text). Shared source composition now inherits the
footer font size and line height. Manual browser measurement confirms both
Chat Error and All Messages use 12px/16px, and the Chat Error complete-screen
regression compares its nested metadata against the shared banner in both themes.

Final consumer commands/results against the refreshed archive:

- `CATALOG_THEME=dark pnpm exec vitest run --project storybook packages/agent-ui/src/chat/transcript/AgentTranscript.stories.ts -t '^Classic Error$'`: 1 passed.
- Message-composer and Transcript files in light and dark: 17 passed per mode.
- `catalog/AgentScreens.stories.ts -t '^(All Messages|Chat Error|Refused Submission|Unknown Submission)$'`: 4 passed per mode.
- Final matrix: 42 interaction/accessibility cases passed, zero failures or runtime diagnostics.
- Root type check: zero errors/warnings; spec validation, architecture and 193 source fingerprints pass. Agent UI build/publint, changed-file formatting and original-base spec-first pass.

The refreshed source-inclusive review archive is
`lapismd-design-core-0.6.0-agent-requests-error-parity-review.tgz`, SHA-256
`de91da5b4daa984ca0a1fb3150014693202d1ab95972f31278b76f7c696e2a64`.
Design Core commits `01984d92`, `782edfa7` and `f2f9fe38` own the shared fixes;
its final focused seven-file lane passes 47 cases and all strict type lanes.
The ignored review hook preserves registry manifests and lockfile bytes.
Storybook 7590 was restarted before consumer/browser acceptance.

Manual light/dark screenshots are saved locally as
`.local/chat-error-footer-review.png` and
`.local/chat-error-footer-dark-review.png`. The saved draft, joined input/status
frame, red feedback and matching status typography were checked in the complete
AppShell. Publication, broad qualification, downstream adoption and visual
baselines remain paused for review.

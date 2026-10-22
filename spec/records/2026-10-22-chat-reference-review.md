# Section 1: portable chat review

The enclosing Jujutsu change implements the first approved section under
AUI-CHAT-004. Stop for user review before JJ Log. The user requires targeted
checks now; full suites and the complete package/static matrix wait until the
final screen review. Downstream applications, services and publication remain
unchanged.

## Delivered behavior

The production composer, Markdown preview, transcript readers and inline comments
share Design Core's reference codec and InlineReference/ReferenceChip. Examples
cover people/agents, repositories, projects/tasks/channels, registered application
schemes, existing jj-store tokens, custom emoji, spoilers, Markdown formatting,
code and cancellable @/#/: and command suggestions. Person/agent chips adapt the
original jj-store filled inline geometry, optional host profile previews and
exact composer removal. Host content supplies profile details and actions.

AgentPort.resolveRecipients is an explicit opt-in host policy. Without it,
mentions add no recipients. Unknown outcomes retain exact resolved recipients;
resolver failures retain the authored draft before executing any action.
Host comment admission preserves drafts and read-only tool controls.

Transcript actions use shared MessageActions for emoji and configured primary /
overflow controls. Comment is icon-only. Wholly unavailable bars are omitted;
invisible controls do not intercept tool toggles. Full screens use these same
production components and the existing header action extension point.

## Source and temporary package setup

Generic fixes are in Design Core, with matching source evidence in
`spec/records/2026-10-22-chat-reference-review.md`. jj-store `f58b93635d49` is a
read-only reference. Desktop and jj-store remain unchanged by this slice.
The Desktop copy ledger retains explicit binding adaptations and matched
193 fingerprints / 140 original layouts after the composer change.

An ignored `.local/review-dependencies.cjs` supplies Design Core's prepared V10
archive and the previously documented unpublished jj-history archive. Install:
`pnpm --config.pnpmfile=.local/review-dependencies.cjs install --lockfile=false`.
Design Core V10 SHA256:
`c4b752713ed4cc1df2f2a9d4f8c2047b2c31aa4003c34fc3ffe7512d394d9c28`.
Source V1 was superseded after fragment-local quote/table and directive fixes;
V2/V3 were superseded by the reviewed author-chip corrections.
Manifests retain npm ranges. The registry lockfile was refreshed for Vite with
an ignored hook omitting the same unpublished jj-history entries already absent
from the previous lockfile; no archive paths or hook checksum are retained.
A released Design Core version and the jj-history lockfile entries remain
release prerequisites. This does not claim an ordinary frozen-registry install.

The cold catalog exposed Vite 7.3.2's broad asset-URL regex overflowing on a
5,522,031-character optimized shared chunk. Temporary diagnostics identified
`vite:asset-import-meta-url`; no diagnostics bypass or dependency patch remains.
Vite 7.3.7 retains that regex; released Vite 8.3.5 uses the precise asset matcher.
The catalog and future package acceptance now use Vite 8.3.5 with compatible
Svelte plugin 7.3.1. Storybook remains 10.5.7. All checks here remain focused.

## Focused evidence and encountered failures

- `pnpm exec vitest run --project unit tests/agent-references.test.ts tests/draft-send-feedback.test.ts`: 7 passed.
- `pnpm exec vitest run --project storybook packages/agent-ui/src/chat/message-composer/ChatMessageComposer.stories.ts catalog/AgentScreens.stories.ts -t 'References|Host Routing'`: 8 passed, 18 intentionally unselected.
- Strict `svelte-check`: zero errors/warnings after fixing a fixture's reactive
  snapshot typing and initial-value warning; production types were retained.
- `pnpm spec:validate`: 9 validators, 5 chapters, 22 requirements.
- `pnpm check:architecture`: production ownership and file budgets passed.
- `pnpm check:source-layout -- --source-root ..`: 193 fingerprints, 140 layouts.
- `pnpm --filter @lapismd/agent-ui build`: package build and publint passed.
- Design Core focused acceptance: 32 Storybook interaction/accessibility cases,
  14 units and strict source types passed. Source evidence separates those
  checks from consumer qualification.

Initial browser runs failed during the invalid proxy-cloning fixture and stale
preview package. A relative-link story then exposed 1 real contrast failure;
the owning ReferenceChip now preserves mention foreground and weight. Its exact
regression and the 8 consumer stories pass. Cold startup failures and final
browser counts are recorded below. No assertion, accessibility rule or baseline
was weakened. New tests wait for DOM readiness and assert actual UI behavior.

Full suites, complete public-example/static acceptance, theme/width matrix and
pixel-baseline approval remain pending. No broader tests qualify this section.

## Final visual corrections

The paired page now scrolls, and all three panel boundaries share the same
leading edge and width; the editor panels have no extra wrapper border/padding.
Plain Mira intentionally retains its own border and stock configuration.
Design Core no longer replaces Mira content typography, line-height, editor
insets or preview paragraph/list/quote/table/image spacing. Only the centered
note-column adjustment remains. Custom chips retain contained removal, aligned
author baselines, inline emoji and no underlines. GitHub/Forgejo icon links use
Mira's public inlineLinksExtension in the editor and preview.

Mira source commit a32942bb adds the missing root lineNumbers option, forwarding
its existing CodeEditor setting. The composer sets false, omitting the actual
extension. The ignored review hook also supplies Mira's prepared local archive;
Mira source tests passed 5 cases and its package build/publint passed. Published
ranges remain unchanged. Native checklist indentation reproduces in the plain
Mira panel and is explicitly deferred at the user's request.

Final source target `InlineReference.stories.svelte -t 'Paired|Removable'` passed
2 cases (3 unselected). The underline assertion first caught one failure, fixed
in the shared chip's own styling. The final six source story families passed
32 interaction/accessibility cases. Source spec validation and spec-first pass;
source/consumer strict types and consumer browser counts follow below.
The earlier isolated 7498 harness failures are not claimed as passing; focused
consumer acceptance uses a freshly restarted 7490 instance through the ignored
live config. Whole-repository suites and static/package matrices remain deferred.

The user then requested less initial composer padding. Shell insets now use 0.25rem
in Document and 0.5rem in Classic while Mira content styles remain stock. The
paired Classic browser scenario caught 1 actual overflow failure (table-cell
controls painting over the preview); the owning composer now bounds its scroll
viewport. The exact rerun and remaining section results are recorded below.
Final owning composer/reference source stories passed 17 cases.

Final strict Svelte checking reported zero errors/warnings in source and
consumer. Consumer spec validation passed 9 validators / 5 chapters / 22
requirements; spec-first passed 30 protected files / 2 canonical chapters.

The final Document inset retains 4px so native outdented task controls stay
visible. The paired browser regression now asserts checkbox bounds in all
three presentations; the source removable-chip scenario exercises Document
mode explicitly. The exact Classic overflow regression passed after a cold
7490 restart; no force-click, skipped control or weakened assertion is used.

The focused complete-chat browser flow caught two harness assumptions: after
closing a menu it must re-hover the owning block before clicking a hover action;
inline and queued draft editors share a label, so the intended inline group must
scope the textbox. The inline CodeEditor accepts suggestions with its native
Enter binding, while the main MarkdownComposer separately supports Tab. The
correctly scoped keyboard-and-pointer flow passed its exact regression without
force actions or removed source/chip assertions. Final seven-case results follow.

Final consumer run: `pnpm exec playwright test --config .local/live-chat.config.ts
tests/chat-references.pw.ts --max-failures=1` passed the three paired reference
presentations and two complete chat action cases. The host-routing selector was
then scoped to its composer because captured readers share its label; its cleared
draft assertion now checks retained source plus the native visible placeholder.
The exact host-routing/unavailable rerun is recorded in
`.local/chat-host-unavailable-after.log`. No product assertions or diagnostics
were disabled. Full suites remain deferred until user screen review.

The exact remaining target passed 2/2: all 7 unique focused consumer cases pass,
with no captured console errors or page errors. Stories remain visual-pending.

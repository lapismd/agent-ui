# Agent transcript completeness and review corrections — 2026-10-22

Scope: AUI-CHAT-001/002, AUI-FOUND-001, AUI-THEME-001,
AUI-VERIFY-001 and AUI-PARITY-001. Agent screens and foundations only.
Design Core source fixes were explicitly authorized by the user. Desktop and
jj-store remain read-only references; Repository screens, downstream changes,
publication, deployment and visual baseline updates remain outside this slice.

## Shared production composition

The standalone transcript and complete Chat screen use AgentTranscript and the
same controller/host-port flow. The catalog now reuses Desktop's sanitized full
recording: 22 recorded rows, 30 tools and three simulated discussions. Added
fixtures cover system/warning/error messages, full outgoing ACP XML, local
reports, registered inventory/tool results, recipients, working state and
saved-turn changes. Captured wire context stays separate from authored text.
Recording provenance and license are retained beside the catalog-only assets.

Five new documented families bring the Agent foundations to 18: Message metadata,
Turn changes, Tool result, Inventory result and Command report. The changed-files
composition copies Desktop's summary, list/tree, rail, diff/before/after inspector
and explicit undo/checkpoint dialogs. Hosts own immutable comparison identities,
reads, undo authority and execution; story effects are in memory only.
The coverage audit requires all 16 Desktop renderer/slot mappings and verifies
that their production components and governed stories exist.

Tool results and Read File overlays use Design Core's public ContentViewToggle:
one Code/BookOpen icon-only button, labelled for its next action. Exact raw
capture remains a separate Markdown-inspector action. No tool is executed by a
view switch. All foundation folders retain colocated usage, anatomy, variation,
API and audited styling-variable documentation.

## Failed-send correction and trailing space

The earlier error fixture represented a failed historical message. The corrected
Chat Error and Transcript Error stories explicitly attempt a send against the
in-memory refusing host. The same exact draft remains editable. Document mode
renders shared MessageMetadata beneath it; Classic retains its existing footer
feedback. The controller records the refused submission/session and does not
attribute its error to edited text, edited inline comments or another session.
Unknown outcomes retain their request identity and recovery feedback without
replaying a send. Existing historical message statuses remain supported.

The jj-store reference `store-agent-chat-body/chat-body.css` retains 4rem after
an ordinary document (3rem on narrow screens), but only 1rem after its composer.
The user requested the larger trailing buffer after the inline draft. Design
Core now owns that behavior through `--ui-transcript-composer-trailing-space`:
4rem by default, 3rem below 600px; Classic retains its 1rem inset. Both Agent
foundations and complete screens consume the same public implementation.

## Before and after

- Prior transcript browser run: four failures and three passes; two cold preview
  load failures and two incorrect CSS color-parser assertions were repaired in
  the regression harness, without changing product thresholds.
- New focused draft/spacing reproduction: two failures; cold Chat Error had not
  mounted before its first assertion, and Document trailing padding was 16px.
  Explicit preview readiness and the product correction yield three focused
  passes, including unchanged Classic feedback.
- One subsequent Classic test and the complete story play selected historical
  readers named Message as well as the composer; scoping to the composer fixed
  that ambiguity without relaxing the retained-draft assertion.
- The first complete matrix found one metadata story still using the former
  historical-error fixture (93 passed, one failed); its dedicated historical
  message-status fixture now passes all three metadata stories while Chat Error
  continues to use an actual refused send.
- Strict checks caught one non-atomic spec bullet and three unsupported
  Storybook query options; these were corrected.
- Clean package acceptance initially found six Svelte lifetime warnings in the
  two new turn-changes examples; both now construct their owned controller
  inside untrack and dispose it explicitly, with zero errors/warnings.

## Qualification

| Command / boundary                                                          | Final result                                                                                                                                                     |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm check`                                                                | Spec, architecture, source fingerprints, strict types and formatting passed                                                                                      |
| `pnpm test`                                                                 | 63 passed across 12 files                                                                                                                                        |
| `pnpm test:storybook`                                                       | 94 stories in each of light/dark × desktop/narrow: 376 passed, zero interaction/accessibility failures                                                           |
| `pnpm test:browser`                                                         | 11 cold browser checks passed: docs tables/sizing/themes, prose, full transcript/context, stale comments, draft metadata, spacing, Classic and both icon toggles |
| `pnpm build-storybook`                                                      | Both public package builds/publint, fresh static catalog and index audit passed: 18 families, 75 variations, five spec chapters                                  |
| `npm_config_pnpmfile=$PWD/.local/review-dependencies.cjs pnpm test:package` | Clean archives/public imports, 36 documented examples: zero errors/warnings and Vite build passed                                                                |
| `node scripts/source-layout.mjs --source-root ..`                           | 104 fingerprints and 81 original layouts verified with documented adaptations                                                                                    |
| `pnpm spec:check`                                                           | Validation, book and spec-first passed                                                                                                                           |
| `pnpm test:source-parity`                                                   | 12 exact Chat/list comparisons passed; six intentional inspector toolbar differences remain in the strict original-Desktop comparison                            |

The six inspector differences are confined to y=20–49 at 420/900/1280px in
light/dark modes. They replace the original Preview/Source/Capture segmented
control with the user-requested Code/BookOpen toggle and separate capture icon.
Outside those controls the inspected frames match exactly. The assertions and
baselines were retained; the strict command therefore still exits with six
visual failures. This is intentional visual review evidence, not a functional
or accessibility waiver and not a claim of a clean 18-case original-pixel run.

The detailed command output and reference/candidate/diff images stay in ignored
.local artifacts. No visual baseline was changed. Full-screen and intentional
control presentation remain visual-pending for user review; no downstream
application/service, native/provider or publication acceptance is claimed.

## Temporary dependency validation

Portable package manifests and lockfiles retain registry semver ranges. The
ignored `.local/review-dependencies.cjs` hook installs a local Design Core archive
for source/consumer qualification, including clean package-example acceptance.
It resolves built public dist exports; retained source supports token auditing.
The qualified Design Core change is committed locally as `0d5d7e5c`.
The archive is not published or committed:

`design-core/.local/packages/lapismd-design-core-0.6.0-agent-draft-review.tgz`

SHA-256: `9a6070e295ed82caaba2b9ae55dea7adfae8f8949d6ce1608ebe11df8914972c`.

Storybook at http://localhost:7490 was restarted against that archive. Original
Desktop listener 7491 and the existing Design Core listener were left alone.

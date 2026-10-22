# Verification

| ID              | Status      | Evidence                                                                                                                                                                                                                                                                              |
| --------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AUI-GOV-001     | Implemented | Architecture and clean public-package acceptance; Agent review record                                                                                                                                                                                                                 |
| AUI-GOV-002     | Partial     | Five complete in-memory screens; downstream review gate retained                                                                                                                                                                                                                      |
| AUI-GOV-003     | Implemented | Spec checks, source ledger and before/after counts                                                                                                                                                                                                                                    |
| AUI-CHAT-001    | Partial     | 81 documented layouts; comment draft/context acceptance in `spec/records/2026-10-22-comment-draft-review.md`; pixel review pending                                                                                                                                                    |
| AUI-CHAT-002    | Implemented | Exact submission/status and retained-draft controller regressions                                                                                                                                                                                                                     |
| AUI-CHAT-003    | Implemented | Outlined request cards and pinned local-dismissal panel; `spec/records/2026-10-22-pinned-permission-panel.md`                                                                                                                                                                         |
| AUI-CHAT-004    | In progress | Section 1 targeted evidence: `spec/records/2026-10-22-chat-reference-review.md`; broad qualification awaits final review.                                                                                                                                                             |
| AUI-SCREEN-001  | Partial     | Chat, History, Catalog, Imports and Recorded; visual-pending stories                                                                                                                                                                                                                  |
| AUI-LIFE-001    | Implemented | Late-read/disposal and import-reader ownership regressions                                                                                                                                                                                                                            |
| RUI-BROWSE-001  | Partial     | Seven documented families, exact-pin read-only controller, complete Files stories and focused evidence in `spec/records/2026-10-22-repository-browser.md`; visual review pending                                                                                                      |
| RUI-BRANCH-001  | Partial     | Two documented Branches families; exact-target controller, focused stories/browser evidence; visual review pending                                                                                                                                                                    |
| RUI-HISTORY-001 | Partial     | JJ Log and Op Log controller/host parity and shared presentation/query follow-up; exact targeted counts and review limits in `spec/records/2026-10-22-op-log-parity.md`; repository browsing has its own review slice; follow-up in `spec/records/2026-10-22-history-presentation.md` |
| RUI-STACK-001   | Partial     | Source-adapted Stacks/Workspace presentation; focused evidence in `spec/records/2026-10-23-stack-workspace-presentation.md`; broad checks deferred                                                                                                                                    |
| RUI-DRAG-001    | In progress | Original drop regressions retained; jj-store workspace slice remains later                                                                                                                                                                                                            |
| RUI-COMMAND-001 | Partial     | Guarded restore, original-request recovery and local conflict staging verified; native host integration deferred                                                                                                                                                                      |
| RUI-FORGE-001   | In progress | Forge and repository settings remain later sections                                                                                                                                                                                                                                   |
| RUI-LIFE-001    | Partial     | Copied Desktop pin/late-read/drain regressions verified; downstream host lifetime remains separate                                                                                                                                                                                    |
| AUI-FOUND-001   | Implemented | 18 colocated families; full recording; 36 public examples; completeness record; filename icon adoption record                                                                                                                                                                         |
| AUI-THEME-001   | Implemented | Audited defaults; independent theme/mode controls; bounded flush docs previews                                                                                                                                                                                                        |
| AUI-VERIFY-001  | Implemented | 656 story/axe checks; 92 unit tests; 21 cold-browser checks; package/static gates                                                                                                                                                                                                     |
| AUI-PARITY-001  | Partial     | 16 renderer mappings; full recording and changes UI; visual review pending                                                                                                                                                                                                            |
| RUI-FOUND-001   | Implemented | 31 documented families; structural negative tests, token/catalog/package audits; Desktop JJ and filename icon review records                                                                                                                                                          |
| RUI-DESKTOP-001 | Partial     | 656 story/axe, 92 unit, 21 cold browser and 18 native-density pixel comparisons; awaiting human review                                                                                                                                                                                |

Commands, counts and visual limits are recorded in
`spec/records/2026-10-21-agent-review.md` and
`spec/records/2026-10-22-agent-foundations.md` and
`spec/records/2026-10-22-transcript-completeness.md` and
`spec/records/2026-10-22-desktop-jj-review.md`. Standalone Agent settings pages are
excluded. Local downstream icon/dependency refresh is user-authorized in the
filename icon closeout record. Publication and deployment remain pending.
User approval of the Agent presentation remains pending.

The progressive history graph and source-style query-help follow-up for
RUI-HISTORY-001 / AUI-GOV-003 is recorded in
`spec/records/2026-10-22-history-graph-help.md`; visual review remains pending.

The RUI-HISTORY-001 split/unified context-folding follow-up is recorded in
`spec/records/2026-10-22-history-diff-context.md`.

The RUI-HISTORY-001 all-file collection and host-menu slice is recorded in
`spec/records/2026-10-22-diff-collection.md`, with focused comparison-cache,
controller, Storybook/a11y and complete JJ/Op Log browser coverage. Broader
qualification and downstream adoption remain pending review.

The RUI-HISTORY-001 / AUI-GOV-003 header follow-up is recorded in
`spec/records/2026-10-22-diff-header-review.md`, covering host totals, scoped
actions, semantic header interaction and painted selection edges in both logs.

The RUI-HISTORY-001 / RUI-DESKTOP-001 / AUI-GOV-003 canvas resize-space follow-up
is recorded in `spec/records/2026-10-22-log-canvas-spacer.md`, with both logs using
the source workspace's fixed scrolling mode and public trailing-content slot.

The RUI-HISTORY-001 / AUI-GOV-003 All Changes surface follow-up is recorded in
`spec/records/2026-10-22-diff-surface.md`, covering flush geometry, opaque sticky
header paint and retained selected side edges in both logs and themes.

The RUI-HISTORY-001 / AUI-GOV-003 diff-status typography correction is recorded
in `spec/records/2026-10-22-diff-status-typography.md`.

The RUI-BROWSE-001 / RUI-FOUND-001 / AUI-GOV-003 repository browsing slice is
recorded in `spec/records/2026-10-22-repository-browser.md`. Review pauses before
Workspace changes after the now-authorized Branches slice; source apps stay read-only.

## Branches slice

RUI-BRANCH-001 is qualified through exact-target controller tests, the two new
Branch Command/Branches story families, cold complete-screen browser checks and
source-layout comparisons. RUI-HISTORY-001 retains query behavior through the
existing focused history/query tests. Evidence and before/after counts belong in
`spec/records/2026-10-22-repository-branches.md`. Broad qualification remains
deferred until final human screen review.

The public Design Core rail-toggle consumer regression for RUI-BRANCH-001 and
AUI-GOV-001/AUI-GOV-003 is recorded in
`spec/records/2026-10-22-column-fit-toggle.md`; broader qualification remains
deferred until final screen review.

The RUI-BRANCH-001 default row surface follow-up is recorded in
`spec/records/2026-10-22-branch-row-background.md`; screen review and broader
qualification remain pending.

The RUI-BRANCH-001 hover-chip visibility and opaque row-paint review is recorded
in `spec/records/2026-10-23-branch-chip-contrast.md`.

## Stacks and Workspace slice

RUI-STACK-001 presentation evidence and before/after counts are in
`spec/records/2026-10-23-stack-workspace-presentation.md`. The source-adapted
complete screens reuse the portable controller and shared graph/files/diff.
Review pauses before transfers, mutation dialogs, forge execution and downstream
adoption; broad qualification waits until final human screen review.

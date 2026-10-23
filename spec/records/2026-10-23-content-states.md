# Shared content states and header composition — 2026-10-23

AUI-SCREEN-001, AUI-THREAD-001, AUI-CHAT-001, AUI-GOV-002,
RUI-STACK-001 and RUI-BROWSE-001 retain the existing source components and
controllers. Loading reads now use public shadcn Skeleton. Empty/unavailable
content uses public shadcn Empty with a relevant icon. This is an explicit rule
in AGENTS, canonical governance and consumer guidance. Busy actions, streaming
and missing scalar values retain their own semantics.

The audit includes catalog/history, saved comparisons and file inspection,
import folder indexes and sessions, agent/session directories, per-home Threads,
project pages, command pickers, operation details and PR checks. Pending settings
values use the same public RepositoryReadOnlyRow with its loading prop. Replace
zero-height utility-class placeholders with native CSS dimensions. Retain loaded
content during refresh, expose bounded-read failures independently, and clear
import failures only after an explicit successful read.

Unavailable stories retain their state for inspection. Directory, reference,
agent and Thread retry interactions have distinct recovery coverage. The missing
read-only scalar variation is now named MissingValue. The operation-details
Loading fixture opens the actual captured operation's canvas path while its
production comparison read is held; no revision or response is fabricated.

Also complete the preceding shared header slice: Stacks/Workspace exposes its
production controls snippet for the enclosing page-frame action slot; standalone
composition retains its toolbar. Undo/Redo/Refresh live in the workspace menu.
Shared file editing is an icon-only host callback, and the command repository
picker supports the public small button size. These controls retain host command
and physical-file authority.

Provenance: existing JJ Store/Desktop source hashes remain intact in the layout
ledger. Explicit markup adaptations record Skeleton/Empty changes. Legacy public
scaffolds receive only the same state substitutions; refreshed deferred hashes
do not approve their wider extraction or application use. JJ Store's
StoreContentEmpty, CommunityInboxSkeleton and StoreSettingsSkeleton are read-only
references for the rule and geometry.

Verification in progress:

- Initial `pnpm test:browser content-states.pw.ts`: 3 audit failures, flagging
  8 loading, 1 empty and 3 unavailable candidates. Closed picker setup, automatic
  story recovery and cold client compilation accounted for some candidates;
  production defects were fixed without removing state assertions.
- Exact import regression: 1 failed / 3 passed before; 4 passed after. Failed
  indexes/folders retain their previous rows and recover only after a read.
- Cold-readiness regression: 1 failed / 5 passed before the repository loading
  family joined the fail-closed client preparation probe.
- Exact operation-details Loading: 1 failed before the captured canvas path was
  opened; 1 passed after, with an explicit visible skeleton assertion.
- Exact directory Unavailable/DirectoryRecovery: 2 passed after preserving the
  unavailable story and testing its retry separately.
- Shared header's earlier four-family interaction/axe matrix: 212 passed.
- Full renderer units: 213 passed. Both packages build and pass publint. Types
  report 0 errors and 0 warnings; ownership/module bounds and 412 source
  fingerprints pass. Final source/docs checks, state matrix, cold catalog sweep,
  packed examples and consumer acceptance remain pending until recorded below.

The optional whole-ledger original-source comparison finds a pre-existing
ChatComposerDrawer layout mismatch outside this change. The focused comparison
of changed source-derived layouts passes (31 original layouts at that point).
This does not qualify the whole-ledger comparison. No visual baseline changed;
all changed stories remain visual-pending.

Completed focused qualification:

- Fresh `pnpm test:browser content-states.pw.ts`: 3 passed, 0 failed, exercising
  all 87 indexed suffix variations: 29 Loading, 28 Empty and 30 Unavailable.
- `pnpm check`, full unit tests (213), both package builds/publint and
  `pnpm spec:check` pass. The source-copy fingerprints retain all 412 entries.
- Clean archive consumption with the documented review dependency overlay:
  `AGENT_UI_REVIEW_PNPMFILE=.local/review-dependencies.cjs pnpm test:package`
  passes; 145 public examples compile and build.
- The broader filtered Storybook run hit one browser RPC closure after 100
  passing tests; its fresh retry hit the same infrastructure failure after 97
  passing tests in another family. Neither result is an accessibility pass.
  Verification continues with an isolated loopback browser API port. Cold
  workspace header acceptance and consumer adoption remain in progress.
- The unmodified parent ledger reproduces the same ChatComposerDrawer original
  layout mismatch. Changed source layouts pass their focused comparison; the
  unrelated whole-ledger lane remains open and no source assertion was relaxed.

Follow-up qualification:

- Splitting the unchanged filtered Storybook matrix into three sequential shards
  completes all four theme/viewport combinations: 428 passed, 0 failed. The CLI
  browser-port override did not take effect in the earlier isolation attempt;
  it is not counted as an isolation pass.
- File history's no-head and concurrent-unselected-head branches still used plain
  status text. Two additional production stories fail before and pass after the
  icon Empty substitution. They retain the explicit pin picker and controller.
  The added source adaptation matches the original layout; all 412 fingerprints
  remain required.
- Cold header acceptance initially times out before executing tests. A traced
  retry reproduces serial client-entry compilation consuming the unchanged
  60-second readiness budget. Start independent transforms together, await every
  result and static imports, and retain failure/retry semantics. The exact unit
  regression changes from 1 failed / 6 passed to 7 passed; the fresh browser
  process reaches readiness within the original limit. Final browser counts are
  recorded after completion below.
- Full units now pass 214 tests; types have 0 errors/warnings, architecture,
  formatting and source fingerprints pass. Updated builds, complete browser
  coverage, package acceptance and consumer archive intake continue separately.

- Exact cold stack-navigation retry: 1 passed. Fresh full header family:
  12 passed. An intermediate run had 11 passed and 1 page navigation aborted
  during concurrent source/docs work; final runs freeze those inputs and retain
  the original readiness/navigation timeouts and all assertions.
- The complete file-history family passes all 28 interaction/axe combinations
  (7 stories across four theme/viewport settings), including both added states.
- Updated builds/publint, three specification lanes and clean packed consumption
  pass; all 145 public examples compile.

Operation-parent follow-up:

- The wider 151-test browser attempt was interrupted with 52 passed, 5 failed
  and 94 not run. Two filename assertions used outdated accessible labels;
  they now retain exact path identity and select the attachment option by role.
  Two diff-collection failures need a fresh exact rerun. The remaining failure
  exposed a production regression: a pending parent read replaced the selected
  operation card, unmounting its open picker.
- Keep selected operation metadata mounted during parent reads. The picker
  retains recorded choices and adds a labelled public Skeleton to its footer.
  ParentLoading holds the production continuation read until disposal. Its
  five-story light/desktop family passes; an intermediate immediate visibility
  assertion failed before the footer received bounded flex geometry and the
  assertion waited for normal popover positioning. The original new-story
  pre-fix probe was cancelled, not a recorded assertion failure.
- Earlier final unit and warm-browser reruns stalled without reporting test
  outcomes and were cancelled. Cold retries timed out at the unchanged 60-second
  server-readiness boundary before executing tests. They are not passing runs.
  A fresh resumed full unit run passes all 214 tests in 35 files.
- Both packages build/publint; all 412 fingerprints, the three changed original
  layouts and three specification lanes pass for the parent-picker changes.
  Final exact browser, four-setting operation family, updated content-state
  audit and fresh archive consumption are recorded below after completion.

Resumed verification:

- `pnpm test:browser file-type-icons.pw.ts jj-diff-collection.pw.ts
jj-operation-parity.pw.ts`: 17 passed in a fresh server/browser run. This closes
  all five failures from the interrupted broader attempt without changing
  readiness, navigation or assertion thresholds.
- `pnpm test:storybook --config .local/vitest-content-states.config.ts
packages/repository-ui/src/jj/operations/operation-column/RepositoryOperationColumn.stories.ts`:
  20 passed across light/dark and desktop/narrow. The isolated configuration only
  binds the browser API to an explicit loopback port; production stories,
  assertions and accessibility checks are unchanged.
- `pnpm test --maxWorkers=2`: 214 passed. `pnpm check`: specification validation,
  architecture, 412 source fingerprints, types (0 errors/warnings) and formatting
  pass. The earlier 428-state matrix and 28 file-history checks remain recorded
  above; the parent-picker addition is covered by the fresh 20-case family.
- Fresh clean package acceptance passes with the documented review overlay:
  all 145 public examples compile with 0 errors/warnings and build from the
  public archives. `pnpm spec:check` passes all three lanes. The complete browser
  sweep and static catalog build are still running at this focused commit.

Final archive and catalog follow-up:

- `pnpm build-storybook` passes both package builds/publint and the static audit:
  64 documented foundation families, 387 variations and five specification
  chapters. All review stories remain visual-pending.
- JJ Desktop adopts archives from `a728319a` through its documented verifier:
  14 payloads verified, 45 fresh browser/axe checks and 43 units passed, with
  types, architecture, formatting and renderer build passing. Registry manifests
  and lockfiles remain unchanged. After free space recovered above the guard,
  all 27 native tests and cold application acceptance passed. The consumer record
  retains the initial stale Workspace-label failure, intermediate hidden-header
  selector failure and final native-header assertion repair. Crash/blank-screen
  soak qualification remains open.
- The resumed complete browser attempt was stopped explicitly after 16 passed,
  3 failed, 1 interrupted and 131 not run. The 320px/420px agent-gallery tests
  could not find the initial card within their existing deadlines; the Loading
  audit also reported `jj-browsing-directory--loading`. The Empty audit was
  interrupted. These are not passing aggregate results. No timeout or assertion
  was weakened. A separate four-case agent-gallery retry records 3 passed and
  the same 320px first-render failure; wider catalog qualification remains open.
- The state inventory now contains 88 variations (30 Loading, 28 Empty and
  30 Unavailable). The focused audit against the restarted review server passes
  all three groups: `pnpm exec playwright test --config
.local/playwright-content-review.config.ts content-states.pw.ts`. This uses the
  same catalog audit, timeouts and assertions; cold startup is independently
  covered by the earlier 17-case exact run. The final focused 320px agent-gallery
  retry also passes (1 test), without code or timeout changes. This does not
  convert the interrupted complete sweep into a passing aggregate result.

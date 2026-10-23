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
  pass; all 145 public examples compile. The complete 151-test browser suite is
  running separately, including the cold 87-variation content audit.

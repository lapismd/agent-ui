# Host response failures and captured feedback

AUI-CHAT-002/003: controlled permission and question callbacks now return their
host response promises to the request cards. The card retains its editable
refused state and displays the failure without an unhandled rejection.
Host-supplied error status follows the same exact new captured-notice rule as
controller feedback; unrelated warnings and historical notices remain visible.

Controlled source regression with the old discarded promises restored:
`pnpm exec vitest run --project storybook
packages/agent-ui/src/chat/transcript/AgentTranscript.stories.ts -t 'Rejected Host'`
reports two failures and one unhandled rejection, with 16 skipped. Earlier probes
without hosted presentation wiring were invalid and do not establish the baseline.
The captured-feedback fixture supplies an external host status as well as the
new exact retained error notice; the original case exposed duplicate alerts.

After returning promises, the first exact run passed permission and captured
feedback but failed the new question's incorrect option label. The fixture's
advertised option is Allow once. The corrected story retains its exact choice,
refused-state and visible error assertions. Further results follow below.

Visual review remains pending; no baseline, publication or default-workspace
integration is included.

The corrected exact story command passes all three cases in all four modes
(12 interaction/accessibility passes). The full directly affected Agent matrix,
`pnpm test:storybook packages/agent-ui/src catalog/AgentScreens.stories.ts`,
passes 158 cases in each mode, 632 total, without unhandled rejections.

Full check passes with zero type errors/warnings, formatting, architecture and
405 documented fingerprints. The first unit attempt found a new assertion
placed outside its parameterized fixture scope; it was corrected rather than
removed. That overloaded run was cancelled. The exact owning file now passes
all six cases, and `pnpm test --maxWorkers=2` passes all 213 cases in 36 files.
Both package builds and publint checks pass, as do all three specification lanes.
The ledger documents returned host promises and exact external status filtering.

Fresh static catalog and packed consumer acceptance continue after this verified
source commit. The cancelled concurrent build/test attempts do not qualify any
remaining lane.

# Catalog read-error announcements

Last updated: 2026-10-25 20:23:14 UTC.

Status: exact source and affected content-state interactions pass. Final complete
source/packed and consumer gates remain separately pending.

The isolated `catalog-retention-20261025` workspace starts from Agent UI tooling
snapshot `0c916619adb0828554253b490457f6cd86a15377`. It owns only the shared
Catalog product component, direct state fixtures/stories, AUI-SCREEN-001's
acceptance clause, its copied-source adaptation record and this receipt.
Docker tooling, the broad validation ledger and PLAN remain separately owned.

## Original boundary

Desktop's exact cold run `68ff45fe-d5c0-4d74-bc43-55f2660078f6` reports four
failed cases, two filtered and zero unhandled diagnostics in its first mode:
Retained Inventory, Toggle Failure And Retry, Load Failure And Retry and
Unreadable Recovery. The broad shard first reports 109 passes/four failures.
Its native provider or history gates are unrelated.

Inspection corrects the initial hypothesis: AiCatalogPanel independently renders
its retained tree during loading and failure. No product retention rewrite is
justified. Two Desktop cases instead read the shell before the accessible
Loading catalog status clears; that helper repair is owned separately by Desktop.
The remaining two cases expect an error alert that the shared Empty currently
omits. Prior Desktop Catalog presentation announced that exact host error.

## Direct source regression

`pnpm test:storybook -- catalog/AgentStates.stories.ts -t
'Unavailable|Retained Catalog'` runs existing initial unavailable cases and the
new retained Catalog loading/unavailable states through the production
AgentWorkbench. Catalog fixtures use the existing production controller and
in-memory adapter; no synthetic product screen or consumer override is added.
Ordinary empty/loading states must remain non-alert states.

The unchanged source is being exercised before product edits. Complete source
counts, the exact command, failure origin and after evidence follow below.
Visual review, public archive admission and Desktop consumer acceptance retain
separate gates; no baseline is changed.

## Before and bounded repair

Exact cold source run `e2c3074b-3d34-4425-b712-fe19fabe0d13`, snapshot
`ee7f5aee`, executes five selected cases in desktop/light. Three pass and two
fail: initial Unavailable and Retained Catalog Unavailable both lack
`role=alert`. Six unrelated cases are deliberately filtered. Retained Catalog
Loading passes with its existing tree and accessible skeleton status. There
are zero unhandled diagnostics. This establishes the genuine shared defect
without changing retained-tree implementation.

The product repair passes the existing public `role` prop to Empty.Root only
when the host supplies a catalog error. It adds no wrapper, styling override,
new component, transport or authority. The original error text and icon remain
unchanged; ordinary empty/loading states remain non-alert. Copied-source
fingerprints record this explicit semantic adaptation.

The exact after command remains unchanged. Desktop readiness-helper repair and
its four-case consumer rerun stay separately owned.

The first after run `2a026444-529d-4150-9793-0a812afc70e3` moves from two
missing-alert failures to four passes/one assertion failure, six filtered. The
remaining new assertion assumed initial AgentDemo retained its temporary Catalog
error string. Its existing memory import fixture explicitly publishes
`The local folder index could not be read.` onto that same controller during
load. The initial case now asserts that actual host-provided error; the isolated
retained Catalog case separately asserts the configured Catalog error. The
required alert and exact error assertion remain; neither product behavior nor
existing assertions were changed.

## Exact and affected source acceptance

The unchanged exact command passes **20 selected cases**, five per mode, with
zero failures, unhandled diagnostics or accessibility errors in cold run
`41f8cd80-e305-41c0-87c0-8070184b274b`. Source is
`5b90d93678893816b5d81ddaf33d49dc2aee7198`; six unrelated cases are filtered
in each mode. The original missing-alert failures move from two to zero.

`pnpm test:storybook -- catalog/AgentStates.stories.ts
catalog/AgentScreens.stories.ts -t 'Loading|Empty|Unavailable|Catalog'` then
passes all **56 selected cases**, 14 per mode, with zero failures or diagnostics
in run `47fad465-a2cb-4def-87ef-9015c7ad736a`, against the same source. Every
content-state story runs, plus the existing Catalog, Catalog Toggle and selected
empty complete-screen behavior. The remaining 29 complete-screen cases in each
mode are explicitly filtered; these focused receipts do not claim a full
repository catalog pass. Both package builds and publint pass as prerequisites.

Both use pinned image
`sha256:fdc27357ce0c4a115c0619df57aa55a63b69b22359d009d53619ac16ceab9034`,
Node 24.15.0, pnpm 10.34.5, four CPU/12 GiB memory and the same seven public
archives, including qualified Design Core `4af345c4`/archive `c77a3a83` and
Bits `a27be819`/archive `7b0fea71`. Full source and package admission remain
owned by the tooling intake; Catalog File Navigation and all other stories are
required in that full matrix. No source commit or publication is claimed here.

Reports and exact source/archive identities remain in this workspace's ignored
`.local/validation/runs/agent-ui-run-<UUID>/` directories. Final evidence-only
updates do not change the passing production or fixture bytes.

Final tooling intake includes these source regressions in the complete
1,944-case Storybook matrix, with zero fatal diagnostics or accessibility
failures. Final-source static/public-package and specification checks also pass.
The explicit composite qualification and remaining native/visual/registry gates
are recorded in `spec/records/2026-10-25-browser-readiness.md`; the original
aggregate's separate private browser timeout is retained as failed evidence.

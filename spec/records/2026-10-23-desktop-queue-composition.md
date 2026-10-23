# Desktop durable queue composition

Desktop acceptance exposed two shared presentation gaps: permission-only chrome
hid the host's durable queue composer, and captured reactive table context could
not cross recipient-resolution cloning.

- New public `queueWhileAwaitingApproval` retains the editor and exact permission
  controls for queue-capable hosts. The default fixed request panel is unchanged.
- Reactive submissions are snapshotted before recipient resolution and dispatch.
  Exact comment anchors and captured table context remain plain data.
- Host presentation initialization disables composer input/actions independently
  of loading the session list.
- Queue regression before: two failing Document/Classic cases with the composer
  absent. After correcting the fixture to scope the composer separately from
  read-only message readers, both pass and assert one explicit queued action.
- Captured table regression before: one failure at dispatch. A simple comment
  control passed; only nested table context reproduced the clone boundary.
- Exact final target: three pass (`Send Anchored Comment|Queued Permission`).
- Full units: 36 files, 210 pass. `pnpm check`: zero errors/warnings, formatting,
  ownership, documentation variations and source fingerprints pass.
- Both public package builds and publint pass. Full chat theme/width qualification
  continues independently of this focused commit; Desktop acceptance follows its
  archive refresh.

Visual review remains pending. No publication or baseline update is performed.

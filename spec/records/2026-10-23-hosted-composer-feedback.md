# Controller feedback with external chat presentation

Desktop's slash-command refusal exposed a shared composition defect: an external
presentation with no host error suppressed the shared controller's own refusal.
The draft and pending comments remained retained, but the reason was invisible.

- Exact regression: `pnpm exec vitest run --project storybook
packages/agent-ui/src/chat/transcript/AgentTranscript.stories.ts -t
'Hosted Refusal Feedback'`.
- Before: one failure, 14 unrelated stories skipped; no Composer feedback group.
- After: one pass, 14 skipped. One exact refused draft and attached red feedback
  remain visible in both Document and Classic.
- The production Transcript now merges the existing controller feedback helper
  after explicit host statuses. Error priority, unknown outcomes, stale-draft
  suppression and host wording retain their existing rules.
- The regression uses the complete production Chat screen, a real controller
  and a controlled external presentation whose status is deliberately empty.
  No consumer banner or CSS override supplies the missing message.

`pnpm check` passes with zero errors/warnings and all source fingerprints intact.
All 36 unit files / 210 tests pass. Both package builds/publint and all three
specification lanes pass. The complete chat foundation matrix passes 85 cases in
each theme/width mode (340 total); complete-screen qualification continues.

Desktop must refresh its verified public archive and prove its original slash
scenario after intake. Visual review remains pending; no baseline or publication
is performed.

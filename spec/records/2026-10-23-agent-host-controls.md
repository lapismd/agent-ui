# Complete chat host integration — 2026-10-23

AUI-SCREEN-001 and AUI-CHAT-001/002/003/004: JJ Desktop must use the complete
All Messages composition. The public snapshot can independently disable native
attachment, approval-policy and runtime controls while preserving the footer.
Omission preserves existing behavior. Host sending, persistence and permission
identities remain unchanged. Recipient projection was extracted into a private
helper to keep the presentation adapter within its existing file budget.

- Consumer reproduction: `pnpm exec playwright test tests/browser/project-chat.spec.ts --reporter=line`, initially 2 failures (missing view toggle and Projects section), then 2 passes after complete-screen adoption.
- `pnpm test:storybook catalog/AgentFlows.stories.ts catalog/AgentScreens.stories.ts -t 'Host Capabilities|All Messages'`: 8 interaction/accessibility passes across light/dark and desktop/narrow. These start fresh test servers.
- `pnpm exec vitest run --project unit tests/presentation-controllers.test.ts tests/agent-requests.test.ts tests/agent-references.test.ts`: 23 passes.
- `pnpm exec svelte-check --tsconfig tsconfig.json --fail-on-warnings`: 0 errors/warnings after correcting 4 testing-library option errors.
- `pnpm spec:validate`: passes after relocating the new requirement paragraph out of the atomic acceptance list.
- `pnpm check:source-layout`: 344 fingerprints verified; explicit disabled-state adaptations recorded; no geometry or baseline updates.
- `pnpm --filter @lapismd/agent-ui build`: Svelte package and publint pass.
- Root `pnpm check:architecture` retains 2 pre-existing failures: repository-branches.pw.ts (305 counted lines) and stack-workspace-presentation.pw.ts (315). Both counts reproduced from parent `0d141388`; those files are unchanged. The new adapter file-budget issue was fixed by extracting recipient projection. These are repository test-file ownership issues, not chat failures. No release/push is performed.

The enclosing Jujutsu change identifies this source slice. Host acceptance and
archive receipts are recorded in JJ Desktop. Visual review remains pending;
the broad final matrix and publication remain deferred.

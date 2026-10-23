# Lapis Desktop host presentation contracts

AUI-CHAT-001/002/003, AUI-SCREEN-001, AUI-LIFE-001, AUI-PARITY-001 and
RUI-DESKTOP-001 retain their source and native-authority boundaries. The user
approved complete shared-screen adoption in isolated Desktop/source workspaces.

The complete chat accepts a portable host presentation model and native-only
conversation menu. Host session selection awaits admission, retaining the prior
draft on refusal; snapshot drafts restore text, attachments and exact comment
threads. Reader/navigation hooks cannot replace controller submission guards.
Native execution, preferences, persistence and credentials remain host-owned.
Recorded screens accept actual capture groups and read-only transcript hooks;
production no longer synthesizes capture timestamps, profiles or version IDs.

- Session admission/refusal plus capture metadata tests: 3 passed.
- Exact same-file pin regression: 1 failure against the prior controller after heads advance; 1 pass after retaining the existing explicit pin. No assertion or timeout relaxed.
- Prior portable controller coverage: 8 passed; full source unit baseline: 205 passed.
- Prior log complete-screen interaction/axe matrix: 136 passed across both themes and widths after a cold process restart.
- API intake checks initially found manifest incompatibility; source owners now accept compatible Mira ranges. Their isolated evidence remains separate.

Fresh source check, package build and affected chat/recorded story qualification
follow this contract change. Native Desktop integration remains independently
qualified; visual baselines are unchanged.

- `pnpm check`: passes with 0 Svelte errors/warnings, source ledger and budgets intact.
- `pnpm spec:check`: all three lanes pass.
- `pnpm build`: both public packages pass packaging and publint.
- Exact `catalog/AgentScreens.stories.ts` cold retry: 32 interaction/axe passes. The initial fresh workspace dependency optimization caused one import-suite failure with no tests executed; rerunning the unchanged target passed.
- Host admission, capture and request tests: 16 passed; full updated unit and four-mode chat matrix remain running at this commit.

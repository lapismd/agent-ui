# Portable history qualification follow-up

AUI-GOV-003 and RUI-DESKTOP-001 retain their original contracts. Lapis Desktop
adoption has explicit user approval in a separate workspace. The new portable
controller export does not alter native authority or storage.

- `pnpm test --maxWorkers=2`: 34 files, 205 tests passed, 0 failed. The initial unbounded run was cancelled after dependency preparation.
- `pnpm check`: Svelte reported 0 errors and 0 warnings; architecture and 405 source fingerprints pass.
- Affected log stories: initial light/desktop import failed during dependency discovery (14 tests passed, 1 failed suite). A fresh process rerun exercises the completed workspace dependency installation in four modes.
- `pnpm spec:check` initially passed validation/mdBook but found one missing governance chapter mapping. This follow-up adds that canonical alignment; no check is disabled.

Native consumer acceptance and visual review remain separate.

# Shared settings framework — 2026-10-23

RUI-FORGE-001 and RUI-LIFE-001. First consumer authorization extends the review
boundary to reusable appearance/settings and JJ Desktop adoption.

Copied JJ Store palettes, theme preview, choices, card geometry and semantic
bindings. Adapted JJ Desktop's already isolated appearance ownership and theme
controls: no native services or glass. Public storage keys preserve existing host
preferences; previews are transient and listeners/root attributes are disposed.
Source fingerprints, license and adaptations are recorded in the layout ledger.

Validation:

- Initial `svelte-check`: 6 import/type errors; repaired, 0 errors/warnings.
- `pnpm exec vitest run --project unit tests/repository-appearance.test.ts`:
  4 passed (host namespaces, transient previews, modes, storage and disposal).
- Exact three settings story files via `pnpm test:storybook`: initial light
  desktop had 4 landmark-unique failures; distinct page naming repairs all 4.
  Rerun: 6/6 passed in each of light/dark × desktop/narrow (24 total), including
  interaction and accessibility checks.
- `pnpm spec:validate`, `pnpm check:source-layout`, package build and final types
  are checked before committing. Final broad qualification and visual baselines
  remain deferred under the section review workflow; no baseline was changed.

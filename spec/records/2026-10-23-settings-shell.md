# Settings in the AppShell — 2026-10-23

RUI-FORGE-001 now uses an embedded production AppShell body, standard toolbar
header and independently scrolling content. All three settings story families
share that component. Canvas uses the viewport; docs remain bounded to 40rem.
JJ Desktop receives the same composition through its public package archive.

- Exact regression: `pnpm test:storybook packages/repository-ui/src/jj/settings/settings-page/RepositorySettingsPage.stories.ts`. Before: 1 failed / 1 passed, missing AppShell body. After: 2 stories in 4 theme/viewport combinations, 8 passed.
- Other affected settings stories: appearance and settings-card, 16 interaction/accessibility passes. Total 24 passed, 0 failed.
- Svelte check: 0 errors, 0 warnings.
- Spec initially caught 5 acceptance bullets (limit 4); combined related host/native capability wording. Validation rerun before commit.
- Source fingerprints and Repository UI build/publint rerun before packaging.
- Browser reviewed the standard header and full-height body. Visual baseline remains pending; broad final matrix remains deferred until human review.

Follow-up: restored the missing 1rem body inset through the public
`--ui-repository-settings-padding` token, keeping the toolbar edge aligned.
Rechecked all three settings families after the padding change.
The source page uses a 1rem inset and extra room for its save bar; this portable
page uses the 1rem inset without a host save bar and removes the first-card
margin so the top inset is not doubled.

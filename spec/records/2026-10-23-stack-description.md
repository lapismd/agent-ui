# Expanded stack description styling

Requirements: RUI-STACK-001, RUI-HISTORY-001 and AUI-GOV-003. Visual-pending.

The stack card supplies native message-margin and Mira typography tokens so
expanded descriptions align with their file-card width and use 13px prose.
Its surface mixes 2% foreground into the theme background, yielding a subtle
off-white in light mode while retaining the dark theme. Three documented host
tokens control the margin, font size and surface. Ordinary JJ Log defaults stay
unchanged. Mira content styles are not overridden.

Before: the live Stacked Branches description measured 546.03px against a
570.03px file card, with 14px prose and 12px horizontal margins. After: both
cards measured 570.03px, prose was 13px, and the description surface resolved
to `color(srgb 0.982667 0.982667 0.982667)` in light mode.

The focused story now selects the long message and verifies the visible width
and typography. Its first four theme/viewport runs passed their assertions but
reported four ResizeObserver feedback notifications. The owning commit-message
measurement now defers its state update to an animation frame and cancels that
frame on teardown. The same expanded-message target then ran without those
notifications; existing revision-message cases retain their clamp behavior.

## Validation

- `pnpm test:storybook packages/repository-ui/src/jj/screens/stack-workspace/RepositoryStackWorkspace.stories.ts packages/repository-ui/src/jj/history/revisions/RepositoryRevisions.stories.ts --testNamePattern='Stacked Branches|Basic|Merge|Unavailable'`:
  six targeted stories passed in each light/dark desktop/narrow combination,
  24 checks, zero assertion/accessibility failures and zero resize warnings.
  Each invocation starts a fresh Vitest/Vite/browser run.
- `pnpm exec svelte-check --tsconfig tsconfig.json --fail-on-warnings`:
  zero errors and warnings.
- Repository UI package build and publint passed.
- `pnpm spec:validate`: 9 validators, 5 chapters and 23 requirements passed.
- Source ledger: 241 destination fingerprints and two changed layouts compared
  with their pinned source revisions and explicit adaptations.
- Changed-file Prettier check passed. Live review screenshot:
  `.local/stack-description-review.jpg`.

Full suites, downstream acceptance, static/package matrix and visual baselines
remain deferred until the final screen review. No dependencies or source
applications changed.

# Compact diff-status typography

RUI-HISTORY-001 / AUI-GOV-003. The unavailable preview inherited the collection's
monospace font and the standard Empty 18px heading. RepositoryDiff now scopes
the public Empty typography tokens to a 14px title and 13px description, with
the app's sans-serif font. Documented `--ui-repository-diff-status-*` variables
allow host styling. Code typography, Empty composition and icon are unchanged.
The source ledger records the exact adaptation; Desktop and Design Core remain
unchanged for this correction.

- Exact regression: `pnpm exec playwright test --config .local/live-chat.config.ts tests/jj-diff-surface.pw.ts -g 'unavailable previews'`: 2 failures before, with measured 18px titles, then 2 passes after. Both cases verify conflict and binary messages in the complete JJ/Op logs, title and description sizes and the same font as the column header.

- `pnpm exec vitest run --project storybook packages/repository-ui/src/jj/history/diff/RepositoryDiff.stories.ts`: all 6 interaction/accessibility cases passed.
- `pnpm exec svelte-check --tsconfig tsconfig.json --fail-on-warnings`: 0 errors, 0 warnings.
- `pnpm spec:check`: all 3 lanes passed, including token defaults and documented family structure.
- Source-layout comparison: 197 fingerprints and 142 original layouts matched; architecture and changed-file formatting checks passed.
- The open AllInOne page was refreshed and the conflicted file selected. Review screenshot: `.local/review/diff-status-typography.png`.

Only focused checks run; broader suites remain deferred for final screen review.
No visual baseline was changed.

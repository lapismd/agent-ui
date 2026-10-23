# Explicit file-history pin — 2026-10-23

First-consumer acceptance exposed a missing RUI-LIFE-001 input. `follow(path)`
could only open latest before the host called `refresh(operation)`. Added the
optional operation argument; existing live-follow behavior is unchanged.

`pnpm exec vitest run --project unit tests/jj-history-controllers.test.ts`:
before, 1 failed / 7 passed (native heads advanced); after, 8 passed. Svelte check: 0 errors/warnings. Spec: 9 validators, 5 chapters, 23 requirements.
Repository UI build/publint passed. File-history stories: 5 stories across
light/dark and desktop/narrow, 20 interaction/accessibility passes. Source ledger:
344 fingerprints passed.
Visual review and the final broad package matrix remain pending.

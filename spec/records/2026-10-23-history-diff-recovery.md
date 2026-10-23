# Independent diff retry feedback

Desktop's `Read Failure Retains Pin` consumer story exposed a retained host
notification after a successful independent diff retry. The shared controller
now acknowledges recovery only for a confirmed diff in its live lifetime.
Stale or closed results remain unable to clear feedback.

- Before: `pnpm exec vitest run --project unit tests/jj-history-controllers.test.ts -t 'retrying a failed independent diff read'` failed once; nine tests skipped.
- After: the exact regression and `tests/diff-collection.test.ts` passed all 12 tests.
- `pnpm check`: pass, zero type errors or warnings, source fingerprints current.
- `pnpm build`: both packages pass build and publint.
- The consumer reproduction is rerun after refreshing the public archive.
- Visual baselines are unchanged. This local source fix does not publish packages.

# Op Log portability review

The user authorized the two pending presentation corrections first, followed by
the approved Op Log slice. Work uses targeted checks and separate verified
commits; broad suites and downstream changes are outside this review.

## Presentation correction

RUI-HISTORY-001 now keeps the shared limit notice outside the complete JJ Log's
scrolling body. Standalone Revisions retain the same notice by default. Long
recorded operation commands reuse the commit-message disclosure pattern with a
nine-rem preview, exact text, accessible expansion state and selection reset.
The private notice belongs to the Revisions documentation/token family.

- Exact before target: `pnpm exec playwright test --config .local/live-chat.config.ts tests/jj-log-parity.pw.ts -g 'Op Log metadata|graph and changed-file paging'`: two failures (missing disclosure and a 284px bottom gap).
- The identical after target passed both cases, including footer geometry before
  and after scrolling, expansion/collapse and unchanged captured command text.
- Strict types: zero errors/warnings; repository-ui build and publint passed.
- Two selected Storybook interaction/accessibility cases passed; 14 unselected.
- Spec validation: nine validators, five chapters, 22 requirements; spec-first:
  11 protected files / two chapters; source ledger: 193 fingerprints and 140
  original layouts verified.

Filename/icon consolidation is already committed by the other agent; this work
does not modify its components or dependency setup. Source applications remain
unchanged and stories remain visual-pending.

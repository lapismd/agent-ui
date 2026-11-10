# Collapsed unavailable checks in catalog audits

Requirements: RUI-FORGE-001 and AUI-GOV-002.

Hosted run 42920657058 on d2678786031ddcbbaab0e4061b9127632032af11
passed governance, quality, units, package, static and complete Storybook
interaction/accessibility checks. Browser acceptance had 149 passes and two
failures: the shared Unavailable-content audit and the Empty/Unavailable icon
audit expected the reviewed collapsed checks body to be visible immediately.
Affected stories were jj-forge-checks--unavailable and
jj-forge-pull-request--checks-unavailable. This is a test-flow correction;
the production disclosure default remains collapsed as requested.

The exact local command reproduced both failures before editing:

```sh
AGENT_UI_VALIDATION_RUNTIME=native pnpm test:browser \
  tests/content-states.pw.ts tests/jj-review.pw.ts \
  --grep 'Every Unavailable story|Every Empty and Unavailable story'
```

Both audits now assert aria-expanded=false on the public Expand checks control,
open it and retain the existing visible public Empty/icon assertion. Neither
story is excluded; no selector, timeout, retry or product assertion is weakened.
The exact cold rerun passed both tests (1.3 minutes), from two failures to zero.
The owning pnpm check (types, format, architecture, source fingerprints and
catalog composition) and pnpm spec:check also pass under Node 24.15.0.
Complete browser-suite hosted qualification remains required before release.
No runtime or published API changes occur here.

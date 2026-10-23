# JJ Store settings rows — 2026-10-23

RUI-FORGE-001 and RUI-FOUND-001: port `StoreReadOnlyRow.svelte` from JJ Store
into public `RepositoryReadOnlyRow`. Preserve its original markup, compact and
stacked CSS, exact-value copy, independent open callback, unavailable behavior
and stale feedback invalidation. Imports move to the existing shared settings
helpers; two audited inset tokens retain the original defaults. The source
ledger records the exact source revision and hashes and compares original layout
before recording its fingerprint.

The Settings page Basic example now uses that primitive for repository identity,
folder path/open/copy and collaboration storage. These are the first consumer's
actual cases, previously absent from Storybook. Hosts retain folder admission
and persistence; there are no native calls in the catalog or shared package.

Verification:

- First-consumer regression before adoption: 3 failed, 0 passed (missing copy
  control, missing version footer and generic rather than source hover tint).
- The new row, Settings page and Settings card story families initially passed
  40 interaction/accessibility cases across light/dark and desktop/narrow.
- Final `pnpm test:storybook packages/repository-ui/src/jj/settings`: all four
  directly affected settings families pass, 48 cases and 0 failures.
- `pnpm test:browser tests/catalog-browser.pw.ts --grep 'Settings page includes'`:
  1 cold browser test passed at both 1280 and 420 pixels, including keyboard copy,
  exact text, separate open focus, compact icon geometry and no row overflow.
- Svelte check caught 8 unsupported Testing Library `exact` role options; those
  were removed without changing exact string-name matching. Rerun: 0 errors,
  0 warnings.
- Specification check caught missing styling documentation/tokens and a compound
  acceptance sentence; added source-faithful optional tokens and corrected the
  docs. `pnpm spec:validate`: 9 validators, 5 chapters, 26 requirements pass.
- Architecture and 412 source fingerprints pass. Repository UI package build
  and publint pass.
- Clean archive acceptance initially rejected a computed Styling example; it
  now uses a complete public-import literal. Rerun with the documented local
  dependency overlay passes type checking and Vite consumption of 144 examples.

The enclosing change owns the evidence revision. Full source/browser/package
qualification remains separately tracked; visual review is pending and no
baselines changed. Native profile, agent/session and header integration are
separate slices.

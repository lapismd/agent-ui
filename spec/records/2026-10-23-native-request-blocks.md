# Native captured request block normalization

Desktop's completed permission was correctly labelled but expanded as Markdown
because its original captured block used that format. The typed request result
must select the shared read-only card without rewriting captured source.

- Exact target: `pnpm exec vitest run --project unit tests/agent-requests.test.ts
-t 'captured permission results select'`.
- Before: one failure and 13 skipped; the typed result retained Markdown kind.
- After: the complete owning file passes all 14 cases. Original custom-block
  arrays retain identity; Markdown blocks get a shallow kind-only copy, preserving
  text, ID, revision and the original host object.
- The initial source check rejected an extra acceptance bullet. The requirement
  moved into the owning contract prose; no validation rule was relaxed.

Whole source `pnpm check` passes with zero diagnostics/warnings, formatting,
architecture and 405 verified source fingerprints. `pnpm test` passes all 211
tests in 36 files; `pnpm build` and both publint checks pass; `pnpm spec:check`
passes all three lanes. Request acknowledgement fixtures now capture Markdown
blocks like the native host. The affected complete-screen Requests cases pass
four tests in each viewport/theme mode (16 passes). The complete Agent screens
then pass all 32 scenarios in each mode (128 interaction/accessibility passes).

Desktop's original captured-permission browser acceptance follows archive intake.
Native/visual gates and package publication remain separate.

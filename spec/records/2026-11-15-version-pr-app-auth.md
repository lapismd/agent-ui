# Version PR App authentication

Revision: enclosing Jujutsu change.

## Contract and review

AUI-GOV-005 version PR writes now use the existing dependency App only on canonical
main, scoped to this repository with contents and pull-request write permissions.
Missing credentials fail closed and checkout retains no credentials. The workflow
token remains read-only except existing actions-write dispatch authority where
needed. Existing publisher, dispatch, native and signature gates are preserved;
Changesets does not directly create GitHub releases. No package version changes.

## Verification

- Exact parsed auth regression: 2 failures before the workflow change; three
  passes afterward. Coverage includes canonical admission, scope, absent fallback,
  checkout credentials, API commits, pins and publisher/dispatch token separation.
- `AGENT_UI_VALIDATION_RUNTIME=native pnpm spec:check`, `pnpm check`,
  `pnpm test -- --maxWorkers=1 --no-file-parallelism`, and `pnpm build`: passed.
- Full unit suite: 237 passes; Node tooling: 33 passes; targeted diagnostic/
  composition checks: 12 passes. Both package builds and publint passed.
- Pinned actionlint and normal workflow-check lane: passed.

## Remaining acceptance

Hosted generated-candidate acceptance, browser/catalog/native acceptance and
actual publication remain separate gates. No UI or visual baseline changed.

Next action: review the protected source PR and qualify the next eligible
App-created version candidate. Do not manufacture a version bump or merge it
without its existing review and functional gates.

# Refresh lockfile for published jj-history

Date: 2026-10-29  
Revision: enclosing Jujutsu change on `fix/jj-history-lockfile`

## Scope

GitHub Actions `check.yml` failed on `pnpm install --frozen-lockfile` after
`lapismd/agent-ui` main landed at `0e549ebc`. Root and
`packages/repository-ui` already declare `@lapismd/jj-history@^0.1.0`, but the
committed lockfile omitted that specifier while the package was unpublished.

## Validation

```shell
npm view @lapismd/jj-history version
# 0.1.0

pnpm install
pnpm install --frozen-lockfile
```

Frozen install succeeds with `@lapismd/jj-history@0.1.0` resolved from the
registry.

## Contract

Unchanged. No production source change; lockfile intake of the published
`@lapismd/jj-history@0.1.0` only.

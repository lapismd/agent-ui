# Local validation

Portable root validation defaults to bounded Docker workers: `pnpm check`,
`pnpm test`, `pnpm build`, `pnpm test:storybook`, `pnpm test:browser`,
`pnpm test:package` and all specification checks. `pnpm checks` runs the complete
nonvisual matrix in one worker. Docker failure fails the command; it never
falls back to the host.

The tool-only image pins pnpm, Playwright, Jujutsu, mdBook and actionlint.
Workers receive the exact Jujutsu source revision and ancestry through a
checksum-verified immutable object pack. The current source and its transferred
history reject private state, credentials, caches and model artifacts. The
tracked port-only `.env.storybook.local.example` is checked against its exact
public schema in every transferred historical blob. Nothing mounts the local
checkout, Docker socket, home, vaults or provider data.

## Configuration and resource bounds

An ignored `.local/validation/config.json` may select a Docker context and
transport; default limits are four CPUs, 12 GiB memory and 2 GiB shared memory:

```json
{
  "context": "omarchy",
  "transport": "ssh-cli",
  "cpus": 4,
  "memoryGiB": 12,
  "shmGiB": 2
}
```

`AGENT_UI_VALIDATION_CONTEXT` selects a context and
`AGENT_UI_VALIDATION_RUNTIME=native` explicitly runs the same portable lane
locally. `pnpm validation:doctor` reports configuration; `pnpm validation:images`
prepares the tool image. Live Storybook, format writing, Changesets and the docs
server stay native. `test:source-parity` also remains native because its reference
harness imports the independently owned Desktop checkout; it is an explicit
source-comparison gate, not portable acceptance.

A worker uses an init reaper and drops all Linux capabilities. Its smoke gate
proves denied reads and writes against a mode-zero directory. A per-checkout
lease serializes that checkout; independent checkouts may run within the shared
machine budget. Dependency cache keys use lockfile, tool identity, architecture
and archive checksums; script-only edits do not force dependency reinstalls.
There is no native/Cargo cache in this UI-only runner.

## Public archive qualification

Ordinary installs use the registry lock with `--frozen-lockfile`. The unpublished
`@lapismd/jj-history` prerequisite currently prevents claiming that gate. A
separate ignored archive inventory may supply verified public tarballs through
`AGENT_UI_VALIDATION_ARCHIVES` or the config's `archives` path. Each entry names
`name`, `version`, `path` and `sha256`; provenance may be retained alongside them.
The runner verifies checksum, identity and safe archive members. It projects
those packages only inside the worker and restores tracked package/lock bytes
before checks. Packed external examples use the same explicit public archives.
Record that acceptance separately from a frozen-registry pass. Published
manifests and lockfiles must continue using registry ranges.

## Guards and reports

Story composition is checked against production component ownership, including
actual render roots; unused imports or a fake replacement cannot qualify.
Every Svelte runtime diagnostic is retained with its origin stack and fails at
post-test/teardown checkpoints, allowing cleanup to finish. Storybook runs both
themes and desktop/narrow viewports; zero selected tests fail focused runs.
All checks preserve accessibility errors and visual-pending metadata.
Complete catalogs use four sequential native Vitest shards for each theme and
viewport, starting a fresh browser for each shard. Focused file/name/shard
arguments remain unchanged and run in all four modes. Retained reports reject
zero executed cases, duplicate shard cases, incomplete modes and different
case identities between modes. Shards do not retry failures.

Reports and console output remain under `.local/validation/runs/<run>`.
`pnpm validation collect <run>` retrieves a completed owned worker. Failed workers
remain available until `pnpm validation:clean -- --apply` collects and removes
only terminal workers owned by this checkout. Unknown, prepared, paused or
active workers retain their lease. No global prune runs. Native host integration,
source parity, visual approval, publication and installed-app replacement remain
separate gates; this runner does not claim them.

## Hosted verification

GitHub verification runs these lanes through Turbo on separate runners.
`pnpm test:storybook` and `pnpm test:browser` run at the same time there:
Vitest uses browser API port 63315, and the catalog browser binds Storybook to
port 7498. `pnpm storybook:check` keeps them sequential inside the one bounded
worker, which shares `node_modules/.vite`. `pnpm spec:check` remains mandatory
and uncached. See AUI-GOV-004.

# Agent UI supported portable tooling

## Exact baseline

The clean source baseline is main
`48435a193aadb906006800f36858fd33d8e278de`, after the normal UI version PR39.
Canonical hosted verification43786455704, version preparation43786455660 and
Pages43786455687 succeeded at that source. The public package versions are
Agent UI0.2.8 and Repository UI0.2.6. Existing archived research remains
historical evidence, not a whole-recipe proof.

A fresh exact-source Node24/pnpm10.34.5 full audit exits1 with7 findings:
2CRITICAL/2HIGH on Storybook/addon-vitest10.5.7,2MODERATE on
@vitest/mocker4.1.11,1unfixed LOW on deepmerge4.3.1. Production audit already
exits0 with no findings; this is not a production security repair claim.
No audit exception or finding suppression is introduced.

## Source-owned fix

Official npm metadata re-read on November16 identifies Storybook10.6.7 as latest
stable and Vitest4.1.12 as maintained V4 (latest Vitest5.1.0 is not adopted).
Their published peer contracts support the existing Vite8.3.5/Svelte plugin7.3.1
and Node24 cohort. Sources: [Storybook10.6](https://storybook.js.org/releases/10.6),
[Storybook metadata](https://registry.npmjs.org/storybook),
[Svelte framework metadata](https://registry.npmjs.org/@storybook%2fsvelte-vite),
[Vitest metadata](https://registry.npmjs.org/vitest).

The compatible patch update aligns all existing Storybook packages10.6.7,
Vitest/browser/browser-playwright4.1.12. An explicit browser development peer
keeps the maintained V4 cohort instead of allowing the addon's broad peer range
to select a new major. CLI2.31.1, pnpm10.34.5, Vite8.3.5, Svelte plugin7.3.1,
the public package contracts and the complete direct version command/config
are unchanged. No first-party override, implementation copy, alias, wrapper,
node_modules patch, new release intent or product behavior change is added.
The previously authorized exact Bits UI2.20.2 patch remains byte-identical.

The exact narrow command is `pnpm exec vitest run --project unit tests/dependency-security.test.ts` on Node24.19.0. Raw audit commands are `pnpm audit --json` and `pnpm audit --prod --json`.

Two meaningful regressions fail2/2 before the dependency update and pass2/2
with the updated real lock. They inspect the supported aligned declared cohort
and actual locked Storybook/mocker advisory ranges. No assertion or diagnostic
is weakened. The final default Docker qualification below completes functional, catalog,
browser, packed-package and static gates for this fixed graph.

## Independent recipe and audit boundaries

The version action uses the actual direct `pnpm exec changeset version`
command and CLI2.31.1, without a root release:version script. The shared harness
and runtime guard need an upstream direct-command representation rather than a
consumer wrapper or script added to fit them. Root owns that shared source;
this repository will provide an immutable case/profile proposal after graph
qualification. No guard adoption precedes actual whole-recipe proof.

The existing current source has no pending release note. A proven genuine
historical note may be restored exclusively inside the existing disposable
qualification fence, explicitly historical/currentReleaseIntent=false. No
synthetic source Changeset or publication intent is permitted for a tooling-only
fix. The exact note source, hashes, expected independent package mutations and
stable recipe inputs remain required proof data.

The remaining deepmerge path is a development build-tool exposure, not declared
runtime shipping content. The precise advisory is
[GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4),
`.>@sveltejs/vite-plugin-svelte>deepmerge`,4.3.1, LOW, vulnerable

> =4.2.0 <=4.3.1, with no patched release. It remains visible and blocking for
> advisory admission. No Docs/coordinator/Visual Delta decision transfers here.
> Source-green and a clean production audit do not make the full audit clean or
> qualify arbitrary recipes as Deno-free. Deno-only/frozen boundaries remain
> excluded and no Deno prerequisite is added, removed or bypassed.

## Complete default-runtime qualification

The exact source-owned `pnpm checks` command passed in the existing default
Docker fence, worker `agent-ui-run-188acce0-a99c-4adf-bada-cdb17a25032d`, from
2026-11-16T08:56:23.675Z to2026-11-16T09:22:04.467Z. One immutable snapshot
`540c9cfb8176a406b4e3086b6e113c27a8362d90` retained parent
`48435a193aadb906006800f36858fd33d8e278de` and all1246 source-file hashes.
Pack SHA256 is
`04c052583b0404a7d233e926fd6d95b894fb6554d3271ef927b1aa30ffb795c6`;
no archive overlay or local review hook was active. Resource bounds remained
4CPUs/12GiB memory/2GiB shared memory, init reaper and no Linux capabilities.
The original smoke proves actual permission denial and exact source/ancestry.

The existing image derives from public Lapis CI digest
`sha256:91341a81cc9306eed818c4c433cd29ed11d2ea64c703f32685391befe0eca503`.
Its local derived ID is
`sha256:fdc27357ce0c4a115c0619df57aa55a63b69b22359d009d53619ac16ceab9034`.
Observed tools are Node24.15.0, pnpm10.34.5, mdBook0.5.4 and actionlint1.7.12.
The existing Playwright1.61.1 package/image contract selects Chromium149.0.7827.55
revision1228. No image source, browser version, launch flag, assertion, timeout,
runner behavior or toolchain version changed for isolation.

The complete interaction/accessibility matrix passes503 cases in each of
light/desktop, light/narrow, dark/desktop and dark/narrow:2012 total, across all
16 required fresh-browser shards. Each mode uses113+126+152+112 cases; the
existing identity/coverage checker rejects missing or duplicate cases. The same
worker then passes the complete151 browser journeys in11.8minutes, without any
failed/retried/flaky markers. That canonical config covers all26 registered
browser files, including configured-agent narrow geometry, complete chat,
all documented JJ foundation pages, independent history/operations/diff panes,
files/branches/stacks/workspace, production content states and both themes
where their contracts require them. No focused subset stands for that full lane.

All239 unit cases,34 validation controls and the12-case diagnostic subset pass.
Both public packages build and pass publint. Source check reports0 Svelte
errors/0 warnings, architecture budgets,424 source fingerprints and mandatory
format checks pass. Cold static Storybook audits68 documented families,
420 foundation variations and5 specification chapters; visual-pending remains.
Clean packed-public type/Vite acceptance compiles154 documented examples with
the same checksum-bound approved Bits UI patch and all3 runtime postimages.
Three spec lanes, mapped source-first, workflow actionlint and all3 existing
version-auth controls pass. The retained report archive SHA256 is
`49ae9fad7d762d46c85e6a5a074bd0564676a78c6eb254aa33cca5b2826e7cc2`.
Local semantic QMD search works; doctor passes10 checks with the existing
wrapper-alias warning. No public package version or runtime source changed.

## Retained native failures and isolation limits

Earlier native debug attempts are not erased or called product fixes. The first
full interaction attempt stops in its first shard with111 passing tests and
one RepositoryShell suite failing before its2 tests on a dynamic import; no
HTTP failure payload was captured in that attempt. A fresh exact target passes
2/2, and the original ordered shard passes18 files/113 tests with HAR/trace and
Vite optimizer evidence plus an identified checkout-owned listener. There is
no late reoptimization. Its29 HTTP failures are the intentional typed avatar
URL prefixes (5local404 and24 invalid-domain DNS failures), not module imports.
All source hashes stay fixed; assertions remain unchanged.

The first native full browser run passes149/151. JJ docs and Stacks navigation
fail with explicit Chromium `net::ERR_NETWORK_CHANGED` on loopback module
requests; the latter then reaches its existing30-second readiness timeout.
Bounded journal observations record host veth/carrier/Docker bridge events
within that run window. Association with unrelated worker lifecycle events is
an inference, not an established cause, and does not prove a product defect.
Only event categories/timestamps are retained; no private network coordinates.

The changed validation condition is use of the repository's already-required
isolated Docker namespace and frozen snapshot, not an assertion, retry, timeout,
error-filter, network flag or product/config adaptation. The complete required
2012+151 gates pass there. Native failures remain provenance of debug attempts;
they are not waived as pre-existing or hidden through the later pass. The
initial new governance section also failed one required Acceptance-details
check; adding its required subsection repaired that specification error before
final qualification, without weakening the checker.

## Remaining work

The final raw source full audit exits1 with exactly one LOW, versus7 before;
production remains0 before and after. The six fixable findings are removed.
Official deepmerge metadata still reports latest4.3.1; no patched version is
available. No active acceptance or blanket waiver is added for the remaining
build-tool exposure, and the full audit is not clean.

This qualifies the source tooling slice, not direct-command runtime guard
adoption. The disabled upstream proposal must be rebound to the final immutable
PR head and preserve the exact actual caller ABI. The shared owner must first
add the literal allowlisted direct command with meaningful positive/negative
regressions, then run the genuine current-graph/historical-note whole recipe
in its existing disposable fence. Every unsupported argv/mode remains closed.
Only successful proof may authorize a separately verified source guard step
before the existing writer App mint. Publication, native host adoption, visual
review and any new exact advisory decision remain separate gates.

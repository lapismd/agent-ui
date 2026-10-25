# Docker-first Agent UI validation

## Scope

Agent UI and Repository UI portable tooling receive the qualified bounded-worker
pattern from Lapis Terminal, adapted for this UI-only pnpm workspace. Product
controllers, screen contracts, host policy and native execution are unchanged.

## Before and after

- Initial exact `node --test scripts/validation.test.mjs`: one failure because
  the required Docker model/runner did not exist. The exact target now passes
  ten runner/archive/zero-case cases with Node 24.10.0.
- Fresh registry lookup `pnpm view @lapismd/jj-history version --json`: npm 404.
  This existing unpublished prerequisite prevents a frozen-registry claim.
- Exact original-runtime regression: two failures/four passes. Cleanup could
  not complete and disposal overwrote a later console wrapper. The repaired
  local tooling target passes all six cases. Docker guard run
  `8643ad05-1e65-4faf-b9b6-4018579b23fa` also passes ten Node and twelve Vitest
  tooling cases, including the complete six-case runtime target.
- Docker smoke `eff7d8a6-9141-4671-b082-f6e5bbed2ed0` passes ten tooling cases,
  actual mode-zero denied reads/writes, reaper/capability assertions and headless
  Chromium. Exact source/ancestry and six checksum-qualified public archives
  were admitted. Prior run `13470912` failed at the known jj-history 404 before its
  archive was supplied; no frozen-registry acceptance is claimed.
- The source guard refused a temporary local tooling node_modules symlink before
  transfer. It was removed; it never entered a worker. Archive qualification and
  tracked package/lock bytes remain distinct.
- CLI composition guard development initially found 48, 52 and 1 unresolved parser
  cases; fixes distinguish own repository paths, public barrel exports, dynamic
  production icons, inherited roots and local/shorthand render factories. No
  product source, assertions, threshold or diagnostic policy was relaxed.
- Docker guard run `c06e91d1-97ec-4a96-887c-e2a8d7de4369` passes ten Node
  cases, 11 Vitest cases and all 69 registered production-composition families.
- First complete candidate gate `62c501f0-b5d6-46dc-b7e3-0d251a6585e8` passes
  strict types/format/spec, 233 unit cases and 483 of 484 light-desktop stories.
  Reference Picker/Recovery immediately asserted visibility while recovered
  virtual rows painted. The exact original-target retry passes in all four
  modes, recording the intermittent failure rather than treating retry as repair.
  The story now waits for the same visible row, then exercises Escape dismissal.
- Complete catalog, browser, static, packed-consumer and final canonical gates
  remain pending.

## Qualification boundary

Ordinary registry installs retain frozen mode. Any public archive validation
must name exact source/version/checksum and preserve tracked manifests/lockfile.
The tool image and UI dependency cache are separate; no Rust cache is coupled to
frontend input changes. Defaults are four CPUs, 12 GiB memory, 2 GiB shared memory,
init reaper, no capabilities and an actual mode-zero read/write-denial check.
Both light/dark and desktop/narrow Storybook runs remain required, with
post-teardown fatal diagnostics and no zero-selected acceptance.

Native source parity imports the separate Desktop checkout and remains an
explicit host lane. Native host behavior, visual review, publication and
installed-app replacement are not qualified by portable Docker success.

## Batched ready-state audit

The second complete run `7c844ccc-98a7-4f93-95c5-313403c52e15` passes 234 unit
cases and 422 light-desktop stories before Projects/Reviews fails on an immediate
post-search responsive-tab assertion. One browser RPC disconnect separately
interrupts remaining files; container `OOMKilled` is false, so no OOM conclusion
is claimed. The exact original Reviews retry `114692db-1f4d-4aa9-8584-583f249b9c72`
passes in all four modes, confirming intermittent readiness rather than repair.

A source-wide audit covers all 69 registered families, 36 Escape/retry/focus/tab
interaction points and their imported browser/layout helpers. The focused
repair waits for the same existing ready states: restored Tasks/Reviews tabs,
search/picker focus restoration, recovered virtual rows, exact picker selection,
responsive tab paint before activation, and visible overflow-menu items. Existing
focus waits and ordinary nonvirtual read assertions remain unchanged. No global
timeout, assertion threshold, failure policy or production markup changes.
The local inventory is `.local/validation/readiness-inventory.json`; four owning
families and the Projects layout helper form the focused browser surface.

The complete focused batch `8babd1bd-e63c-4e47-b0fb-86c055994331` passes all
48 cases in each of light/dark and desktop/narrow modes: 192 passes, zero
functional, accessibility or fatal diagnostic failures. The next aggregate
qualification waits for the finalized shared Bits, Mira and Notes archive cohort.

## Final dependency cohort

The final source cohort admits seven checksum-qualified public archives:
Design Core committed source `8318eb6d` with audited package checksum `567f022a`;
Mira committed source `fd2bcd15` with core checksum `85d80be3` and three built
companions; Bits UI source `a27be819` with checksum `7b0fea71`; and the unchanged
jj-history public package `94bae0ae`, equivalent to committed source `4e74e423`.
Full identities and receipts remain in ignored
`.local/validation/final-source-cohort-receipt.json`.

No Notes package is declared by the root or either public package, so this
aggregate can run independently of the separate Notes API/UI archive refresh.
The Notes cold twenty-five-case consumer run passes with the same DC, Mira and
Bits inputs. Source qualification, this UI consumer gate, registry availability,
publication and native host acceptance remain distinct. In particular, Bits is
a temporary source archive, and jj-history's registry 404 is not waived.

The first final-cohort aggregate `6845af9b-d951-4b06-8a37-979f203f0aa0`
stops at one architecture finding: the added ready-state waits take the Projects
story to 408 counted lines against its unchanged 400-line limit. The exact
`node scripts/architecture.mjs` target reproduces that failure. Its existing
Reviews play is moved without changing assertions into the feature-owned
`catalog/jj/support/projects-reviews-play.ts`; the story keeps its render and
delegates the play. Exact architecture and the four-family browser batch are
rerun before any further aggregate. The separate Tasks consumer has uncovered
an upstream Swipe Item post-action lifetime defect; the next full cohort waits
for its source repair rather than spending another broad retry on known input.
The exact architecture target now reports zero findings. The four-family cold
batch `84834835-f2e6-4628-8fd2-204a5294448a` passes all 192 cases on the
admitted seven-archive source cohort. Its discovery initially waited for the
expired SSH master, then advanced and completed normally; no duplicate worker
was started or active worker interrupted. Subsequent calls use the task-owned
shared master through ignored configuration, leaving global SSH settings intact.

## Swipe repair cohort and browser transport diagnosis

The next aggregate `1add80d3-c38e-47c3-b554-3c03a798b14c` admits Design
Core archive `c77a3a83` from package-audit source
`f2971304d7e82c9cb67051cf1ec13f4774116e90`. Exact Swipe Item, family and
pointer checks plus its clean public-archive audit pass; its complete source
gate remains independent. Other six archive bytes are unchanged.

This aggregate passes all 234 unit cases and 442 light-desktop stories before
the Vitest browser connection closes while opening RepositoryStackLane. It
reports one unhandled transport error and cannot qualify the complete catalog.
No failing story assertion or accessibility result precedes that error. Docker
reports `OOMKilled=false`; retained Docker events and the bounded remote kernel
journal contain no OOM, Chromium crash, kill or trap event. Dependency optimization
runs only at startup, without a later reload in the retained console. A source
audit finds no page-close, location-navigation or page-unload calls. These facts
do not establish the cause or waive runtime teardown checks.

The failed run's archive checksum is correct, but its ignored input inventory
carried the previous Design Core source descriptor. That immutable result is
retained. The corrected source identity and explicit correction are recorded in
`final-source-cohort-receipt.json`; subsequent inventories carry the audited
source above. No original build head or complete source pass is invented.

An ignored diagnostic launcher is prepared to retain Playwright browser process
logs and cgroup memory events/peak for the next exact reproduction. It changes
only the staged diagnostic bootstrap. Browser batching, production source,
assertions and fatal-diagnostic policy remain unchanged pending that diagnosis.

Design Core subsequently passes complete source run `acf23771` and commits
`4af345c4`; its owner verifies all 1,557 public source inputs equal the audited
`c77a3a83` archive. Later inventories bind that committed-equivalent source.
The exact Stack Lane diagnostic `e9c5b2b9` passes all seven cases in each of the
four modes: 28 passes, zero fatal or accessibility failures. Browser processes
exit normally; cgroup counters show zero OOM events and a 4.26 GB memory peak
against the 12 GiB limit. This isolated pass does not establish the earlier
disconnect's cause. The original complete unsharded catalog now runs with the
same diagnostic capture before any batching change is considered.

The unsharded diagnostic `e5bba002` passes 484 light-desktop and 459 light-narrow
cases before transport closes at Commit Picker. The complete light/narrow-only
observer run `fde2bdd1` passes 461 cases before the same error at Appearance.
Different failing entrypoints, zero preceding assertions/axe/fatal diagnostics,
normal Chrome exit, zero cgroup OOM/max events and a 6.79 GB peak do not identify
a product cause. The first observer executes in tester frames and captures no
orchestrator close caller; it does not establish a close code for that failure.

The complete keyboard-source audit finds no Control/Meta+W or native tab-close
shortcut in catalog helpers. The subsequent context-wide observer also records
page/context close/crash events, WebSocket lifecycle and explicit close callers.
Exact Appearance run `dd0d75d4` passes all eight cases across the four modes;
page/context closes are normal Vitest teardown after reports, with browser exit
zero. This isolated pass does not retrospectively explain the full-run failure.

The controlled infrastructure change uses four sequential native Vitest shards
per mode, each with a fresh browser, preserving all 484 cases in each of the
four modes. Focused selectors are forwarded unchanged. New source tests retain
all native shard arguments and verify report identities, rejecting duplicate
cases, incomplete matrices and cross-mode selection drift. The 12 Node tooling
tests pass. Complete canonical qualification of the changed runner remains open;
no failure is retried, suppressed or accepted as a passing catalog.

The first canonical sharded aggregate `1d1b39ab` passes source/type/format checks,
the 12 Node infrastructure tests, 12 focused runtime/composition tests and all
234 repository unit cases. Its complete light-desktop matrix passes all 484
cases across shards 111/116/148/109; the first light-narrow shard passes 111.
The parent then cancels the owned Storybook orchestrator to prioritize the newly
reported source Catalog error/readiness regression. The source worker records
failure, retains reports, and exits; `cancelled.json` explicitly excludes full
qualification. The later modes, browser/static, package and final spec/workflow
lanes remain pending against the integrated repair. Partial passes do not stand
for the required 1,936-case catalog.

The integrated Catalog alert repair adds two source regression stories, so the
final matrix contains 486 cases per mode. Integration preflight catches one
non-atomic acceptance bullet (`32c7a28b`), then its six-bullet count (`7f5f2f5f`),
and two new Catalog story type annotations bound to the other fixture
(`5a0ecbc4`). The final acceptance clause stays one sentence and four total
bullets; each new story uses its actual fixture's typed StoryObj. No product
assertion, runtime fixture behavior or role repair is weakened. Exact spec
regression `b98c9e07` and complete source/type/format check `94278f2a` then pass.
Integrated aggregate `1e03663c` passes all 234 units and the complete 1,944-case
matrix without RPC loss, fatal Svelte diagnostics or accessibility failures.
The subsequent browser lane has 146 passes and five failures; it correctly stops
before static, public-package and final spec/workflow gates. Op Log/JJ repairs
pass their exact four-case cold target (`08b7a090`), source/type/format
(`355487c8`) and full specification (`034b39ae`) checks. The independent
Branches content-fit defect belongs to Design Core. Detailed before/after
evidence is in `spec/records/2026-10-25-browser-readiness.md`; complete final
dependency-cohort qualification remains pending.

## Final qualified portable scope

The final cohort substitutes Design Core content-fit archive `14806b99` from
package source `20119562`; the other six dependency archives remain unchanged.
Full aggregate `7438e80b` passes 234 units and all 1,944 Storybook cases, then
finishes its browser lane with 150 passes and one private Classic reference
navigation timeout. Exact and complete seven-case follow-ups pass after adding
only the real document-start keyboard action. Every assertion and timeout stays
unchanged, and the original aggregate remains failed.

Final source/type/format, units/tooling, static catalog, clean packed consumer,
full specification and workflow lanes pass on the repaired source. Normal final
packing preserves all 333 Agent UI and 699 Repository UI public files byte for
byte, retaining consumer archive SHA prefixes `f9fff47b` and `34388594`.
The exact commands, immutable run identities and input-equality proof are in
`spec/records/2026-10-25-browser-readiness.md`. The ignored machine receipt is
`.local/validation/composite-qualification.json`; it explicitly records composite
qualification and cannot masquerade as a passed full `pnpm checks` result.

This completes the portable tooling slice against its declared source archives.
The Design Core producer separately qualifies its repair and public-file equality.
Frozen registry installation still lacks jj-history; temporary Bits source,
native source parity/host integration, visual approval, publication and installed
application replacement remain separate and are not claimed here.

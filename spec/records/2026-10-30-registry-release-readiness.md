# Registry release-readiness intake

Requirements: AUI-GOV-001, AUI-GOV-003, AUI-GOV-004.

Current authorized follow-up: the shared tracked Bits UI 2.20.2 patch is now
permitted and Core's original Linux boundary passes all 32 cases with it.
The [patch intake](2026-10-31-shared-bits-patch.md) owns that provenance and its
explicit consumer-root setup. Complete Core qualification, actual fixed Core
publication and final UI registry acceptance remain pending; earlier failed and
archive-only receipts below remain historical evidence.

Current qualification gate, updated October 31: Core 0.7.2 is published from
`3ee2b016e453f159b376a69a19e0f5680dda3f65`, but it lacks the required captured
JSON and Swipe teardown corrections. The next Core candidate preserves the
normal registry graph and passes its exact owner regressions. Its related Linux
family boundary still reports 31 passes and one RestrictedReactions focus
failure; complete qualification remains blocked.

The dependency owner correction is now
[Bits UI PR #2264](https://github.com/huntabyte/bits-ui/pull/2264), source
`692fbdf5095941464561189fd81ffc2cb4b81c6c`. Its primary hosted checks pass and
the PR is ready for maintainer review. No fixed npm release exists yet;
bits-ui latest remains 2.20.2. Its additional native two-browser qualification
still has failures, retained in the upstream PR rather than waived. Earlier Core
archive-only results below remain historical evidence and do not establish
released-registry acceptance. Both UI package releases require the fixed,
downloadable Core cohort and fresh complete registry checks.

Scope: qualify the released Design Core dependency for both public UI packages.
No public API, runtime component, test assertion, baseline or publication
permission changes. The parent Desktop workstream retains its frozen source
pins and artifacts independently.

Before state:

- Main is `b203f0184f70594408d7e7a079aecacb4ec48e74`, including the qualified
  host-owned footer draft repair. Hidden-artifact fix `bbc88216` is already
  its ancestor and the publishing workflow retains hidden tarballs.
- Root and both packages permit Design Core `^0.7.0`; the root catalog pins
  Mira `~0.1.0`. The frozen registry lock installs Design Core 0.7.0,
  Mira 0.1.0 and jj-history 0.1.0 successfully without archive overrides.
- Exact command: `pnpm test:storybook
packages/agent-ui/src/chat/transcript-footer/AiTranscriptFooter.stories.ts
-t 'Host.?Owned.?Draft|Send.?Capability.?Withdrawn'`.
  Docker run `agent-ui-run-dcb3878e-3ad8-4318-bc1f-de0fa1544069` passes both
  cases in all four modes: eight passed, zero failures. This is the unchanged
  source baseline, not proof of the new registry intake.
- Latest published Spec Validator is 0.2.0; main already uses its ^0.2.0 range
  and semantic discovery scripts. Doctor passes ten checks with the expected
  custom-wrapper alias warning. The first concurrent semantic request reports
  a QMD database lock; the serial request succeeds and returns the canonical
  Governance, Agent, Repository and Verification chapters.

Workspace inventory: default `tvwovrql`, desktop-send `tssrpuol`,
verify-parallel `ooxsylkw`, catalog-retention `kmyqnxsp`, docker-validation
`wxqrlsko`, send-capability `zypyxvwn`, and branches-fit `tmknqknv` are retained.
Default is clean and its completed release-artifact fix is in main. Empty
review workspaces retain their historical bases. Branches-fit contains a prior
unfinished diagnostic, and send-capability contains older unmerged source
`2bee4ed6`, whose newer owning footer corrections are now in main. Neither is
silently imported or deleted by this dependency-only intake. Publication still
requires explicit release scope review.

The intake raises both packages and catalog tooling to Design Core `^0.7.1`,
and the catalog's direct Mira minimum to `~0.1.2`. Both use published registry
artifacts. A Changeset requests patch releases for both independently versioned
public packages; it does not create tags or publish them. Existing version
inputs remain unconsumed until the separately reviewed version-preparation step.

After intake, the same exact two cases pass in all four modes (eight passed,
zero failures) in Docker run
`agent-ui-run-1fb4058c-b4a6-4df6-8328-c6bf53dbb887`. No private archives are
provided. Complete registry-only checks remain pending.
Functional/accessibility and package failures remain blocking. Native source
parity, visual approval, release preparation and publication stay separate.

The first complete registry worker is
`agent-ui-run-96292a9d-e85c-43d8-98be-f23af3fc46a4`, frozen at
`4202a7a99a8dd2ebd69ae745825d2e7398a1a0b1`, before transitive deduplication.
Its unit suite passes 235 tests and its complete Storybook matrix passes 489
cases in all four modes: 1,956 assertions, zero assertion failures. Inspector
Basic nevertheless logs a CodeMirror crash and an unknown JSON property tag;
those diagnostics prevent treating that result as release-ready. Browser,
static/package and final governance stages are still running at this point.

Exact diagnostic reproduction:

```sh
AGENT_UI_VALIDATION_RUNTIME=native pnpm test:storybook packages/agent-ui/src/chat/transcript-tool-inspector/AiTranscriptToolInspector.stories.ts -t '^Basic$'
```

Before deduplication: four story passes with four CodeMirror
`tags is not iterable` crashes and four `Unknown highlighting tag property`
warnings. The registry graph mixed Lezer Common 1.5.3 and 1.5.5, so Markdown
extensions and their consumers used incompatible NodeProp identities.
`pnpm update @lezer/common --lockfile-only` did not change the graph.
Normal `pnpm dedupe --lockfile-only` followed by
`pnpm install --frozen-lockfile` unified Common 1.5.5 and LR 1.4.12 without
overrides or aliases. The same cold exact command then passes four modes with
zero crashes; the four JSON warnings remain.

The remaining warning belongs to Design Core's private captured-code grammar:
its legacy JSON parser emits a composite `string property` token whose legacy
property alias is not expanded. A separate owning source correction is being
qualified with distinct JSON-property/value and unchanged UTF-16 regression
evidence. No consumer workaround or diagnostic suppression is introduced.

Current release backlog: finish that source correction and released-package
intake; rerun complete portable qualification on the deduplicated registry lock;
prepare coordinated versions for both packages after scope review; retain
separate explicit publication, native source/host and visual-approval gates.

The obsolete pre-deduplication aggregate was gracefully interrupted after its
browser lane passed 101 cases: one case interrupted and 49 not run. Its complete
aggregate is failed/interrupted, never a full pass; all reports remain retained.
The corrected cohort is qualified in a new worker rather than resuming stale
inputs. Explicit Design Core source archive validation uses prepared SHA-256
`58309c74bbceeb360e8d793e824c34e6fd3a132e621cae231276a8be9735f53c`,
with tracked manifests and lockfile retaining registry ranges.

The exact Inspector Basic reproduction now passes all four cold modes with
zero CodeMirror crashes and zero unknown-highlighting warnings in Docker run
`agent-ui-run-9b4c809f-3dc8-4356-910a-3bdd9f9a63e5`. This uses the explicit
prepared source archive, not the published 0.7.1 implementation. Broader
explicit-archive qualification starts from that same package hash; ordinary
registry qualification still requires the released source correction.

The initial broad archive attempt, Docker run
`agent-ui-run-c2136531-5579-49df-af2f-4c9fcb559b88`, failed with 34 token-owner
audit findings before functional suites started. I supplied the runtime-only
`package:local` variant, which omits the source files used by those audits.
The production release helper explicitly retains both source and dist. Repacking
with its existing `packLocal(..., { retainSource: true })` option produces the
release-layout candidate SHA-256
`36146858bc3a0a9f3cf6e3fe969b7f9bc28e44ccac8894e665c107b14193effb`.
The unchanged exact token audit is rerun against that artifact before retrying
broader acceptance; no token metadata, assertion or audit is weakened.
The unchanged `pnpm spec:validate` now passes all ten validators with zero
findings in run `agent-ui-run-29821697-52d2-476b-9d6c-86f3d7bb0b70`: 34
artifact-layout findings before, zero after using the release-layout archive.
The exact Inspector Basic command also passes all four cold modes with zero
crashes or highlighting warnings using the release-layout candidate in run
`agent-ui-run-a4a83f1e-e025-4d6d-9b8a-5ee79a1d954e`.

## Complete explicit-archive qualification and release follow-through

The release-layout source archive run
`agent-ui-run-57d6c8fb-ec39-4c9a-bfdd-5fa5f7798cf0` completes successfully:
235 unit tests, 1,956 Storybook/axe cases, all 151 browser cases, static catalog,
strict checks, package/publint, 149 clean packed examples and specification
checks pass with no captured-reader diagnostics. Frozen Agent UI source is
`ed49976388255747401a9f63c4701881997c8dad`; result digest is
`665eeb0c8d133304b78f5e92d3de530f2daf1c46ac5e432b01b2eef973ec2d8c`.
This remains explicit archive qualification, not released registry acceptance.

The user has now authorized source/version pull-request approval, qualified
merging, public publication and actual artifact/provenance/consumer verification.
That supersedes the earlier release-readiness stop; private source/native and
visual gates remain distinct. Design Core's combined ready-fix release must land
before this final registry intake.

Pending Changesets select Agent UI 0.2.0 and Repository UI 0.1.1. The old workflow
requires their versions to match, so its shell equality check necessarily fails
for that valid independent pair. The repaired workflow retains the existing
`v<agent-ui-version>` cohort tag, verifies the immutable main source, and resolves
each package's own version and exact tarball. It records SHA-512 integrity and
requires both publication jobs before comparing registry bytes and verifying a
clean install and npm signatures/attestations. Existing versions remain
immutable. `actionlint .github/workflows/npm-publish.yml` passes.

The normal native `pnpm check:workflow` wrapper cannot discover a Git project
from a non-colocated Jujutsu workspace. Explicit actionlint over all three
workflow paths passes with the same checks. The Docker worker reconstructs
ordinary Git metadata and previously passed this lane; the final full registry
worker will repeat it. `changeset status` has the same native Git-discovery
limitation. The public `@changesets/get-release-plan` API reads the actual
candidate and confirms Agent UI 0.2.0 (minor) and Repository UI 0.1.1 (patch)
without changing files or repository metadata. No checker or assertion is changed.

The independent workflow source is reviewed in
[Agent UI PR #11](https://github.com/lapismd/agent-ui/pull/11). It does not consume
the separate runtime intake or pending Changesets. Its frozen-registry install,
all three explicit actionlint paths and canonical specification checks pass.
Node 24 Spec Validator doctor and serial semantic QMD discovery pass; the
expected custom-wrapper alias warning remains. An initial search concurrent with
doctor hit a QMD database lock; the serial search succeeds without configuration
or installation changes.

The exact workflow identity step is executed in an isolated fixture, with no
network or real Git operations. Baseline rejects the actual 0.2.0/0.1.1 pair;
the candidate accepts it and produces both exact package versions. Eight cases
reject wrong cohort/workflow/tag sources, source outside main, and invalid
package identity/private/version/access. Exact per-package SHA-512 manifest
generation passes and a wrong-version tarball is rejected: 11 candidate contract
cases pass. Hosted full verification remains required before merge. Source
merge alone neither creates a version tag nor triggers the publisher.
The same 11 cases are retained in `scripts/npm-publish.test.mjs` and wired into
the normal `validation:check` lane; they execute the tracked workflow run blocks
without contacting the registry or changing real Git metadata.
The normal local Node 24 test command passes all 28 tooling cases, 12 diagnostic
and composition guards, and 235 unit cases. Full quality checks pass with zero
Svelte diagnostics and no formatting, ownership or source-ledger findings.

## Combined Core source acceptance

Before Core publication, the combined ready-fix archive is checked separately
from the earlier JSON-only archive. It retains source revision
`7f5801601ea744e5232e4683c51bba48fbe03ae6` and SHA-256
`79ff0e66af1cf424405d5d33af843e27c5ab65fd3af569ae103901ec7a06a17f`.
Its pre-version 0.7.1 identity does not represent published npm 0.7.1.

Docker run `agent-ui-run-681927bf-798a-472f-b20b-2cac6db19b62` checks
Inspector, footer draft/send, dense/bounded Branches and Stacks acceptance:
10 selected cases in all four modes, 40 passes, zero fatal diagnostics. Result
digest: `5acb1ea7c341366b274f1975a363cfc003a19b58a5c29623d0dbf89004a759ce`.
Docker run `agent-ui-run-d7db72cc-bb65-4ebe-b54a-f98b4d114942` passes the exact
`resize rail toggles content fit and default width without changing selection`
browser case, including selection preservation. Result digest:
`5ed3795e7643dc27e66e9355a004c52cd8b558f610943a640ad91d24e57cbdda`.
Both runs use the explicit checksum-verified archive only inside the worker;
tracked manifests and lock retain normal registry ranges. Final complete
registry-only intake still waits for the actual Core patch release.

## Patched Core dependency-cohort acceptance

The later Core source cohort raises Bits UI to `^2.20.2` and minimatch to
`^11.0.1` (source lock 11.0.3), with private matcher compatibility and immediate
post-Select pointer restoration. Prepared source archive SHA-256:
`0af4b94fcfb40a56037ea057c47352eca023d69408dd2559e0ab4010d5ccb74d`;
source snapshot `fd1748bed97b32cb2d956e74b4f338b42f86fa80`. Its pre-version
0.7.1 identity does not represent published npm 0.7.1.

Docker run `agent-ui-run-e708a085-b442-4736-8df8-91ba94a8c6d2` repeats the same
ten Inspector, footer draft/send, Branches and Stacks cases in all four modes:
40 passes, zero fatal diagnostics. Receipt digest:
`5a8f3a1ca7b6933a50b0712f7068f068c0909c16bdd85a80fd53df462859addb`.
Tracked manifests and lock retain registry ranges; final complete registry
qualification and publication still wait for the downloadable Core patch.

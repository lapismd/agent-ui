# Actual published Core cohort

Current release requirements and outstanding gates belong to the canonical
Agent, Repository, Governance and Verification chapters. This record preserves
the actual dependency artifact and qualification attempts.

## Published prerequisite

Core 0.7.3 completed all five release jobs in
[run 41194948225](https://github.com/lapismd/design-core/actions/runs/41194948225)
from source `1ff36f37c165a3496be4826be48b048fc812e38e`. Its owner verified exact
registry bytes, signatures, provenance, tag and
[GitHub release](https://github.com/lapismd/design-core/releases/tag/design-core%400.7.3).
Core's 44 signature checks and existing KaTeX acceptance do not transfer to UI
or application consumers.

The initial read-only asset probe received HTTP 404 while publication had
succeeded but edge-cached registry verification was incomplete. No UI floor or
final acceptance advanced then. After the owner's complete handoff, a fresh
download verifies the actual 1,903,722-byte npm tarball:

- SHA-256: `4c07fdaa8fecc6d7f1ede2f03f89b5afb0728dae82b25dc0e55ec6ddda7ab6ca`.
- SRI: `sha512-mXDhs+c6kdMZ8E3krwXTxzVavb/b4UVEVrNDlM3eQ6ILgfeOHeFiXfrP29QKZ2JXAIKwcqDPIS3WNElL94fH3w==`.
- Packaged `patches/bits-ui@2.20.2.patch` matches SHA-256 `debd3bc7d43917f0967f0cc1e212fc5c7721c751d3b92bf8f31030d1c96289ad`.
- The packaged manifest retains all three canonical Link Preview, Slider and FocusScope postimages; `patches/README.md` is present.

Raw public-asset receipts are under
`/tmp/lapis-ui-actual-registry-release-20261031/core-public-assets`.
The earlier 0.7.2-labelled source archives remain historical preliminary
acceptance and are not used for this registry candidate.

## Registry intake

Raise the root catalog and both published package floors to `^0.7.3`. Generate
the normal registry lock with
`pnpm install --lockfile-only --ignore-scripts --ignore-pnpmfile`.
Its changes are the three Core importer entries, actual Core integrity and
Core's required minimatch 11 dependency/one new glob helper. Other package
versions and the existing runtime identities remain unchanged.

Both published package READMEs now carry the consumer-root patch setup and
removal contract, linked to the actual Core release. Remove obsolete
archive/future-Core prerequisites from four pending Changeset descriptions;
preserve all behavior descriptions and independent bump types. The public
Changesets plan remains Agent UI 0.2.0 and Repository UI 0.1.1. No production UI,
source fingerprint, runtime assertion or visual baseline is changed.

## UI qualification

The exact clean packed-package boundary, all installed catalog patch postimages,
complete registry check/unit/build/catalog/browser/static/package/spec/workflow
matrix, source PR, reviewed bot version PR and actual UI publication remain
pending at intake. Normal runs must use an empty archive inventory and the
actual published Core; prepared archives cannot discharge these gates.

## Independent UI runtime audit

`pnpm audit --prod --json` against this candidate's lock returns exit 1 with one
low finding: [GHSA-238p-pmpm-9mq7](https://github.com/advisories/GHSA-238p-pmpm-9mq7),
KaTeX 0.16.47 through UI → Design Core → Mira → rehype-katex. The advisory's
patched range is `>=0.18.2`. There are zero moderate, high or critical findings.

Repeat the same command against an isolated export of the exact prior
`6f9924a4` lock/manifests, without installation: the same low KaTeX finding is
present, plus moderate minimatch 10.2.6
[GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249).
The required Core/minimatch upgrade removes the moderate finding. This proves
the remaining low is pre-existing; it does not approve it for UI publication.
Core's existing exception is not inherited. Coordinated owning-source
remediation or explicit UI-specific disposition is pending with the release
coordinator while functional qualification continues.

Raw reports are
`/tmp/lapis-ui-actual-registry-release-20261031/runtime-audit.json` and
`/tmp/lapis-ui-actual-registry-release-20261031/baseline-runtime-audit.json`.

The separate npm bulk audit follows each published package's dependency and
required-peer roots: Agent UI resolves 294 snapshots/281 package names;
Repository UI resolves 296/283. Both have zero unresolved nodes and precisely
the same single low KaTeX finding. The helper filters optional root peers and
uses the tracked root importer only to resolve required peer versions.
Receipts: `agent-required-peer-audit.json` and
`repository-required-peer-audit.json` beside the runtime reports above.

The coordinator selects the owning-source fix, with no waiver or consumer
override: qualify and publish Mira's unchanged math-adapter packaging repair,
then publish Core with a minimum requiring that actual fixed Mira. Final UI
intake must consume the released fixed Core boundary. The current Core 0.7.3 /
Mira 0.1.2 functional results remain evidence for their stated input; release
pushes stay held. No unavailable package version is inserted into manifests.

## Completed Core 0.7.3/Mira 0.1.2 functional qualification

The exact `pnpm test:package` target passes first in
`agent-ui-run-b42b32f2-6634-4188-b8cf-e274f3e8c08e`: both package builds and
publint, all three actual packed-consumer Bits postimages, strict zero Svelte
errors/warnings and Vite compilation of all 149 documented public examples.
It uses the actual registry Core with an empty archive inventory.

The unchanged source `79cace3b8fe703a3d94b69d45b29cd08ff152d43`, parent
`6f9924a45b33d6c7a37ecf5b59892e0b881eb2e5`, then passes complete `pnpm checks`
in `agent-ui-run-f3875ca2-4d0f-4869-b29b-d427c5fd50e1`, exit 0:

- Smoke: 12 pass, zero failures/skips.
- Workflow/validation guards: 28 pass; runtime/composition: 12 pass; UI units: 235 pass.
- Quality: all 418 extracted fingerprints; file budgets/ownership; strict Svelte zero errors and warnings; formatting.
- Storybook/axe: 489 identical case identities in each of four theme/viewport modes, 1,956 passes across 16 retained JSON reports; zero failures, pending or todo cases.
- Cold browser: 151 passes in 11.8 minutes, zero failures/skips/retries reported.
- Both builds, static catalog, clean package acceptance with all 149 examples, all three specification lanes and actionlint pass.

The actual active catalog worker independently verifies Core 0.7.3, the
published Core patch asset and manifest, and one installed Bits 2.20.2 context
with all three exact canonical postimages. Its manifest SHA-256 is
`abe7287861a8eae23e57114e7f213db50307b83437e9e8b06b71cf7a4a8480a5`.
The first attempted read-only probe targeted the already-successful exact
package worker after owned cleanup; that missing-container probe proves
nothing. The subsequent active full-worker inspection is the retained proof.

Both normal runs use frozen registry installation with no archives. The full
worker image is
`sha256:fdc27357ce0c4a115c0619df57aa55a63b69b22359d009d53619ac16ceab9034`,
Node 24.15.0/pnpm 10.34.5, four CPUs, 12 GiB RAM and 2 GiB shared memory.
Reports remain in `.local/validation/runs/<run>`; console logs, active graph and
independent report verification remain under
`/tmp/lapis-ui-actual-registry-release-20261031`.

These passing functional/tooling results do not waive the separate runtime
audit, qualify the forthcoming fixed Mira/Core cohort, approve visual baselines
or establish native-host acceptance. Release pushes remain held. Production UI,
source fingerprints, assertions, diagnostics and visual baselines are unchanged.

After recording the completed counts and current source-owned release gate,
changed-file formatting, doctor and semantic QMD pass. The complete isolated
specification check passes all three lanes again in
`agent-ui-run-a66df537-c59d-442c-ac0b-eefe1247358d`.
The expected existing Docker-wrapper alias warning remains visible.

`qualified-core073-source.pack` and its JSON receipt beside the console logs
retain the exact tested commit and ancestry without restoring an old working
change or creating a divergent bookmark. The re-export's pack-byte hash differs
from the original worker transfer; its commit identity remains the stated
content-addressed source. No byte-identical-pack claim is made.

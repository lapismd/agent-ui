# Shared Bits UI patch intake

Requirements: AUI-GOV-001, AUI-GOV-003, AUI-GOV-004.

The user authorizes the tracked shared repair against registry Bits UI 2.20.2.
The exact payload is `patches/bits-ui@2.20.2.patch`, SHA-256
`debd3bc7d43917f0967f0cc1e212fc5c7721c751d3b92bf8f31030d1c96289ad`.
It retains Link Preview's deferred pointer-selection cancellation and all six
Slider pointer-handler destroyed guards, then adds owner FocusScope `692fbdf5`
from <https://github.com/huntabyte/bits-ui/pull/2264>. Retained source commits are
Plugins `bf492db552702fd310dcc6439152d42d472de068` and
`201b1feb60fe97ee383ea30b061e453e1ad5e853`; Core's packaged manifest retains
complete registry and before/after file identities.

The actual unpatched Core registry 2.20.2 Linux owner boundary reports 31 passes
and one RestrictedReactions failure. The same 32-case command with this payload
passes all 32 without changing focus/selection assertions. Owner receipts:
`/tmp/lapis-core-tracked-patch-validation-20261031/{before,after}/results`.
Those are Core source receipts, not UI acceptance or published-package evidence.

Preparation is isolated in the `patched-release-20261031` Jujutsu workspace,
based on actual main `5ea2f849` and a duplicate of the nine-file earlier registry
intake. The original `qvxylpon/c9b2caab` remains byte for byte unchanged.
No runtime UI implementation, public API, test assertion, source fingerprint,
visual baseline or authentication changes are introduced by this intake.

The catalog root explicitly binds Bits UI 2.20.2 and declares the identical
version-bound pnpm patch; its regenerated lock records that hash. Each clean
packed-example fixture independently copies/verifies the payload, configures
its own root package manager and resolves the installed Bits implementation
through the actual Core package. It rejects mismatched versions/contracts and
checks all three installed postimages before compiling the public examples.
Published dependency metadata does not propagate patches. Source archives may
qualify a preliminary cohort only through the explicit checksum-bound overlay;
they do not qualify final registry publication.

The actually published Core is still 0.7.2, which lacks JSON/Swipe corrections.
The minimum and final lock must advance to the actually released fixed Core
before either UI release. Expected Changesets remain Agent UI 0.2.0 and
Repository UI 0.1.1, independently versioned. Full quality/unit/build/catalog,
interaction/accessibility/browser, public-package, protected PR/version and
actual npm/provenance/GitHub release verification remain required.

Preliminary preparation checks pass with the current old Core lock: strict
source check has zero Svelte diagnostics and 418 unchanged source fingerprints;
specification check/build, doctor and semantic QMD search pass. Doctor retains
the expected custom-wrapper alias warning. Normal units pass 28 durable
workflow/validation guards, 12 runtime-diagnostic/composition cases and 235 UI
cases. These checks validate preparation only; no browser or public-package
claim is made against that old registry cohort. The complete final registry
matrix must follow the actual fixed Core publication and floor update.

The changed packed-example fixture passes separately in bounded Linux run
`agent-ui-run-19c57f7a-4959-4a81-95f2-ecb54f2d9c80`, UI source `848cd0b7`,
using the explicit checksum-bound Core source archive from `95b70dd4`.
Archive SHA-256 is
`b80ad762df4f4bd33f65e6cb895ac2827f9f28f21dbe202c9c11dc9c00592856`.
Both UI builds/publint pass; the independently configured packed consumer
verifies all three patched files, has zero Svelte errors/warnings and compiles
all 149 documented public examples with Vite. The archive's pre-version manifest
is 0.7.2, but its bytes are not registry 0.7.2. Reports retain that preliminary
profile explicitly; this pass does not satisfy final registry qualification.

Remove the shared patch only after the resolved registry dependency contains all
three equivalent repairs and exact plus complete source/package/consumer
acceptance passes without it. Earlier red and archive-only receipts remain
retained separately.

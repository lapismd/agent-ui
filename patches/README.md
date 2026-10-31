# Shared temporary Bits UI repair

The user authorizes the same `bits-ui@2.20.2` pnpm patch as Core, Notes, Tasks,
Desktop and Plugins. SHA-256:
`debd3bc7d43917f0967f0cc1e212fc5c7721c751d3b92bf8f31030d1c96289ad`.

It retains Link Preview's cancellable pointer-selection probe and Slider's six
destroyed pointer guards, adding the exact same-container FocusScope repair
from <https://github.com/huntabyte/bits-ui/pull/2264> / owner `692fbdf5`.
Retained owner provenance: Plugins `bf492db5` (Link Preview) and `201b1feb`
(Slider, LP-SPEC-058). The final Link Preview and Slider files match the prior
qualified fixes. Core's packaged `patches/manifest.json` retains complete
registry, preimage and postimage identities.

Each actual installation root must bind released Bits 2.20.2 and configure this
identical payload under its own `pnpm.patchedDependencies`. The private catalog
and clean packed-example fixture do so explicitly and verify installed hashes.
Published dependency pnpm fields do not propagate this configuration. The UI
packages continue to consume public Core through normal npm ranges.

Remove the patch only after a resolved registry version contains all three
equivalent repairs and exact plus complete source/package/consumer acceptance
passes without it. Preserve red receipts; upstream merge or a version bump alone
does not qualify removal. Actual fixed Core publication and final registry-only
qualification remain prerequisites for the UI version releases.

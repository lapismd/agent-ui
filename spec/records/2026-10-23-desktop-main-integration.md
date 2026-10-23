# Desktop extensions integrated into the default workspace

The user requested integration and retirement of temporary migration workspaces
before further qualification. Merge parents are current default `890bd723` and
qualified migration `a43947f6`. Both remain ancestors; no history was rebased or
unrelated work discarded. The `desktop-integration` workspace is retired.

Five merge conflicts retain both sides: the plan and consumer guidance, public
screen exports, governance and source ledger. The Catalog component combines
host `applyDefaults` with current Skeleton/Empty states. Its script-only binding
changes the normalized fingerprint; current documented layout adaptations and
layout hash remain intact. Other production files merged automatically.

Validation from the default workspace:

- `pnpm check`: all specification/architecture checks, 418 source fingerprints,
  zero Svelte errors or warnings, and formatting pass.
- `pnpm test`: 227 cases across 38 files pass, zero failures.
- `pnpm build`: both public packages build and pass publint.
- `pnpm spec:check`: all three specification lanes pass.
- Original migration source qualification remains in the host-feedback record:
  213 units, 632 interactions, package builds and clean packed acceptance.
  Those counts apply to the qualified migration input, not this newer union.

The Desktop retains its exact qualified archives for this integration. Current
merged source/package and consumer qualification continue separately; no new
four-mode aggregate or visual-parity claim is made by the merge. Publication,
installed-app replacement and visual-baseline updates are excluded.

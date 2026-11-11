# Maintenance check-list runtime qualification — 2026-11-11

The live Maintenance PR inspector reproduced rows painting behind the merge
footer. The actual checks viewport had `max-height: none`, although Repository
UI supplies viewportProps. Maintenance's registry graph contained Core 0.12.4
at its root and Core 0.7.4 beneath Repository UI. The published compatibility
range still allowed that older runtime, which does not forward viewportProps.

## Change

Raise both public UI packages and the catalog/packed-consumer Core dependency
floor to ^0.12.4. Keep registry packages and standard ranges; do not add consumer
aliases, selector repairs, patches or private imports. The shared release cohort
advances both package patch versions. This also avoids separate private
ColumnCanvasController identities in clean packed examples.

## Failure ledger

- Maintenance's exact `Maintenance/Cached reload/Long checks stay above merge`
  interaction failed once before intake: viewport and scroll heights were both
  1546 px, so checks could not scroll independently. The assertion retains a
  scrolling viewport, merge-footer separation and last-row containment.
- The first focused source command selected no tests because the generated story
  name is `Long Checks`, not `LongChecks`; the runner failed closed. Corrected
  exact target passed in four light/dark and desktop/narrow modes.
- Initial packed acceptance exposed one ColumnCanvasController type-identity
  error while the consumer root remained on Core 0.10.1. Aligning both public
  packages and the clean root to the same released floor resolved it; all 153
  documented examples compiled and built without type errors or warnings.
- An in-progress catalog run was discarded after the dependency graph changed;
  qualification restarts from a cold runner against the final lockfile.

## Verification

- Focused long-check interaction: 1 case in four modes passed.
- Source check: types/warnings, architecture, specification, fingerprints and
  formatting passed. Unit suite: 237 passed; package builds/publint passed.
- Clean packed-package type and Vite consumption: 153 examples passed.
- Full catalog, browser, static, specification and hosted qualification follow
  against the final frozen registry graph. Maintenance intake waits for npm
  publication and re-runs its actual consumer overlap story.

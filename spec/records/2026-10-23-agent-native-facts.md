# Native session facts

AUI-SCREEN-001 and AUI-GOV-003: the desktop native session snapshot has no
timestamp. Make directory `updatedAt` optional and document that absent times
and unproven configured-agent associations must not be synthesized. No runtime
markup or styles change. Existing ten Agents stories remain visual-pending.

Focused directory tests: 12 pass. `pnpm check`, the Agent package build/publint,
and all unit tests (204 in 34 files) pass. Initial spec-first requires the mapped
governance chapter as well as Agent; both are updated and `pnpm spec:check` passes.
All 40 affected Agents interaction/accessibility story cases pass in both themes
and viewports. Native adoption and the remaining five-slice plan are not closed
by this contract clarification. Complete final catalog qualification stays open.

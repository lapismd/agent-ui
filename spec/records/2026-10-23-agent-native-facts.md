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

The next native-lifecycle integration requires a non-disposing `drain()`. Its
regression first fails 1/13 cases because that method is absent, then passes all
13 after implementation. Failed draft writes block drain until an explicit save
succeeds. Reads cannot clear a failed write. Controller disposal stays separate.

Drain verification: exact target 13 pass, full unit suite 205 pass, all 40 Agents
story interaction/axe cases pass, `pnpm check`, build/publint and `pnpm spec:check`
pass. Clean archive acceptance compiles all 140 public documented examples and
builds its isolated Vite consumer. Registry manifests and visual baselines remain
unchanged. Live native/provider qualification belongs to the consuming app.

JJ Desktop adoption is committed as `23e0116d`: 33 browser/axe, 35 renderer unit,
26 native tests and the cold native application flow pass. The running preview
uses the documented archive workflow. Shared Storybook was restarted after
refreshing Design Core to the committed nested-shell source fix `3c8d2733`.
With that dependency, `pnpm check`, all 40 affected Agents interaction/axe cases
and four cold Agents browser cases pass. The broad Storybook run passes all 429
light/desktop cases; its light/narrow run was cancelled to isolate native delivery
timeouts, with remaining theme/viewport lanes deferred. The unchanged native
targets and full native suite then pass. Broader source qualification remains
open, including the Design Core browser failures recorded by its owner.

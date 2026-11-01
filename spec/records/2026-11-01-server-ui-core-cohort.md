# Shared Notes UI dependency cohort

The public Agent and Repository packages admit Design Core
`^0.7.4 || ^0.8.0 || ^0.9.0` through portable ranges. Source/controller behavior
is unchanged. Token-source validation resolves the unique public installed root
when prepared packages relocate authored sources into built output; missing,
ambiguous and mismatched defaults still fail closed.

`pnpm checks` passes in Docker on the Omarchy context with the verified Core
0.9 archive. Receipt: `agent-ui-run-63701896-a71e-4d2c-8c7b-a1488f367874`.
The checked implementation snapshot is
`e5e3f1fc38db35c1d4571b0ab1ced12d50e6ab34` and Core source is
`2b872a416c180f1bdb1bdfea30c41e6ddc9f070a`.

- Types, formatting, architecture, 418 source fingerprints and 69 catalog
  compositions pass.
- Validation infrastructure: 28 passing tests; unit lane: 237 passing tests
  plus 12 validation unit cases.
- Storybook interaction/axe: 489 cases in each of light/dark desktop/narrow,
  1,956 total, zero failures.
- Browser acceptance: 151 passing journeys, zero failures.
- Static catalog, both package builds/publint, packed consumer acceptance,
  specification and workflow checks pass.

The exact token-source regression, `tests/foundation-audit.test.ts`, improves
from 1 failed / 20 passed to 21 passed / 0 failed. Preceding attempts remain
in ignored `.local/ui-parity/prepared-token-before.log` and
`.local/ui-parity/prepared-token-after-2.log`. The final
matrix qualifies the complete adopted cohort rather than inferring readiness
from an older Core run. Publication, push, deployment, visual baseline approval
and native consumer acceptance are outside this receipt.

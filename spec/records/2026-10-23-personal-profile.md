# Personal Profile and sidebar identity menu

RUI-FORGE-001, RUI-GOV-001; enclosing Jujutsu change `rplmuksn`.

## Source and scope

Copy/adapt JJ Store `42ae3473` Profile settings, photo row, divided directory
field, save footer, profile CSS and CommunityProfileMenu. Six source entries in
`docs/desktop-layout-sources.json` record hashes and explicit layout adaptations.
The host supplies installation persistence, image normalization, asset references
and exact requests. The complete public screens own the settings/header/row and
menu composition. Design Core's public AvatarPicker owns the chooser.

The controller retains drafts before Save, records exact pending intents,
inspects without replay, retries only an explicitly inspected not-known request,
and requires explicit conflict reconciliation. Known validation rejection keeps
an editable draft. Disposal rejects late reads and drains uploads/draft writes.
Loading uses Skeleton; unavailable content uses icon Empty with Settings access.
No server sign-in/out, credentials, execution or repository authority is added.

## Verification

- `pnpm test tests/profile.test.ts`: 5 pass, 0 fail, including unknown restore,
  exact retry, conflict, known rejection, stale disposal and upload drain.
- Profile and Profile Menu Storybook family: 44 interaction/accessibility passes
  across light/dark and desktop/narrow (11 cases per setting). The final exact
  rerun uses `.local/vitest-content-states.config.ts` for an isolated browser port.
- `pnpm check`: pass, including 418 source fingerprints, architecture, 0 type
  errors/warnings and formatting. Focused original-layout comparison matches all
  six adapted entries against the sibling source.
- `pnpm --filter @lapismd/repository-ui build`: package and publint pass.
- `AGENT_UI_REVIEW_PNPMFILE=.local/review-dependencies.cjs pnpm test:package`:
  clean packed type/Vite consumption passes; 149 documented examples compile.
- `pnpm spec:check`: validation, mdbook and spec-first pass.

Initial startup found two MDX indexing errors (missing separator after imports).
The first family then had 4 failures/7 passes: an assumed avatar-dialog role,
duplicate tooltip tab stop and menu accessible-name mismatch. The menu included
visible fallback initials in its label and removed the duplicate stop. The next
family had 2 failures/9 passes from checking the opening popup before animation
completed; waiting for the same visibility assertion fixed them. Final count is
0 failures/44 passes. Initial type diagnostics (2 errors/1 warning, followed by
9 test-option errors) are resolved; final count is 0/0.

## Review and remaining delivery

Exact stories: `JJ/Settings/Profile` Basic, Avatar, Loading, Unavailable, Unknown,
Conflict; `JJ/Settings/Profile menu` Basic, Compact, Loading, Unavailable,
Recovery. All remain visual-pending; no baselines changed. The cold review server
was restarted and the Profile composition inspected in the browser.

JJ Desktop archive/native/browser acceptance is recorded separately by its
consumer. Custom Emoji, Integrations, expandable sidebar sections, native Reload,
session parity, contextual chat/rails and remaining workflow adapters remain
open. Source acceptance does not close those app capabilities or final catalog,
live composition, provider and release gates. No publication occurred.

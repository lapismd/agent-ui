# Desktop JJ history review — 2026-10-22

The user authorized updating AGENTS.md, extracting Desktop's JJ presentation and
stopping for review before downstream adoption. Subsequent review corrections
cover Op Log expansion, author avatars and rich blame, Empty/Unavailable states,
standalone framing and failed docs module loading. Agent visual approval remains
pending; no source application, downstream service, registry or deployment changed.

## Scope and ownership

The `/jj` public entry of `@lapismd/repository-ui` contains 51 source-copied
Desktop Svelte components, 30 pure controller/model helpers and eight styles.
It reuses the previously copied graph algorithm rather than duplicating it.
Twenty documented families expose 69 stories with the same production components
and copied controllers in their building blocks and complete screens.

Families cover the embedded AppShell, author avatars/IDs/loading, log header,
source/workspace/parent/pin pickers, revision graph/details/changed files/diff,
file history, operation inspection, blame, conflicts, restore, JJ Log and Op Log.
Each has colocated MDX, public examples, styling tokens and rendered variations.
There are 77 compiling public examples across Agent and JJ families.

Native admission, repository access, avatar resolution/caching, preferences,
notifications, persistence and navigation remain host-owned. No controller issues
reads in its constructor or mutations on mount. Restore services and conflict
staging use isolated in-memory effects. The three Desktop App/plugin footer
contributions (backup status, working-copy status, upstream actions) and its
backup/provider/settings subtree are excluded from this presentation slice.
Workspace drag/drop, broader repository browsing and forge remain later work.
Fifteen pre-review scaffold components remain hidden and frozen by exact hashes.

## User review corrections

- A complete single operation-change group is selected on expansion; paths and
  file content retain its native revision pair and original pinned handle.
  Multiple or continued groups require a selection, and ambiguous/unavailable
  comparisons never invent endpoints. Failed reads require explicit retry.
- Avatar stories use a plain theme background and seven public sizes, with a
  functional diameter override. The `dev@lapis.md` story resolves Gravatar in
  the catalog host. An explicit URL or host-provided cached resolver enriches
  descendant graph/blame avatars without moving lookup policy into the library.
- Blame copies Desktop's large source fixture, twelve commit subjects, six
  authors, irregular groups, statistics, long lines, sticky origins and virtual
  scrolling. Source/line numbers retain 14px and author/time metadata 12px.
- Every named Empty/Unavailable story uses public shadcn Empty with an icon.
  This includes valid no-head log states, successful empty comparisons,
  unavailable conflict/diff/blame/revision reads and Agent turn/checkpoint UI.
  A generated index-driven browser check covers future named states too.
- Small controls render on padded, bounded surfaces; components requiring
  column/shell context retain it. Standalone pickers import their owned common
  styles, so their presentation does not depend on a surrounding shell import.
  Compact docs previews use natural height; complete shell docs retain the
  40rem/flush rule while Canvas screens retain the viewport.
- Design Core's dependency prebundling setup was adapted for source/catalog and
  public-package icons/runtime dependencies. Storybook 10.5.7 remains unchanged;
  all twenty JJ Markdown docs pages load in a cold process. Compilation errors
  were fixed at their source, and the strict warning/runtime guards remain on.

## Before and after evidence

The exact Op Log browser target initially failed once: expanded Changed files
was absent. Its controller regression also failed once because no group was
selected. Both exact targets pass after the change; seven operation-file tests
cover native pairs/handles, multiple/continued groups, ambiguous/unavailable
endpoints, stale collapse and explicit recovery.

Earlier extraction qualification found four conflict-fixture failures (missing
required shell content), then fifteen failures after assertions were strengthened
(invalid role queries, alert-dialog opening timing and missing standalone column
selection wiring). Their exact affected targets were repaired and rerun; no
assertion threshold was reduced.

The first new browser suite passed eight and failed two: a hidden unrelated Empty
was selected, and the picker query omitted its actual “comparison parent” label.
The visible-state/query corrections exposed one real missing no-head log Empty,
which was fixed in production. Strict compilation then caught an intentionally
captured initial fixture prop and unused paragraph styles; `untrack` expresses
the retained fixture lifetime, and unused rules were removed rather than hiding
warnings. The final index-driven Empty/Unavailable check passes.

A raw Design Core source archive caused eighteen reference startup failures and
prevented the JJ story suite from starting because this consumer's Svelte/Vite
optimizer requires prepared rune modules. It was replaced with Design Core's
existing `packLocal` output, including prepared browser CSS and declarations;
source is retained for token auditing. No dependency files or source aliases were
patched. The first dependency-discovery setup also caught a conditional-export
resolution error and an unavailable root-only transitive import; both were
corrected to the installed public entry and the actual dependency surface.

The symmetric source-layout check removes script/comment formatting on both
sides; it repaired a false graph-layout mismatch from comment-only blank lines.
The ledger now verifies 193 fingerprints and compares 140 original layouts with
explicit token, host-binding and user-requested Empty/selection adaptations.

## Qualification

Final verification uses the prepared public review archives below; no visual baseline was written.

| Lane                                | Result                                                                                                                            |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Exact Op Log regression             | Cold browser passed; seven operation-file regressions passed                                                                      |
| `pnpm check`                        | Passed: specification, ownership/budgets, fingerprints, zero type warnings and formatting                                         |
| `pnpm test`                         | 92 passed, zero failed                                                                                                            |
| `pnpm test:storybook`               | 656 passed, zero failed: 164 stories in light/dark × desktop/narrow, with accessibility enabled                                   |
| `pnpm test:browser`                 | 21 passed, zero failed; all 20 JJ docs pages and all 24 named Empty/Unavailable variants covered                                  |
| Strict Desktop reference comparison | 18 passed, zero different pixels at native 2× density: JJ Log, Op Log and multi-author blame at 420/900/1280 CSS px in both modes |
| `pnpm build-storybook`              | Passed: both package builds/publint, static catalog, 38 families, 145 foundation variations and five specification chapters       |
| Clean packed-package examples       | 77 documented examples compiled with zero errors/warnings; packed archives exclude catalog files                                  |
| `pnpm spec:check`                   | Passed: validate, mdbook and spec-first lanes                                                                                     |

Source Design Core commit `749de753` adds Empty/icon presentation for normalized
unavailable tool output. Its exact story initially failed 1/10, then passed 10/10
with the actual public media selector and exact refusal text. Source lanes passed:
859 unit tests, 909 story/accessibility tests, strict source/public consumer type
checks, static build and all three spec-check lanes. Its record is
`design-core/spec/records/2026-10-22-tool-unavailable-empty.md`.

## Pixel evidence and review limits

The initial 1× cold comparison passed 7 and failed 11; optional Gravatars
explained the blame differences and are supplied by the catalog host in normal
stories. Network avatar enrichment is disabled only in the source-comparison
fixture so it cannot alter captured identity images between samples.

Subsequent 1× runs passed 13, 14 and 10 of 18 with only single RGB-level corner
rounding differences after source data/typography settled. Computed identifiers'
styles and bounds matched. A control rendering Desktop against Desktop itself
also failed 7/18 at 1×, proving this is not an extraction-layout regression.
Thresholds stayed at zero. Paired original/candidate captures now share loaded
fonts/styles, require two identical settled frames, and use the native macOS
2× display density. The final eighteen comparisons pass with zero changed pixels; a separate Desktop-to-Desktop control at 2× also passes all eighteen.
This qualifies those matching-data populated views, not every expanded state,
external profile image, browser zoom level or complete Agent transcript.
Human visual approval and downstream adoption remain pending. The earlier Agent
shell comparison's six intentional toolbar-toggle differences remain recorded in
the Agent completeness record; no baseline is accepted or refreshed here.

## Temporary dependency prerequisite

Publishable manifests retain normal semver ranges. `@lapismd/jj-history@0.1.0`
is not available from npm (registry lookup returned 404); its existing public
`dist` and license material were archived without modifying or rebuilding
jj-store. The normal portable lockfile has not been refreshed for this
unpublished protocol dependency and its new importer entries; ordinary frozen
registry installation is not claimed. Publication and release lockfile refresh
remain behind the review gate.

The ignored `.local/review-dependencies.cjs` resolves these review archives:

- `agent-ui/.local/packages/lapismd-jj-history-0.1.0-desktop-review.tgz`;
  SHA256 `c3fbfdb8759147ba05ffcb778f5207cd54b2b9845bbd039c4b18b9e11593e887`.
- `design-core/.local/packages/lapismd-design-core-0.6.0-agent-jj-review-with-source.tgz`;
  SHA256 `9ae2b863a7669e08ee8a103cef6c699a82df90b0dc8aa540cc15ee7fb4c8580b`.

Install with `pnpm --config.pnpmfile=.local/review-dependencies.cjs install
--lockfile=false`. Clean consumer acceptance explicitly uses
`AGENT_UI_REVIEW_PNPMFILE=.local/review-dependencies.cjs pnpm test:package`.
The overlay contains only packed public exports and is neither shipped nor
committed. Native service/provider qualification and actual application adoption
remain separate from these presentation checks.

Storybook remains at http://localhost:7490. No visual baseline is updated.
The next action is user review of this Desktop JJ section, not downstream work.

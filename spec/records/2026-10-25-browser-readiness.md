# Portable browser readiness and operation paging

Updated: 2026-10-25T21:45:54Z

## Scope and before evidence

RUI-HISTORY-001 and AUI-GOV-003 retain the existing browser assertions while
qualifying the current shared screens. The complete owner aggregate
`1e03663c-24f5-4a61-9523-cb5dd0279418`, frozen source
`9c0c8b2d0c0b0640477cf1f280d5963297c05476`, passes all 234 units and the
complete 486-case four-mode Storybook matrix: 1,944 passes. Its subsequent
`pnpm test:browser` run finishes with 146 passes and five failures:

- Both themes in `tests/jj-operation-presentation.pw.ts` measure a 6 px
  difference between the Operation graph and More operations widths, above the
  existing 2 px tolerance.
- The global Empty/Unavailable audit in `tests/jj-review.pw.ts` checks the
  Reference Picker's menu before opening its combobox.
- The File history host-action check in that file selects the removed graph
  button, while the current grouped history card exposes View code at this
  point and the same exact recorded revision callback.
- The Branches resize-rail content-fit check retains 380 px after double-click
  instead of expanding within the existing 640 px bound; an independent source
  lane investigates this behavior without weakening the test.

The graph's horizontal minimum can exceed its fixed column. Its paging action
must share that content width. A common grid sizing boundary preserves the
graph's existing minimum, the column's horizontal scrolling and the button's
centered muted presentation without changing a shared primitive or public API.
Browser setup must open the existing picker and use the current public history
action while retaining all exact callback assertions.

## Focused follow-up

Exact four-case run `bcc66763-b0d6-46f1-b1b5-79d998052df2` has two passes and
two failures. Both light/dark width assertions pass, and exact File history
callbacks pass. The global state audit advances to Repository Picker's missing
selected ID, which is a scalar unavailable label while valid choices remain;
it now asserts that exact label and available options instead of requiring an
incorrect empty menu. Genuine content Empty states retain their icon assertion.

The dark Op Log case reaches a previously hidden palette assumption. Diagnostic
run `2d6e7815-b1ef-49a0-a972-fac990d28d51` reproduces one failure: the URL's
`globals=colorMode:dark` omits the brand, no theme attribute is present, and the
default navy background is `oklch(12.9% 0.042 264.695)`. Its tinted selected row
is `[49,42,57,255]`, so absolute red exceeding blue is inappropriate for that
palette. The Lapis presentation URL now explicitly selects `theme:lapis` and
asserts that theme is attached; both original red-channel assertions remain
unchanged. Production tint values and all geometry tolerances stay unchanged.

Exact cold run `d5d18e51-fe22-41d2-8387-fd7bb597b74e`, source
`ced06c6f93b1176d4a8f271766385374eb9d7273`, passes all four repaired cases.
Source preflight `a39d7e69` then catches 303 counted lines in the Op Log source
and its generated package copy. Keeping the common grid as a native inline
layout declaration brings the component to the unchanged 300-line limit.
Preflight `355487c8-d584-47d7-96d1-d1fe6c564c7c` passes all 22 routing lanes,
69 production composition families, specification validation, architecture,
418 source fingerprints, Svelte with zero errors/warnings and formatting.
Exact cold rerun `08b7a090-ab8f-4af4-bd24-655002eed470`, source
`2831f9d1f0d7afe313a907463c7d70436ff1a996`, again passes all four cases after
that equivalent style placement. Full specification check
`034b39ae-156a-43d2-b76b-8da297aa8bed` passes validation, mdBook and spec-first,
plus the 22-lane routing and 69-family production composition guards.

## Validation

At that checkpoint, exact repaired targets and source preflight pass while
complete final-cohort qualification remains pending. The following retained runs
close portable source qualification; native/visual and downstream acceptance
remain separate.

Design Core's source repair traverses visible `display: contents` wrappers while
excluding hidden/inert descendants from ancestor width measurements. Its exact
regression and complete 35-case Column Canvas family pass, followed by normal
source-inclusive public packing and clean-consumer runtime/CSS checks. The
provisional archive is `14806b997506d44d73c85f24f2a52612157c952376f0f6752db3a6cf7d9bf4e8`,
package source `20119562e4753f43c2092a569be34d027875b26c`; its full owner gates
remain independent. The other six Agent UI prerequisite archives are unchanged.
The original Agent UI Branches resize-rail regression passes in cold run
`a3414696-2f80-41de-94d0-f7e761ffd914` against that exact source archive, without
an Agent UI production workaround or an assertion change. Final complete owner
qualification now runs against this frozen seven-archive cohort.

That final aggregate `7438e80b` passes the complete 1,944-case Storybook matrix,
234 units and source/tooling guards before exposing one new browser timeout in
`tests/chat-references.pw.ts`: Classic references waits for Remove Lapis Desktop
after document-end mention input. Its snapshot starts at the second paragraph;
CodeMirror has released the first paragraph's reference widgets outside its
viewport. The test now uses the real document-start keyboard command before
invoking the first-paragraph remove action. Exact persisted source and Undo
assertions remain unchanged across all three reference variants; no product or
public package file changes. The immutable complete browser run finishes with 150 passes and that one
timeout; it correctly leaves the aggregate failed. No assertion or timeout is
changed by the private browser repair.

## Final composite source qualification

The failed full aggregate is `7438e80b-9f60-4a01-afe8-ef89ceafe515`, frozen
source `8afcc31fa98d918ab8ce9ee5e6ad8d555f00c8e7`. Final-source follow-ups
use `6cd9b2e18d09e050b6ca31ee76b89104a1e8df11`:

| Command                                                        | Run                                    | Result                                                         |
| -------------------------------------------------------------- | -------------------------------------- | -------------------------------------------------------------- |
| Exact Classic references case in `tests/chat-references.pw.ts` | `2620b6ca-af44-48e9-80ed-0eb9d1cfb396` | 1 pass                                                         |
| `pnpm test:browser -- tests/chat-references.pw.ts`             | `60f3f373-091a-4fe4-a731-0f5ed59f41bc` | 7 passes                                                       |
| `pnpm check`                                                   | `6cb35f6e-be4a-485b-b8e1-1bbd42c93c15` | Source/spec/type/format pass; zero Svelte diagnostics          |
| `pnpm test`                                                    | `6c4037ea-d8e9-48d6-8f31-d7d6523f4e34` | 12 tooling, 12 focused runtime/composition and 234 unit passes |
| `pnpm build-storybook`                                         | `f47cb50d-96cc-418e-84f3-df4334b534b2` | Static build/catalog audit pass                                |
| `pnpm test:package`                                            | `3a5d12c6-6fa0-4f31-9f00-c28942826c42` | Clean types/Vite consumption; 149 public examples              |
| `pnpm spec:check`                                              | `f1eafc9c-b13e-4023-97c9-e29eda6cced4` | Validation, mdBook and spec-first pass                         |
| `pnpm check:workflow`                                          | `27ddfd96-c5dc-4ac7-96ef-a11503ba509d` | Pass                                                           |

The exact Classic command is `pnpm test:browser -- tests/chat-references.pw.ts
--grep 'Composer and preview share references: classic-references'`.
A machine-checked ignored `composite-qualification.json` retains the original
failed result, verifies the two-line keyboard-navigation-only test delta and
proves equality of every product, package, Storybook and other browser input.
All eight follow-ups use the same seven dependency archive versions/checksums.
The 1,944 Storybook and 234 unit results remain applicable. Current browser
coverage is the 144 unchanged cases outside the repaired file plus its seven
final-source passes: all 151 cases, with six overlapping historical passes
counted only once. This is composite source qualification, not a passed aggregate or a
waiver of its failure.

Normal public packing from the passed package run compares every emitted file
with the provisional consumer candidate: all 333 Agent UI and 699 Repository UI
files match. Their retained archives are respectively `f9fff47b` and `34388594`;
full SHA-256 values, public file inventories and original/final provenance live
under `.local/validation/public-archives/final-composite-qualified-v2-6cd9b2e1/`.
Only canonical evidence changes after the qualified source. Registry availability,
producer admission, consumer/native behavior, visual approval and publication
remain separate gates.

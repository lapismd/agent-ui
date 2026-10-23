# Projects live source comparison

Requirements: RUI-WORK-001, RUI-NAV-001 and AUI-GOV-003.

## Completion gate

The user requires new page composition to match the running JJ Store before it
is marked complete. This is an explicit completion gate, separate from ordinary
visual-pending baselines. Projects and the five-slice integration plan remain
in progress. No visual baseline, package publication or installed app changed.

JJ Store reference: `42ae3473081a50b5acfbd2a763421af18d4608d0`, live UI at
`http://127.0.0.1:7460`. Its four pre-existing documentation changes are untouched.
Shared catalog: `http://localhost:7490`. Comparison uses the live application
and source markup/styles, not only story tests or fingerprints.

## Live observations and corrections

| Surface        | Reference composition and shared correction                                                                                                                                                                               |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frame          | Breadcrumbs belong in Topbar outside the rounded body. Source contextual tabs use a circular expanding search and far-right filter. PageFrame now preserves those boundaries and hides navigation on task/review details. |
| Directory      | Current-tab heading, muted compact toolbar, icon controls, Mine/Other groups across homes. Shared directory now retains these groups rather than creating a heading for every home.                                       |
| Create project | Wide DialogFrame, Metadata home and Project details settings cards, labelled icon rows, Markdown description and fixed Done/Create footer. Replaced the initial compact plain form.                                       |
| Tasks          | Fixed Back/title/time/refresh header, scrolling metadata/description/subtasks/activity and fixed Markdown composer. The live source also wraps the chat icon below the title; that behavior is preserved.                 |
| Reviews        | Repository groups, compact status/title/ID/anchor/comment-count/author/time rows. Visible title is retained in the accessible name. Full review detail remains a gap.                                                     |
| Repositories   | Source description/access, author, stacked activity bar, time and contextual actions; linked repositories open a dialog and preserve unavailable/retired links.                                                           |
| Activity       | One descending commit timeline across homes, author/repository/time, Git/JJ identifiers and exact recorded navigation. Duplicate exact pins are deduplicated; per-home failures and paging stay independent.              |
| Rail           | Closed by default, AppShell rail outside body. Source overview row geometry, status/comments, host Copy Link and repository rows retained; explicit metadata-home context is added.                                       |
| Filters        | Source task-state radio menu includes Active/Done/All/Open/In progress/Blocked. Omitted state means Active. Home IDs and portable repository filters remain separate.                                                     |

The source ledger records raw source and normalized destination hashes with
explicit adaptations. Hash equality is provenance evidence, not a visual pass.
Source application routing, private controllers, notifications and stores are
replaced with typed host-owned ports and public Design Core primitives.

## Focused before/after evidence

- Initial controller regression: 2 failures / 4 passes; after controller fixes, 6 passes.
- Initial `vitest --project storybook .../projects -t 'Project|Create Project'`: 2 failures / 9 skipped (missing Metadata home card and Tasks heading).
- Corrected project/create/task composition: 3 passes / 8 skipped. One intermediate dialog visibility race was corrected by waiting for the visible state, without removing the assertion.
- Initial Projects/navigation matrix: 1 failure / 22 passes in first combination: Reviews accessible-name mismatch. Exact Reviews rerun: 1 pass / 10 skipped after including the visible title.
- Expanded Projects stories: 2 failures / 16 passes: activity and linked-repository accessible names omitted visible content. Corrected activity markup keeps Markdown outside the title button; repository names derive from their complete visible content.
- Exact Activity/Linked Repositories rerun initially exposed 1 dialog-animation race / 1 pass; retained visibility assertion now waits for the open dialog. Final exact rerun: 2 passes / 16 skipped.
- The expanded matrix exposed one filter-menu visibility race (1 failed / 29 passed); awaiting the checked Active item preserves the assertion, and the exact narrow Filters rerun passed (1 pass / 17 skipped).
- `pnpm test:storybook packages/repository-ui/src/jj/projects packages/repository-ui/src/jj/navigation`: 120 passes, 0 failures across light/dark and desktop/narrow (30 each).
- `pnpm test`: 33 files, 192 unit tests passed, 0 failures.
- `pnpm --filter @lapismd/repository-ui build`: build and publint passed.
- `pnpm check`: passed all specification, architecture, 389 source fingerprints, Svelte types and formatting checks; 0 type errors/warnings. Intermediate documentation validator findings (2 then 1) were repaired by putting the gate prose before atomic acceptance bullets; two unsupported test query options were replaced by exact regular expressions.
- `pnpm storybook:restart`: fresh port-7490 startup succeeded, preserving unrelated servers. The cold Create Project Dialog loaded and was visually compared with the live source dialog without submitting native metadata.
- Captured comparison images are retained locally at `.local/projects-review/jj-store-create-project.png` and `.local/projects-review/shared-create-project.png`; no baselines changed.

Commands/logs use the ignored `.local/projects-*` files. Cold browser UI loading
is verified, not cold native startup. Unrun aggregate and consumer lanes remain
pending and these focused passes do not close the composition gate.

## Remaining gates

- Threaded task discussion still lacks source reply connectors, reaction controls and captured edit-version context. Public MarkdownComposer radius/toolbar and settings icon backgrounds differ from the source; use an owning public extension if necessary, never a dependency-internal patch.
- Selected-project Add menu, source activity category filters and manual portable repository linking are not yet fully adapted. Unknown/unregistered references must remain visible without granting access.
- Full review detail must compose existing review/anchor/diff primitives; the current generic task-like detail is not source parity.
- Global task project-picker continuation still needs controller-owned cancellation/drain and duplicate bounds. Draft restoration needs captured comment/task versions and recovery interaction coverage.
- Native Projects adapters, consumer routing/sidebar/picker/history, agent/session/thread content, settings and final integration remain separate unfinished slices.
- Full package/static/consumer/browser/native qualification, source-close visual comparison, rail narrow-window focus/priority and cold native startup are pending. No incomplete surface is declared closed by this record.

## Review stories

All are under `JJ/Complete screens/Projects` and remain visual-pending:
Directory, Create Project Dialog, Project, Task, Reviews, Activity, Repositories,
Linked Repositories, Filters, Details Rail, Basic, Create Project, Paged,
Partial Failure, Empty, Loading, Disabled and Recovery.

Use Create Project Dialog to inspect the open form; Create Project intentionally
submits fixture metadata and ends in the directory. Story adapters never access
native repositories or send to a service.

# Stacks and Workspace PR/workflow alignment

Requirements: RUI-STACK-001, RUI-FORGE-001, RUI-COMMAND-001, RUI-FOUND-001 and
AUI-GOV-003. Stories remain visual-pending; baselines are unchanged.

## Source comparison and changes

The user explicitly authorized restoring PR details, action bars and floating
workflow, superseding the presentation-only deferral. JJ Store remains a
read-only source reference. Its `StoreStackWorkspaceDetailsColumn` places
`StoreForgeDetails` above an embedded diff and supports PR-only selection.
`StoreDetachablePanel` moves the same content node through the public Design
Core workspace floating layer. The corresponding action bars/menus and retained
commit form were missing here. Expanded commit bodies were also an incorrect
addition to both lane views.

This slice adapts those source components at pinned JJ Store revision
`6961bd1c`, keeping the portable controller, per-origin identities, native hunks,
scoped reads, public AppShell/Column Canvas and host-owned effects. Lanes now
show summaries/files only. PR details include recorded description, additional
metadata, revision-aware checks and capability-aware action/merge controls.
Branch, stack, commit and workspace actions retain exact command context;
Push, Submit stack, Create PR, settings, clipboard and errors are explicit host
ports. The source inline composer uses public MarkdownComposer and retained
controller drafts; it requests preview without executing a mutation.

The new public PR family and `RepositoryPullRequestReview` accept host-issued
records/scope. Requests carry repository/revision/readKey/workspace, PR identity
and expected SHA. Busy/pending, missing capabilities, stale SHA, draft/closed or
unknown-mergeability PRs reject unsafe requests. Host review/confirmation and
execution remain explicit. No credentials, native/forge transport, publication
or downstream application changes are part of this slice.

## Before/after and qualification

- Exact target: `pnpm test:browser tests/stack-workspace-workflow.pw.ts`.
  The first two-case probe found one real lane-body regression and one test
  selection error (clicking an already selected story row closed its files).
  Correcting the probe preserved the requirement rather than weakening it.
  The completed six-case target passed with zero failures.
- The first PR integration run passed four cases; two close/reopen probes
  incorrectly expected the closed column to remain and then omitted selecting
  the commit before choosing its file. Aligning the probes and complete fixture
  with the source workflow repaired those two failures. Both views now verify
  PR-only selection followed by a file in the same origin.
- `pnpm test:browser tests/stack-workspace-workflow.pw.ts tests/stack-workspace-presentation.pw.ts tests/stack-workspace-drag.pw.ts`:
  final cold run on port 7498: 26 passed, zero failures. It includes real native
  drag/drop, complete existing lane behavior, PR placement/actions, retained
  editor node/draft/focus through floating/Escape docking, pointer window move,
  pointer resize and staged commit preview before Apply.
- `pnpm exec vitest run --project unit tests/pull-request-review.test.ts tests/stack-workspace-*.test.ts`:
  six test files, 25 passed, zero failures. Includes exact request identities,
  stale/head/scope handling, retained drafts and capability/pending/merge gates.
- `pnpm test:storybook` with `RepositoryStackWorkspace`, `RepositoryStackLane`,
  `RepositoryWorkspaceFiles`, `RepositoryWorkspaceDiff` and
  `RepositoryPullRequest` story files: initially nine stories failed the
  visible-text/accessibility-name rule. Corrected the PR title disclosure and
  number button labels to include visible text. Final run: 48 stories in each
  light/dark desktop/narrow combination, 192 checks and zero
  interaction/accessibility/runtime-diagnostic failures.
- `pnpm exec svelte-check --tsconfig tsconfig.json --fail-on-warnings`:
  zero errors and warnings after resolving intermediate integration diagnostics.
- `pnpm --filter @lapismd/repository-ui build`: package build and publint passed.
- Public self-import TypeScript probe against the built package resolves the
  component, review model, distinct `RepositoryPullRequestRecord`, request and
  scoped snapshot types through `@lapismd/repository-ui/jj` and `/stacks`.
- Source ledger: 261 destination fingerprints, with 24 changed/new pinned-source
  layout adaptations; public record-name refinement was separately verified.
- `pnpm spec:validate`: nine validators, five chapters and 23 requirements passed.
- `pnpm check:architecture` retains the same two pre-existing browser-test size
  failures in unchanged `repository-branches.pw.ts` (305) and
  `stack-workspace-presentation.pw.ts` (315), against its 300-line limit. No new
  findings and no limit/allowlist changes. Owner remains browser-test organization.

An intermediate cold startup correctly failed readiness while the new composer
markup had a syntax error; fixing the source restored startup. The final browser
run uses a fresh server. `pnpm storybook:restart` also refreshed review port 7490. Review images: `.local/stack-workflow-review.png` and
`.local/stack-workflow-floating.png`.

Review **Pull Requests**, **Branch Pull Requests**, **Floating Pull Request** and
the six standalone **JJ/Forge/Pull request** variations. Broad repository/static/
clean-package qualification, human visual approval, live host/forge execution and
downstream adoption remain deferred; focused mock evidence does not qualify them.

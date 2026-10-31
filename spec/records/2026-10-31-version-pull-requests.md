# Bot-authored version pull requests

The user explicitly authorizes release agents to review and approve Changesets
PRs, merge only after required checks pass, and verify actual publication.
At main `5ea2f849`, this repository has no version-PR generator. Both the CLI
and connector authenticate as `stevejuma`; a manually authored version PR cannot
receive that same identity's formal approval. No new identity or credentials
are introduced.

Use the sibling Notes `changesets/action@v1.8.0` / `GITHUB_TOKEN` pattern with
GitHub API commits. The version-only main-branch job has contents/pull-request
write permissions and no publication, approval, token-minting or tag step.
Existing repository workflow permissions already allow bot-created PRs.
Normal verification gains manual dispatch for the exact candidate branch when
GitHub's token event-loop prevention suppresses its automatic PR checks.
All seven existing verification lanes and their aggregate remain blocking.
Workflow files also become explicit spec-first protected paths.

Baseline: all 11 existing publisher identity/integrity fixtures pass under Node
24.10.0 before this change. After the change those 11 plus five existing Turbo
fixtures pass (16 total, zero failures). Docker actionlint passes in
`agent-ui-run-bbce9bf7-8706-4762-934b-3316155c6384`.

The first Docker `pnpm spec:check` fails one validation finding:
`SPEC-DETAILS-MISSING` for AUI-GOV-005 in
`agent-ui-run-ee85d81a-578f-4206-bb6b-17e4ff5fda4b`. Add three scoped acceptance
details under the new requirement without changing the validator's minimum.
The exact rerun passes canonical validation, mdBook and spec-first (three lanes)
in `agent-ui-run-ee2b9875-e5d2-46f7-9f2b-a654e023b921`. All 22 routing lanes and
69 production composition families pass their guards. Changed-file formatting
passes seven files. Published Spec Validator 0.2.0 remains the latest release;
doctor and semantic QMD pass against the new configuration, with only the
existing intentional Docker-wrapper alias warning.

Actual bot PR generation, reviewed independent versions, green candidate checks,
merge and trusted publication remain live gates. Core 0.7.3 is not yet published;
all three Core floors remain `^0.7.1` during this slice. PLAN's release section
now points to canonical contracts and verification instead of duplicating their
current version/status facts.

# Host-owned footer draft qualification

The host-draft correction is committed at
`78a03b6d56cd61c965c70163855bbf503ed349eb`, under AUI-CHAT-003. Its original
failure and focused repair are retained in
`2026-10-30-footer-host-owned-draft.md`; that pending receipt is not rewritten.

Complete `pnpm checks` passes in bounded Docker run
`agent-ui-run-18e37094-7423-48c2-adae-019b48b151b6` with
`AGENT_UI_VALIDATION_ARCHIVES` selecting the explicit Design Core validation
archive. The tested Jujutsu snapshot `e3fe0a9a` differs from the committed source
only in PLAN and the earlier evidence record, as verified with
`jj diff --from e3fe0a9a --to 78a03b6d --summary`.

| Lane                                                | Actual result                                         |
| --------------------------------------------------- | ----------------------------------------------------- |
| Complete interaction/accessibility matrix           | 489 cases in each of four modes, 1,956 total          |
| Catalog browser acceptance                          | 151 passed                                            |
| Unit tests                                          | 235 passed                                            |
| Types, architecture, source fidelity and formatting | Zero diagnostics; 418 source fingerprints             |
| Both package builds and publint                     | Passed                                                |
| Clean packed consumption                            | 149 documented examples compiled and consumed by Vite |
| Static catalog                                      | 66 documented families, 407 foundation variations     |
| Specification, workflow and permission smoke        | Passed; three specification lanes                     |

The first complete run stopped on 34 source-token audit findings because the
runtime-only Design Core archive omitted the owning source files named by that
audit. The existing packer's `retainSource` option supplies a separate validation
archive, SHA256
`18d9c275d1daf930edb6d7498eba292583a830ba1a863bb4e3b45fe91b41589d`.
All 2,750 `dist` file hashes equal Desktop's runtime-only archive at Design Core
source `3b0392ca`; public runtime exports still target `dist`. No audit rule,
diagnostic, assertion, timeout, source alias or installed dependency is patched.
This is explicit archive qualification, distinct from a frozen registry install.

Desktop's original Sending Error case passes in all four modes on the corrected
public Agent UI archive. Its complete catalog and hosted native gates remain
separate acceptance in Desktop's E-CI-004. Agent UI PR 10 still requires its own
hosted verification before merging. Visual review stays pending; no baseline,
publication, installed application or user profile changes.

The first specification check for this appended record rejects its missing
mapped governance update. The canonical archive-qualification rule now explicitly
requires identical runtime payloads and separate audit/distribution records;
the specification checker remains unchanged.

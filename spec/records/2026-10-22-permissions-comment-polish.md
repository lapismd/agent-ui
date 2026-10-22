# Permission feedback and inline comment formatting review

The user requested red denied permission text/icons, compact spacing after the
collapsed permission result, a formatting T toggle in inline comments, then a
green icon in the expanded granted permission card. Host request decisions,
identities, adapters and enforcement remain unchanged.

Design Core owns the shared CommentComposer formatting UI, Mira action commands,
TranscriptItem destructive disclosure tone and compact final tool-row gap.
Agent UI projects denied request outcomes into that public presentation and owns
its request-card colours. The copied request stylesheet's previous normalized
source/layout fingerprints were verified before recording this explicit approved
paint adaptation; no unrelated source ledger values changed.

Initial exact source regression: three failures (missing toggle and neutral
disclosures); after: three passes. The denied card target initially failed once
for neutral text/icon, then passed. The granted-card target likewise failed once
with its previous neutral icon. The initial green generated one accessibility
failure at 4.17:1 on the tinted outcome; the 55% semantic-green/foreground mix
repairs it while preserving the 4.5:1 threshold. Red uses the shared 80% light /
60% dark destructive/foreground strategy.

Final focused acceptance commands/results:

- Permissions, Questions and Transcript story families: 42 passed in light and 42 in dark.
- Complete-screen target `-t '^(Permission Denied|Permission Scopes|Requests|Requests Classic|Inline Comments|All Messages)$'`: 6 passed per mode.
- Exact Inline Comments and Permission Denied consumer targets: 1 passed each.
- Focused final matrix: 96 interaction/accessibility cases passed, zero unresolved failures or runtime diagnostics.
- `pnpm exec vitest run --project unit tests/agent-requests.test.ts`: 10 passed, including exact captured outcome projection.
- Root types: zero errors/warnings; canonical validation, source ledger, architecture and package build/publint pass.

The complete-screen story file initially exceeded its 400-line budget by four
lines. Its unchanged inline formatting play moved to a private catalog-only
helper; architecture passes, and the exact complete-screen Inline Comments case
passes again in both themes. The spec-first mapping also required the governance
chapter for the recorded source adaptation; that owner boundary is now explicit.
No size limit or specification assertion was weakened.

Shared source commit: `bb17302b` in `design-core-requests`; 57 source story cases,
root/strict source-consumer types, canonical validation and native CSS pass.
Prepared source-inclusive review archive:
`lapismd-design-core-0.6.0-agent-requests-comment-formatting-review.tgz`, SHA-256
`b020dfc6793a89b89983b04eefeeeb3df610ad18aa4007f343e5e60080639e00`.
The ignored review hook preserves registry manifests and lockfile bytes;
Storybook 7590 was restarted before focused consumer/browser review.

Manual review confirms the inline toolbar below its input, green granted icon,
red denied label/icon and a 4px trailing row margin (previously 16px). Screenshots
are `.local/inline-comment-formatting-review.png` and
`.local/granted-permission-review.png`. Broader qualification, publication,
Desktop/JJ Store adoption and visual baselines remain paused for review.
